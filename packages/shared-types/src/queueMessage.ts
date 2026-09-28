import { z } from "zod";

/**
 * Action types supported by a switch request.
 * Currently only "press" exists; kept as an open string-backed enum
 * (per ADR.md 3.8) to allow future variants (e.g. long-press) without
 * a breaking schema change.
 */
export const SwitchActionSchema = z.enum(["press"]);
export type SwitchAction = z.infer<typeof SwitchActionSchema>;

/**
 * Status of a switch request as tracked by the status store (ADR.md 3.7).
 */
export const SwitchRequestStatusSchema = z.enum(["pending", "done", "failed"]);
export type SwitchRequestStatus = z.infer<typeof SwitchRequestStatusSchema>;

/**
 * Schema for the message body placed on Azure Queue Storage (ADR.md 3.8).
 * Shared between the API (producer) and the edge device (consumer contract).
 */
export const QueueMessageSchema = z.object({
  requestId: z.string().uuid(),
  action: SwitchActionSchema,
  issuedAt: z.string().datetime(),
});
export type QueueMessage = z.infer<typeof QueueMessageSchema>;
