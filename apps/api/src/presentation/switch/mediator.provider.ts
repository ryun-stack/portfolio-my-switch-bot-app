import type { Provider } from "@nestjs/common";
import { Mediator } from "mediatr-ts";
import { createMediator } from "../../application/mediatorSetup";
import type { SwitchQueueSender } from "../../application/ports/SwitchQueueSender";
import type { SwitchRequestRepository } from "../../domain/repositories/SwitchRequestRepository";
import { SWITCH_REQUEST_REPOSITORY } from "./repository.provider";
import { SWITCH_QUEUE_SENDER } from "./queue.provider";

/** DI token for the Application layer's Mediator (see mediator.provider.ts). */
export const MEDIATOR = Symbol("MEDIATOR");

/**
 * Builds the Application layer's Mediator wired to the injected
 * SwitchRequestRepository (see repository.provider.ts) and SwitchQueueSender
 * (see queue.provider.ts).
 */
function buildMediator(
  repository: SwitchRequestRepository,
  queueSender: SwitchQueueSender
): Mediator {
  return createMediator({ repository, queueSender });
}

/**
 * Nest provider exposing the Mediator singleton under the MEDIATOR token,
 * so Presentation controllers depend on the token (not a concrete class).
 */
export const mediatorProvider: Provider = {
  provide: MEDIATOR,
  useFactory: buildMediator,
  inject: [SWITCH_REQUEST_REPOSITORY, SWITCH_QUEUE_SENDER],
};
