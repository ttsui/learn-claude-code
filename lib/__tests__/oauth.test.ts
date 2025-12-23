import { describe, it, expect, beforeEach } from 'vitest';
import {
  getOAuthConfig,
  createOAuth2Client,
  generateStateParameter,
  generateAuthUrl,
} from '../oauth';
import { PHOTOS_PICKER_SCOPE } from '@/types/google-photos';

describe('OAuth Helper Functions', () => {
  describe('getOAuthConfig', () => {
    it('should return OAuth configuration from environment variables', () => {
      const config = getOAuthConfig();

      expect(config).toEqual({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
      });
    });

    it('should throw error if environment variables are missing', () => {
      const originalClientId = process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_ID;

      expect(() => getOAuthConfig()).toThrow(
        'Missing required Google OAuth environment variables'
      );

      process.env.GOOGLE_CLIENT_ID = originalClientId;
    });
  });

  describe('createOAuth2Client', () => {
    it('should create an OAuth2 client with correct configuration', () => {
      const client = createOAuth2Client();

      expect(client).toBeDefined();
      expect(client._clientId).toBe(process.env.GOOGLE_CLIENT_ID);
      expect(client._clientSecret).toBe(process.env.GOOGLE_CLIENT_SECRET);
    });
  });

  describe('generateStateParameter', () => {
    it('should generate a random state parameter', () => {
      const state = generateStateParameter();

      expect(state).toBeDefined();
      expect(typeof state).toBe('string');
      expect(state.length).toBeGreaterThan(0);
    });

    it('should generate unique state parameters', () => {
      const state1 = generateStateParameter();
      const state2 = generateStateParameter();

      expect(state1).not.toBe(state2);
    });

    it('should generate URL-safe state parameters', () => {
      const state = generateStateParameter();

      // Should only contain base64url characters: A-Z, a-z, 0-9, -, _
      expect(state).toMatch(/^[A-Za-z0-9\-_]+$/);
    });
  });

  describe('generateAuthUrl', () => {
    it('should generate authorization URL with required parameters', () => {
      const state = 'test-state-123';
      const authUrl = generateAuthUrl(state);

      expect(authUrl).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(authUrl).toContain(`client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID!)}`);
      expect(authUrl).toContain('redirect_uri=');
      expect(authUrl).toContain('response_type=code');
      expect(authUrl).toContain(`state=${state}`);
    });

    it('should include Google Photos Picker scope', () => {
      const state = 'test-state-123';
      const authUrl = generateAuthUrl(state);

      expect(authUrl).toContain(encodeURIComponent(PHOTOS_PICKER_SCOPE));
    });

    it('should request offline access for refresh token', () => {
      const state = 'test-state-123';
      const authUrl = generateAuthUrl(state);

      expect(authUrl).toContain('access_type=offline');
    });

    it('should prompt for consent', () => {
      const state = 'test-state-123';
      const authUrl = generateAuthUrl(state);

      expect(authUrl).toContain('prompt=consent');
    });
  });
});
