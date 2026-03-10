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

import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface SpiNotification {
  action: 'createInstance' | 'renewInstance' | 'releaseInstance';
  instanceId?: string;
  orderId?: string;
  orderBizId?: string;
  aliUid?: string;
  token?: string;
  productCode?: string;
  created?: string;
  expired?: string;
  [key: string]: unknown;
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as SpiNotification;
    const { action, instanceId, orderId, aliUid } = body;

    // Log the event (visible in Vercel/deployment logs)
    console.log(
      `[marketplace-spi] action=${action} instance=${instanceId ?? 'n/a'} order=${orderId ?? 'n/a'} uid=${aliUid ?? 'n/a'} ts=${new Date().toISOString()}`,
    );

    // Acknowledge the event — Alibaba requires 200 within 2 seconds
    return NextResponse.json(
      {
        success: true,
        action,
        instanceId: instanceId ?? null,
        processedAt: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime,
      },
      { status: 200 },
    );
  } catch {
    // Even on parse failures, return 200 to prevent Alibaba retries flooding the endpoint
    console.error(
      `[marketplace-spi] Failed to parse notification body ts=${new Date().toISOString()}`,
    );

    return NextResponse.json(
      {
        success: true,
        error: 'Invalid payload — acknowledged',
        processedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
}

/** Health check for the notification endpoint */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      endpoint: 'marketplace-spi-notify',
      description: 'Alibaba Cloud Marketplace SPI notification receiver',
      accepts: 'POST',
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
