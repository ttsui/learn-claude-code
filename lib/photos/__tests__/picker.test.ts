import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createPickerSession,
  getSessionDetails,
  listMediaItems,
  deleteSession,
  PickerAPIError,
} from "../picker";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("Google Photos Picker Session Management", () => {
  const mockAccessToken = "mock-access-token";
  const mockSessionId = "session-123";

  it("should create a picker session with valid access token", async () => {
    const mockResponse = {
      id: mockSessionId,
      pickerUri: "https://photos.google.com/picker/session-123",
      mediaItemsSet: false,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const session = await createPickerSession(mockAccessToken);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://photospicker.googleapis.com/v1/sessions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockAccessToken}`,
          "Content-Type": "application/json",
        }),
      }),
    );

    expect(session).toEqual({
      id: mockSessionId,
      pickerUri: "https://photos.google.com/picker/session-123",
      mediaItemsSet: false,
    });
  });

  it("should retrieve session details", async () => {
    const mockResponse = {
      id: mockSessionId,
      pickerUri: "https://photos.google.com/picker/session-123",
      mediaItemsSet: true,
      mediaItemIds: ["item-1", "item-2"],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const details = await getSessionDetails(mockSessionId, mockAccessToken);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://photospicker.googleapis.com/v1/sessions/${mockSessionId}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockAccessToken}`,
        }),
      }),
    );

    expect(details).toEqual(mockResponse);
  });

  it("should list media items from a session", async () => {
    const mockMediaItems = [
      {
        id: "item-1",
        filename: "photo1.jpg",
        mimeType: "image/jpeg",
        mediaFile: { url: "https://example.com/photo1.jpg" },
      },
      {
        id: "item-2",
        filename: "photo2.jpg",
        mimeType: "image/jpeg",
        mediaFile: { url: "https://example.com/photo2.jpg" },
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ mediaItems: mockMediaItems }),
    });

    const items = await listMediaItems(mockSessionId, mockAccessToken);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://photospicker.googleapis.com/v1/sessions/${mockSessionId}/mediaItems`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockAccessToken}`,
        }),
      }),
    );

    expect(items).toEqual(mockMediaItems);
  });

  it("should delete a session after use", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    await deleteSession(mockSessionId, mockAccessToken);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://photospicker.googleapis.com/v1/sessions/${mockSessionId}`,
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockAccessToken}`,
        }),
      }),
    );
  });

  it("should handle 401 unauthorized errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: { message: "Invalid token", code: "UNAUTHENTICATED" },
      }),
    });

    await expect(createPickerSession(mockAccessToken)).rejects.toThrow(
      PickerAPIError,
    );
  });

  it("should handle FAILED_PRECONDITION errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: { message: "No Photos account", code: "FAILED_PRECONDITION" },
      }),
    });

    await expect(createPickerSession(mockAccessToken)).rejects.toThrow(
      "User does not have an active Google Photos account",
    );
  });

  it("should handle RESOURCE_EXHAUSTED errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: { message: "Too many sessions", code: "RESOURCE_EXHAUSTED" },
      }),
    });

    await expect(createPickerSession(mockAccessToken)).rejects.toThrow(
      "Too many active sessions",
    );
  });
});
