import { GoogleTokens } from '@/types/google-auth';
import {
  PickingSession,
  ListMediaItemsResponse,
  SessionStatus,
} from '@/types/google-photos';

const PHOTOS_PICKER_API_BASE = 'https://photospicker.googleapis.com/v1';

/**
 * Create a new picker session
 */
export async function createPickerSession(
  tokens: GoogleTokens
): Promise<PickingSession> {
  const response = await fetch(`${PHOTOS_PICKER_API_BASE}/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create picker session: ${error}`);
  }

  const session: PickingSession = await response.json();
  return session;
}

/**
 * Get the status of a picker session
 */
export async function getSessionStatus(
  sessionId: string,
  tokens: GoogleTokens
): Promise<SessionStatus> {
  const response = await fetch(
    `${PHOTOS_PICKER_API_BASE}/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get session status: ${error}`);
  }

  const session: PickingSession = await response.json();

  return {
    session,
    mediaItemsReady: session.mediaItemsSet || false,
  };
}

/**
 * List media items selected in a session
 */
export async function listMediaItems(
  sessionId: string,
  tokens: GoogleTokens,
  pageToken?: string
): Promise<ListMediaItemsResponse> {
  const url = new URL(
    `${PHOTOS_PICKER_API_BASE}/sessions/${sessionId}/mediaItems`
  );

  if (pageToken) {
    url.searchParams.append('pageToken', pageToken);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list media items: ${error}`);
  }

  const data: ListMediaItemsResponse = await response.json();
  return data;
}
