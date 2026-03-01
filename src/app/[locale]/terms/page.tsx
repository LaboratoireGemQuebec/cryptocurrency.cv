/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';

export function generateMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Terms of Service',
    description: 'Terms of Service for Free Crypto News. Understand the rules and guidelines for using our website and API.',
    path: '/terms',
    tags: ['terms of service', 'terms and conditions', 'legal', 'crypto news'],
  });
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="px-4 py-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-10">Last updated: March 1, 2026</p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            {/* Agreement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Agreement to Terms</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                By accessing or using Free Crypto News (the &quot;Service&quot;), including our website, API, RSS feeds,
                widgets, SDKs, and any associated tools, you agree to be bound by these Terms of Service (&quot;Terms&quot;).
                If you do not agree to these Terms, do not use the Service.
              </p>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Description of Service</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Free Crypto News is an open-source cryptocurrency news aggregator that collects and displays
                publicly available news from 300+ sources. We provide:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li>Real-time cryptocurrency news aggregation</li>
                <li>Free public REST API and RSS/Atom feeds</li>
                <li>Market data, charts, and analytics tools</li>
                <li>AI-powered summaries, analysis, and research tools</li>
                <li>SDKs for Python, TypeScript, Go, React, and PHP</li>
                <li>Embeddable widgets and integrations</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Acceptable Use</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to overwhelm, disrupt, or attack the Service (DDoS, scraping beyond reasonable use, etc.)</li>
                <li>Misrepresent aggregated content as your own original journalism</li>
                <li>Use the Service to distribute malware, spam, or phishing content</li>
                <li>Reverse-engineer or attempt to extract proprietary algorithms beyond what is available in the open-source codebase</li>
                <li>Resell API access as a standalone product without adding substantial value</li>
              </ul>
            </section>

            {/* API Usage */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. API Usage</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Our public API is provided free of charge with no API key required for basic access. By using the API, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li>Use the API in good faith and at reasonable volumes</li>
                <li>Cache responses where appropriate to reduce unnecessary load</li>
                <li>Include attribution to Free Crypto News when displaying our data publicly</li>
                <li>Not circumvent any rate limits or access restrictions</li>
              </ul>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mt-4">
                We reserve the right to rate-limit, throttle, or block excessive or abusive API usage at our discretion.
                Premium API tiers with higher limits are available — see our{' '}
                <Link href="/pricing" className="text-amber-600 dark:text-amber-400 hover:underline">Pricing</Link> page.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Intellectual Property</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                The Free Crypto News codebase is released under the{' '}
                <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">MIT License</a>.
                This means you can freely use, modify, and distribute the code with proper attribution.
              </p>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mt-4">
                News content displayed on the Service is aggregated from third-party sources and remains the intellectual
                property of its respective publishers. We display headlines, excerpts, and links in accordance with fair use
                principles and RSS/Atom feed terms.
              </p>
            </section>

            {/* No Financial Advice */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Not Financial Advice</h2>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mt-4">
                <p className="text-gray-800 dark:text-slate-200 leading-relaxed font-medium">
                  ⚠️ The information provided by Free Crypto News is for informational and educational purposes only.
                  It does <strong>not</strong> constitute financial advice, investment advice, trading advice, or any other
                  type of professional advice.
                </p>
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed mt-4">
                  Cryptocurrency markets are highly volatile and risky. You should always conduct your own research
                  (&quot;DYOR&quot;) and consult with a qualified financial advisor before making any investment decisions.
                  We are not liable for any losses resulting from actions taken based on information provided by the Service.
                </p>
              </div>
            </section>

            {/* AI-Generated Content */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. AI-Generated Content</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Some features of the Service use artificial intelligence to generate summaries, analysis, predictions,
                and other content. AI-generated content:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li>May contain errors, inaccuracies, or hallucinations</li>
                <li>Should not be relied upon as the sole source of truth</li>
                <li>Is provided &quot;as is&quot; without warranties of accuracy or completeness</li>
                <li>Is clearly labeled where applicable</li>
              </ul>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mt-4">
                We do not warrant that the Service will be uninterrupted, timely, secure, or error-free. News data
                may be delayed, incomplete, or inaccurate. Market data is provided for informational purposes and
                may not reflect real-time prices.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">9. Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FREE CRYPTO NEWS AND ITS CONTRIBUTORS SHALL NOT BE LIABLE
                FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS
                OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">10. Modifications to Terms</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an
                updated &quot;Last updated&quot; date. Your continued use of the Service after changes are posted
                constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">11. Governing Law</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable law, without regard to
                conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved
                through good-faith negotiation or, if necessary, through binding arbitration.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">12. Contact</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                If you have questions about these Terms, please contact us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li>Email: <a href="mailto:legal@freecryptonews.io" className="text-amber-600 dark:text-amber-400 hover:underline">legal@freecryptonews.io</a></li>
                <li>GitHub: <a href="https://github.com/nirholas/free-crypto-news/issues" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">Open an issue</a></li>
              </ul>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
