import { SwitchRequest } from "../../domain/SwitchRequest/SwitchRequest";
import type { SwitchRequestRepository } from "../../domain/repositories/SwitchRequestRepository";
import { Uuid } from "../../domain/shared/Uuid";
import { GetSwitchStatusQuery } from "./GetSwitchStatusQuery";
import { GetSwitchStatusQueryHandler } from "./GetSwitchStatusQueryHandler";

const EXECUTOR_ID = "11111111-1111-4111-8111-111111111111";

describe("GetSwitchStatusQueryHandler", () => {
  function createRepository(): jest.Mocked<SwitchRequestRepository> {
    return {
      save: jest.fn(),
      findById: jest.fn(),
    };
  }

  it("returns a status view when the request exists", async () => {
    const issuedAt = new Date("2026-07-21T21:53:00Z");
    const updatedAt = new Date("2026-07-21T21:53:05Z");
    const switchRequest = SwitchRequest.reconstruct({
      requestId: Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
      executorId: Uuid.create(EXECUTOR_ID),
      action: "press",
      status: "done",
      issuedAt,
      updatedAt,
    });

    const repository = createRepository();
    repository.findById.mockResolvedValue(switchRequest);

    const handler = new GetSwitchStatusQueryHandler(repository);
    const result = await handler.handle(
      new GetSwitchStatusQuery("3fa85f64-5717-4562-b3fc-2c963f66afa6")
    );

    expect(repository.findById).toHaveBeenCalledWith(
      Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6")
    );
    expect(result).toEqual({
      requestId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      executorId: EXECUTOR_ID,
      action: "press",
      status: "done",
      issuedAt: issuedAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it("returns undefined when a validly-formatted request id does not exist", async () => {
    const repository = createRepository();
    repository.findById.mockResolvedValue(undefined);

    const handler = new GetSwitchStatusQueryHandler(repository);
    const result = await handler.handle(
      new GetSwitchStatusQuery("3fa85f64-5717-4562-b3fc-2c963f66afa6")
    );

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it("returns undefined without querying the repository when the request id is malformed", async () => {
    const repository = createRepository();

    const handler = new GetSwitchStatusQueryHandler(repository);
    const result = await handler.handle(new GetSwitchStatusQuery("unknown-id"));

    expect(repository.findById).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
