/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * /pricing/upgrade now redirects to /billing where x402 payment
 * info is explained. There are no subscription upgrades — everything
 * is pay-per-request via x402 micropayments on Base.
 */
export default async function UpgradePage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/billing`);
}
