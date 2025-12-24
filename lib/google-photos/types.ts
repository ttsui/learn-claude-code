/**
 * Google Photos API Types
 * Based on Google Photos Library API v1
 */

export interface MediaItem {
  id: string;
  description?: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  filename: string;
  mediaMetadata?: MediaMetadata;
}

export interface MediaMetadata {
  creationTime?: string;
  width?: string;
  height?: string;
  photo?: PhotoMetadata;
  video?: VideoMetadata;
}

export interface PhotoMetadata {
  cameraMake?: string;
  cameraModel?: string;
  focalLength?: number;
  apertureFNumber?: number;
  isoEquivalent?: number;
  exposureTime?: string;
}

export interface VideoMetadata {
  cameraMake?: string;
  cameraModel?: string;
  fps?: number;
  status?: 'UNSPECIFIED' | 'PROCESSING' | 'READY' | 'FAILED';
}

export interface ListMediaItemsRequest {
  pageSize?: number;
  pageToken?: string;
  filters?: Filters;
}

export interface Filters {
  dateFilter?: DateFilter;
  contentFilter?: ContentFilter;
  mediaTypeFilter?: MediaTypeFilter;
}

export interface DateFilter {
  dates?: Date[];
  ranges?: DateRange[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ContentFilter {
  includedContentCategories?: string[];
  excludedContentCategories?: string[];
}

export interface MediaTypeFilter {
  mediaTypes: ('ALL_MEDIA' | 'VIDEO' | 'PHOTO')[];
}

export interface Date {
  year: number;
  month: number;
  day: number;
}
