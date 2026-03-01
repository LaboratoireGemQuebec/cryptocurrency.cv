'use client';

/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */


import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'general', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="px-4 py-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 max-w-2xl">
            Have a question, feedback, or want to report an issue? We&apos;d love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="md:col-span-2">
              {status === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
                  <span className="text-4xl mb-4 block">✅</span>
                  <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-2">Message Sent!</h2>
                  <p className="text-green-700 dark:text-green-400">
                    Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-800 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-800 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-800 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="api">API Support</option>
                      <option value="correction">News Correction</option>
                      <option value="tip">Submit a News Tip</option>
                      <option value="partnership">Partnership / Collaboration</option>
                      <option value="legal">Legal / DMCA</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-800 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-y"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-black font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Direct Contact */}
              <div className="bg-gray-50 dark:bg-black rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Direct Contact</h3>
                <ul className="space-y-4 text-sm text-gray-600 dark:text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-lg">📧</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">General</p>
                      <a href="mailto:hello@freecryptonews.io" className="text-amber-600 dark:text-amber-400 hover:underline">
                        hello@freecryptonews.io
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg">🔒</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Security</p>
                      <a href="mailto:security@freecryptonews.io" className="text-amber-600 dark:text-amber-400 hover:underline">
                        security@freecryptonews.io
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg">⚖️</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Legal / DMCA</p>
                      <a href="mailto:legal@freecryptonews.io" className="text-amber-600 dark:text-amber-400 hover:underline">
                        legal@freecryptonews.io
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Community */}
              <div className="bg-gray-50 dark:bg-black rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Community</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="https://github.com/nirholas/free-crypto-news/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      <span className="text-lg">🐛</span>
                      Report a Bug on GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/nirholas/free-crypto-news/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      <span className="text-lg">💬</span>
                      GitHub Discussions
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/nirholas/free-crypto-news"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      <span className="text-lg">⭐</span>
                      Star on GitHub
                    </a>
                  </li>
                </ul>
              </div>

              {/* Response Time */}
              <div className="bg-gray-50 dark:bg-black rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  We typically respond within 24–48 hours. For urgent security issues, please email{' '}
                  <a href="mailto:security@freecryptonews.io" className="text-amber-600 dark:text-amber-400 hover:underline">
                    security@freecryptonews.io
                  </a>{' '}
                  directly.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
