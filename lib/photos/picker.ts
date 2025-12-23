/**
 * Google Photos Picker API Client
 *
 * This module handles Google Photos Picker API session management:
 * - Create picker sessions
 * - Retrieve session details
 * - List selected media items
 * - Delete sessions
 */

const PICKER_API_BASE = "https://photospicker.googleapis.com/v1";

export interface PickerSession {
  id: string;
  pickerUri: string;
  mediaItemsSet?: boolean;
}

export interface MediaItem {
  id: string;
  filename: string;
  mimeType: string;
  mediaFile: {
    url: string;
  };
  mediaMetadata?: {
    creationTime: string;
    width?: string;
    height?: string;
  };
}

export interface SessionDetails extends PickerSession {
  mediaItemIds?: string[];
}

export class PickerAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "PickerAPIError";
  }
}

/**
 * Create a new Google Photos Picker session
 *
 * @param accessToken - OAuth 2.0 access token
 * @returns Picker session with ID and URI
 */
export async function createPickerSession(
  accessToken: string,
): Promise<PickerSession> {
  try {
    const response = await fetch(`${PICKER_API_BASE}/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      await handleAPIError(response);
    }

    const data = await response.json();
    return {
      id: data.id,
      pickerUri: data.pickerUri,
      mediaItemsSet: data.mediaItemsSet,
    };
  } catch (error) {
    if (error instanceof PickerAPIError) {
      throw error;
    }
    throw new PickerAPIError(
      `Failed to create picker session: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Get details about a picker session
 *
 * @param sessionId - Session ID
 * @param accessToken - OAuth 2.0 access token
 * @returns Session details including media item IDs
 */
export async function getSessionDetails(
  sessionId: string,
  accessToken: string,
): Promise<SessionDetails> {
  try {
    const response = await fetch(`${PICKER_API_BASE}/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      await handleAPIError(response);
    }

    const data = await response.json();
    return {
      id: data.id,
      pickerUri: data.pickerUri,
      mediaItemsSet: data.mediaItemsSet,
      mediaItemIds: data.mediaItemIds,
    };
  } catch (error) {
    if (error instanceof PickerAPIError) {
      throw error;
    }
    throw new PickerAPIError(
      `Failed to get session details: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * List media items from a picker session
 *
 * @param sessionId - Session ID
 * @param accessToken - OAuth 2.0 access token
 * @returns Array of media items selected by the user
 */
export async function listMediaItems(
  sessionId: string,
  accessToken: string,
): Promise<MediaItem[]> {
  try {
    const response = await fetch(
      `${PICKER_API_BASE}/sessions/${sessionId}/mediaItems`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      await handleAPIError(response);
    }

    const data = await response.json();
    return data.mediaItems || [];
  } catch (error) {
    if (error instanceof PickerAPIError) {
      throw error;
    }
    throw new PickerAPIError(
      `Failed to list media items: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Delete a picker session
 *
 * Sessions should be deleted after use to avoid resource exhaustion.
 *
 * @param sessionId - Session ID
 * @param accessToken - OAuth 2.0 access token
 */
export async function deleteSession(
  sessionId: string,
  accessToken: string,
): Promise<void> {
  try {
    const response = await fetch(`${PICKER_API_BASE}/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      await handleAPIError(response);
    }
  } catch (error) {
    if (error instanceof PickerAPIError) {
      throw error;
    }
    throw new PickerAPIError(
      `Failed to delete session: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Handle API error responses
 */
async function handleAPIError(response: Response): Promise<never> {
  let errorMessage = `API request failed with status ${response.status}`;
  let errorCode: string | undefined;

  try {
    const errorData = await response.json();
    if (errorData.error) {
      errorMessage = errorData.error.message || errorMessage;
      errorCode = errorData.error.code;
    }
  } catch {
    // If we can't parse the error response, use the default message
  }

  // Handle specific error cases
  if (response.status === 401) {
    throw new PickerAPIError(
      "Invalid or expired access token",
      401,
      "UNAUTHENTICATED",
    );
  }

  if (errorCode === "FAILED_PRECONDITION") {
    throw new PickerAPIError(
      "User does not have an active Google Photos account",
      response.status,
      errorCode,
    );
  }

  if (errorCode === "RESOURCE_EXHAUSTED") {
    throw new PickerAPIError(
      "Too many active sessions. Please delete unused sessions.",
      response.status,
      errorCode,
    );
  }

  throw new PickerAPIError(errorMessage, response.status, errorCode);
}
