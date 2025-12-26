"use client";

import { useState } from "react";
import { getAuthorizationUrl } from "../../lib/auth/oauth";
import { createPickerSession } from "../../lib/google-photos/picker";

export default function GooglePhotosPickerDemo() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [pickerUri, setPickerUri] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleStartOAuth = () => {
    // These would come from environment variables in a real app
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "your-client-id";
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope =
      "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

    const authUrl = getAuthorizationUrl({
      clientId,
      redirectUri,
      scope,
      state: Math.random().toString(36).substring(7),
    });

    window.location.href = authUrl;
  };

  const handleCreateSession = async () => {
    if (!accessToken) {
      setError("Please provide an access token");
      return;
    }

    try {
      setError("");
      const session = await createPickerSession({ accessToken });
      setPickerUri(session.pickerUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    }
  };

  const handleOpenPicker = () => {
    if (pickerUri) {
      window.open(pickerUri, "googlePhotosPicker", "width=800,height=600");
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold">
          Google Photos Picker Demo
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-medium">Step 1: OAuth Login</h3>
            <button
              onClick={handleStartOAuth}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Start OAuth Flow
            </button>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">
              Step 2: Enter Access Token
            </h3>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              For demo purposes, paste your OAuth access token here:
            </p>
            <input
              type="text"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Access token from OAuth flow"
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">
              Step 3: Create Picker Session
            </h3>
            <button
              onClick={handleCreateSession}
              disabled={!accessToken}
              className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Session
            </button>
          </div>

          {pickerUri && (
            <div>
              <h3 className="mb-2 text-lg font-medium">
                Step 4: Open Photo Picker
              </h3>
              <button
                onClick={handleOpenPicker}
                className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
              >
                Open Photo Picker
              </button>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Picker URI: {pickerUri.substring(0, 50)}...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-2 text-lg font-semibold">Setup Instructions</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Create a Google Cloud Project at{" "}
            <a
              href="https://console.cloud.google.com"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              console.cloud.google.com
            </a>
          </li>
          <li>Enable the Google Photos Picker API</li>
          <li>Create OAuth 2.0 credentials (Web application type)</li>
          <li>
            Add{" "}
            <code className="rounded bg-gray-100 px-1 dark:bg-gray-900">
              {typeof window !== "undefined" ? window.location.origin : ""}
            </code>{" "}
            to Authorized JavaScript origins
          </li>
          <li>
            Set{" "}
            <code className="rounded bg-gray-100 px-1 dark:bg-gray-900">
              NEXT_PUBLIC_GOOGLE_CLIENT_ID
            </code>{" "}
            in .env.local
          </li>
        </ol>
      </div>
    </div>
  );
}
