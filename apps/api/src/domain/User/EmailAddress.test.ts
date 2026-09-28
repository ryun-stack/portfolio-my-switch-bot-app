import { EmailAddress } from "./EmailAddress";

describe("EmailAddress", () => {
  describe("create", () => {
    it("creates an EmailAddress from a well-formed address", () => {
      const email = EmailAddress.create("user@example.com");

      expect(email.toString()).toBe("user@example.com");
    });

    it("trims surrounding whitespace", () => {
      const email = EmailAddress.create("  user@example.com  ");

      expect(email.toString()).toBe("user@example.com");
    });

    it("lowercases the address", () => {
      const email = EmailAddress.create("User@Example.COM");

      expect(email.toString()).toBe("user@example.com");
    });

    it.each([
      "not-an-email",
      "",
      "@example.com",
      "user@",
      "user@example",
      "user name@example.com", // embedded whitespace
      "user'@example.com", // OData filter injection attempt
      'user"@example.com', // OData filter injection attempt
      "user@example.com'; DROP", // OData filter injection attempt
    ])("throws for malformed input '%s'", (value) => {
      expect(() => EmailAddress.create(value)).toThrow();
    });
  });

  describe("equals", () => {
    it("returns true for two EmailAddresses created from the same value", () => {
      const a = EmailAddress.create("user@example.com");
      const b = EmailAddress.create("user@example.com");

      expect(a.equals(b)).toBe(true);
    });

    it("treats case and whitespace differences as equal", () => {
      const a = EmailAddress.create("user@example.com");
      const b = EmailAddress.create("  User@Example.COM  ");

      expect(a.equals(b)).toBe(true);
    });

    it("returns false for two different EmailAddresses", () => {
      const a = EmailAddress.create("user@example.com");
      const b = EmailAddress.create("other@example.com");

      expect(a.equals(b)).toBe(false);
    });
  });
});
