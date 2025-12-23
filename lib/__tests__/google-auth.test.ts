import { describe, it, expect } from "vitest";
import { generateAuthUrl, exchangeCodeForTokens } from "../google-auth";

describe("Google OAuth 2.0", () => {
  describe("generateAuthUrl", () => {
    it.skip("should generate authorization URL with correct parameters", () => {
      const redirectUri = "http://localhost:3000/api/auth/google/callback";
      const authUrl = generateAuthUrl(redirectUri);

      expect(authUrl).toContain("https://accounts.google.com/o/oauth2/v2/auth");
      expect(authUrl).toContain(
        "scope=https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
      );
      expect(authUrl).toContain("response_type=code");
      expect(authUrl).toContain("access_type=offline");
      expect(authUrl).toContain(
        `redirect_uri=${encodeURIComponent(redirectUri)}`,
      );
    });

    it.skip("should include a state parameter for CSRF protection", () => {
      const redirectUri = "http://localhost:3000/api/auth/google/callback";
      const authUrl = generateAuthUrl(redirectUri);

      expect(authUrl).toMatch(/state=[a-zA-Z0-9-_]+/);
    });
  });

  describe("exchangeCodeForTokens", () => {
    it.skip("should exchange authorization code for access and refresh tokens", async () => {
      const code = "test-authorization-code";
      const redirectUri = "http://localhost:3000/api/auth/google/callback";

      const tokens = await exchangeCodeForTokens(code, redirectUri);

      expect(tokens).toHaveProperty("access_token");
      expect(tokens).toHaveProperty("refresh_token");
      expect(tokens).toHaveProperty("expires_in");
      expect(tokens).toHaveProperty("token_type", "Bearer");
    });
  });
});
