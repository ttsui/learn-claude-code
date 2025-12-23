/**
 * OAuth Login Route
 *
 * Initiates the OAuth 2.0 authorization flow by generating
 * an authorization URL and redirecting the user to Google.
 */

import { NextResponse } from "next/server";
import { generateAuthorizationUrl } from "@/lib/auth/oauth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Generate authorization URL with PKCE
    const { url, codeVerifier, state } = await generateAuthorizationUrl();

    // Store code verifier and state in HTTP-only cookies
    // These will be needed in the callback route
    const cookieStore = await cookies();
    cookieStore.set("oauth_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    // Redirect to Google's authorization page
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth flow" },
      { status: 500 },
    );
  }
}
