/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

/**
 * Ask Page
 * 
 * Full-page RAG-powered chat interface
 */

import { generateSEOMetadata } from '@/lib/seo';
import { RAGChat } from '@/components/rag-chat';

export const metadata = generateSEOMetadata({
  title: 'Ask AI \u2014 Crypto News Assistant',
  description: 'Get instant answers about cryptocurrency news, market trends, Bitcoin, Ethereum, DeFi, NFTs, and more using our AI-powered assistant.',
  path: '/ask',
  tags: ['crypto AI', 'AI assistant', 'news chat', 'bitcoin', 'ethereum', 'crypto questions'],
});

export default function AskPage() {
  return (
    <main className="h-screen bg-gray-900">
      <RAGChat showSidebar={true} />
    </main>
  );
}
