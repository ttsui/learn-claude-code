import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  GOOGLE_PHOTOS_SCOPE,
  GOOGLE_AUTH_ENDPOINT,
  GOOGLE_TOKEN_ENDPOINT,
} from "../oauth";

describe("Google OAuth 2.0", () => {
  describe("buildAuthorizationUrl", () => {
    const mockConfig = {
      clientId: "test-client-id",
      redirectUri: "http://localhost:3000/api/auth/callback",
    };

    it("should generate authorization URL with required parameters", () => {
      const url = buildAuthorizationUrl(mockConfig);

      expect(url).toContain(GOOGLE_AUTH_ENDPOINT);
      expect(url).toContain(`client_id=${mockConfig.clientId}`);
      expect(url).toContain(
        `redirect_uri=${encodeURIComponent(mockConfig.redirectUri)}`,
      );
      expect(url).toContain("response_type=code");
      expect(url).toContain(`scope=${encodeURIComponent(GOOGLE_PHOTOS_SCOPE)}`);
    });

    it("should include state parameter for CSRF protection", () => {
      const state = "random-csrf-token";
      const url = buildAuthorizationUrl({ ...mockConfig, state });

      expect(url).toContain(`state=${state}`);
    });

    it("should request offline access for refresh tokens", () => {
      const url = buildAuthorizationUrl(mockConfig);

      expect(url).toContain("access_type=offline");
    });

    it("should include prompt=consent when forceConsent is true", () => {
      const url = buildAuthorizationUrl({ ...mockConfig, forceConsent: true });

      expect(url).toContain("prompt=consent");
    });
  });

  describe("exchangeCodeForTokens", () => {
    const mockCredentials = {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      redirectUri: "http://localhost:3000/api/auth/callback",
    };
    const mockCode = "test-authorization-code";

    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("should exchange authorization code for tokens", async () => {
      const mockTokenResponse = {
        access_token: "test-access-token",
        refresh_token: "test-refresh-token",
        expires_in: 3600,
        token_type: "Bearer",
        scope: GOOGLE_PHOTOS_SCOPE,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      const result = await exchangeCodeForTokens(mockCode, mockCredentials);

      expect(result).toEqual(mockTokenResponse);
      expect(fetch).toHaveBeenCalledWith(
        GOOGLE_TOKEN_ENDPOINT,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
      );
    });

    it("should send correct parameters in request body", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await exchangeCodeForTokens(mockCode, mockCredentials);

      const call = vi.mocked(fetch).mock.calls[0];
      const body = call[1]?.body as string;

      expect(body).toContain(`code=${mockCode}`);
      expect(body).toContain(`client_id=${mockCredentials.clientId}`);
      expect(body).toContain(`client_secret=${mockCredentials.clientSecret}`);
      expect(body).toContain(
        `redirect_uri=${encodeURIComponent(mockCredentials.redirectUri)}`,
      );
      expect(body).toContain("grant_type=authorization_code");
    });

    it("should throw error when token exchange fails", async () => {
      const errorResponse = {
        error: "invalid_grant",
        error_description: "Code has expired",
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => errorResponse,
      } as Response);

      await expect(
        exchangeCodeForTokens(mockCode, mockCredentials),
      ).rejects.toThrow("Token exchange failed: invalid_grant");
    });
  });

  describe("constants", () => {
    it("should have correct Google Photos Picker scope", () => {
      expect(GOOGLE_PHOTOS_SCOPE).toBe(
        "https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
      );
    });

    it("should have correct Google authorization endpoint", () => {
      expect(GOOGLE_AUTH_ENDPOINT).toBe(
        "https://accounts.google.com/o/oauth2/v2/auth",
      );
    });

    it("should have correct Google token endpoint", () => {
      expect(GOOGLE_TOKEN_ENDPOINT).toBe("https://oauth2.googleapis.com/token");
    });
  });
});
