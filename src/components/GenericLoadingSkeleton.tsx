/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/Skeletons';

export default function GenericLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-5 w-96 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <Skeleton className="h-40 w-full mb-4 rounded-xl" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
