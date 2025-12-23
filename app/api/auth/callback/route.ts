/**
 * OAuth Callback Route
 *
 * Handles the OAuth 2.0 callback from Google, exchanges
 * the authorization code for an access token, and stores it.
 */

import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/auth/oauth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error)}`, request.url),
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/?error=missing_parameters", request.url),
      );
    }

    // Retrieve and validate state from cookies
    const cookieStore = await cookies();
    const storedState = cookieStore.get("oauth_state")?.value;
    const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;

    if (!storedState || !codeVerifier) {
      return NextResponse.redirect(
        new URL("/?error=missing_session", request.url),
      );
    }

    if (state !== storedState) {
      return NextResponse.redirect(new URL("/?error=state_mismatch", request.url));
    }

    // Exchange authorization code for access token
    const tokens = await exchangeCodeForToken(code, codeVerifier);

    // Store access token in HTTP-only cookie
    // In production, you might want to use a more secure session store
    cookieStore.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    if (tokens.refresh_token) {
      cookieStore.set("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 86400 * 30, // 30 days
        path: "/",
      });
    }

    // Clean up temporary cookies
    cookieStore.delete("oauth_state");
    cookieStore.delete("oauth_code_verifier");

    // Redirect to success page
    return NextResponse.redirect(new URL("/?auth=success", request.url));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=token_exchange_failed", request.url),
    );
  }
}
