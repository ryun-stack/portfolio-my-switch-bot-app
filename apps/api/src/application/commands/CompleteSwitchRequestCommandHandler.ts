import type { RequestHandler } from "mediatr-ts";
import type { SwitchRequestRepository } from "../../domain/repositories/SwitchRequestRepository";
import { Uuid } from "../../domain/shared/Uuid";
import {
  CompleteSwitchRequestCommand,
  type CompleteSwitchRequestResult,
} from "./CompleteSwitchRequestCommand";

/**
 * Handles CompleteSwitchRequestCommand: loads the SwitchRequest the edge
 * device is reporting on, transitions it to `done`/`failed` via the Domain
 * entity's own state machine (SwitchRequest#markDone/#markFailed), and
 * persists the result. Depends only on the Application-layer repository
 * port, never on a concrete Infrastructure class.
 */
export class CompleteSwitchRequestCommandHandler
  implements RequestHandler<CompleteSwitchRequestCommand, CompleteSwitchRequestResult>
{
  constructor(private readonly repository: SwitchRequestRepository) {}

  async handle(
    command: CompleteSwitchRequestCommand
  ): Promise<CompleteSwitchRequestResult> {
    let requestId: Uuid;
    try {
      requestId = Uuid.create(command.requestId);
    } catch {
      // A malformed id can never match a stored request.
      return "not_found";
    }

    const switchRequest = await this.repository.findById(requestId);
    if (!switchRequest) {
      return "not_found";
    }

    try {
      if (command.status === "done") {
        switchRequest.markDone();
      } else {
        switchRequest.markFailed();
      }
    } catch {
      // SwitchRequest#markDone/#markFailed throw when the request isn't
      // `pending` anymore (e.g. a duplicate report from the edge device).
      return "already_finalized";
    }

    await this.repository.save(switchRequest);
    return "completed";
  }
}
