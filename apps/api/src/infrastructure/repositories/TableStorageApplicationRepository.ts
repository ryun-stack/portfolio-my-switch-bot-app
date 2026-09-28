import type { TableClient, TableEntity } from "@azure/data-tables";
import type { ApplicationRepository } from "../../domain/repositories/ApplicationRepository";
import { Application } from "../../domain/Application/Application";
import type { Uuid } from "../../domain/shared/Uuid";
import { nameof } from "../../shared/typeHelper";

/**
 * See TableStorageUserRepository for why this type is composed from the
 * SDK's own `TableEntity<T>` generic rather than hand-duplicated.
 */
type ApplicationEntity = TableEntity<{
  id: string;
  clientId: string;
  name: string;
}>;

/**
 * Infrastructure implementation of ApplicationRepository backed by
 * Azure Table Storage (ADR.md 3.3/3.9), mirroring
 * TableStorageUserRepository. Implements the Application(-layer)-defined
 * port; nothing in Domain/Application depends on this class directly.
 */
export class TableStorageApplicationRepository implements ApplicationRepository {
  constructor(private readonly tableClient: TableClient) {}

  async findByClientId(clientId: Uuid): Promise<Application | undefined> {
    // clientId is a validated Uuid (see domain/shared/Uuid.ts), so it's
    // guaranteed not to contain quote characters that could break out of
    // this OData filter (same defense as TableStorageUserRepository).
    const columnName = nameof<ApplicationEntity>((p) => p.clientId);
    const entities = this.tableClient.listEntities<ApplicationEntity>({
      queryOptions: { filter: `${columnName} eq '${clientId.toString()}'` },
    });

    for await (const entity of entities) {
      return Application.reconstruct(entity.id, entity.clientId, entity.name);
    }
    return undefined;
  }
}
