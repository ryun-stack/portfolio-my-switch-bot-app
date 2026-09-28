import { Uuid } from "../shared/Uuid";

/**
 * A registered caller application (Onion Architecture Domain layer),
 * mirroring `User` (see domain/User/User.ts) but for non-human callers
 * that authenticate via OAuth2 client credentials (Entra ID app
 * registration + client secret) instead of a delegated user login — e.g.
 * the Edge device (Raspberry Pi, ADR.md 3.3/4章).
 *
 * Modeling this as its own entity/table (rather than a single
 * `ENTRA_EDGE_CLIENT_ID` env var) means authorizing a new caller
 * application only requires adding a row to Table Storage, the same way
 * a new family member is authorized by adding a row to the Users table —
 * no redeploy/env var change needed, and multiple caller applications can
 * be registered side by side.
 */
export class Application {
  constructor(
    public readonly id: Uuid,
    public readonly clientId: Uuid,
    public readonly name: string
  ) {}

  static reconstruct(id: string, clientId: string, name: string): Application {
    return new Application(Uuid.create(id), Uuid.create(clientId), name);
  }
}
