import type { User } from "../User/User";
import type { EmailAddress } from "../User/EmailAddress";

/**
 * Port (interface) for persisting and retrieving User information.
 * Implemented by Infrastructure (Azure Table Storage); Application code
 * depends only on this abstraction, never on a concrete storage SDK.
 */
export interface UserRepository {
  findByEmailAddress(emailAddress: EmailAddress): Promise<User | undefined>;
}