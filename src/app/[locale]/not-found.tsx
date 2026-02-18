'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <>
      <Header />
      <main
        id="main-content"
        className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16"
      >
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-black text-gray-200 dark:text-slate-800 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('notFound')}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8">
            {t('notFoundDescription')}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors"
          >
            ← {t('goHome')}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
