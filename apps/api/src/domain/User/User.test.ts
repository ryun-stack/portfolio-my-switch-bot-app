import { User } from "./User";
import { Uuid } from "../shared/Uuid";
import { EmailAddress } from "./EmailAddress";

describe("User", () => {
  describe("constructor", () => {
    it("holds the given Uuid and EmailAddress as-is", () => {
      const id = Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6");
      const emailAddress = EmailAddress.create("user@example.com");

      const user = new User(id, emailAddress);

      expect(user.id).toBe(id);
      expect(user.emailAddress).toBe(emailAddress);
    });
  });

  describe("reconstruct", () => {
    it("builds a User from persisted raw id/emailAddress strings", () => {
      const user = User.reconstruct(
        "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "User@Example.com"
      );

      expect(user.id.toString()).toBe("3fa85f64-5717-4562-b3fc-2c963f66afa6");
      expect(user.emailAddress.toString()).toBe("user@example.com");
    });

    it("throws when the persisted id is not a well-formed UUID", () => {
      expect(() =>
        User.reconstruct("not-a-uuid", "user@example.com")
      ).toThrow();
    });

    it("throws when the persisted emailAddress is not well-formed", () => {
      expect(() =>
        User.reconstruct(
          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "not-an-email"
        )
      ).toThrow();
    });
  });
});
