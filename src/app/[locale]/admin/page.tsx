/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { generateSEOMetadata } from '@/lib/seo';
import AdminDashboard from './AdminDashboard';

export const metadata = generateSEOMetadata({
  title: 'Admin Dashboard',
  description: 'Admin dashboard for monitoring API usage and system health.',
  path: '/admin',
  noindex: true,
});

export default function AdminPage() {
  return <AdminDashboard />;
}
