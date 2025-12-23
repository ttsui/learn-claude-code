/**
 * Google Photos Picker API client
 */

export interface PickerSession {
  id: string;
  pickerUri: string;
}

export interface MediaItem {
  id: string;
  filename?: string;
  mimeType?: string;
  mediaMetadata?: {
    width?: string;
    height?: string;
    creationTime?: string;
  };
}

export interface SessionStatus {
  mediaItemsSet: boolean;
  mediaItems?: MediaItem[];
  pollingConfig?: {
    pollInterval?: string;
  };
}

/**
 * Create a new Google Photos Picker session
 * @param accessToken - Valid OAuth 2.0 access token
 * @returns Picker session with ID and pickerUri
 */
export async function createPickerSession(
  accessToken: string,
): Promise<PickerSession> {
  throw new Error("Not implemented");
}

/**
 * Get the status of a Picker session
 * @param accessToken - Valid OAuth 2.0 access token
 * @param sessionId - The session ID to check
 * @returns Session status including selected media items if available
 */
export async function getSessionStatus(
  accessToken: string,
  sessionId: string,
): Promise<SessionStatus> {
  throw new Error("Not implemented");
}
