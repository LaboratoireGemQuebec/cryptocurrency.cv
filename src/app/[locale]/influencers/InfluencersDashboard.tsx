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


import InfluencerLeaderboard from '@/components/InfluencerLeaderboard';

/** Dashboard component for influencer reliability tracking */
export default function InfluencersDashboard() {
  return (
    <div className="space-y-8">
      <InfluencerLeaderboard 
        showStats={true}
        showRecentCalls={true}
        maxItems={20}
      />
    </div>
  );
}
