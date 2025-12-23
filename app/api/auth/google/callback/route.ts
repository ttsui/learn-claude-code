import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google-auth";

/**
 * GET /api/auth/google/callback
 * Handles OAuth 2.0 callback from Google and exchanges authorization code for tokens
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Check if user denied authorization
    if (error) {
      return NextResponse.json(
        {
          error: "Authorization denied",
          message: `User denied authorization: ${error}`,
        },
        { status: 400 },
      );
    }

    // Check if authorization code is present
    if (!code) {
      return NextResponse.json(
        {
          error: "Missing authorization code",
          message: "No authorization code received from Google",
        },
        { status: 400 },
      );
    }

    // Build the redirect URI (must match the one used in authorization request)
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // In a real application, you would:
    // 1. Store tokens securely (e.g., in a session or database)
    // 2. Create a user session
    // 3. Redirect to the app with a session cookie
    //
    // For this basic implementation, we'll just return the tokens
    // Note: This is for demonstration only - DO NOT expose tokens in production
    return NextResponse.json({
      message: "Authorization successful",
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
      // Note: Only return refresh_token if you need offline access
      has_refresh_token: !!tokens.refresh_token,
    });
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    return NextResponse.json(
      {
        error: "Token exchange failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
