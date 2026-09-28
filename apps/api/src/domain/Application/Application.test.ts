import { Application } from "./Application";
import { Uuid } from "../shared/Uuid";

describe("Application", () => {
  describe("constructor", () => {
    it("holds the given Uuid id/clientId and name as-is", () => {
      const id = Uuid.create("3fa85f64-5717-4562-b3fc-2c963f66afa6");
      const clientId = Uuid.create("11111111-1111-1111-1111-111111111111");

      const application = new Application(id, clientId, "edge-raspberrypi");

      expect(application.id).toBe(id);
      expect(application.clientId).toBe(clientId);
      expect(application.name).toBe("edge-raspberrypi");
    });
  });

  describe("reconstruct", () => {
    it("builds an Application from persisted raw id/clientId/name strings", () => {
      const application = Application.reconstruct(
        "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "11111111-1111-1111-1111-111111111111",
        "edge-raspberrypi"
      );

      expect(application.id.toString()).toBe(
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      );
      expect(application.clientId.toString()).toBe(
        "11111111-1111-1111-1111-111111111111"
      );
      expect(application.name).toBe("edge-raspberrypi");
    });

    it("throws when the persisted id is not a well-formed UUID", () => {
      expect(() =>
        Application.reconstruct(
          "not-a-uuid",
          "11111111-1111-1111-1111-111111111111",
          "edge-raspberrypi"
        )
      ).toThrow();
    });

    it("throws when the persisted clientId is not a well-formed UUID", () => {
      expect(() =>
        Application.reconstruct(
          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "not-a-uuid",
          "edge-raspberrypi"
        )
      ).toThrow();
    });
  });
});
