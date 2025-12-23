import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";
import * as googleAuth from "@/lib/google-auth";

describe("GET /api/auth/google/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = "test-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
  });

  it("should exchange authorization code for tokens successfully", async () => {
    const mockTokens = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      token_type: "Bearer" as const,
    };

    vi.spyOn(googleAuth, "exchangeCodeForTokens").mockResolvedValue(mockTokens);

    const request = new NextRequest(
      "http://localhost:3000/api/auth/google/callback?code=auth-code-123",
      {
        headers: {
          host: "localhost:3000",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("message", "Authorization successful");
    expect(data).toHaveProperty("access_token", "mock-access-token");
    expect(data).toHaveProperty("expires_in", 3600);
    expect(data).toHaveProperty("has_refresh_token", true);

    expect(googleAuth.exchangeCodeForTokens).toHaveBeenCalledWith(
      "auth-code-123",
      "http://localhost:3000/api/auth/google/callback",
    );
  });

  it("should handle authorization denial from user", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/auth/google/callback?error=access_denied",
      {
        headers: {
          host: "localhost:3000",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Authorization denied");
    expect(data.message).toContain("access_denied");
  });

  it("should return error when authorization code is missing", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/auth/google/callback",
      {
        headers: {
          host: "localhost:3000",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Missing authorization code");
  });

  it("should handle token exchange failure", async () => {
    vi.spyOn(googleAuth, "exchangeCodeForTokens").mockRejectedValue(
      new Error("Token exchange failed: 401 Unauthorized"),
    );

    const request = new NextRequest(
      "http://localhost:3000/api/auth/google/callback?code=invalid-code",
      {
        headers: {
          host: "localhost:3000",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Token exchange failed");
    expect(data.message).toContain("Token exchange failed");
  });

  it("should use x-forwarded-proto for redirect URI", async () => {
    const mockTokens = {
      access_token: "mock-access-token",
      expires_in: 3600,
      token_type: "Bearer" as const,
    };

    vi.spyOn(googleAuth, "exchangeCodeForTokens").mockResolvedValue(mockTokens);

    const request = new NextRequest(
      "https://example.com/api/auth/google/callback?code=auth-code-123",
      {
        headers: {
          host: "example.com",
          "x-forwarded-proto": "https",
        },
      },
    );

    await GET(request);

    expect(googleAuth.exchangeCodeForTokens).toHaveBeenCalledWith(
      "auth-code-123",
      "https://example.com/api/auth/google/callback",
    );
  });
});
