import { Uuid } from "../shared/Uuid";
import { EmailAddress } from "./EmailAddress";

export class User {
  constructor(
    public readonly id: Uuid,
    public readonly emailAddress: EmailAddress
  ) {}

  static reconstruct(id: string, emailAddress: string): User {
    return new User(Uuid.create(id), EmailAddress.create(emailAddress));
  }
}
