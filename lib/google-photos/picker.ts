/**
 * Google Photos Picker API utilities
 */

export const GOOGLE_PHOTOS_PICKER_ENDPOINT =
  "https://photospicker.googleapis.com/v1";

export enum PickerSessionState {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export interface PickerSession {
  id: string;
  pickerUri: string;
  expireTime: string;
  mediaItemsSet: boolean;
}

export interface PickerSessionWithState extends PickerSession {
  state: PickerSessionState;
}

export interface MediaFile {
  baseUrl: string;
  mimeType: string;
  filename: string;
}

export interface PickedMediaItem {
  id: string;
  mediaFile: MediaFile;
  type: "PHOTO" | "VIDEO";
}

export interface PickerMediaItemsResponse {
  pickedMediaItems: PickedMediaItem[];
  nextPageToken?: string;
}

/**
 * Creates a new Google Photos Picker session.
 *
 * @param accessToken - The OAuth access token
 * @returns The created picker session details
 * @throws Error if session creation fails
 */
export async function createPickerSession(
  accessToken: string,
): Promise<PickerSession> {
  const response = await fetch(`${GOOGLE_PHOTOS_PICKER_ENDPOINT}/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error("Failed to create picker session");
  }

  return response.json();
}

/**
 * Retrieves the current state of a Google Photos Picker session.
 *
 * @param sessionId - The session ID to retrieve
 * @param accessToken - The OAuth access token
 * @returns The session details with computed state
 * @throws Error if session retrieval fails
 */
export async function getPickerSession(
  sessionId: string,
  accessToken: string,
): Promise<PickerSessionWithState> {
  const response = await fetch(
    `${GOOGLE_PHOTOS_PICKER_ENDPOINT}/sessions/${sessionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get picker session");
  }

  const session: PickerSession = await response.json();

  return {
    ...session,
    state: session.mediaItemsSet
      ? PickerSessionState.COMPLETED
      : PickerSessionState.PENDING,
  };
}

/**
 * Retrieves media items selected by the user from a completed picker session.
 *
 * @param sessionId - The session ID to retrieve media items from
 * @param accessToken - The OAuth access token
 * @param pageToken - Optional page token for pagination
 * @returns The list of picked media items
 * @throws Error if media items retrieval fails
 */
export async function getPickerMediaItems(
  sessionId: string,
  accessToken: string,
  pageToken?: string,
): Promise<PickerMediaItemsResponse> {
  const params = new URLSearchParams({ sessionId });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const response = await fetch(
    `${GOOGLE_PHOTOS_PICKER_ENDPOINT}/mediaItems?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get picker media items");
  }

  return response.json();
}
