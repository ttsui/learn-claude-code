import { NextRequest, NextResponse } from "next/server";
import {
  createPickerSession,
  getSessionStatus,
} from "@/lib/google-photos-picker";

/**
 * POST /api/photos/picker/session
 * Creates a new Google Photos Picker session
 * Requires: Bearer token in Authorization header
 */
export async function POST(request: NextRequest) {
  try {
    // Extract access token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Missing or invalid Authorization header",
        },
        { status: 401 },
      );
    }

    const accessToken = authHeader.substring(7); // Remove "Bearer " prefix

    // Create a new Picker session
    const session = await createPickerSession(accessToken);

    return NextResponse.json({
      id: session.id,
      pickerUri: session.pickerUri,
      message:
        "Session created successfully. Direct users to pickerUri to select photos.",
    });
  } catch (error) {
    console.error("Error creating picker session:", error);
    return NextResponse.json(
      {
        error: "Failed to create session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/photos/picker/session?sessionId=xxx
 * Retrieves the status of a Google Photos Picker session
 * Requires: Bearer token in Authorization header
 */
export async function GET(request: NextRequest) {
  try {
    // Extract access token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Missing or invalid Authorization header",
        },
        { status: 401 },
      );
    }

    const accessToken = authHeader.substring(7);

    // Get session ID from query parameters
    const sessionId = request.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Missing sessionId query parameter",
        },
        { status: 400 },
      );
    }

    // Get session status
    const status = await getSessionStatus(accessToken, sessionId);

    return NextResponse.json({
      sessionId,
      mediaItemsSet: status.mediaItemsSet,
      mediaItems: status.mediaItems || [],
      message: status.mediaItemsSet
        ? "User has completed photo selection"
        : "Waiting for user to complete photo selection",
    });
  } catch (error) {
    console.error("Error getting session status:", error);
    return NextResponse.json(
      {
        error: "Failed to get session status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
