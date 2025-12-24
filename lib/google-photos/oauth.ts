import { google } from 'googleapis';

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface AccessTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export class GoogleOAuth {
  private oauth2Client;

  constructor(private config: GoogleOAuthConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
  }

  getAuthorizationUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/photoslibrary.readonly',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      response_type: 'code',
    });
  }

  async getAccessToken(code: string): Promise<AccessTokenResponse> {
    const { tokens } = await this.oauth2Client.getToken(code);

    return {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      token_type: tokens.token_type || 'Bearer',
    };
  }
}
