import { NextRequest, NextResponse } from "next/server";
import { generateAuthUrl } from "@/lib/google-auth";

/**
 * GET /api/auth/google
 * Initiates OAuth 2.0 authorization flow by redirecting to Google's authorization endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Build the callback URL
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    // Generate authorization URL
    const authUrl = generateAuthUrl(redirectUri);

    // Redirect user to Google's authorization page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate authorization",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
