import type { RequestHandler } from "mediatr-ts";
import type { SwitchStatusResponse } from "@my-switch-bot-app/shared-types";
import type { SwitchRequestRepository } from "../../domain/repositories/SwitchRequestRepository";
import { Uuid } from "../../domain/shared/Uuid";
import { GetSwitchStatusQuery } from "./GetSwitchStatusQuery";

/**
 * Handles GetSwitchStatusQuery: reads the status store via the repository
 * port and maps the domain entity to a plain view model for Presentation.
 */
export class GetSwitchStatusQueryHandler
  implements RequestHandler<GetSwitchStatusQuery, SwitchStatusResponse | undefined>
{
  constructor(private readonly repository: SwitchRequestRepository) {}

  async handle(query: GetSwitchStatusQuery): Promise<SwitchStatusResponse | undefined> {
    let requestId: Uuid;
    try {
      requestId = Uuid.create(query.requestId);
    } catch {
      // A malformed id can never match a stored request, so this is
      // equivalent to "not found" — no need to even query the repository.
      return undefined;
    }

    const switchRequest = await this.repository.findById(requestId);
    if (!switchRequest) {
      return undefined;
    }

    const props = switchRequest.toProps();
    return {
      requestId: props.requestId.toString(),
      executorId: props.executorId.toString(),
      action: props.action,
      status: props.status,
      issuedAt: props.issuedAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),
    };
  }
}
