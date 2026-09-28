import { z } from "zod";
import { SwitchActionSchema, SwitchRequestStatusSchema } from "./queueMessage";

/**
 * Response body for `POST /api/switch/press` (ADR.md 3.9).
 * Shared between the API (producer) and the client (consumer) so both
 * sides agree on the shape without duplicating it by hand.
 */
export const PressSwitchResponseSchema = z.object({
  requestId: z.string().uuid(),
});
export type PressSwitchResponse = z.infer<typeof PressSwitchResponseSchema>;

/**
 * Response body for `GET /api/switch/status/{requestId}` (ADR.md 3.9).
 */
export const SwitchStatusResponseSchema = z.object({
  requestId: z.string().uuid(),
  executorId: z.string().uuid(),
  action: SwitchActionSchema,
  status: SwitchRequestStatusSchema,
  issuedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type SwitchStatusResponse = z.infer<typeof SwitchStatusResponseSchema>;

/**
 * Request body for `PATCH /api/edge/switch/{requestId}/status` (ADR.md
 * 3.7/4章): the edge device (Raspberry Pi) reports the outcome of driving
 * the servo for a previously-enqueued SwitchRequest. Only `done`/`failed`
 * are valid terminal states here — `pending` is the initial state set by
 * `POST /api/switch/press` and is never something the edge device reports
 * back.
 */
export const CompleteSwitchRequestSchema = z.object({
  status: SwitchRequestStatusSchema.exclude(["pending"]),
});
export type CompleteSwitchRequestRequest = z.infer<
  typeof CompleteSwitchRequestSchema
>;
