import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { generateAuthUrl, generateStateParameter } from '@/lib/oauth';
import { sessionOptions, validateSessionConfig } from '@/lib/session';
import { SessionData } from '@/types/session';

/**
 * OAuth initiation endpoint
 * Redirects user to Google's OAuth authorization page
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate configuration
    validateSessionConfig();

    // Get session
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    // Generate state parameter for CSRF protection
    const state = generateStateParameter();

    // Store state in session
    session.oauthState = state;
    session.createdAt = Date.now();
    await session.save();

    // Generate authorization URL
    const authUrl = generateAuthUrl(state);

    // Redirect to Google OAuth
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}
