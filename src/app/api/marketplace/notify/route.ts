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
 * Alibaba Cloud Marketplace — SPI Production Notification Handler
 *
 * Receives subscription lifecycle events from Alibaba Cloud Marketplace:
 * - createInstance  — user purchased the API
 * - renewInstance   — user renewed subscription
 * - releaseInstance — user cancelled / subscription expired
 *
 * Must respond with HTTP 200 within 2 seconds.
 *
 * @see https://www.alibabacloud.com/help/en/api-gateway/developer-reference/spi-notification
 */

import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Alibaba Cloud Marketplace sends SPI notifications as GET requests with
 * all parameters in the query string, including a `token` for verification.
 *
 * Example:
 *   /api/marketplace/notify?action=createInstance&aliUid=...&orderId=...&token=...
 *
 * Must respond with HTTP 200 + JSON `{ success: true }` within 2 seconds.
 */

function handleSpiNotification(params: URLSearchParams): Response {
  const startTime = Date.now();

  const action = params.get('action') ?? 'unknown';
  const aliUid = params.get('aliUid');
  const orderId = params.get('orderId');
  const orderBizId = params.get('orderBizId');
  const productCode = params.get('productCode');
  const skuId = params.get('skuId');
  const trial = params.get('trial');

  // Log for Vercel dashboard visibility
  console.log(
    `[marketplace-spi] action=${action} uid=${aliUid ?? 'n/a'} order=${orderId ?? 'n/a'} ` +
    `bizId=${orderBizId ?? 'n/a'} product=${productCode ?? 'n/a'} sku=${skuId ?? 'n/a'} ` +
    `trial=${trial ?? 'n/a'} ts=${new Date().toISOString()}`,
  );

  // Alibaba expects: { "success": true } with 200 status
  return NextResponse.json(
    {
      success: true,
      instanceId: orderBizId ?? orderId ?? `inst-${Date.now()}`,
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}

/** Alibaba SPI notifications arrive as GET with query parameters */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  // If there's an `action` param, this is an SPI notification
  if (params.has('action')) {
    return handleSpiNotification(params);
  }

  // Otherwise, health check
  return NextResponse.json(
    {
      status: 'ok',
      endpoint: 'marketplace-spi-notify',
      description: 'Alibaba Cloud Marketplace SPI notification receiver',
      accepts: 'GET with query params (?action=createInstance&...)',
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}

/** Also handle POST in case Alibaba ever sends POST for some event types */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    // Check query params first (some SPI variants send POST with query params)
    if (url.searchParams.has('action')) {
      return handleSpiNotification(url.searchParams);
    }
    // Fallback: try JSON body
    const body = await request.json() as Record<string, string>;
    const params = new URLSearchParams(body);
    return handleSpiNotification(params);
  } catch {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
