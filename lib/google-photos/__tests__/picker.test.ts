import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createPickerSession,
  getPickerSession,
  getPickerMediaItems,
  GOOGLE_PHOTOS_PICKER_ENDPOINT,
  PickerSessionState,
} from "../picker";

describe("Google Photos Picker", () => {
  const mockAccessToken = "test-access-token";

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("createPickerSession", () => {
    it("should create a picker session and return session details", async () => {
      const mockSessionResponse = {
        id: "session-123",
        pickerUri: "https://photos.google.com/picker/session-123",
        expireTime: "2024-01-01T12:00:00Z",
        mediaItemsSet: false,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSessionResponse,
      } as Response);

      const result = await createPickerSession(mockAccessToken);

      expect(result).toEqual(mockSessionResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${GOOGLE_PHOTOS_PICKER_ENDPOINT}/sessions`,
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
            "Content-Type": "application/json",
          },
        }),
      );
    });

    it("should throw error when session creation fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ error: { message: "Invalid token" } }),
      } as Response);

      await expect(createPickerSession(mockAccessToken)).rejects.toThrow(
        "Failed to create picker session",
      );
    });
  });

  describe("getPickerSession", () => {
    const mockSessionId = "session-123";

    it("should retrieve session with pending state", async () => {
      const mockSessionResponse = {
        id: mockSessionId,
        pickerUri: "https://photos.google.com/picker/session-123",
        expireTime: "2024-01-01T12:00:00Z",
        mediaItemsSet: false,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSessionResponse,
      } as Response);

      const result = await getPickerSession(mockSessionId, mockAccessToken);

      expect(result.state).toBe(PickerSessionState.PENDING);
      expect(fetch).toHaveBeenCalledWith(
        `${GOOGLE_PHOTOS_PICKER_ENDPOINT}/sessions/${mockSessionId}`,
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
          },
        }),
      );
    });

    it("should retrieve session with completed state when media items are set", async () => {
      const mockSessionResponse = {
        id: mockSessionId,
        pickerUri: "https://photos.google.com/picker/session-123",
        expireTime: "2024-01-01T12:00:00Z",
        mediaItemsSet: true,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSessionResponse,
      } as Response);

      const result = await getPickerSession(mockSessionId, mockAccessToken);

      expect(result.state).toBe(PickerSessionState.COMPLETED);
    });

    it("should throw error when session retrieval fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ error: { message: "Session not found" } }),
      } as Response);

      await expect(
        getPickerSession(mockSessionId, mockAccessToken),
      ).rejects.toThrow("Failed to get picker session");
    });
  });

  describe("getPickerMediaItems", () => {
    const mockSessionId = "session-123";

    it("should retrieve media items from a completed session", async () => {
      const mockMediaItems = {
        pickedMediaItems: [
          {
            id: "media-1",
            mediaFile: {
              baseUrl: "https://example.com/photo1.jpg",
              mimeType: "image/jpeg",
              filename: "photo1.jpg",
            },
            type: "PHOTO",
          },
          {
            id: "media-2",
            mediaFile: {
              baseUrl: "https://example.com/video1.mp4",
              mimeType: "video/mp4",
              filename: "video1.mp4",
            },
            type: "VIDEO",
          },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMediaItems,
      } as Response);

      const result = await getPickerMediaItems(mockSessionId, mockAccessToken);

      expect(result.pickedMediaItems).toHaveLength(2);
      expect(result.pickedMediaItems[0].id).toBe("media-1");
      expect(fetch).toHaveBeenCalledWith(
        `${GOOGLE_PHOTOS_PICKER_ENDPOINT}/mediaItems?sessionId=${mockSessionId}`,
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
          },
        }),
      );
    });

    it("should handle pagination with pageToken", async () => {
      const mockResponse = {
        pickedMediaItems: [],
        nextPageToken: "token-123",
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getPickerMediaItems(
        mockSessionId,
        mockAccessToken,
        "prev-token",
      );

      expect(result.nextPageToken).toBe("token-123");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("pageToken=prev-token"),
        expect.anything(),
      );
    });

    it("should throw error when media items retrieval fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ error: { message: "Access denied" } }),
      } as Response);

      await expect(
        getPickerMediaItems(mockSessionId, mockAccessToken),
      ).rejects.toThrow("Failed to get picker media items");
    });
  });

  describe("constants", () => {
    it("should have correct Google Photos Picker endpoint", () => {
      expect(GOOGLE_PHOTOS_PICKER_ENDPOINT).toBe(
        "https://photospicker.googleapis.com/v1",
      );
    });
  });
});
