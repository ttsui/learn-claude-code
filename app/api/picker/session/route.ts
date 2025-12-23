/**
 * Picker Session Route
 *
 * Creates a new Google Photos Picker session and returns
 * the session ID and picker URI.
 */

import { NextResponse } from "next/server";
import { createPickerSession } from "@/lib/photos/picker";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Not authenticated. Please log in first." },
        { status: 401 },
      );
    }

    // Create picker session
    const session = await createPickerSession(accessToken);

    return NextResponse.json({
      sessionId: session.id,
      pickerUri: session.pickerUri,
      mediaItemsSet: session.mediaItemsSet,
    });
  } catch (error) {
    console.error("Session creation error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to create picker session" },
      { status: 500 },
    );
  }
}
