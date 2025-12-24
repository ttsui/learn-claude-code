'use client';

import { useEffect, useState } from 'react';

export function GooglePhotosPicker() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate OAuth URL on client side
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const redirectUri = `${window.location.origin}/api/auth/callback`;
    const scope = 'https://www.googleapis.com/auth/photoslibrary.readonly';

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', scope);
    url.searchParams.append('access_type', 'offline');

    setAuthUrl(url.toString());
  }, []);

  const handleConnect = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-bold">Google Photos Picker</h2>
      <button
        onClick={handleConnect}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Connect Google Photos
      </button>
    </div>
  );
}
