import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAuthorizationUrl,
  exchangeCodeForToken,
  refreshAccessToken,
} from "../../auth/oauth";

// Mock global fetch
global.fetch = vi.fn();

describe("OAuth 2.0 Token Acquisition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate authorization URL with correct parameters", () => {
    const clientId = "test-client-id";
    const redirectUri = "http://localhost:3000/auth/callback";
    const scope =
      "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

    const authUrl = getAuthorizationUrl({
      clientId,
      redirectUri,
      scope,
    });

    expect(authUrl).toContain("https://accounts.google.com/o/oauth2/v2/auth");
    expect(authUrl).toContain(`client_id=${clientId}`);
    expect(authUrl).toContain(
      `redirect_uri=${encodeURIComponent(redirectUri)}`,
    );
    expect(authUrl).toContain(`scope=${encodeURIComponent(scope)}`);
    expect(authUrl).toContain("response_type=code");
    expect(authUrl).toContain("access_type=offline");
  });

  it("should exchange authorization code for access token", async () => {
    const code = "test-auth-code";
    const clientId = "test-client-id";
    const clientSecret = "test-client-secret";
    const redirectUri = "http://localhost:3000/auth/callback";

    const mockTokenResponse = {
      access_token: "mock-access-token",
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenResponse,
    });

    const tokenResponse = await exchangeCodeForToken({
      code,
      clientId,
      clientSecret,
      redirectUri,
    });

    expect(tokenResponse).toHaveProperty("access_token");
    expect(tokenResponse).toHaveProperty("token_type");
    expect(tokenResponse.token_type).toBe("Bearer");
    expect(tokenResponse).toHaveProperty("expires_in");
  });

  it("should include state parameter for CSRF protection", () => {
    const clientId = "test-client-id";
    const redirectUri = "http://localhost:3000/auth/callback";
    const scope =
      "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";
    const state = "random-state-string";

    const authUrl = getAuthorizationUrl({
      clientId,
      redirectUri,
      scope,
      state,
    });

    expect(authUrl).toContain(`state=${state}`);
  });

  it("should handle token refresh when access token expires", async () => {
    const refreshToken = "test-refresh-token";
    const clientId = "test-client-id";
    const clientSecret = "test-client-secret";

    const mockTokenResponse = {
      access_token: "new-access-token",
      token_type: "Bearer",
      expires_in: 3600,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenResponse,
    });

    const tokenResponse = await refreshAccessToken({
      refreshToken,
      clientId,
      clientSecret,
    });

    expect(tokenResponse).toHaveProperty("access_token");
    expect(tokenResponse).toHaveProperty("expires_in");
  });
});
