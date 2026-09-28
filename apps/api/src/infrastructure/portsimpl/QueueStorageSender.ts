import type { QueueClient } from "@azure/storage-queue";
import type { QueueMessage } from "@my-switch-bot-app/shared-types";
import type { SwitchQueueSender } from "../../application/ports/SwitchQueueSender";

/**
 * Infrastructure implementation of SwitchQueueSender backed by
 * Azure Queue Storage (ADR.md 3.8/3.9). Implements the Application-defined
 * port; nothing in Domain/Application depends on this class directly.
 */
export class QueueStorageSender implements SwitchQueueSender {
  constructor(private readonly queueClient: QueueClient) {}

  async enqueue(message: QueueMessage): Promise<void> {
    // Azure Queue Storage messages must be base64-encoded text by default.
    const body = Buffer.from(JSON.stringify(message)).toString("base64");
    await this.queueClient.sendMessage(body);
  }
}
