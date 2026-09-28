import {
  InteractionRequiredAuthError,
  PublicClientApplication,
  type AccountInfo,
} from "@azure/msal-browser";
import { computed, ref } from "vue";
import { loginRequest, msalConfig } from "./msalConfig";

/**
 * Single MSAL instance shared by the whole app (ADR.md 3.3/3.5, Phase 2).
 * MSAL manages its own token cache; a module-level singleton (rather than
 * one per component) mirrors how msal-browser is designed to be used.
 */
export const msalInstance = new PublicClientApplication(msalConfig);

const account = ref<AccountInfo | null>(null);

function syncActiveAccountFromCache() {
  const accounts = msalInstance.getAllAccounts();
  const active = accounts[0] ?? null;
  if (active) {
    msalInstance.setActiveAccount(active);
  }
  account.value = active;
}

let initPromise: Promise<void> | null = null;

/**
 * Must be awaited once, before mounting the app (see src/main.ts): completes
 * MSAL's own setup and processes the redirect response when the browser
 * comes back from Entra ID after loginRedirect()/acquireTokenRedirect().
 */
export function initializeAuth(): Promise<void> {
  if (!initPromise) {
    initPromise = msalInstance.initialize().then(async () => {
      const redirectResult = await msalInstance.handleRedirectPromise();
      if (redirectResult?.account) {
        msalInstance.setActiveAccount(redirectResult.account);
      }
      syncActiveAccountFromCache();
    });
  }
  return initPromise;
}

async function login(): Promise<void> {
  await msalInstance.loginRedirect(loginRequest);
}

async function logout(): Promise<void> {
  await msalInstance.logoutRedirect();
}

/**
 * Returns a valid access token for the API scope, silently refreshing via
 * the cached session when possible and falling back to an interactive
 * redirect only when Entra ID actually requires it (e.g. consent, expired
 * session) — per the acquireTokenSilent-then-redirect pattern MSAL docs
 * recommend for SPAs.
 */
export async function getAccessToken(): Promise<string> {
  const activeAccount = msalInstance.getActiveAccount();
  if (!activeAccount) {
    throw new Error("Not signed in");
  }

  try {
    const result = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: activeAccount,
    });
    return result.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      // Navigates away from the page; nothing after this call will run.
      await msalInstance.acquireTokenRedirect(loginRequest);
    }
    throw error;
  }
}

/** Composition API entry point for auth state/actions used from components. */
export function useAuth() {
  return {
    account,
    isAuthenticated: computed(() => account.value !== null),
    login,
    logout,
  };
}
