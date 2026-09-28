import { TableClient } from "@azure/data-tables";
import type { Provider } from "@nestjs/common";
import { isInsecureStorageEndpoint, requiredEnv } from "../../common/env";
import { TableStorageSwitchRequestRepository } from "../../infrastructure/repositories/TableStorageSwitchRequestRepository";
import { TableStorageUserRepository } from "../../infrastructure/repositories/TableStorageUserRepository";
import { TableStorageApplicationRepository } from "../../infrastructure/repositories/TableStorageApplicationRepository";

const DEFAULT_STATUS_TABLE_NAME = "SwitchRequestStatus";
const DEFAULT_USER_TABLE_NAME = "Users";
const DEFAULT_APPLICATION_TABLE_NAME = "Applications";

/** DI token for the SwitchRequestRepository port (see application/repositories). */
export const SWITCH_REQUEST_REPOSITORY = Symbol("SWITCH_REQUEST_REPOSITORY");
/** DI token for the UserRepository port. */
export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
/** DI token for the ApplicationRepository port (registered caller apps, e.g. Edge device). */
export const APPLICATION_REPOSITORY = Symbol("APPLICATION_REPOSITORY");

function buildTableClient(tableName: string): TableClient {
  const connectionString = requiredEnv("TABLE_STORAGE_CONNECTION_STRING");
  const tableClient = TableClient.fromConnectionString(
    connectionString,
    tableName,
    { allowInsecureConnection: isInsecureStorageEndpoint(connectionString) }
  );

  // Table Storage doesn't auto-create the table on first write; this is a
  // no-op if it already exists, so it's safe on every process start against
  // both Azurite (local) and real Azure Storage.
  void tableClient.createTable().catch((error) => {
    console.error(`Failed to ensure table '${tableName}' exists:`, error);
  });

  return tableClient;
}

/**
 * Composition root for every Table Storage-backed repository (Onion
 * Architecture ports, ADR.md 3.9). Centralizing them here means adding a
 * new repository only requires a provider entry in this one file, rather
 * than each consumer (mediator wiring, guards, ...) building its own
 * TableClient/connection-string plumbing.
 */
export const repositoryProviders: Provider[] = [
  {
    provide: SWITCH_REQUEST_REPOSITORY,
    useFactory: () => {
      const tableName =
        process.env.STATUS_TABLE_NAME ?? DEFAULT_STATUS_TABLE_NAME;
      return new TableStorageSwitchRequestRepository(
        buildTableClient(tableName)
      );
    },
  },
  {
    provide: USER_REPOSITORY,
    useFactory: () => {
      const tableName = process.env.USER_TABLE_NAME ?? DEFAULT_USER_TABLE_NAME;
      return new TableStorageUserRepository(buildTableClient(tableName));
    },
  },
  {
    provide: APPLICATION_REPOSITORY,
    useFactory: () => {
      const tableName =
        process.env.APPLICATION_TABLE_NAME ?? DEFAULT_APPLICATION_TABLE_NAME;
      return new TableStorageApplicationRepository(buildTableClient(tableName));
    },
  },
];
