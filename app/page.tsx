import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Google Photos Picker Integration</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-center mb-8">
        A Next.js application demonstrating OAuth 2.0 authentication and Google Photos Picker API integration
      </p>

      <div className="flex gap-4">
        <Link
          href="/api/auth/google"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Sign in with Google
        </Link>
        <Link
          href="/photos"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          Go to Photos
        </Link>
      </div>

      <div className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>OAuth 2.0 authentication with Google</li>
          <li>Google Photos Picker API integration</li>
          <li>Secure session management with encrypted cookies</li>
          <li>TypeScript for type safety</li>
          <li>Comprehensive test coverage with Vitest</li>
          <li>TDD approach following Kent Beck's principles</li>
        </ul>
      </div>
    </main>
  );
}
