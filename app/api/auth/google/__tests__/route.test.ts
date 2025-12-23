import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";
import * as googleAuth from "@/lib/google-auth";

describe("GET /api/auth/google", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = "test-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
  });

  it("should redirect to Google authorization URL", async () => {
    const mockAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=test&scope=photos";

    vi.spyOn(googleAuth, "generateAuthUrl").mockReturnValue(mockAuthUrl);

    const request = new NextRequest("http://localhost:3000/api/auth/google", {
      headers: {
        host: "localhost:3000",
      },
    });

    const response = await GET(request);

    expect(response.status).toBe(307); // Temporary redirect
    expect(response.headers.get("location")).toBe(mockAuthUrl);
    expect(googleAuth.generateAuthUrl).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/google/callback",
    );
  });

  it("should handle x-forwarded-proto header for HTTPS", async () => {
    const mockAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    vi.spyOn(googleAuth, "generateAuthUrl").mockReturnValue(mockAuthUrl);

    const request = new NextRequest("https://example.com/api/auth/google", {
      headers: {
        host: "example.com",
        "x-forwarded-proto": "https",
      },
    });

    const response = await GET(request);

    expect(googleAuth.generateAuthUrl).toHaveBeenCalledWith(
      "https://example.com/api/auth/google/callback",
    );
  });

  it("should return error response when auth URL generation fails", async () => {
    vi.spyOn(googleAuth, "generateAuthUrl").mockImplementation(() => {
      throw new Error("OAuth credentials not configured");
    });

    const request = new NextRequest("http://localhost:3000/api/auth/google", {
      headers: {
        host: "localhost:3000",
      },
    });

    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Failed to initiate authorization");
    expect(data.message).toContain("OAuth credentials not configured");
  });
});
