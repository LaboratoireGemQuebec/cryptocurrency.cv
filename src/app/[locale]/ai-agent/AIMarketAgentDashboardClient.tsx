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

import dynamic from 'next/dynamic';

export const AIMarketAgentDashboard = dynamic(
  () => import('@/components/AIMarketAgentDashboard').then(m => ({ default: m.AIMarketAgentDashboard })),
  { ssr: false }
);
