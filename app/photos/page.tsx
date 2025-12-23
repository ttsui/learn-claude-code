'use client';

import { useState } from 'react';

export default function PhotosPage() {
  const [pickerUri, setPickerUri] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/photos/sessions', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const session = await response.json();
      setSessionId(session.id);
      setPickerUri(session.pickerUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Google Photos Picker</h1>

        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            This page demonstrates the Google Photos Picker API integration.
          </p>
          <a
            href="/api/auth/google"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Sign in with Google
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create Picker Session</h2>
          <button
            onClick={createSession}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating Session...' : 'Create Picker Session'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              Error: {error}
            </div>
          )}

          {pickerUri && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Picker URI Ready</h3>
              <p className="text-gray-600 mb-4">
                Session ID: <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
              </p>
              <a
                href={pickerUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Open Google Photos Picker
              </a>
              <p className="text-sm text-gray-500 mt-2">
                This will open in a new window. Select photos and return here.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Sign in with Google" to authenticate with OAuth 2.0</li>
            <li>Grant permission to access your Google Photos</li>
            <li>Create a picker session to get a unique picker URI</li>
            <li>Open the picker URI to select photos from your library</li>
            <li>Selected photos will be available via the API</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
