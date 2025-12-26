import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "../../../../lib/auth/oauth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    return NextResponse.json(
      { error: `OAuth error: ${error}` },
      { status: 400 },
    );
  }

  // Check for authorization code
  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 },
    );
  }

  try {
    // Exchange code for token
    const tokenResponse = await exchangeCodeForToken({
      code,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectUri: `${request.nextUrl.origin}/api/auth/callback`,
    });

    // Redirect back to home page with access token as URL fragment
    // Using fragment (#) keeps token out of server logs
    const redirectUrl = new URL("/", request.nextUrl.origin);
    redirectUrl.hash = `access_token=${tokenResponse.access_token}&token_type=${tokenResponse.token_type}&expires_in=${tokenResponse.expires_in}`;

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Token exchange error:", err);
    return NextResponse.json(
      { error: "Failed to exchange authorization code for token" },
      { status: 500 },
    );
  }
}
