import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-black text-gray-200 dark:text-slate-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
