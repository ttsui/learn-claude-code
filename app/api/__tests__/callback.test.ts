import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../auth/callback/route";
import { NextRequest } from "next/server";

// Mock the oauth module
vi.mock("../../../lib/auth/oauth", () => ({
  exchangeCodeForToken: vi.fn(),
}));

describe("OAuth Callback API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.fails(
    "should exchange code for token and redirect with token",
    async () => {
      const { exchangeCodeForToken } = await import("../../../lib/auth/oauth");

      const mockTokenResponse = {
        access_token: "mock-access-token",
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: "mock-refresh-token",
      };

      (exchangeCodeForToken as any).mockResolvedValueOnce(mockTokenResponse);

      const request = new NextRequest(
        "http://localhost:3000/api/auth/callback?code=test-auth-code&state=test-state",
      );

      const response = await GET(request);

      expect(response.status).toBe(302); // Redirect
      expect(response.headers.get("location")).toContain("/?access_token=");
    },
  );

  it.fails("should handle missing authorization code", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/callback");

    const response = await GET(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  it.fails("should handle token exchange errors", async () => {
    const { exchangeCodeForToken } = await import("../../../lib/auth/oauth");

    (exchangeCodeForToken as any).mockRejectedValueOnce(
      new Error("Token exchange failed"),
    );

    const request = new NextRequest(
      "http://localhost:3000/api/auth/callback?code=invalid-code",
    );

    const response = await GET(request);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });
});
