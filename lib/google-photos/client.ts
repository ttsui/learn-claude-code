export interface GooglePhotosClientConfig {
  accessToken: string;
}

export interface MediaItem {
  id: string;
  description?: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  filename: string;
}

export interface ListMediaItemsResponse {
  mediaItems: MediaItem[];
  nextPageToken?: string;
}

export class GooglePhotosClient {
  private readonly baseUrl = 'https://photoslibrary.googleapis.com/v1';

  constructor(private config: GooglePhotosClientConfig) {}

  async listMediaItems(pageSize: number = 10, pageToken?: string): Promise<ListMediaItemsResponse> {
    const url = new URL(`${this.baseUrl}/mediaItems`);
    url.searchParams.append('pageSize', pageSize.toString());
    if (pageToken) {
      url.searchParams.append('pageToken', pageToken);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list media items: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      mediaItems: data.mediaItems || [],
      nextPageToken: data.nextPageToken,
    };
  }
}
