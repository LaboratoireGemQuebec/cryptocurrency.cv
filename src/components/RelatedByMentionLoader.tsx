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
 * Async server component that fetches homepage news and renders RelatedByMention.
 * Wrapped in <Suspense> on the article page so it streams independently
 * without blocking the main article render.
 */
import { getHomepageNews, type NewsArticle } from "@/lib/crypto-news";
import { RelatedByMention } from "@/components/RelatedByMention";

interface Props {
  currentTitle: string;
  currentDescription?: string;
  currentLink: string;
}

export async function RelatedByMentionLoader({
  currentTitle,
  currentDescription,
  currentLink,
}: Props) {
  const homepageResult = await getHomepageNews({ latestLimit: 50 }).catch(
    () => null,
  );
  const allArticles: NewsArticle[] =
    homepageResult?.latest.articles ?? [];

  if (allArticles.length === 0) return null;

  return (
    <RelatedByMention
      currentTitle={currentTitle}
      currentDescription={currentDescription}
      currentLink={currentLink}
      allArticles={allArticles}
    />
  );
}
