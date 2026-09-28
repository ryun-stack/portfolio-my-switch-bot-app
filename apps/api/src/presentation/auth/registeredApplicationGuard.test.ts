import { ForbiddenException, type ExecutionContext } from "@nestjs/common";
import type { ApplicationRepository } from "../../domain/repositories/ApplicationRepository";
import { Application } from "../../domain/Application/Application";
import { Uuid } from "../../domain/shared/Uuid";
import { RegisteredApplicationGuard } from "./registeredApplicationGuard";

function createContext(application: unknown): {
  context: ExecutionContext;
  request: Record<string, unknown>;
} {
  const request: Record<string, unknown> = { application };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

describe("RegisteredApplicationGuard", () => {
  function createRepository(): jest.Mocked<ApplicationRepository> {
    return { findByClientId: jest.fn() };
  }

  it("returns false and skips the repository when request.application is missing", async () => {
    const repository = createRepository();
    const guard = new RegisteredApplicationGuard(repository);
    const { context } = createContext(undefined);

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
    expect(repository.findByClientId).not.toHaveBeenCalled();
  });

  it("returns false and skips the repository when request.application has no clientId", async () => {
    const repository = createRepository();
    const guard = new RegisteredApplicationGuard(repository);
    const { context } = createContext({ clientId: "" });

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
    expect(repository.findByClientId).not.toHaveBeenCalled();
  });

  it("returns false and skips the repository when clientId is not a well-formed UUID", async () => {
    const repository = createRepository();
    const guard = new RegisteredApplicationGuard(repository);
    const { context } = createContext({ clientId: "not-a-uuid" });

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
    expect(repository.findByClientId).not.toHaveBeenCalled();
  });

  it("returns true and attaches registeredApplicationId when clientId matches a registered application", async () => {
    const repository = createRepository();
    const registeredApplication = Application.reconstruct(
      "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "11111111-1111-1111-1111-111111111111",
      "edge-raspberrypi"
    );
    repository.findByClientId.mockResolvedValue(registeredApplication);
    const guard = new RegisteredApplicationGuard(repository);
    const { context, request } = createContext({
      clientId: "11111111-1111-1111-1111-111111111111",
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(repository.findByClientId).toHaveBeenCalledWith(
      Uuid.create("11111111-1111-1111-1111-111111111111")
    );
    expect(
      (request.application as { registeredApplicationId?: string })
        .registeredApplicationId
    ).toBe("3fa85f64-5717-4562-b3fc-2c963f66afa6");
  });

  it("throws ForbiddenException when no registered application matches the clientId", async () => {
    const repository = createRepository();
    repository.findByClientId.mockResolvedValue(undefined);
    const guard = new RegisteredApplicationGuard(repository);
    const { context } = createContext({
      clientId: "22222222-2222-2222-2222-222222222222",
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException
    );
  });
});
