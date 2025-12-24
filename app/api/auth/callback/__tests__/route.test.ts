import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";

// Mock the oauth module
vi.mock("@/lib/google-photos/oauth", () => ({
  exchangeCodeForTokens: vi.fn(),
  GOOGLE_TOKEN_ENDPOINT: "https://oauth2.googleapis.com/token",
}));

// Mock the picker module
vi.mock("@/lib/google-photos/picker", () => ({
  createPickerSession: vi.fn(),
}));

import { exchangeCodeForTokens } from "@/lib/google-photos/oauth";
import { createPickerSession } from "@/lib/google-photos/picker";

describe("GET /api/auth/callback", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      GOOGLE_CLIENT_ID: "test-client-id",
      GOOGLE_CLIENT_SECRET: "test-client-secret",
      NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function createRequest(params: Record<string, string>): NextRequest {
    const url = new URL("http://localhost:3000/api/auth/callback");
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return new NextRequest(url);
  }

  it("should exchange code for tokens and redirect to photos page", async () => {
    const mockTokens = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      expires_in: 3600,
      token_type: "Bearer",
      scope: "https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
    };

    const mockSession = {
      id: "session-123",
      pickerUri: "https://photos.google.com/picker/session-123",
      expireTime: "2024-01-01T12:00:00Z",
      mediaItemsSet: false,
    };

    vi.mocked(exchangeCodeForTokens).mockResolvedValueOnce(mockTokens);
    vi.mocked(createPickerSession).mockResolvedValueOnce(mockSession);

    const request = createRequest({
      code: "test-auth-code",
      state: "test-state",
    });

    const response = await GET(request);

    expect(response.status).toBe(302);
    expect(exchangeCodeForTokens).toHaveBeenCalledWith("test-auth-code", {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      redirectUri: "http://localhost:3000/api/auth/callback",
    });
    expect(createPickerSession).toHaveBeenCalledWith("test-access-token");

    // Should redirect to photos page with session info
    const location = response.headers.get("Location");
    expect(location).toContain("http://localhost:3000/photos");
    expect(location).toContain("sessionId=session-123");
    expect(location).toContain(
      `pickerUri=${encodeURIComponent(mockSession.pickerUri)}`,
    );

    // Should set access token cookie
    const cookies = response.cookies.get("google_access_token");
    expect(cookies?.value).toBe("test-access-token");
  });

  it("should return error when code is missing", async () => {
    const request = createRequest({ state: "test-state" });

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Missing authorization code");
  });

  it("should return error when OAuth error is present", async () => {
    const request = createRequest({
      error: "access_denied",
      error_description: "User denied access",
    });

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("access_denied");
  });

  it("should return error when token exchange fails", async () => {
    vi.mocked(exchangeCodeForTokens).mockRejectedValueOnce(
      new Error("Token exchange failed"),
    );

    const request = createRequest({
      code: "test-auth-code",
      state: "test-state",
    });

    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toContain("Token exchange failed");
  });
});
