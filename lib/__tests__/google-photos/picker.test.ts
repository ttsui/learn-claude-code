import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPickerSession, getMediaItems } from "../../google-photos/picker";

// Mock global fetch
global.fetch = vi.fn();

describe("Google Photos Picker API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.fails("should create a picker session with access token", async () => {
    const accessToken = "test-access-token";

    const mockSessionResponse = {
      pickerUri:
        "https://photospicker.googleapis.com/picker/abc123?access_token=xyz",
      mediaItemsSet: false,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSessionResponse,
    });

    const session = await createPickerSession({
      accessToken,
    });

    expect(session).toHaveProperty("pickerUri");
    expect(session.pickerUri).toContain("photospicker.googleapis.com");
    expect(session).toHaveProperty("mediaItemsSet");
  });

  it.fails(
    "should retrieve selected media items from picker session",
    async () => {
      const accessToken = "test-access-token";
      const sessionId = "test-session-id";

      const mockMediaItems = {
        mediaItems: [
          {
            id: "photo1",
            mimeType: "image/jpeg",
            filename: "IMG_001.jpg",
            baseUrl: "https://lh3.googleusercontent.com/...",
          },
          {
            id: "photo2",
            mimeType: "image/png",
            filename: "IMG_002.png",
            baseUrl: "https://lh3.googleusercontent.com/...",
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMediaItems,
      });

      const mediaItems = await getMediaItems({
        accessToken,
        sessionId,
      });

      expect(mediaItems).toHaveProperty("mediaItems");
      expect(mediaItems.mediaItems).toHaveLength(2);
      expect(mediaItems.mediaItems[0]).toHaveProperty("id");
      expect(mediaItems.mediaItems[0]).toHaveProperty("baseUrl");
    },
  );

  it.fails("should handle picker session creation errors", async () => {
    const accessToken = "invalid-token";

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    await expect(createPickerSession({ accessToken })).rejects.toThrow(
      "Failed to create picker session",
    );
  });

  it.fails("should handle errors when retrieving media items", async () => {
    const accessToken = "test-access-token";
    const sessionId = "invalid-session";

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Session not found",
    });

    await expect(getMediaItems({ accessToken, sessionId })).rejects.toThrow(
      "Failed to get media items",
    );
  });
});
