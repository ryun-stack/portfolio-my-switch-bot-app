import { QueueMessageSchema, type QueueMessage } from "@my-switch-bot-app/shared-types";
import type { SwitchRequest } from "../../domain/SwitchRequest/SwitchRequest";

/**
 * Translates a Domain SwitchRequest into the Queue message DTO shared with
 * the edge device (ADR.md 3.8). This mapping belongs in the Application
 * layer: Domain must not know about `shared-types` or any external wire
 * contract, and Infrastructure should only be handed an already-shaped
 * message to send.
 *
 * Re-validates against `QueueMessageSchema` as a safety net: if Domain's
 * own `SwitchAction`/`SwitchRequestStatus` unions ever drift from the
 * shared contract, this throws immediately instead of silently sending a
 * malformed message.
 */
export function toQueueMessage(request: SwitchRequest): QueueMessage {
  const props = request.toProps();

  return QueueMessageSchema.parse({
    requestId: props.requestId.toString(),
    action: props.action,
    issuedAt: props.issuedAt.toISOString(),
  });
}
