import type { TableClient, TableEntity } from "@azure/data-tables";
import { SwitchRequest, type SwitchAction, type SwitchRequestStatus } from "../../domain/SwitchRequest/SwitchRequest";
import type { SwitchRequestRepository } from "../../domain/repositories/SwitchRequestRepository";
import { Uuid } from "../../domain/shared/Uuid";

/**
 * Composed from the SDK's own `TableEntity<T>` generic (rather than
 * hand-duplicating `partitionKey`/`rowKey`) so that this file fails to
 * compile right here if `@azure/data-tables` ever changes what shape a
 * table entity requires, instead of only failing wherever the entity is
 * later passed to `upsertEntity`/`listEntities`.
 */
type SwitchRequestEntity = TableEntity<{
  executorId: string;
  status: SwitchRequestStatus;
  action: SwitchAction;
  issuedAt: string;
  updatedAt: string;
}>;

/** PartitionKey scheme decided in ADR.md 3.9: the date the request was issued. */
function partitionKeyFor(issuedAt: Date): string {
  return issuedAt.toISOString().slice(0, 10); // yyyy-MM-dd
}

/**
 * Infrastructure implementation of SwitchRequestRepository backed by
 * Azure Table Storage (ADR.md 3.7/3.9). Implements the Application-defined
 * port; nothing in Domain/Application depends on this class directly.
 */
export class TableStorageSwitchRequestRepository implements SwitchRequestRepository {
  constructor(private readonly tableClient: TableClient) {}

  async save(request: SwitchRequest): Promise<void> {
    const props = request.toProps();
    const entity: SwitchRequestEntity = {
      partitionKey: partitionKeyFor(props.issuedAt),
      rowKey: props.requestId.toString(),
      executorId: props.executorId.toString(),
      status: props.status,
      action: props.action,
      issuedAt: props.issuedAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),
    };

    await this.tableClient.upsertEntity(entity, "Replace");
  }

  async findById(requestId: Uuid): Promise<SwitchRequest | undefined> {
    // The RowKey (requestId) alone doesn't determine the date-based
    // PartitionKey, so we query across partitions by RowKey. `requestId` is
    // a validated Uuid (see domain/shared/Uuid.ts), so it's guaranteed to
    // only contain hex digits/hyphens and can't break out of this filter.
    const entities = this.tableClient.listEntities<SwitchRequestEntity>({
      queryOptions: { filter: `RowKey eq '${requestId.toString()}'` },
    });

    for await (const entity of entities) {
      return SwitchRequest.reconstruct({
        requestId: Uuid.create(entity.rowKey),
        executorId: Uuid.create(entity.executorId),
        action: entity.action,
        status: entity.status,
        issuedAt: new Date(entity.issuedAt),
        updatedAt: new Date(entity.updatedAt),
      });
    }

    return undefined;
  }
}
