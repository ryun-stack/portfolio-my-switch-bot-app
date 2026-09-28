import type { Request } from "express";

/**
 * Shape of the user info extracted from a validated Entra ID access token
 * (ADR.md 3.3/3.5), attached to the request by EntraIdAuthGuard.
 */
export interface AuthenticatedUser {
  /** Entra ID object id (`oid` claim): stable per-user identifier. */
  oid: string;
  /** `preferred_username` (falls back to `email`) claim, if present. */
  email?: string;
  /** `name` claim, if present. */
  name?: string;
  /**
   * Domain `User.id` (Uuid, as a string) resolved by `RegisteredUserGuard`
   * once it confirms `email` matches a registered family member. Only set
   * after that guard succeeds; used as the SwitchRequest's `executorId` for
   * history/auditing — everyone in the family can still see every request,
   * but each one now records who issued it (ADR.md 3.9).
   */
  registeredUserId?: string;
}

export type RequestWithUser = Request & { user?: AuthenticatedUser };
