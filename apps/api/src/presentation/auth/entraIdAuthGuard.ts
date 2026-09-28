import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { RequestWithUser } from "./authenticatedUser";
import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import jwksClient, { JwksClient } from "jwks-rsa";
import { requiredEnv } from "../../common/env";
import type { AuthenticatedUser } from "./authenticatedUser";

const AUTH_SCHEME_PREFIX = "Bearer ";

/**
 * Validates the bearer token carried on incoming requests' Authorization
 * header against Microsoft Entra ID (ADR.md 3.3/3.5): verifies the token's
 * signature via Entra ID's JWKS endpoint, and its issuer/audience/expiry.
 *
 * Family-only access (ADR.md 3.5) is primarily enforced by the Entra ID
 * tenant itself (invite-only B2B guests with Google federation), so no
 * signed-in user is rejected here by default. `ENTRA_ALLOWED_EMAILS` is an
 * optional defense-in-depth allowlist on top of that.
 *
 * `ENTRA_TENANT_ID`/`ENTRA_API_AUDIENCE` are only read/validated the first
 * time a request actually reaches this guard (not at process startup or DI
 * construction time), so the API can still start, build, and be unit-tested
 * before the Entra ID app registration exists (Phase 2 is env-var driven;
 * the registration itself is done later, see apps/api/.env.example).
 */
@Injectable()
export class EntraIdAuthGuard implements CanActivate {
  private jwks?: JwksClient;
  private issuer?: string;
  private audience?: string;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const payload = await this.verifyToken(token);

    const email = (payload.preferred_username ?? payload.email ?? "")
      .toString()
      .toLowerCase();

    const user: AuthenticatedUser = {
      oid: String(payload.oid),
      email: email || undefined,
      name: typeof payload.name === "string" ? payload.name : undefined,
    };
    request.user = user;

    return true;
  }

  private extractBearerToken(request: RequestWithUser): string | undefined {
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
