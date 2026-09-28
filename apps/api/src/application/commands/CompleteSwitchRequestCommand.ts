import { RequestData } from "mediatr-ts";

/**
 * Outcome of handling CompleteSwitchRequestCommand, letting Presentation
 * map each case to the right HTTP response without the Application layer
 * knowing anything about HTTP:
 *  - "completed": the request existed, was still `pending`, and is now
 *    finalized as `done`/`failed`.
 *  - "not_found": no SwitchRequest with that id exists (or the id was
 *    malformed, which can never match one).
 *  - "already_finalized": the request exists but was already `done`/`failed`
 *    (e.g. a duplicate report from the edge device after a retry).
 */
export type CompleteSwitchRequestResult =
  | "completed"
  | "not_found"
  | "already_finalized";

/**
 * Command: the edge device reports that it finished (successfully or not)
 * driving the servo for a previously-enqueued SwitchRequest (ADR.md
 * 3.7/4章). Issued by EdgeSwitchController, guarded by EdgeClientAuthGuard
 * (client-credentials/app-only token) rather than a family member's
 * delegated token.
 */
export class CompleteSwitchRequestCommand extends RequestData<CompleteSwitchRequestResult> {
  constructor(
    public readonly requestId: string,
    public readonly status: "done" | "failed"
  ) {
    super();
  }
}
