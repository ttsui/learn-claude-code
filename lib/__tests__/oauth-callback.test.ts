import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateStateParameter, exchangeCodeForTokens } from '../oauth';
import { google } from 'googleapis';

// Mock the getToken method
const mockGetToken = vi.fn();

// Mock googleapis module
vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: vi.fn(function(this: any) {
        this.getToken = mockGetToken;
        this._clientId = process.env.GOOGLE_CLIENT_ID;
        this._clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      }),
    },
  },
}));

describe('OAuth Callback Helper Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateStateParameter', () => {
    it('should return true when state matches session state', () => {
      const state = 'test-state-123';
      const result = validateStateParameter(state, state);
      expect(result).toBe(true);
    });

    it('should return false when state does not match', () => {
      const result = validateStateParameter('state1', 'state2');
      expect(result).toBe(false);
    });

    it('should return false when received state is null', () => {
      const result = validateStateParameter(null, 'session-state');
      expect(result).toBe(false);
    });

    it('should return false when session state is undefined', () => {
      const result = validateStateParameter('received-state', undefined);
      expect(result).toBe(false);
    });

    it('should return false when both states are missing', () => {
      const result = validateStateParameter(null, undefined);
      expect(result).toBe(false);
    });
  });

  describe('exchangeCodeForTokens', () => {
    it('should exchange authorization code for tokens', async () => {
      const mockTokens = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        scope: 'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
        token_type: 'Bearer',
        expiry_date: 1234567890,
      };

      mockGetToken.mockResolvedValue({ tokens: mockTokens });

      const result = await exchangeCodeForTokens('test-code');

      expect(mockGetToken).toHaveBeenCalledWith('test-code');
      expect(result).toEqual(mockTokens);
    });

    it('should throw error when access token is missing', async () => {
      mockGetToken.mockResolvedValue({ tokens: {} });

      await expect(exchangeCodeForTokens('test-code')).rejects.toThrow(
        'Failed to obtain access token'
      );
    });

    it('should handle missing optional fields', async () => {
      const mockTokens = {
        access_token: 'mock-access-token',
      };

      mockGetToken.mockResolvedValue({ tokens: mockTokens });

      const result = await exchangeCodeForTokens('test-code');

      expect(result.access_token).toBe('mock-access-token');
      expect(result.scope).toBe('');
      expect(result.token_type).toBe('Bearer');
    });
  });
});
