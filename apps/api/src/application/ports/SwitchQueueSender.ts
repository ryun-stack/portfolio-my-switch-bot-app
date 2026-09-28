import type { QueueMessage } from "@my-switch-bot-app/shared-types";

/**
 * Port (interface) for enqueueing an instruction message for the edge device.
 * Implemented by Infrastructure (Azure Queue Storage); Application code
 * depends only on this abstraction, never on a concrete queue SDK.
 */
export interface SwitchQueueSender {
  enqueue(message: QueueMessage): Promise<void>;
}
