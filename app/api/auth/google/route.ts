import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth initiation endpoint
 * Redirects user to Google's OAuth authorization page
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // TODO: Implement OAuth initiation flow
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
