import type { TableClient, TableEntity } from "@azure/data-tables";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/User/User";
import type { EmailAddress } from "../../domain/User/EmailAddress";
import { nameof } from "../../shared/typeHelper";

/**
 * Composed from the SDK's own `TableEntity<T>` generic (rather than
 * hand-duplicating `partitionKey`/`rowKey`) so that this file fails to
 * compile right here if `@azure/data-tables` ever changes what shape a
 * table entity requires, instead of only failing wherever the entity is
 * later passed to `upsertEntity`/`listEntities`.
 */
type UserEntity = TableEntity<{
  id: string;
  emailAddress: string;
}>;

/**
 * Infrastructure implementation of UserRepository backed by
 * Azure Table Storage (ADR.md 3.7/3.9). Implements the Application-defined
 * port; nothing in Domain/Application depends on this class directly.
 */
export class TableStorageUserRepository implements UserRepository {
  constructor(private readonly tableClient: TableClient) {}

  async findByEmailAddress(emailAddress: EmailAddress): Promise<User | undefined> {
    // Query by emailAddress column across all partitions. Since emailAddress
    // is a validated EmailAddress (see domain/User/EmailAddress.ts), it's
    // guaranteed not to contain quote characters that could break out of
    // this OData filter expression.
    const columnName = nameof<UserEntity>(p => p.emailAddress);
    const entities = this.tableClient.listEntities<UserEntity>({
      queryOptions: { filter: `${columnName} eq '${emailAddress.toString()}'` },
    });

    for await (const entity of entities) {
      return User.reconstruct(entity.id, entity.emailAddress);
    }
    return undefined;
  }
}