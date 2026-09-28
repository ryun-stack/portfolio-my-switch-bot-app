import { SwitchRequest } from "../../domain/SwitchRequest/SwitchRequest";
import type { SwitchRequestRepository } from "../../domain/repositories/SwitchRequestRepository";
import { Uuid } from "../../domain/shared/Uuid";
import { CompleteSwitchRequestCommand } from "./CompleteSwitchRequestCommand";
import { CompleteSwitchRequestCommandHandler } from "./CompleteSwitchRequestCommandHandler";

const EXECUTOR_ID = "11111111-1111-4111-8111-111111111111";
const REQUEST_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

describe("CompleteSwitchRequestCommandHandler", () => {
  function createRepository(): jest.Mocked<SwitchRequestRepository> {
    return {
      save: jest.fn(),
      findById: jest.fn(),
    };
  }

  function createPendingRequest(): SwitchRequest {
    return SwitchRequest.reconstruct({
      requestId: Uuid.create(REQUEST_ID),
      executorId: Uuid.create(EXECUTOR_ID),
      action: "press",
      status: "pending",
      issuedAt: new Date("2026-07-21T21:53:00Z"),
      updatedAt: new Date("2026-07-21T21:53:00Z"),
    });
  }

  it("marks a pending request as done and persists it", async () => {
    const repository = createRepository();
    const switchRequest = createPendingRequest();
    repository.findById.mockResolvedValue(switchRequest);

    const handler = new CompleteSwitchRequestCommandHandler(repository);
    const result = await handler.handle(
      new CompleteSwitchRequestCommand(REQUEST_ID, "done")
    );

    expect(result).toBe("completed");
    expect(switchRequest.status).toBe("done");
    expect(repository.save).toHaveBeenCalledWith(switchRequest);
  });

  it("marks a pending request as failed and persists it", async () => {
    const repository = createRepository();
    const switchRequest = createPendingRequest();
    repository.findById.mockResolvedValue(switchRequest);

    const handler = new CompleteSwitchRequestCommandHandler(repository);
    const result = await handler.handle(
      new CompleteSwitchRequestCommand(REQUEST_ID, "failed")
    );

    expect(result).toBe("completed");
    expect(switchRequest.status).toBe("failed");
    expect(repository.save).toHaveBeenCalledWith(switchRequest);
  });

  it("returns not_found when the request does not exist", async () => {
    const repository = createRepository();
    repository.findById.mockResolvedValue(undefined);

    const handler = new CompleteSwitchRequestCommandHandler(repository);
    const result = await handler.handle(
      new CompleteSwitchRequestCommand(REQUEST_ID, "done")
    );

    expect(result).toBe("not_found");
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("returns not_found without querying the repository when the request id is malformed", async () => {
    const repository = createRepository();

    const handler = new CompleteSwitchRequestCommandHandler(repository);
    const result = await handler.handle(
      new CompleteSwitchRequestCommand("not-a-uuid", "done")
    );

    expect(repository.findById).not.toHaveBeenCalled();
    expect(result).toBe("not_found");
  });

  it("returns already_finalized when the request was already done/failed", async () => {
    const repository = createRepository();
    const switchRequest = createPendingRequest();
    switchRequest.markDone();
    repository.findById.mockResolvedValue(switchRequest);

    const handler = new CompleteSwitchRequestCommandHandler(repository);
    const result = await handler.handle(
      new CompleteSwitchRequestCommand(REQUEST_ID, "failed")
    );

    expect(result).toBe("already_finalized");
    expect(repository.save).not.toHaveBeenCalled();
  });
});
