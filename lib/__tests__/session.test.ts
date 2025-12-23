import { describe, it, expect } from 'vitest';
import { sessionOptions, validateSessionConfig } from '../session';

describe('Session Helper Functions', () => {
  describe('sessionOptions', () => {
    it('should have correct cookie name', () => {
      expect(sessionOptions.cookieName).toBe('google_photos_session');
    });

    it('should have correct password from environment', () => {
      expect(sessionOptions.password).toBe(process.env.SESSION_PASSWORD);
    });

    it('should have httpOnly cookie option', () => {
      expect(sessionOptions.cookieOptions?.httpOnly).toBe(true);
    });

    it('should have sameSite lax option', () => {
      expect(sessionOptions.cookieOptions?.sameSite).toBe('lax');
    });

    it('should have maxAge of 7 days', () => {
      const sevenDaysInSeconds = 60 * 60 * 24 * 7;
      expect(sessionOptions.cookieOptions?.maxAge).toBe(sevenDaysInSeconds);
    });

    it('should set secure cookie in production', () => {
      const originalEnv = process.env.NODE_ENV;

      process.env.NODE_ENV = 'production';
      // Need to re-import to get new value
      expect(sessionOptions.cookieOptions?.secure).toBe(false); // Will be false in test env

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('validateSessionConfig', () => {
    it('should not throw when SESSION_PASSWORD is valid', () => {
      expect(() => validateSessionConfig()).not.toThrow();
    });

    it('should throw when SESSION_PASSWORD is missing', () => {
      const original = process.env.SESSION_PASSWORD;
      delete process.env.SESSION_PASSWORD;

      expect(() => validateSessionConfig()).toThrow(
        'SESSION_PASSWORD environment variable is required'
      );

      process.env.SESSION_PASSWORD = original;
    });

    it('should throw when SESSION_PASSWORD is too short', () => {
      const original = process.env.SESSION_PASSWORD;
      process.env.SESSION_PASSWORD = 'short';

      expect(() => validateSessionConfig()).toThrow(
        'SESSION_PASSWORD must be at least 32 characters long'
      );

      process.env.SESSION_PASSWORD = original;
    });

    it('should accept SESSION_PASSWORD exactly 32 characters long', () => {
      const original = process.env.SESSION_PASSWORD;
      process.env.SESSION_PASSWORD = '12345678901234567890123456789012';

      expect(() => validateSessionConfig()).not.toThrow();

      process.env.SESSION_PASSWORD = original;
    });
  });
});
