import type { Request } from "express";

/**
 * Shape of the caller-application info extracted from a validated Entra ID
 * app-only (client credentials) access token, attached to the request by
 * EdgeClientAuthGuard. Mirrors AuthenticatedUser's role for delegated user
 * tokens (see authenticatedUser.ts).
 */
export interface AuthenticatedApplication {
  /** `appid` claim (falls back to `azp`) identifying the calling app registration. */
  clientId: string;
  /**
   * Domain `Application.id` (Uuid, as a string) resolved by
   * `RegisteredApplicationGuard` once it confirms `clientId` matches a
   * registered caller application (Table Storage `Applications` allowlist,
   * ADR.md 3.9). Only set after that guard succeeds.
   */
  registeredApplicationId?: string;
}

export type RequestWithApplication = Request & {
  application?: AuthenticatedApplication;
};
