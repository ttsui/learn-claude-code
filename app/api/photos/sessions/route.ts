import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { createPickerSession } from '@/lib/photos-picker';
import { sessionOptions } from '@/lib/session';
import { SessionData } from '@/types/session';

/**
 * Create a new Google Photos Picker session
 */
export async function POST() {
  try {
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

    // Create picker session
    const pickerSession = await createPickerSession(session.tokens);

    return NextResponse.json(pickerSession);
  } catch (error) {
    console.error('Failed to create picker session:', error);
    return NextResponse.json(
      { error: 'Failed to create picker session' },
      { status: 500 }
    );
  }
}
