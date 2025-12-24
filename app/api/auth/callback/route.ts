import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google-photos/oauth";
import { createPickerSession } from "@/lib/google-photos/picker";

/**
 * GET /api/auth/callback
 *
 * Handles the OAuth 2.0 callback from Google.
 * Exchanges the authorization code for tokens and creates a picker session.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;

  // Check for OAuth errors
  const error = searchParams.get("error");
  if (error) {
    const errorDescription = searchParams.get("error_description");
    return NextResponse.json(
      { error, error_description: errorDescription },
      { status: 400 },
    );
  }

  // Get the authorization code
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 },
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!clientId || !clientSecret || !baseUrl) {
    return NextResponse.json(
      { error: "Missing required environment variables" },
      { status: 500 },
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, {
      clientId,
      clientSecret,
      redirectUri: `${baseUrl}/api/auth/callback`,
    });

    // Create a picker session
    const session = await createPickerSession(tokens.access_token);

    // Redirect to photos page with session info
    const photosUrl = new URL(`${baseUrl}/photos`);
    photosUrl.searchParams.set("sessionId", session.id);
    photosUrl.searchParams.set("pickerUri", session.pickerUri);

    // Store access token in a secure HTTP-only cookie
    const response = NextResponse.redirect(photosUrl.toString(), {
      status: 302,
    });
    response.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expires_in,
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
