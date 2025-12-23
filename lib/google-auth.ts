/**
 * Google OAuth 2.0 helper functions for Google Photos Picker API
 */

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

/**
 * Generate authorization URL for Google OAuth 2.0 flow
 * @param redirectUri - The callback URL to redirect to after authorization
 * @returns Authorization URL with required parameters
 */
export function generateAuthUrl(redirectUri: string): string {
  throw new Error("Not implemented");
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
  throw new Error("Not implemented");
}
