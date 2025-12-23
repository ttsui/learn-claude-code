/**
 * Picker Media Items Route
 *
 * Retrieves media items from a Google Photos Picker session.
 */

import { NextRequest, NextResponse } from "next/server";
import { listMediaItems, deleteSession } from "@/lib/photos/picker";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Get session ID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Not authenticated. Please log in first." },
        { status: 401 },
      );
    }

    // List media items from the session
    const mediaItems = await listMediaItems(sessionId, accessToken);

    // Clean up: delete the session after retrieving media items
    // This prevents resource exhaustion
    try {
      await deleteSession(sessionId, accessToken);
    } catch (cleanupError) {
      // Log but don't fail the request if cleanup fails
      console.error("Failed to delete session:", cleanupError);
    }

    return NextResponse.json({
      mediaItems,
      count: mediaItems.length,
    });
  } catch (error) {
    console.error("Media retrieval error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to retrieve media items" },
      { status: 500 },
    );
  }
}
