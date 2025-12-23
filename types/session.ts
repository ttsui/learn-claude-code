/**
 * Session types for iron-session
 */

import { GoogleTokens } from './google-auth';

export interface SessionData {
  /**
   * OAuth tokens for Google API access
   */
  tokens?: GoogleTokens;

  /**
   * OAuth state parameter for CSRF protection
   */
  oauthState?: string;

  /**
   * User identifier (if needed)
   */
  userId?: string;

  /**
   * Session creation timestamp
   */
  createdAt?: number;
}

/**
 * Augment the iron-session module to include our session data type
 */
declare module 'iron-session' {
  interface IronSessionData extends SessionData {}
}
