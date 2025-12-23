/**
 * Google Photos Picker API client
 */

const PICKER_API_BASE_URL = "https://photospicker.googleapis.com/v1";

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

interface CreateSessionResponse {
  id: string;
  pickerUri: string;
  pollingConfig?: {
    pollInterval?: string;
  };
}

interface GetSessionResponse {
  id: string;
  pickerUri: string;
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
  const response = await fetch(`${PICKER_API_BASE_URL}/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `Failed to create picker session: ${response.status} ${response.statusText} - ${errorData}`,
    );
  }

  const data: CreateSessionResponse = await response.json();
  return {
    id: data.id,
    pickerUri: data.pickerUri,
  };
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
  const response = await fetch(`${PICKER_API_BASE_URL}/sessions/${sessionId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `Failed to get session status: ${response.status} ${response.statusText} - ${errorData}`,
    );
  }

  const data: GetSessionResponse = await response.json();
  return {
    mediaItemsSet: data.mediaItemsSet,
    mediaItems: data.mediaItems,
    pollingConfig: data.pollingConfig,
  };
}
