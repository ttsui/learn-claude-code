/**
 * Google OAuth 2.0 helper functions for Google Photos Picker API
 */

import { randomBytes } from "crypto";

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_PHOTOS_PICKER_SCOPE =
  "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

/**
 * Generate a secure random state parameter for CSRF protection
 * @returns Random state string
 */
function generateState(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Get OAuth client credentials from environment variables
 * @throws Error if credentials are not configured
 */
function getClientCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Google OAuth credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.",
    );
  }

  return { clientId, clientSecret };
}

/**
 * Generate authorization URL for Google OAuth 2.0 flow
 * @param redirectUri - The callback URL to redirect to after authorization
 * @returns Authorization URL with required parameters
 */
export function generateAuthUrl(redirectUri: string): string {
  const { clientId } = getClientCredentials();
  const state = generateState();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_PHOTOS_PICKER_SCOPE,
    access_type: "offline",
    state: state,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access and refresh tokens
 * @param code - The authorization code from the callback
 * @param redirectUri - The same redirect URI used in authorization
 * @returns OAuth tokens including access_token and refresh_token
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
): Promise<OAuthTokens> {
  const { clientId, clientSecret } = getClientCredentials();

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `Token exchange failed: ${response.status} ${response.statusText} - ${errorData}`,
    );
  }

  const tokens: OAuthTokens = await response.json();
  return tokens;
}
