/**
 * Reads a required environment variable, throwing a clear error (pointing
 * at .env.example) instead of silently proceeding with `undefined` if it's
 * missing. Shared by every place that reads Storage/Entra ID config.
 */
export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} environment variable is required (see apps/api/.env.example).`
    );
  }
  return value;
}

/**
 * Azure Table/Queue Storage connection strings need `allowInsecureConnection`
 * set explicitly when pointing at Azurite's http:// endpoints; the SDKs only
 * infer it automatically from the `UseDevelopmentStorage=true` shortcut.
 */
export function isInsecureStorageEndpoint(connectionString: string): boolean {
  return (
    connectionString.includes("http://") ||
    connectionString.includes("UseDevelopmentStorage=true")
  );
}
