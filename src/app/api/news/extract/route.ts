/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { type NextRequest, NextResponse } from 'next/server';

interface ExtractedArticle {
  url: string;
  title: string;
  content: string;
  author?: string;
  published_date?: string;
  word_count: number;
  reading_time_minutes: number;
}

/**
 * Validate that a URL is safe to fetch (prevent SSRF attacks).
 * Blocks internal/private IPs, localhost, and non-HTTP(S) schemes.
 */
function isSafeUrl(input: string): boolean {
  try {
    const parsed = new URL(input);

    // Only allow HTTP(S)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost & loopback
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname === '0.0.0.0'
    ) return false;

    // Block private/internal IP ranges (RFC 1918, link-local, metadata)
    const privatePatterns = [
      /^10\./,                           // 10.0.0.0/8
      /^172\.(1[6-9]|2\d|3[01])\./,     // 172.16.0.0/12
      /^192\.168\./,                     // 192.168.0.0/16
      /^169\.254\./,                     // link-local
      /^0\./,                            // 0.0.0.0/8
      /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // CGN 100.64.0.0/10
      /^198\.18\./,                      // benchmarking
    ];
    if (privatePatterns.some((p) => p.test(hostname))) return false;

    // Block cloud metadata endpoints
    if (
      hostname === 'metadata.google.internal' ||
      hostname === '169.254.169.254'
    ) return false;

    // Block common internal hostnames
    if (
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.localhost')
    ) return false;

    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!isSafeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid or disallowed URL. Only public HTTP(S) URLs are accepted.' },
        { status: 400 },
      );
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CryptoNewsBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
    }

    const html = await response.text();

    // Extract metadata from <head> (regex is fine for meta tags)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i) ||
                         html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:title"/i);
    const title = ogTitleMatch?.[1] || titleMatch?.[1] || 'Unknown Title';

    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]+)"/i) ||
                       html.match(/<meta[^>]*content="([^"]+)"[^>]*name="author"/i) ||
                       html.match(/<meta[^>]*property="article:author"[^>]*content="([^"]+)"/i);
    const author = authorMatch?.[1];

    const dateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i) ||
                     html.match(/<meta[^>]*content="([^"]+)"[^>]*property="article:published_time"/i) ||
                     html.match(/<time[^>]*datetime="([^"]+)"/i) ||
                     html.match(/<meta[^>]*name="date"[^>]*content="([^"]+)"/i);
    const published_date = dateMatch?.[1];

    const ogDescription = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i) ||
                           html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:description"/i) ||
                           html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
    const description = ogDescription?.[1];

    const ogImage = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
                    html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
    const image = ogImage?.[1];

    // --- Content Extraction (multi-strategy) ---
    // Strategy 1: JSON-LD structured data (most reliable when available)
    let content = '';
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
      for (const ldBlock of jsonLdMatch) {
        try {
          const jsonStr = ldBlock.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
          const ld = JSON.parse(jsonStr);
          // Handle arrays of LD+JSON objects
          const items = Array.isArray(ld) ? ld : [ld];
          for (const item of items) {
            if (item['@type'] === 'NewsArticle' || item['@type'] === 'Article' || item['@type'] === 'BlogPosting') {
              if (item.articleBody) {
                content = item.articleBody;
                break;
              }
            }
          }
          if (content) break;
        } catch { /* invalid JSON-LD, skip */ }
      }
    }

    // Strategy 2: Semantic HTML elements with scoring
    if (!content) {
      content = extractContentFromHTML(html);
    }

    // Strategy 3: Fallback to <body> text if nothing else worked
    if (!content || content.length < 100) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch) {
        content = cleanHTMLToText(bodyMatch[1]);
      }
    }

    // Final cleanup
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    const result: ExtractedArticle = {
      url,
      title: title.trim(),
      content: content.slice(0, 10000),
      author,
      published_date,
      ...(description ? { description } : {}),
      ...(image ? { image } : {}),
      word_count: wordCount,
      reading_time_minutes: readingTime
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Article extraction error:', error);
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
  }
}
