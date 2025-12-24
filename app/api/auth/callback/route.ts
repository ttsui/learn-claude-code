import { NextRequest, NextResponse } from 'next/server';
import { GoogleOAuth } from '@/lib/google-photos/oauth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code is missing' },
      { status: 400 }
    );
  }

  try {
    const oauth = new GoogleOAuth({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/callback`,
    });

    const tokens = await oauth.getAccessToken(code);

    // In a real application, you would store these tokens securely
    // For now, we'll redirect to a success page with the token as a query param
    // (This is NOT secure for production - tokens should be stored in secure HTTP-only cookies or server-side session)
    const redirectUrl = new URL('/', request.nextUrl.origin);
    redirectUrl.searchParams.set('auth', 'success');

    return NextResponse.redirect(redirectUrl, { status: 302 });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { error: 'Failed to exchange authorization code for tokens' },
      { status: 500 }
    );
  }
}
