import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createPickerSession,
  getSessionStatus,
  listMediaItems,
} from '../photos-picker';
import { GoogleTokens } from '@/types/google-auth';
import { PickingSession, MediaItem } from '@/types/google-photos';

// Mock fetch
global.fetch = vi.fn();

describe('Google Photos Picker API Client', () => {
  const mockTokens: GoogleTokens = {
    access_token: 'mock-access-token',
    scope: 'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
    token_type: 'Bearer',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPickerSession', () => {
    it('should create a new picker session', async () => {
      const mockSession: PickingSession = {
        id: 'session-123',
        pickerUri: 'https://photos.google.com/picker/session-123',
        mediaItemsSet: false,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockSession,
      } as Response);

      const result = await createPickerSession(mockTokens);

      expect(fetch).toHaveBeenCalledWith(
        'https://photospicker.googleapis.com/v1/sessions',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer mock-access-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      expect(result).toEqual(mockSession);
    });

    it('should return session with pickerUri', async () => {
      const mockSession: PickingSession = {
        id: 'session-456',
        pickerUri: 'https://photos.google.com/picker/session-456',
        mediaItemsSet: false,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockSession,
      } as Response);

      const result = await createPickerSession(mockTokens);

      expect(result.pickerUri).toBeDefined();
      expect(result.pickerUri).toContain('https://');
    });

    it('should throw error when session creation fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        text: async () => 'API Error',
      } as Response);

      await expect(createPickerSession(mockTokens)).rejects.toThrow(
        'Failed to create picker session'
      );
    });
  });

  describe('getSessionStatus', () => {
    it('should retrieve session status', async () => {
      const mockSession: PickingSession = {
        id: 'session-123',
        pickerUri: 'https://photos.google.com/picker/session-123',
        mediaItemsSet: true,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockSession,
      } as Response);

      const result = await getSessionStatus('session-123', mockTokens);

      expect(fetch).toHaveBeenCalledWith(
        'https://photospicker.googleapis.com/v1/sessions/session-123',
        {
          headers: {
            Authorization: 'Bearer mock-access-token',
          },
        }
      );

      expect(result.session).toEqual(mockSession);
    });

    it('should indicate when media items are ready', async () => {
      const mockSession: PickingSession = {
        id: 'session-123',
        pickerUri: 'https://photos.google.com/picker/session-123',
        mediaItemsSet: true,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockSession,
      } as Response);

      const result = await getSessionStatus('session-123', mockTokens);

      expect(result.mediaItemsReady).toBe(true);
    });
  });

  describe('listMediaItems', () => {
    it('should list selected media items from session', async () => {
      const mockMediaItems: MediaItem[] = [
        {
          id: 'media-1',
          baseUrl: 'https://photos.googleapis.com/media-1',
          mimeType: 'image/jpeg',
          filename: 'photo1.jpg',
        },
        {
          id: 'media-2',
          baseUrl: 'https://photos.googleapis.com/media-2',
          mimeType: 'image/png',
          filename: 'photo2.png',
        },
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ mediaItems: mockMediaItems }),
      } as Response);

      const result = await listMediaItems('session-123', mockTokens);

      expect(fetch).toHaveBeenCalledWith(
        'https://photospicker.googleapis.com/v1/sessions/session-123/mediaItems',
        {
          headers: {
            Authorization: 'Bearer mock-access-token',
          },
        }
      );

      expect(result.mediaItems).toHaveLength(2);
      expect(result.mediaItems[0].id).toBe('media-1');
    });

    it('should handle pagination with nextPageToken', async () => {
      const mockResponse = {
        mediaItems: [],
        nextPageToken: 'next-page-token',
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await listMediaItems('session-123', mockTokens, 'page-token');

      expect(fetch).toHaveBeenCalledWith(
        'https://photospicker.googleapis.com/v1/sessions/session-123/mediaItems?pageToken=page-token',
        {
          headers: {
            Authorization: 'Bearer mock-access-token',
          },
        }
      );
    });

    it('should return empty array when no items selected', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ mediaItems: [] }),
      } as Response);

      const result = await listMediaItems('session-123', mockTokens);

      expect(result.mediaItems).toHaveLength(0);
    });
  });
});
