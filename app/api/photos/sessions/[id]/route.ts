import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { getSessionStatus } from '@/lib/photos-picker';
import { sessionOptions } from '@/lib/session';
import { SessionData } from '@/types/session';

/**
 * Get the status of a Photos Picker session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Get session status
    const status = await getSessionStatus(id, session.tokens);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to get session status:', error);
    return NextResponse.json(
      { error: 'Failed to get session status' },
      { status: 500 }
    );
  }
}
