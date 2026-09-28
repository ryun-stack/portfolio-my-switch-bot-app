import type { Application } from "../Application/Application";
import type { Uuid } from "../shared/Uuid";

/**
 * Port (interface) for persisting and retrieving registered caller
 * Application information (Edge device, etc. — see domain/Application/
 * Application.ts). Mirrors UserRepository's shape/role: Application code
 * depends only on this abstraction, never on a concrete storage SDK.
 */
export interface ApplicationRepository {
  findByClientId(clientId: Uuid): Promise<Application | undefined>;
}
