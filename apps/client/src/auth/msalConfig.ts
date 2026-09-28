import type { Configuration } from "@azure/msal-browser";
import { requiredEnv } from "../utils/env";

/**
 * MSAL configuration for the Vue SPA (ADR.md 3.3/3.5, Phase 2).
 *
 * All values are env-var driven, since the actual Entra ID app
 * registration (tenant, SPA app, exposed API scope) is created later by
 * whoever owns the tenant — see apps/client/.env.example for what to fill
 * in once that registration exists.
 */
const tenantId = requiredEnv(
  "VITE_ENTRA_TENANT_ID",
  import.meta.env.VITE_ENTRA_TENANT_ID as string | undefined
);
const clientId = requiredEnv(
  "VITE_ENTRA_CLIENT_ID",
  import.meta.env.VITE_ENTRA_CLIENT_ID as string | undefined
);

/**
 * The API's exposed scope (e.g. `api://<api-client-id>/access_as_user`),
 * requested both at login and when acquiring the access token sent to the
 * NestJS API's Authorization header.
 */
export const apiScope = requiredEnv(
  "VITE_ENTRA_API_SCOPE",
  import.meta.env.VITE_ENTRA_API_SCOPE as string | undefined
);

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    // sessionStorage (not localStorage) so signing out of the browser tab
    // clears the session; family devices are usually shared, not personal.
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest = {
  scopes: [apiScope],
};
