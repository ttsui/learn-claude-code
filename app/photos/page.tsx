"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PhotosPage() {
  const searchParams = useSearchParams();
  const pickerUri = searchParams.get("pickerUri");
  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    // Automatically open picker in new tab when page loads
    if (pickerUri) {
      window.open(pickerUri, "_blank");
    }
  }, [pickerUri]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Google Photos Picker</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Please select photos from your Google Photos library using the picker
        window that opened. Once you&apos;ve made your selection, return here to
        see your chosen photos.
      </p>
      <div className="mt-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Waiting for photo selection...
        </p>
        {sessionId && (
          <p className="mt-2 text-center text-xs text-gray-400">
            Session: {sessionId}
          </p>
        )}
      </div>
      {pickerUri && (
        <a
          href={pickerUri}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Open Google Photos Picker
        </a>
      )}
      <Link
        href="/"
        className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Back to Home
      </Link>
    </main>
  );
}
