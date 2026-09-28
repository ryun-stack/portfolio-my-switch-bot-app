import { SwitchRequest } from "../../domain/SwitchRequest/SwitchRequest";
import { Uuid } from "../../domain/shared/Uuid";
import { toQueueMessage } from "./toQueueMessage";

describe("toQueueMessage", () => {
  it("maps a Domain SwitchRequest to the shared QueueMessage contract", () => {
    const issuedAt = new Date("2026-07-21T21:53:00Z");
    const executorId = Uuid.create("11111111-1111-4111-8111-111111111111");
    const request = SwitchRequest.create("press", executorId, issuedAt);

    expect(toQueueMessage(request)).toEqual({
      requestId: request.requestId.toString(),
      action: "press",
      issuedAt: issuedAt.toISOString(),
    });
  });
});
