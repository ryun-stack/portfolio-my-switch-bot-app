import { QueueServiceClient } from "@azure/storage-queue";
import type { Provider } from "@nestjs/common";
import { requiredEnv } from "../../common/env";
import { QueueStorageSender } from "../../infrastructure/portsimpl/QueueStorageSender";

const DEFAULT_QUEUE_NAME = "switchrequests";

/** DI token for the SwitchQueueSender port (see application/ports/SwitchQueueSender). */
export const SWITCH_QUEUE_SENDER = Symbol("SWITCH_QUEUE_SENDER");

/**
 * Composition root for Azure Queue Storage-backed senders (Onion
 * Architecture ports, ADR.md 3.9), mirroring repository.provider.ts's
 * pattern for Table Storage-backed repositories: consumers depend on the
 * SWITCH_QUEUE_SENDER token, not on QueueStorageSender/QueueServiceClient
 * directly.
 */
export const queueProviders: Provider[] = [
  {
    provide: SWITCH_QUEUE_SENDER,
    useFactory: () => {
      const queueConnectionString = requiredEnv(
        "QUEUE_STORAGE_CONNECTION_STRING"
      );
      const queueName = process.env.SWITCH_QUEUE_NAME ?? DEFAULT_QUEUE_NAME;

      const queueClient = QueueServiceClient.fromConnectionString(
        queueConnectionString
      ).getQueueClient(queueName);

      // Queue Storage doesn't auto-create the queue on first write. This is
      // a no-op if it already exists, so it's safe on every process start
      // against both Azurite (local) and real Azure Storage.
      void queueClient.createIfNotExists().catch((error) => {
        console.error(`Failed to ensure queue '${queueName}' exists:`, error);
      });

      return new QueueStorageSender(queueClient);
    },
  },
];
