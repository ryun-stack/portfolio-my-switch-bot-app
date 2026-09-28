import type {
  PressSwitchResponse,
  SwitchStatusResponse,
} from "@my-switch-bot-app/shared-types";
import { getAccessToken } from "../auth/useAuth";
import { requiredEnv } from "../utils/env";

const API_BASE_URL = requiredEnv(
  "VITE_API_BASE_URL",
  import.meta.env.VITE_API_BASE_URL
);

/**
 * Thin fetch wrapper around the NestJS API's switch endpoints (ADR.md 3.9).
 * Phase 2 (ADR.md 6章) requires a signed-in Entra ID user; every request
 * carries the current access token as a Bearer token.
 */
async function authHeaders(): Promise<HeadersInit> {
  const accessToken = await getAccessToken();
  return { Authorization: `Bearer ${accessToken}` };
}

export async function pressSwitch(): Promise<PressSwitchResponse> {
  const res = await fetch(`${API_BASE_URL}/switch/press`, {
    method: "POST",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`POST /switch/press failed: ${res.status}`);
  }
  return res.json();
}

export async function getSwitchStatus(requestId: string): Promise<SwitchStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/switch/status/${requestId}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`GET /switch/status/${requestId} failed: ${res.status}`);
  }
  return res.json();
}
