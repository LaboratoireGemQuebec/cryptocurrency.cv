import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSources, type SourceInfo } from "@/lib/crypto-news";
import { generateSEOMetadata } from "@/lib/seo";
import SourcesGrid from "@/components/SourcesGrid";

export const metadata = generateSEOMetadata({
  title: "News Sources",
  description:
    "Browse 300+ cryptocurrency news sources aggregated by Free Crypto News. Covering Bitcoin, Ethereum, DeFi, NFTs, trading, and more.",
  path: "/sources",
  tags: ["crypto sources", "news sources", "bitcoin news", "crypto feeds"],
});

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SourcesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let sources: SourceInfo[] = [];
  try {
    const data = await getSources();
    sources = data.sources ?? [];
  } catch {
    // Render empty state on failure
  }

  const activeCount = sources.filter((s) => s.status === "active").length;
  const categories = new Set(sources.map((s) => s.category || "other"));

  return (
    <>
      <Header />
      <main className="container-main py-10">
        {/* Hero Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-[var(--color-text-primary)]">
            {sources.length}+ News Sources
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl text-base leading-relaxed">
            Free Crypto News aggregates headlines from {sources.length}+ sources
            across {categories.size} categories in the crypto ecosystem —
            updated in real-time.
          </p>

          {/* Stats Row */}
          <div className="mt-5 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {activeCount}
                </span>{" "}
                active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {sources.length - activeCount}
                </span>{" "}
                unavailable
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-[var(--color-text-tertiary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {categories.size}
                </span>{" "}
                categories
              </span>
            </div>
          </div>
        </div>

        <div className="divider mb-8" />

        {sources.length === 0 ? (
          <div className="py-20 text-center">
            <svg
              className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)] mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p className="text-[var(--color-text-tertiary)] text-lg">
              Unable to load sources.
            </p>
            <p className="text-[var(--color-text-tertiary)] text-sm mt-1">
              Please try again later.
            </p>
          </div>
        ) : (
          <SourcesGrid sources={sources} />
        )}
      </main>
      <Footer />
    </>
  );
}
