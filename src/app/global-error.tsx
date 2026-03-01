'use client';

/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */


import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-400 text-sm mb-2 leading-relaxed">
            A critical error occurred. This is likely temporary — try
            refreshing or come back shortly.
          </p>

          {error.digest && (
            <p className="text-xs text-gray-600 font-mono mb-6">
              Error ref: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={reset}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm rounded-xl transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm rounded-xl transition-colors border border-gray-700"
            >
              Go to homepage
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-600">
            If this keeps happening,{' '}
            <a
              href="https://github.com/nirholas/free-crypto-news/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white underline transition-colors"
            >
              report the issue
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
