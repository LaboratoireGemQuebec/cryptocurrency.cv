/**
 * Home Market Strip - wraps the interactive HomePricesTable
 * with the section heading used on the homepage.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import HomePricesTable from '@/components/HomePricesTable';

export default async function HomeMarketStrip() {
  const t = await getTranslations('common');
  return (
    <section className="mb-8" aria-label="Crypto Market Overview">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Prices
          </h2>
          <span className="text-xs text-gray-500 dark:text-slate-400 hidden sm:inline">
            Explore all 3000+ cryptocurrency prices
          </span>
        </div>
        <Link
          href="/markets"
          className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors flex items-center gap-1"
        >
          {t('viewAll')}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <HomePricesTable limit={20} />
    </section>
  );
}
