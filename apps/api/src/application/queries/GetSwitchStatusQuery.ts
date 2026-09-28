import { RequestData } from "mediatr-ts";
import type { SwitchStatusResponse } from "@my-switch-bot-app/shared-types";

/**
 * Query: retrieves the current status of a previously issued SwitchRequest.
 * Resolves to `undefined` when no request with the given id exists.
 */
export class GetSwitchStatusQuery extends RequestData<SwitchStatusResponse | undefined> {
  constructor(public readonly requestId: string) {
    super();
  }
}
