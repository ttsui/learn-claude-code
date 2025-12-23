/**
 * OAuth 2.0 Client for Google Photos Picker API
 *
 * This module handles the OAuth 2.0 authorization flow including:
 * - Authorization URL generation with PKCE
 * - Token exchange from authorization codes
 * - Error handling
 */

import { OAuth2Client } from "google-auth-library";
import { getOAuthConfig, GOOGLE_PHOTOS_SCOPE } from "../config/oauth";

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expiry_date: number;
  token_type: string;
}

export interface AuthorizationUrlOptions {
  state?: string;
  codeVerifier?: string;
}

export interface AuthorizationUrlResult {
  url: string;
  codeVerifier: string;
  state: string;
}

/**
 * Create an OAuth2 client instance
 */
export function createOAuthClient(): OAuth2Client {
  const config = getOAuthConfig();
  return new OAuth2Client(
    config.clientId,
    config.clientSecret,
    config.redirectUri,
  );
}

/**
 * Generate OAuth 2.0 authorization URL with PKCE
 *
 * @param options - Optional state and code verifier
 * @returns Authorization URL, code verifier, and state
 */
export async function generateAuthorizationUrl(
  options: AuthorizationUrlOptions = {},
): Promise<AuthorizationUrlResult> {
  const client = createOAuthClient();

  // Generate code verifier for PKCE if not provided
  const codeVerifier =
    options.codeVerifier || generateRandomString(128);

  // Generate state for CSRF protection if not provided
  const state = options.state || generateRandomString(32);

  // Generate authorization URL with PKCE
  const url = await client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_PHOTOS_SCOPE,
    state,
    code_challenge_method: "S256",
    code_challenge: await generateCodeChallenge(codeVerifier),
  });

  return {
    url,
    codeVerifier,
    state,
  };
}

/**
 * Exchange authorization code for access token
 *
 * @param code - Authorization code from OAuth callback
 * @param codeVerifier - PKCE code verifier
 * @returns Token response with access token and metadata
 */
export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
): Promise<TokenResponse> {
  const client = createOAuthClient();

  try {
    const { tokens } = await client.getToken({
      code,
      codeVerifier,
    });

    if (!tokens.access_token) {
      throw new Error("No access token received from OAuth provider");
    }

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000,
      token_type: tokens.token_type || "Bearer",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to exchange code for token: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Generate a cryptographically secure random string
 */
function generateRandomString(length: number): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const randomValues = new Uint8Array(length);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // Fallback for Node.js environment
    const nodeCrypto = require("crypto");
    nodeCrypto.randomFillSync(randomValues);
  }

  return Array.from(randomValues)
    .map((val) => charset[val % charset.length])
    .join("");
}

/**
 * Generate PKCE code challenge from verifier using SHA-256
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  let encoder: TextEncoder;
  let digest: ArrayBuffer;

  if (typeof crypto !== "undefined" && crypto.subtle) {
    // Browser environment
    encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    digest = await crypto.subtle.digest("SHA-256", data);
  } else {
    // Node.js environment
    const nodeCrypto = require("crypto");
    const hash = nodeCrypto.createHash("sha256");
    hash.update(verifier);
    const buffer = hash.digest();
    digest = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );
  }

  // Base64-URL encode the hash
  return base64UrlEncode(digest);
}

/**
 * Base64-URL encode a buffer
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
