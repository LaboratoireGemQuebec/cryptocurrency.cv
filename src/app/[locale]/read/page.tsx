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
import { ReaderContent } from '@/components/ReaderContent';
import { BreadcrumbStructuredData, NewsListStructuredData } from '@/components/StructuredData';
import { getLatestNews } from '@/lib/crypto-news';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Full Reader — Crypto News with AI Summaries',
  description: 'Read full crypto news articles from 200+ sources with AI-powered summaries and analysis.',
  path: '/read',
  tags: ['crypto reader', 'news reader', 'AI summaries', 'full articles', 'crypto news'],
});

export const revalidate = 300; // Revalidate every 5 minutes

export default async function ReaderPage() {
  const data = await getLatestNews(50);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Structured Data for SEO */}
      <BreadcrumbStructuredData 
        items={[
          { name: 'Home', url: 'https://cryptocurrency.cv' },
          { name: 'Reader', url: 'https://cryptocurrency.cv/read' }
        ]}
      />
      <NewsListStructuredData 
        articles={data.articles.slice(0, 20)}
        listName="Latest Crypto News - Full Reader"
      />
      
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <main id="main-content" className="px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">📖 Full Article Reader</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Read complete articles with AI-powered summaries and key insights.
              Click any article to expand and read the full content.
            </p>
          </div>

          <ReaderContent articles={data.articles} />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
