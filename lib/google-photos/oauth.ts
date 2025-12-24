/**
 * Google OAuth 2.0 constants and utilities for Google Photos Picker API
 */

export const GOOGLE_AUTH_ENDPOINT =
  "https://accounts.google.com/o/oauth2/v2/auth";

export const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export const GOOGLE_PHOTOS_SCOPE =
  "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  state?: string;
  forceConsent?: boolean;
}

export interface TokenCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface TokenErrorResponse {
  error: string;
  error_description?: string;
}

/**
 * Builds the Google OAuth 2.0 authorization URL for Google Photos Picker API.
 *
 * @param config - OAuth configuration parameters
 * @returns The complete authorization URL to redirect the user to
 */
export function buildAuthorizationUrl(config: OAuthConfig): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: GOOGLE_PHOTOS_SCOPE,
    access_type: "offline",
  });

  if (config.state) {
    params.set("state", config.state);
  }

  if (config.forceConsent) {
    params.set("prompt", "consent");
  }

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges an authorization code for access and refresh tokens.
 *
 * @param code - The authorization code received from the OAuth callback
 * @param credentials - The OAuth client credentials
 * @returns The token response containing access_token and refresh_token
 * @throws Error if the token exchange fails
 */
export async function exchangeCodeForTokens(
  code: string,
  credentials: TokenCredentials,
): Promise<TokenResponse> {
  const params = new URLSearchParams({
    code,
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    redirect_uri: credentials.redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error: TokenErrorResponse = await response.json();
    throw new Error(`Token exchange failed: ${error.error}`);
  }

  return response.json();
}
