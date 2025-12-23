import { describe, it, expect } from "vitest";
import { createPickerSession, getSessionStatus } from "../google-photos-picker";

describe("Google Photos Picker API", () => {
  describe("createPickerSession", () => {
    it.skip("should create a new picker session with valid access token", async () => {
      const accessToken = "test-access-token";

      const session = await createPickerSession(accessToken);

      expect(session).toHaveProperty("id");
      expect(session).toHaveProperty("pickerUri");
      expect(session.pickerUri).toMatch(/^https:\/\//);
    });

    it.skip("should throw error when access token is invalid", async () => {
      const invalidToken = "invalid-token";

      await expect(createPickerSession(invalidToken)).rejects.toThrow();
    });
  });

  describe("getSessionStatus", () => {
    it.skip("should retrieve session status and selected media items", async () => {
      const accessToken = "test-access-token";
      const sessionId = "test-session-id";

      const status = await getSessionStatus(accessToken, sessionId);

      expect(status).toHaveProperty("mediaItemsSet");
      expect(status.mediaItemsSet).toBeTypeOf("boolean");
    });

    it.skip("should include media items when selection is complete", async () => {
      const accessToken = "test-access-token";
      const sessionId = "test-session-id";

      const status = await getSessionStatus(accessToken, sessionId);

      if (status.mediaItemsSet) {
        expect(status).toHaveProperty("mediaItems");
        expect(Array.isArray(status.mediaItems)).toBe(true);
      }
    });
  });
});
