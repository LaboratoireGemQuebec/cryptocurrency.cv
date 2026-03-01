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
 * Root Layout
 * 
 * This is a minimal root layout that exists to handle the root route.
 * The actual layout with all providers is in [locale]/layout.tsx.
 * 
 * The middleware handles redirecting users to the appropriate locale,
 * so this layout primarily serves as a fallback and to satisfy Next.js
 * requirements for a root layout.
 */

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
