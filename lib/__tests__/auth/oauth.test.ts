import { describe, it, expect } from "vitest";
import { getAuthorizationUrl, exchangeCodeForToken } from "../../auth/oauth";

describe("OAuth 2.0 Token Acquisition", () => {
  it.fails("should generate authorization URL with correct parameters", () => {
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

  it.fails("should exchange authorization code for access token", async () => {
    const code = "test-auth-code";
    const clientId = "test-client-id";
    const clientSecret = "test-client-secret";
    const redirectUri = "http://localhost:3000/auth/callback";

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

  it.fails("should include state parameter for CSRF protection", () => {
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

  it.fails(
    "should handle token refresh when access token expires",
    async () => {
      const refreshToken = "test-refresh-token";
      const clientId = "test-client-id";
      const clientSecret = "test-client-secret";

      const { refreshAccessToken } = await import("../../auth/oauth");
      const tokenResponse = await refreshAccessToken({
        refreshToken,
        clientId,
        clientSecret,
      });

      expect(tokenResponse).toHaveProperty("access_token");
      expect(tokenResponse).toHaveProperty("expires_in");
    },
  );
});
