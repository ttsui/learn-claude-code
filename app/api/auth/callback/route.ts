import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import {
  validateStateParameter,
  exchangeCodeForTokens,
} from '@/lib/oauth';
import { sessionOptions } from '@/lib/session';
import { SessionData } from '@/types/session';

/**
 * OAuth callback endpoint
 * Handles the redirect from Google after user authorization
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Validate required parameters
    if (!code) {
      return NextResponse.redirect(
        new URL('/?error=missing_code', request.url)
      );
    }

    // Get session
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions
    );

    // Validate state parameter for CSRF protection
    if (!validateStateParameter(state, session.oauthState)) {
      console.error('Invalid state parameter');
      return NextResponse.redirect(
        new URL('/?error=invalid_state', request.url)
      );
    }

    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Store tokens in session
    session.tokens = tokens;
    delete session.oauthState; // Clear the state parameter
    await session.save();

    // Redirect to photos page or success page
    return NextResponse.redirect(new URL('/photos', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/?error=auth_failed', request.url)
    );
  }
}
