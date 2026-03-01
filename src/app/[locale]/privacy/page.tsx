import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';

export function generateMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Privacy Policy',
    description: 'Privacy policy for Free Crypto News. Learn how we handle your data, what we collect, and your rights.',
    path: '/privacy',
    tags: ['privacy policy', 'data protection', 'GDPR', 'crypto news'],
  });
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="px-4 py-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-10">Last updated: March 1, 2026</p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Introduction</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Free Crypto News (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard information when you use our
                website and API services at freecryptonews.io (the &quot;Service&quot;).
              </p>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                We are an open-source project. Our source code is publicly available on{' '}
                <a href="https://github.com/nirholas/free-crypto-news" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">
                  GitHub
                </a>, so you can verify exactly how we handle data.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Information We Collect</h2>

              <h3 className="text-xl font-medium text-gray-800 dark:text-slate-200 mt-6">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li><strong>Newsletter subscription:</strong> If you subscribe to our newsletter, we collect your email address.</li>
                <li><strong>Contact form:</strong> If you contact us, we collect the information you submit (name, email, message).</li>
                <li><strong>API keys:</strong> If you register for a premium API key, we collect your email and payment information.</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 dark:text-slate-200 mt-6">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li><strong>Usage data:</strong> We use privacy-friendly analytics (Vercel Analytics) that do not use cookies and do not track personal data.</li>
                <li><strong>Local storage:</strong> Bookmarks, watchlist, portfolio, and user preferences are stored locally in your browser. This data never leaves your device.</li>
                <li><strong>Server logs:</strong> Standard server logs may temporarily include IP addresses and request metadata for security and debugging purposes.</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 dark:text-slate-200 mt-6">2.3 What We Do NOT Collect</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li>We do <strong>not</strong> use tracking cookies or third-party advertising trackers.</li>
                <li>We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing purposes.</li>
                <li>We do <strong>not</strong> build user profiles or fingerprint devices.</li>
                <li>Our public API requires <strong>no</strong> API keys and collects no personal data.</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. How We Use Information</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                We use the limited information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li>Provide and improve the Service</li>
                <li>Send newsletter updates (only if you opted in)</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Monitor and prevent abuse of our API</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Cookies &amp; Local Storage</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                We use <strong>minimal essential cookies</strong> only:
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Purpose</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-slate-300">
                    <tr className="border-b border-gray-100 dark:border-slate-800">
                      <td className="py-2 px-4 font-mono text-xs">__csrf</td>
                      <td className="py-2 px-4">CSRF protection token</td>
                      <td className="py-2 px-4">Session</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-slate-800">
                      <td className="py-2 px-4 font-mono text-xs">theme</td>
                      <td className="py-2 px-4">Dark/light mode preference</td>
                      <td className="py-2 px-4">1 year</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-slate-800">
                      <td className="py-2 px-4 font-mono text-xs">locale</td>
                      <td className="py-2 px-4">Language preference</td>
                      <td className="py-2 px-4">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mt-4">
                We use <strong>localStorage</strong> (not cookies) to store bookmarks, watchlists, portfolio data, and UI preferences. This data stays entirely on your device.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Third-Party Services</h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li><strong>Vercel:</strong> Hosting and privacy-friendly analytics (no cookies, no personal data).</li>
                <li><strong>GitHub:</strong> Source code hosting and issue tracking.</li>
                <li><strong>News sources:</strong> We aggregate publicly available RSS feeds and APIs from 200+ crypto news sources. We do not share your data with these sources.</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Data Retention</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Server logs are retained for a maximum of 30 days. Newsletter subscriptions are retained until you unsubscribe.
                All locally stored data (bookmarks, watchlist, portfolio) can be deleted at any time by clearing your browser data.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Your Rights</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Depending on your jurisdiction, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li><strong>Access</strong> your personal data</li>
                <li><strong>Correct</strong> inaccurate data</li>
                <li><strong>Delete</strong> your data (&quot;right to be forgotten&quot;)</li>
                <li><strong>Export</strong> your data (data portability)</li>
                <li><strong>Object</strong> to processing of your data</li>
                <li><strong>Withdraw consent</strong> at any time</li>
              </ul>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@freecryptonews.io" className="text-amber-600 dark:text-amber-400 hover:underline">privacy@freecryptonews.io</a>.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Children&apos;s Privacy</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
                If you believe we have collected such data, please contact us and we will delete it promptly.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">9. Changes to This Policy</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date.
                Continued use of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">10. Contact Us</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
                <li>Email: <a href="mailto:privacy@freecryptonews.io" className="text-amber-600 dark:text-amber-400 hover:underline">privacy@freecryptonews.io</a></li>
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
