import type { SwitchRequest } from "../SwitchRequest/SwitchRequest";
import type { Uuid } from "../shared/Uuid";

/**
 * Port (interface) for persisting and retrieving SwitchRequest status.
 * Implemented by Infrastructure (Azure Table Storage); Application code
 * depends only on this abstraction, never on a concrete storage SDK.
 */
export interface SwitchRequestRepository {
  save(request: SwitchRequest): Promise<void>;
  findById(requestId: Uuid): Promise<SwitchRequest | undefined>;
}
