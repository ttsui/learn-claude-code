/**
 * Google Photos Picker API integration module
 * Provides functionality to create picker sessions and retrieve selected media items
 */

export interface PickerSessionParams {
  accessToken: string;
}

export interface PickerSession {
  pickerUri: string;
  mediaItemsSet: boolean;
}

export interface MediaItemsParams {
  accessToken: string;
  sessionId: string;
}

export interface MediaItem {
  id: string;
  mimeType: string;
  filename: string;
  baseUrl: string;
}

export interface MediaItemsResponse {
  mediaItems: MediaItem[];
}

/**
 * Create a new Google Photos Picker session
 * Returns a picker URI that can be used to display the picker interface
 */
export async function createPickerSession(
  params: PickerSessionParams,
): Promise<PickerSession> {
  const { accessToken } = params;

  const response = await fetch(
    "https://photospicker.googleapis.com/v1/sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create picker session: ${error}`);
  }

  return (await response.json()) as PickerSession;
}

/**
 * Retrieve selected media items from a picker session
 */
export async function getMediaItems(
  params: MediaItemsParams,
): Promise<MediaItemsResponse> {
  const { accessToken, sessionId } = params;

  const response = await fetch(
    `https://photospicker.googleapis.com/v1/sessions/${sessionId}/mediaItems`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get media items: ${error}`);
  }

  return (await response.json()) as MediaItemsResponse;
}
