/**
 * Google Photos Picker API Types
 * API Documentation: https://developers.google.com/photos/picker/reference/rest
 */

/**
 * OAuth scope required for the Photos Picker API
 */
export const PHOTOS_PICKER_SCOPE = 'https://www.googleapis.com/auth/photospicker.mediaitems.readonly';

/**
 * Picker session configuration
 */
export interface PickingSession {
  /**
   * Unique identifier for the session
   */
  id?: string;

  /**
   * URI for the picker interface
   */
  pickerUri?: string;

  /**
   * Whether media items have been selected
   */
  mediaItemsSet?: boolean;

  /**
   * Timestamp when the session was created
   */
  createdTime?: string;

  /**
   * Timestamp when the session expires
   */
  expiryTime?: string;
}

/**
 * Request to create a new picking session
 */
export interface CreateSessionRequest {
  /**
   * Optional session ID to use
   */
  sessionId?: string;
}

/**
 * Media item metadata from Google Photos
 */
export interface MediaItem {
  /**
   * Unique identifier for the media item
   */
  id: string;

  /**
   * Base URL for the media item
   */
  baseUrl: string;

  /**
   * MIME type of the media item
   */
  mimeType: string;

  /**
   * Filename of the media item
   */
  filename: string;

  /**
   * Metadata about the media item
   */
  mediaMetadata?: {
    creationTime?: string;
    width?: string;
    height?: string;
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
      focalLength?: number;
      apertureFNumber?: number;
      isoEquivalent?: number;
    };
    video?: {
      fps?: number;
      status?: string;
    };
  };
}

/**
 * Response from listing media items
 */
export interface ListMediaItemsResponse {
  /**
   * List of selected media items
   */
  mediaItems: MediaItem[];

  /**
   * Token for pagination
   */
  nextPageToken?: string;
}

/**
 * Session status check response
 */
export interface SessionStatus {
  session: PickingSession;
  mediaItemsReady: boolean;
}
