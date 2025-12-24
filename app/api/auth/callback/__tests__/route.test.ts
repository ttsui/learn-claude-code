import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';

// Mock the GoogleOAuth module
vi.mock('@/lib/google-photos/oauth', () => {
  return {
    GoogleOAuth: class MockGoogleOAuth {
      constructor() {}
      async getAccessToken() {
        return {
          access_token: 'mock-access-token',
          expires_in: 3600,
          token_type: 'Bearer',
        };
      }
    },
  };
});

describe('OAuth Callback Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
  });

  it('should handle OAuth callback with authorization code', async () => {
    const mockUrl = 'http://localhost:3000/api/auth/callback?code=test-auth-code';
    const request = new NextRequest(mockUrl);

    const response = await GET(request);

    expect(response).toBeDefined();
    expect(response.status).toBe(302); // Redirect status
  });

  it('should handle missing authorization code', async () => {
    const mockUrl = 'http://localhost:3000/api/auth/callback';
    const request = new NextRequest(mockUrl);

    const response = await GET(request);

    expect(response).toBeDefined();
    expect(response.status).toBe(400); // Bad request
  });
});
