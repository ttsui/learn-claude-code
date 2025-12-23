import { google } from 'googleapis';
import { PHOTOS_PICKER_SCOPE } from '@/types/google-photos';
import { GoogleOAuthConfig } from '@/types/google-auth';
import crypto from 'crypto';

/**
 * Get OAuth configuration from environment variables
 */
export function getOAuthConfig(): GoogleOAuthConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing required Google OAuth environment variables');
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

/**
 * Create OAuth2 client instance
 */
export function createOAuth2Client() {
  const config = getOAuthConfig();

  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );
}

/**
 * Generate a secure random state parameter for CSRF protection
 */
export function generateStateParameter(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Generate the OAuth authorization URL
 */
export function generateAuthUrl(state: string): string {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [PHOTOS_PICKER_SCOPE],
    state,
    prompt: 'consent',
  });
}
