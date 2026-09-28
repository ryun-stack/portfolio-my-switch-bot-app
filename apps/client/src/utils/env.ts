/**
 * Fail-fast environment variable validation for Vite.
 * Throws an error if the env var is not set, with a helpful message.
 */
export function requiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} is not set. Define it in apps/client/.env (see .env.example).`
    );
  }
  return value;
}
