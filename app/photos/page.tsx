import Link from "next/link";

export default function PhotosPage() {
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
      </div>
      <Link
        href="/"
        className="mt-8 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Back to Home
      </Link>
    </main>
  );
}
