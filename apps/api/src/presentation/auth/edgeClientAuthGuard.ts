import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import jwksClient, { JwksClient } from "jwks-rsa";
import { requiredEnv } from "../../common/env";
import type {
  AuthenticatedApplication,
  RequestWithApplication,
} from "./authenticatedApplication";

const AUTH_SCHEME_PREFIX = "Bearer ";

/**
 * Validates the bearer token used by the Edge device (Raspberry Pi) when it
 * calls back into the API to report a SwitchRequest's outcome (ADR.md
 * 3.7/4章). Unlike EntraIdAuthGuard (a family member's delegated/user
 * token obtained via Authorization Code + PKCE), the edge device
 * authenticates via the OAuth2 **client credentials** flow: its own Entra
 * ID app registration + client secret, with no signed-in user involved.
 *
 * Mirrors EntraIdAuthGuard's split of responsibilities: this guard only
 * verifies the token's signature/issuer/audience against the tenant's JWKS
 * and attaches the caller's `clientId` (from the `appid`/`azp` claim) to
 * the request as `request.application` — it does **not** check whether
 * that client id is a registered caller application. That allowlist check
 * is a separate concern, done by `RegisteredApplicationGuard` (mirroring
 * how `RegisteredUserGuard` is separate from `EntraIdAuthGuard`), which
 * must run after this guard.
 *
 * Kept as a self-contained class (rather than sharing implementation with
 * EntraIdAuthGuard) to keep each guard's authentication logic easy to read
 * in one place, mirroring the existing style of this codebase.
 */
@Injectable()
export class EdgeClientAuthGuard implements CanActivate {
  private jwks?: JwksClient;
  private issuer?: string;
  private audience?: string;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithApplication>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const payload = await this.verifyToken(token);

    const clientId = String(payload.appid ?? payload.azp ?? "");
    const application: AuthenticatedApplication = { clientId };
    request.application = application;

    return true;
  }

  private extractBearerToken(request: RequestWithApplication): string | undefined {
    const header = request.headers.authorization;
    if (!header?.startsWith(AUTH_SCHEME_PREFIX)) {
      return undefined;
    }
    return header.slice(AUTH_SCHEME_PREFIX.length);
  }

  private getJwksClient(): JwksClient {
    if (!this.jwks) {
      const tenantId = requiredEnv("ENTRA_TENANT_ID");
      this.jwks = jwksClient({
        jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
        cache: true,
        rateLimit: true,
      });
    }
    return this.jwks;
  }

  private getIssuer(): string {
    if (!this.issuer) {
      const tenantId = requiredEnv("ENTRA_TENANT_ID");
      this.issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;
    }
    return this.issuer;
  }

  private getAudience(): string {
    if (!this.audience) {
      this.audience = requiredEnv("ENTRA_API_AUDIENCE");
    }
    return this.audience;
  }

  private verifyToken(token: string): Promise<JwtPayload> {
    const jwks = this.getJwksClient();
    const getSigningKey = (header: JwtHeader, callback: SigningKeyCallback) => {
      jwks.getSigningKey(header.kid, (error, key) => {
        if (error || !key) {
          callback(error ?? new Error("Signing key not found"));
          return;
        }
        callback(null, key.getPublicKey());
      });
    };

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getSigningKey,
        {
          audience: this.getAudience(),
          issuer: this.getIssuer(),
          algorithms: ["RS256"],
        },
        (error, decoded) => {
          if (error || !decoded || typeof decoded === "string") {
            reject(new UnauthorizedException("Invalid or expired token"));
            return;
          }
          resolve(decoded);
        }
      );
    });
  }
}
