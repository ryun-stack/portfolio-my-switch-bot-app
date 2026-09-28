import { ForbiddenException, type ExecutionContext } from "@nestjs/common";
import { EmailAddress } from "../../domain/User/EmailAddress";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import { Uuid } from "../../domain/shared/Uuid";
import { User } from "../../domain/User/User";
import { RegisteredUserGuard } from "./registeredUserGuard";

function createContext(user: unknown): { context: ExecutionContext; request: Record<string, unknown> } {
  const request: Record<string, unknown> = { user };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

describe("RegisteredUserGuard", () => {
  function createRepository(): jest.Mocked<UserRepository> {
    return { findByEmailAddress: jest.fn() };
  }

  it("returns false and skips the repository when request.user is missing", async () => {
    const repository = createRepository();
    const guard = new RegisteredUserGuard(repository);
    const { context } = createContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException
    );
    expect(repository.findByEmailAddress).not.toHaveBeenCalled();
  });

  it("returns false and skips the repository when request.user has no email", async () => {
    const repository = createRepository();
    const guard = new RegisteredUserGuard(repository);
    const { context } = createContext({ oid: "abc-123" });

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException
    );
    expect(repository.findByEmailAddress).not.toHaveBeenCalled();
  });

  it("returns false and skips the repository when the email claim is malformed", async () => {
    const repository = createRepository();
    const guard = new RegisteredUserGuard(repository);
    const { context } = createContext({ email: "not-an-email" });

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException
    );
  });

  it("returns true and attaches registeredUserId when the email matches a registered user", async () => {
    const repository = createRepository();
    const registeredUser = new User(
      Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
      EmailAddress.create("family@example.com")
    );
    repository.findByEmailAddress.mockResolvedValue(registeredUser);
    const guard = new RegisteredUserGuard(repository);
    const { context, request } = createContext({ email: "Family@Example.com" });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(repository.findByEmailAddress).toHaveBeenCalledWith(
      EmailAddress.create("family@example.com")
    );
    expect((request.user as { registeredUserId?: string }).registeredUserId).toBe(
      "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    );
  });

  it("throws ForbiddenException when no registered user matches the email", async () => {
    const repository = createRepository();
    repository.findByEmailAddress.mockResolvedValue(undefined);
    const guard = new RegisteredUserGuard(repository);
    const { context } = createContext({ email: "stranger@example.com" });

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException
    );
  });
});
