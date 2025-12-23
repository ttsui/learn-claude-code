import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateAuthUrl, exchangeCodeForTokens } from "../google-auth";

describe("Google OAuth 2.0", () => {
  beforeEach(() => {
    // Set up test environment variables
    process.env.GOOGLE_CLIENT_ID = "test-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
  });

  describe("generateAuthUrl", () => {
    it("should generate authorization URL with correct parameters", () => {
      const redirectUri = "http://localhost:3000/api/auth/google/callback";
      const authUrl = generateAuthUrl(redirectUri);

      expect(authUrl).toContain("https://accounts.google.com/o/oauth2/v2/auth");
      expect(authUrl).toContain(
        `scope=${encodeURIComponent("https://www.googleapis.com/auth/photospicker.mediaitems.readonly")}`,
      );
      expect(authUrl).toContain("response_type=code");
      expect(authUrl).toContain("access_type=offline");
      expect(authUrl).toContain(
        `redirect_uri=${encodeURIComponent(redirectUri)}`,
      );
      expect(authUrl).toContain("client_id=test-client-id");
    });

    it("should include a state parameter for CSRF protection", () => {
      const redirectUri = "http://localhost:3000/api/auth/google/callback";
      const authUrl = generateAuthUrl(redirectUri);

      expect(authUrl).toMatch(/state=[a-zA-Z0-9-_]+/);
    });
  });

  describe("exchangeCodeForTokens", () => {
    it("should exchange authorization code for access and refresh tokens", async () => {
      const code = "test-authorization-code";
      const redirectUri = "http://localhost:3000/api/auth/google/callback";

      // Mock the fetch API
      const mockTokenResponse = {
        access_token: "test-access-token",
        refresh_token: "test-refresh-token",
        expires_in: 3600,
        token_type: "Bearer",
        scope:
          "https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      const tokens = await exchangeCodeForTokens(code, redirectUri);

      expect(tokens).toHaveProperty("access_token", "test-access-token");
      expect(tokens).toHaveProperty("refresh_token", "test-refresh-token");
      expect(tokens).toHaveProperty("expires_in", 3600);
      expect(tokens).toHaveProperty("token_type", "Bearer");

      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        "https://oauth2.googleapis.com/token",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
      );
    });
  });
});
