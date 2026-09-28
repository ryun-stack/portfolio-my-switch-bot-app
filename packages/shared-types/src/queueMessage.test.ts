import { QueueMessageSchema } from "./queueMessage";

describe("QueueMessageSchema", () => {
  it("accepts a valid queue message", () => {
    const result = QueueMessageSchema.safeParse({
      requestId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      action: "press",
      issuedAt: "2026-07-21T21:53:00Z",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a message with a non-uuid requestId", () => {
    const result = QueueMessageSchema.safeParse({
      requestId: "not-a-uuid",
      action: "press",
      issuedAt: "2026-07-21T21:53:00Z",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a message with an unsupported action", () => {
    const result = QueueMessageSchema.safeParse({
      requestId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      action: "long-press",
      issuedAt: "2026-07-21T21:53:00Z",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a message with a non-ISO8601 issuedAt", () => {
    const result = QueueMessageSchema.safeParse({
      requestId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      action: "press",
      issuedAt: "2026/07/21 21:53:00",
    });

    expect(result.success).toBe(false);
  });
});
