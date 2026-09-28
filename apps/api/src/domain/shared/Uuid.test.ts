import { Uuid } from "./Uuid";

describe("Uuid", () => {
  describe("create", () => {
    it("creates a Uuid from a well-formed lowercase UUID string", () => {
      const uuid = Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6");

      expect(uuid.toString()).toBe("3fa85f64-5717-4562-b3fc-2c963f66afa6");
    });

    it("normalizes an uppercase UUID string to lowercase", () => {
      const uuid = Uuid.create("3FA85F64-5717-4562-B3FC-2C963F66AFA6");

      expect(uuid.toString()).toBe("3fa85f64-5717-4562-b3fc-2c963f66afa6");
    });

    it.each([
      "not-a-uuid",
      "",
      "3fa85f64-5717-4562-b3fc-2c963f66afa6'", // OData filter injection attempt
      "3fa85f64571745623b3fc2c963f66afa6", // missing hyphens
      "3fa85f64-5717-4562-b3fc-2c963f66afa", // too short
    ])("throws for malformed input '%s'", (value) => {
      expect(() => Uuid.create(value)).toThrow();
    });
  });

  describe("generate", () => {
    it("generates a well-formed v4 UUID", () => {
      const uuid = Uuid.generate();

      expect(uuid.toString()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it("generates a different value on each call", () => {
      const first = Uuid.generate();
      const second = Uuid.generate();

      expect(first.equals(second)).toBe(false);
    });
  });

  describe("equals", () => {
    it("returns true for two Uuids created from the same value", () => {
      const a = Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6");
      const b = Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6");

      expect(a.equals(b)).toBe(true);
    });

    it("treats case differences as equal", () => {
      const a = Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6");
      const b = Uuid.create("3FA85F64-5717-4562-B3FC-2C963F66AFA6");

      expect(a.equals(b)).toBe(true);
    });

    it("returns false for two different Uuids", () => {
      const a = Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6");
      const b = Uuid.create("00000000-0000-0000-0000-000000000000");

      expect(a.equals(b)).toBe(false);
    });
  });
});
