/**
 * Google OAuth 2.0 Configuration
 *
 * This module provides configuration for Google OAuth 2.0 authentication
 * required for the Google Photos Picker API.
 */

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/**
 * Google Photos Picker API OAuth scope
 * Allows read-only access to media items selected by the user
 */
export const GOOGLE_PHOTOS_SCOPE =
  "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

/**
 * Get OAuth configuration from environment variables
 * @throws {Error} If required environment variables are not set
 */
export function getOAuthConfig(): OAuthConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing required OAuth environment variables. Please check .env.example",
    );
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}
