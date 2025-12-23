import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { listMediaItems } from '@/lib/photos-picker';
import { sessionOptions } from '@/lib/session';
import { SessionData } from '@/types/session';

/**
 * List media items from a Photos Picker session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const pageToken = searchParams.get('pageToken') || undefined;

    // Get session
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions
    );

    // Check if user is authenticated
    if (!session.tokens) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // List media items
    const mediaItems = await listMediaItems(id, session.tokens, pageToken);

    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error('Failed to list media items:', error);
    return NextResponse.json(
      { error: 'Failed to list media items' },
      { status: 500 }
    );
  }
}
