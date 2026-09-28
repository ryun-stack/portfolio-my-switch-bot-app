import { SwitchRequest } from "./SwitchRequest";
import { Uuid } from "../shared/Uuid";

const EXECUTOR_ID = Uuid.create("11111111-1111-4111-8111-111111111111");

describe("SwitchRequest", () => {
  it("creates a new request in the pending state", () => {
    const now = new Date("2026-07-21T21:53:00Z");

    const request = SwitchRequest.create("press", EXECUTOR_ID, now);

    expect(request.action).toBe("press");
    expect(request.status).toBe("pending");
    expect(request.issuedAt).toEqual(now);
    expect(request.updatedAt).toEqual(now);
    expect(request.executorId).toBe(EXECUTOR_ID);
    expect(request.requestId.toString()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("transitions from pending to done", () => {
    const issuedAt = new Date("2026-07-21T21:53:00Z");
    const doneAt = new Date("2026-07-21T21:53:05Z");
    const request = SwitchRequest.create("press", EXECUTOR_ID, issuedAt);

    request.markDone(doneAt);

    expect(request.status).toBe("done");
    expect(request.updatedAt).toEqual(doneAt);
  });

  it("transitions from pending to failed", () => {
    const issuedAt = new Date("2026-07-21T21:53:00Z");
    const failedAt = new Date("2026-07-21T21:53:05Z");
    const request = SwitchRequest.create("press", EXECUTOR_ID, issuedAt);

    request.markFailed(failedAt);

    expect(request.status).toBe("failed");
    expect(request.updatedAt).toEqual(failedAt);
  });

  it("does not allow finalizing a request twice", () => {
    const request = SwitchRequest.create("press", EXECUTOR_ID);
    request.markDone();

    expect(() => request.markFailed()).toThrow(
      /only 'pending' requests can be finalized/
    );
  });

  it("reconstructs a request from persisted props", () => {
    const props = {
      requestId: Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
      executorId: EXECUTOR_ID,
      action: "press" as const,
      status: "done" as const,
      issuedAt: new Date("2026-07-21T21:53:00Z"),
      updatedAt: new Date("2026-07-21T21:53:05Z"),
    };

    const request = SwitchRequest.reconstruct(props);

    expect(request.toProps()).toEqual(props);
  });
});
