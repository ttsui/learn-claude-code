import { NextResponse } from "next/server";
import { buildAuthorizationUrl } from "@/lib/google-photos/oauth";

/**
 * Generates a random state string for CSRF protection
 */
function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * GET /api/auth/google
 *
 * Initiates the Google OAuth 2.0 authorization flow for Google Photos Picker API.
 * Redirects the user to Google's authorization page.
 */
export async function GET(): Promise<NextResponse> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!clientId || !baseUrl) {
    return NextResponse.json(
      { error: "Missing required environment variables" },
      { status: 500 },
    );
  }

  const state = generateState();
  const redirectUri = `${baseUrl}/api/auth/callback`;

  const authorizationUrl = buildAuthorizationUrl({
    clientId,
    redirectUri,
    state,
  });

  return NextResponse.redirect(authorizationUrl, { status: 302 });
}
