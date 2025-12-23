import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "../route";
import * as pickerApi from "@/lib/google-photos-picker";

describe("POST /api/photos/picker/session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new Picker session with valid access token", async () => {
    const mockSession = {
      id: "session-abc123",
      pickerUri: "https://photos.google.com/picker/session-abc123",
    };

    vi.spyOn(pickerApi, "createPickerSession").mockResolvedValue(mockSession);

    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-access-token",
        },
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("id", "session-abc123");
    expect(data).toHaveProperty("pickerUri");
    expect(data.pickerUri).toContain("https://photos.google.com/picker");
    expect(data).toHaveProperty("message");

    expect(pickerApi.createPickerSession).toHaveBeenCalledWith(
      "valid-access-token",
    );
  });

  it("should return 401 when Authorization header is missing", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session",
      {
        method: "POST",
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Unauthorized");
    expect(data.message).toContain("Authorization header");
  });

  it("should return 401 when Authorization header is malformed", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session",
      {
        method: "POST",
        headers: {
          Authorization: "InvalidFormat token123",
        },
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Unauthorized");
  });

  it("should handle session creation failure", async () => {
    vi.spyOn(pickerApi, "createPickerSession").mockRejectedValue(
      new Error("Failed to create picker session: 401 Unauthorized"),
    );

    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer invalid-token",
        },
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Failed to create session");
    expect(data.message).toContain("Failed to create picker session");
  });
});

describe("GET /api/photos/picker/session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve session status successfully", async () => {
    const mockStatus = {
      mediaItemsSet: false,
      pollingConfig: {
        pollInterval: "1s",
      },
    };

    vi.spyOn(pickerApi, "getSessionStatus").mockResolvedValue(mockStatus);

    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session?sessionId=session-123",
      {
        headers: {
          Authorization: "Bearer valid-access-token",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("sessionId", "session-123");
    expect(data).toHaveProperty("mediaItemsSet", false);
    expect(data).toHaveProperty("mediaItems", []);
    expect(data.message).toContain("Waiting for user");

    expect(pickerApi.getSessionStatus).toHaveBeenCalledWith(
      "valid-access-token",
      "session-123",
    );
  });

  it("should return media items when selection is complete", async () => {
    const mockStatus = {
      mediaItemsSet: true,
      mediaItems: [
        {
          id: "photo-1",
          filename: "vacation.jpg",
          mimeType: "image/jpeg",
        },
        {
          id: "photo-2",
          filename: "sunset.jpg",
          mimeType: "image/jpeg",
        },
      ],
    };

    vi.spyOn(pickerApi, "getSessionStatus").mockResolvedValue(mockStatus);

    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session?sessionId=session-456",
      {
        headers: {
          Authorization: "Bearer valid-access-token",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("mediaItemsSet", true);
    expect(data.mediaItems).toHaveLength(2);
    expect(data.message).toContain("completed photo selection");
  });

  it("should return 401 when Authorization header is missing", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session?sessionId=session-123",
    );

    const response = await GET(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Unauthorized");
  });

  it("should return 400 when sessionId is missing", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session",
      {
        headers: {
          Authorization: "Bearer valid-access-token",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Bad Request");
    expect(data.message).toContain("sessionId");
  });

  it("should handle session status retrieval failure", async () => {
    vi.spyOn(pickerApi, "getSessionStatus").mockRejectedValue(
      new Error("Failed to get session status: 404 Not Found"),
    );

    const request = new NextRequest(
      "http://localhost:3000/api/photos/picker/session?sessionId=invalid-id",
      {
        headers: {
          Authorization: "Bearer valid-access-token",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Failed to get session status");
  });
});
