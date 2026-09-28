import { PressSwitchCommand } from "./PressSwitchCommand";
import { PressSwitchCommandHandler } from "./PressSwitchCommandHandler";
import type { SwitchQueueSender } from "../ports/SwitchQueueSender";
import type { SwitchRequestRepository } from "../../domain/repositories/SwitchRequestRepository";

const EXECUTOR_ID = "11111111-1111-4111-8111-111111111111";

describe("PressSwitchCommandHandler", () => {
  function createMocks() {
    const repository: jest.Mocked<SwitchRequestRepository> = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
    };
    const queueSender: jest.Mocked<SwitchQueueSender> = {
      enqueue: jest.fn().mockResolvedValue(undefined),
    };
    return { repository, queueSender };
  }

  it("saves a pending SwitchRequest and enqueues its message", async () => {
    const { repository, queueSender } = createMocks();
    const handler = new PressSwitchCommandHandler(repository, queueSender);

    const result = await handler.handle(new PressSwitchCommand(EXECUTOR_ID));

    expect(result.requestId).toEqual(expect.any(String));

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedRequest = repository.save.mock.calls[0][0];
    expect(savedRequest.requestId.toString()).toBe(result.requestId);
    expect(savedRequest.executorId.toString()).toBe(EXECUTOR_ID);
    expect(savedRequest.status).toBe("pending");
    expect(savedRequest.action).toBe("press");

    expect(queueSender.enqueue).toHaveBeenCalledTimes(1);
    expect(queueSender.enqueue).toHaveBeenCalledWith({
      requestId: result.requestId,
      action: "press",
      issuedAt: savedRequest.issuedAt.toISOString(),
    });
  });

  it("persists the request before enqueueing it", async () => {
    const { repository, queueSender } = createMocks();
    const callOrder: string[] = [];
    repository.save.mockImplementation(async () => {
      callOrder.push("save");
    });
    queueSender.enqueue.mockImplementation(async () => {
      callOrder.push("enqueue");
    });

    const handler = new PressSwitchCommandHandler(repository, queueSender);
    await handler.handle(new PressSwitchCommand(EXECUTOR_ID));

    expect(callOrder).toEqual(["save", "enqueue"]);
  });

  it("rejects a malformed executorId", async () => {
    const { repository, queueSender } = createMocks();
    const handler = new PressSwitchCommandHandler(repository, queueSender);

    await expect(
      handler.handle(new PressSwitchCommand("not-a-uuid"))
    ).rejects.toThrow();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
