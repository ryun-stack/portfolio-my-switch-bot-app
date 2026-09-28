import { UnauthorizedException } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { EdgeClientAuthGuard } from "./edgeClientAuthGuard";
import type { RequestWithApplication } from "./authenticatedApplication";

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
  request: RequestWithApplication;
} {
  const request = { headers } as unknown as RequestWithApplication;
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

describe("EdgeClientAuthGuard", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...ORIGINAL_ENV,
      ENTRA_TENANT_ID: "test-tenant-id",
      ENTRA_API_AUDIENCE: "test-audience",
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
    const guard = new EdgeClientAuthGuard();
    const { context } = createContext({});

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException
    );
    expect(mockedVerify).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedException when the Authorization header isn't Bearer", async () => {
    const guard = new EdgeClientAuthGuard();
    const { context } = createContext({ authorization: "Basic abc123" });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException
    );
    expect(mockedVerify).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedException when token verification fails (bad signature/expired/etc.)", async () => {
    mockVerifyResult(new Error("invalid signature"));
    const guard = new EdgeClientAuthGuard();
    const { context } = createContext({ authorization: "Bearer test-token" });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it("attaches request.application.clientId from the appid claim on a valid token", async () => {
    mockVerifyResult(null, { appid: "11111111-1111-1111-1111-111111111111" });
    const guard = new EdgeClientAuthGuard();
    const { context, request } = createContext({
      authorization: "Bearer test-token",
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.application).toEqual({
      clientId: "11111111-1111-1111-1111-111111111111",
    });
  });

  it("falls back to the azp claim when appid is absent", async () => {
    mockVerifyResult(null, { azp: "11111111-1111-1111-1111-111111111111" });
    const guard = new EdgeClientAuthGuard();
    const { context, request } = createContext({
      authorization: "Bearer test-token",
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.application?.clientId).toBe(
      "11111111-1111-1111-1111-111111111111"
    );
  });

  it("attaches an empty clientId when neither appid nor azp is present", async () => {
    mockVerifyResult(null, { oid: "some-user-oid" });
    const guard = new EdgeClientAuthGuard();
    const { context, request } = createContext({
      authorization: "Bearer test-token",
    });

    const result = await guard.canActivate(context);

    // This guard only decodes/attaches the claim; RegisteredApplicationGuard
    // is responsible for rejecting an empty/unregistered clientId.
    expect(result).toBe(true);
    expect(request.application).toEqual({ clientId: "" });
  });
});
