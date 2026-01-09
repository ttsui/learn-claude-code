/**
 * OAuth 2.0 authentication module for Google Photos Picker API
 * Following the web server application pattern
 */

export interface AuthorizationUrlParams {
  clientId: string;
  redirectUri: string;
  scope: string;
  state?: string;
}

export interface TokenExchangeParams {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TokenRefreshParams {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

/**
 * Generate OAuth 2.0 authorization URL for Google Photos Picker API
 */
export function getAuthorizationUrl(params: AuthorizationUrlParams): string {
  const { clientId, redirectUri, scope, state } = params;

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("access_type", "offline");

  if (state) {
    url.searchParams.set("state", state);
  }

  return url.toString();
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  params: TokenExchangeParams,
): Promise<TokenResponse> {
  const { code, clientId, clientSecret, redirectUri } = params;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return (await response.json()) as TokenResponse;
}

/**
 * Refresh an expired access token using a refresh token
 */
export async function refreshAccessToken(
  params: TokenRefreshParams,
): Promise<TokenResponse> {
  const { refreshToken, clientId, clientSecret } = params;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return (await response.json()) as TokenResponse;
}
