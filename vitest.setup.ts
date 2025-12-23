import "@testing-library/jest-dom";

// Set up environment variables for testing
process.env.GOOGLE_CLIENT_ID = "test-client-id.apps.googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
process.env.GOOGLE_REDIRECT_URI = "http://localhost:3000/api/auth/callback";
process.env.SESSION_PASSWORD = "test-session-password-at-least-32-characters-long-for-security";
