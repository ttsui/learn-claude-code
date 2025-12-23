import { describe, it, expect, vi } from "vitest";
import { createPickerSession, getSessionStatus } from "../google-photos-picker";

describe("Google Photos Picker API", () => {
  describe("createPickerSession", () => {
    it("should create a new picker session with valid access token", async () => {
      const accessToken = "test-access-token";

      // Mock the fetch API
      const mockSessionResponse = {
        id: "session-123",
        pickerUri: "https://photos.google.com/picker/session-123",
        pollingConfig: {
          pollInterval: "1s",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSessionResponse,
      } as Response);

      const session = await createPickerSession(accessToken);

      expect(session).toHaveProperty("id", "session-123");
      expect(session).toHaveProperty("pickerUri");
      expect(session.pickerUri).toMatch(/^https:\/\//);

      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        "https://photospicker.googleapis.com/v1/sessions",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer test-access-token",
            "Content-Type": "application/json",
          },
        }),
      );
    });

    it("should throw error when access token is invalid", async () => {
      const invalidToken = "invalid-token";

      // Mock failed response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        text: async () => "Invalid credentials",
      } as Response);

      await expect(createPickerSession(invalidToken)).rejects.toThrow(
        "Failed to create picker session",
      );
    });
  });

  describe("getSessionStatus", () => {
    it("should retrieve session status and selected media items", async () => {
      const accessToken = "test-access-token";
      const sessionId = "test-session-id";

      // Mock the fetch API
      const mockStatusResponse = {
        id: "test-session-id",
        pickerUri: "https://photos.google.com/picker/test-session-id",
        mediaItemsSet: false,
        pollingConfig: {
          pollInterval: "1s",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockStatusResponse,
      } as Response);

      const status = await getSessionStatus(accessToken, sessionId);

      expect(status).toHaveProperty("mediaItemsSet");
      expect(status.mediaItemsSet).toBeTypeOf("boolean");

      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        "https://photospicker.googleapis.com/v1/sessions/test-session-id",
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: "Bearer test-access-token",
          },
        }),
      );
    });

    it("should include media items when selection is complete", async () => {
      const accessToken = "test-access-token";
      const sessionId = "test-session-id";

      // Mock response with completed selection
      const mockStatusResponse = {
        id: "test-session-id",
        pickerUri: "https://photos.google.com/picker/test-session-id",
        mediaItemsSet: true,
        mediaItems: [
          {
            id: "media-item-1",
            filename: "photo1.jpg",
            mimeType: "image/jpeg",
          },
          {
            id: "media-item-2",
            filename: "photo2.jpg",
            mimeType: "image/jpeg",
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockStatusResponse,
      } as Response);

      const status = await getSessionStatus(accessToken, sessionId);

      expect(status.mediaItemsSet).toBe(true);
      expect(status).toHaveProperty("mediaItems");
      expect(Array.isArray(status.mediaItems)).toBe(true);
      expect(status.mediaItems).toHaveLength(2);
    });
  });
});
