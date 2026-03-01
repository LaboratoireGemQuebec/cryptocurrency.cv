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
