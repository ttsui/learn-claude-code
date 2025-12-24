import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        A TypeScript Next.js starter with Vitest and Tailwind CSS
      </p>
      <Link
        href="/api/auth/google"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Connect to Google Photos
      </Link>
    </main>
  );
}
