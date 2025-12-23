import { SessionOptions } from 'iron-session';
import { SessionData } from '@/types/session';

/**
 * Session configuration for iron-session
 */
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'google_photos_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Validates that required environment variables are set
 */
export function validateSessionConfig(): void {
  if (!process.env.SESSION_PASSWORD) {
    throw new Error('SESSION_PASSWORD environment variable is required');
  }

  if (process.env.SESSION_PASSWORD.length < 32) {
    throw new Error('SESSION_PASSWORD must be at least 32 characters long');
  }
}
