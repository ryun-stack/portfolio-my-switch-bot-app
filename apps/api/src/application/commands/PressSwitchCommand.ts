import { RequestData } from "mediatr-ts";
import type { PressSwitchResponse } from "@my-switch-bot-app/shared-types";

/**
 * Command: instructs the switch to be pressed. Carries no input data today
 * (ADR.md 3.8's `action` is currently always "press"), but is kept as a
 * dedicated Command class so it can grow (e.g. a future `long-press` action)
 * without changing the Application layer's public shape.
 */
export class PressSwitchCommand extends RequestData<PressSwitchResponse> {
  constructor(public readonly executorId: string) {
    super();
  }
}
