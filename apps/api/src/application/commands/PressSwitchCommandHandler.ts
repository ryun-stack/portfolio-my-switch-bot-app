import type { RequestHandler } from "mediatr-ts";
import type { PressSwitchResponse } from "@my-switch-bot-app/shared-types";
import { SwitchRequest } from "../../domain/SwitchRequest/SwitchRequest";
import type { SwitchQueueSender } from "../ports/SwitchQueueSender";
import type { SwitchRequestRepository } from "../../domain/repositories/SwitchRequestRepository";
import { Uuid } from "../../domain/shared/Uuid";
import { toQueueMessage } from "../mappers/toQueueMessage";
import { PressSwitchCommand } from "./PressSwitchCommand";

/**
 * Handles PressSwitchCommand: creates a pending SwitchRequest, persists it
 * to the status store, and enqueues its message for the edge device.
 * Depends only on Application-layer ports (interfaces), never on concrete
 * Infrastructure classes, per the Onion Architecture's dependency rule.
 */
export class PressSwitchCommandHandler
  implements RequestHandler<PressSwitchCommand, PressSwitchResponse>
{
  constructor(
    private readonly repository: SwitchRequestRepository,
    private readonly queueSender: SwitchQueueSender
  ) {}

  async handle(command: PressSwitchCommand): Promise<PressSwitchResponse> {
    const executorId = Uuid.create(command.executorId);
    const switchRequest = SwitchRequest.create("press", executorId);

    await this.repository.save(switchRequest);
    await this.queueSender.enqueue(toQueueMessage(switchRequest));

    return { requestId: switchRequest.requestId.toString() };
  }
}
