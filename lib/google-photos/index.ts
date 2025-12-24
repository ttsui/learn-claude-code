/**
 * Google Photos Picker API integration module
 *
 * This module provides utilities for:
 * - OAuth 2.0 authentication with Google
 * - Google Photos Picker session management
 * - Media item retrieval
 */

export {
  // OAuth constants
  GOOGLE_AUTH_ENDPOINT,
  GOOGLE_TOKEN_ENDPOINT,
  GOOGLE_PHOTOS_SCOPE,
  // OAuth functions
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  // OAuth types
  type OAuthConfig,
  type TokenCredentials,
  type TokenResponse,
} from "./oauth";

export {
  // Picker constants
  GOOGLE_PHOTOS_PICKER_ENDPOINT,
  PickerSessionState,
  // Picker functions
  createPickerSession,
  getPickerSession,
  getPickerMediaItems,
  // Picker types
  type PickerSession,
  type PickerSessionWithState,
  type MediaFile,
  type PickedMediaItem,
  type PickerMediaItemsResponse,
} from "./picker";
