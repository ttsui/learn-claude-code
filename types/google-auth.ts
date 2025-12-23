/**
 * Google OAuth 2.0 Types
 */

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

export interface GoogleUserSession {
  tokens: GoogleTokens;
  userId?: string;
}

export interface OAuthAuthorizationParams {
  client_id: string;
  redirect_uri: string;
  response_type: 'code';
  scope: string;
  access_type: 'offline' | 'online';
  state: string;
  prompt?: 'consent' | 'select_account' | 'none';
}

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}
