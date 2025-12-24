import { describe, it, expect } from 'vitest';
import { GooglePhotosClient } from '../client';

describe('GooglePhotosClient', () => {
  describe('initialization', () => {
    it('should create a client with access token', () => {
      const client = new GooglePhotosClient({
        accessToken: 'test-access-token',
      });

      expect(client).toBeDefined();
      expect(client.listMediaItems).toBeDefined();
    });
  });

  describe('listMediaItems', () => {
    it('should have a method to list media items', () => {
      const client = new GooglePhotosClient({
        accessToken: 'test-access-token',
      });

      expect(typeof client.listMediaItems).toBe('function');
    });
  });
});
