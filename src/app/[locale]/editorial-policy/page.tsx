import React from 'react';
import Head from 'next/head';

export default function EditorialPolicyPage() {
  return (
    <>
      <Head>
        <title>Editorial Policy | free-crypto-news</title>
        <meta
          name="description"
          content="Editorial guidelines, source selection, AI usage, sponsored content policy, and corrections process for free-crypto-news."
        />
      </Head>
      <main className="prose mx-auto py-8">
        <h1>Editorial Policy</h1>
        <section>
          <h2>Our Mission</h2>
          <p>
            free-crypto-news aims to provide free, unbiased, comprehensive crypto news aggregation
            for everyone.
          </p>
        </section>
        <section>
          <h2>Source Selection Criteria</h2>
          <ul>
            <li>Editorial reputation and track record</li>
            <li>Factual accuracy history</li>
            <li>Regular publishing cadence</li>
            <li>Coverage breadth (not just one topic)</li>
            <li>No pay-to-play: sources are not paid to be included</li>
            <li>Sources can be removed for persistent inaccuracy</li>
          </ul>
        </section>
        <section>
          <h2>Content Curation</h2>
          <ul>
            <li>Chronological by default (newest first)</li>
            <li>No manual editorial boosting of specific articles</li>
            <li>
              Algorithm transparency: articles are ranked by recency, source quality tier, and topic
              relevance — not by commercial relationships
            </li>
            <li>
              AI is used for: categorization, summarization, translation — not for generating
              original reporting
            </li>
          </ul>
        </section>
        <section>
          <h2>Corrections & Accuracy</h2>
          <ul>
            <li>We aggregate content as-is from source publications</li>
            <li>If a source publishes a correction, it is reflected in our feed</li>
            <li>
              Factual errors in our own content (learn articles, guides, glossary) can be reported
              via contact page
            </li>
            <li>We label content types clearly: News, Opinion, Sponsored, Press Release</li>
          </ul>
        </section>
        <section>
          <h2>Conflicts of Interest</h2>
          <ul>
            <li>free-crypto-news does not hold positions in cryptocurrencies as an organization</li>
            <li>
              Individual contributors may hold crypto assets; this does not influence source
              selection or article ranking
            </li>
            <li>Sponsored content is always clearly labeled</li>
            <li>API partnerships do not influence editorial content or source ranking</li>
          </ul>
        </section>
        <section>
          <h2>AI & Automation Disclosure</h2>
          <ul>
            <li>AI is used for article categorization, tagging, and language translation</li>
            <li>AI-generated summaries are labeled as such</li>
            <li>No AI-generated articles are presented as human-written journalism</li>
            <li>Our AI content detection endpoint is publicly available</li>
          </ul>
        </section>
        <section>
          <h2>Sponsored Content Policy</h2>
          <ul>
            <li>All sponsored/paid content is clearly marked with a "Sponsored" label</li>
            <li>Sponsored content does not appear in the main news feed by default</li>
            <li>Press releases are separated into their own section</li>
            <li>Advertising does not influence which articles appear in feeds</li>
          </ul>
        </section>
        <section>
          <h2>User-Generated Content</h2>
          <ul>
            <li>User comments, if enabled, do not represent editorial views</li>
            <li>Community contributions to guides/glossary are reviewed before publishing</li>
          </ul>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            To report editorial concerns, corrections, or complaints, please use our contact page.
          </p>
        </section>
      </main>
    </>
  );
}
