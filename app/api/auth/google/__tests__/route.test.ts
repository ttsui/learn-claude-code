import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET } from "../route";
import { GOOGLE_AUTH_ENDPOINT } from "@/lib/google-photos/oauth";

describe("GET /api/auth/google", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      GOOGLE_CLIENT_ID: "test-client-id",
      NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should redirect to Google OAuth authorization URL", async () => {
    const response = await GET();

    expect(response.status).toBe(302);
    const location = response.headers.get("Location");
    expect(location).toContain(GOOGLE_AUTH_ENDPOINT);
    expect(location).toContain("client_id=test-client-id");
    expect(location).toContain("response_type=code");
    expect(location).toContain("access_type=offline");
  });

  it("should include state parameter for CSRF protection", async () => {
    const response = await GET();

    const location = response.headers.get("Location");
    expect(location).toMatch(/state=[a-zA-Z0-9]+/);
  });

  it("should include correct redirect URI", async () => {
    const response = await GET();

    const location = response.headers.get("Location");
    expect(location).toContain(
      encodeURIComponent("http://localhost:3000/api/auth/callback"),
    );
  });
});
