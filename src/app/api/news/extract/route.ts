import { NextRequest, NextResponse } from 'next/server';

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

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
    const title = ogTitleMatch?.[1] || titleMatch?.[1] || 'Unknown Title';

    // Extract author
    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]+)"/i) ||
                       html.match(/<meta[^>]*property="article:author"[^>]*content="([^"]+)"/i);
    const author = authorMatch?.[1];

    // Extract published date
    const dateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i) ||
                     html.match(/<time[^>]*datetime="([^"]+)"/i);
    const published_date = dateMatch?.[1];

    // Extract main content (simplified - strip tags from article/main elements)
    let content = '';
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                        html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                        html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    
    if (articleMatch) {
      content = articleMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Calculate reading time (avg 200 words/minute)
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    const result: ExtractedArticle = {
      url,
      title: title.trim(),
      content: content.slice(0, 10000), // Limit content length
      author,
      published_date,
      word_count: wordCount,
      reading_time_minutes: readingTime
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Article extraction error:', error);
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
  }
}
