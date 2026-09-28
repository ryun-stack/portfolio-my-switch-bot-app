import { UnauthorizedException } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { EntraIdAuthGuard } from "./entraIdAuthGuard";
import type { AuthenticatedUser } from "./authenticatedUser";

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: { verify: jest.fn() },
  verify: jest.fn(),
}));
jest.mock("jwks-rsa", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedVerify = jwt.verify as unknown as jest.Mock;
const mockedJwksClient = jwksClient as unknown as jest.Mock;

function createContext(headers: Record<string, string>): {
  context: ExecutionContext;
  request: Record<string, unknown>;
} {
  const request: Record<string, unknown> = { headers };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

/** Configures the mocked jwt.verify callback for the next call. */
function mockVerifyResult(error: Error | null, decoded?: Record<string, unknown>) {
  mockedVerify.mockImplementation(
    (
      _token: string,
      _getKey: unknown,
      _options: unknown,
      callback: (err: Error | null, decoded?: Record<string, unknown>) => void
    ) => {
      callback(error, decoded);
    }
  );
}

describe("EntraIdAuthGuard", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...ORIGINAL_ENV,
      ENTRA_TENANT_ID: "test-tenant-id",
      ENTRA_API_AUDIENCE: "test-audience",
      ENTRA_ALLOWED_EMAILS: "",
    };

    mockedJwksClient.mockReturnValue({
      getSigningKey: (
        _kid: string | undefined,
        callback: (err: Error | null, key?: { getPublicKey: () => string }) => void
      ) => {
        callback(null, { getPublicKey: () => "fake-public-key" });
      },
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws UnauthorizedException when no Authorization header is present", async () => {
    const guard = new EntraIdAuthGuard();
    const { context } = createContext({});

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException
    );
    expect(mockedVerify).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedException when the Authorization header isn't a Bearer token", async () => {
    const guard = new EntraIdAuthGuard();
    const { context } = createContext({ authorization: "Basic abc123" });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException
    );
    expect(mockedVerify).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedException when token verification fails (bad signature/expired/etc.)", async () => {
    mockVerifyResult(new Error("invalid signature"));
    const guard = new EntraIdAuthGuard();
    const { context } = createContext({ authorization: "Bearer bad-token" });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it("allows a valid token and attaches the AuthenticatedUser to the request", async () => {
    mockVerifyResult(null, {
      oid: "user-oid-123",
      preferred_username: "Family@Example.com",
      name: "Family Member",
    });
    const guard = new EntraIdAuthGuard();
    const { context, request } = createContext({
      authorization: "Bearer good-token",
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual({
      oid: "user-oid-123",
      email: "family@example.com",
      name: "Family Member",
    } satisfies AuthenticatedUser);
  });

  it("falls back to the email claim when preferred_username is absent", async () => {
    mockVerifyResult(null, { oid: "abc", email: "Other@Example.com" });
    const guard = new EntraIdAuthGuard();
    const { context, request } = createContext({
      authorization: "Bearer good-token",
    });

    await guard.canActivate(context);

    expect((request.user as AuthenticatedUser).email).toBe(
      "other@example.com"
    );
  });

});
