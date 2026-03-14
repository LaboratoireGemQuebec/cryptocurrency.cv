import React from 'react';
import Head from 'next/head';

export default function EthicsPage() {
  return (
    <>
      <Head>
        <title>Ethics Statement | free-crypto-news</title>
        <meta
          name="description"
          content="Core ethical principles and compliance standards for free-crypto-news."
        />
      </Head>
      <main className="prose mx-auto py-8">
        <h1>Ethics Statement</h1>
        <section>
          <h2>Core Principles</h2>
          <ol>
            <li>
              <strong>Accuracy</strong> — We only aggregate from verified news sources
            </li>
            <li>
              <strong>Transparency</strong> — Our algorithms and data sources are documented
            </li>
            <li>
              <strong>Independence</strong> — No commercial relationship influences content ranking
            </li>
            <li>
              <strong>Accessibility</strong> — Free tier always available, no paywalls on aggregated
              news
            </li>
            <li>
              <strong>Privacy</strong> — Minimal data collection, no tracking beyond analytics
            </li>
            <li>
              <strong>Open Source</strong> — Our code is publicly auditable
            </li>
          </ol>
        </section>
        <section>
          <h2>Compliance</h2>
          <ul>
            <li>GDPR compliant</li>
            <li>No misleading financial claims</li>
            <li>Age-appropriate content only</li>
            <li>Respect for intellectual property (proper attribution, linking to source)</li>
          </ul>
        </section>
      </main>
    </>
  );
}
