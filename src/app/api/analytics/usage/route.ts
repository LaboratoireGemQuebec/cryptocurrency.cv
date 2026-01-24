import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { isKvConfigured, ApiKeyData, API_KEY_TIERS } from '@/lib/api-keys';

export const runtime = 'edge';
export const revalidate = 60; // 1 minute cache

/**
 * API Key Usage Analytics
 * 
 * Provides insights into API key usage patterns, including:
 * - Usage over time (daily, hourly)
 * - Endpoint popularity
 * - Geographic distribution
 * - Rate limit statistics
 */

interface UsageDataPoint {
  timestamp: string;
  count: number;
}

interface EndpointUsage {
  endpoint: string;
  count: number;
  avgLatency?: number;
}

interface UsageAnalytics {
  keyId: string;
  keyPrefix: string;
  tier: 'free' | 'pro' | 'enterprise';
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalRequests: number;
    uniqueDays: number;
    avgRequestsPerDay: number;
    peakHour: { hour: number; count: number };
    rateLimitHits: number;
    quotaUsage: { used: number; limit: number; percentage: number };
  };
  timeSeries: {
    daily: UsageDataPoint[];
    hourly: UsageDataPoint[];
  };
  endpoints: EndpointUsage[];
  errors: {
    total: number;
    byStatus: Record<number, number>;
  };
  insights: string[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyPrefix = searchParams.get('key_prefix');
  const keyId = searchParams.get('key_id');
  const days = Math.min(parseInt(searchParams.get('days') || '30'), 90);
  
  // Require authentication for usage data
  const authHeader = request.headers.get('authorization');
  const apiKey = authHeader?.replace('Bearer ', '') || searchParams.get('api_key');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key required. Use Authorization: Bearer <api_key> or ?api_key=<key>' },
      { status: 401 }
    );
  }

  if (!isKvConfigured()) {
    // Return mock data for demo
    return NextResponse.json(generateMockAnalytics(keyPrefix || 'demo', days));
  }

  try {
    // Get the API key data
    const keyData = await getKeyDataByPrefix(apiKey.slice(0, 12));
    
    if (!keyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Only allow users to view their own key's analytics (or enterprise/admin)
    if (keyId && keyId !== keyData.id && keyData.tier !== 'enterprise') {
      return NextResponse.json(
        { error: 'You can only view analytics for your own API keys' },
        { status: 403 }
      );
    }

    const targetKeyId = keyId || keyData.id;
    const analytics = await getUsageAnalytics(targetKeyId, keyData, days);
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Usage analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage analytics' },
      { status: 500 }
    );
  }
}

async function getKeyDataByPrefix(prefix: string): Promise<ApiKeyData | null> {
  try {
    // Search for key by prefix pattern
    const keys = await kv.keys(`apikey:*`);
    for (const key of keys) {
      const data = await kv.get<ApiKeyData>(key);
      if (data && data.keyPrefix === prefix) {
        return data;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function getUsageAnalytics(
  keyId: string, 
  keyData: ApiKeyData, 
  days: number
): Promise<UsageAnalytics> {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // Get usage data from KV
  const dailyUsage: UsageDataPoint[] = [];
  const hourlyUsage: UsageDataPoint[] = [];
  let totalRequests = 0;
  let rateLimitHits = 0;
  const hourCounts: number[] = new Array(24).fill(0);
  
  // Fetch daily usage for the period
  for (let d = 0; d < days; d++) {
    const date = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const count = await kv.get<number>(`usage:${keyId}:${dateStr}`) || 0;
      dailyUsage.push({ timestamp: dateStr, count });
      totalRequests += count;
    } catch {
      dailyUsage.push({ timestamp: dateStr, count: 0 });
    }
  }
  
  // Fetch hourly usage for last 24 hours
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  for (let h = 0; h < 24; h++) {
    const hour = new Date(last24h.getTime() + h * 60 * 60 * 1000);
    const hourStr = hour.toISOString().slice(0, 13);
    
    try {
      const count = await kv.get<number>(`usage:${keyId}:hour:${hourStr}`) || 0;
      hourlyUsage.push({ timestamp: hourStr, count });
      hourCounts[hour.getHours()] += count;
    } catch {
      hourlyUsage.push({ timestamp: hourStr, count: 0 });
    }
  }
  
  // Get rate limit hits
  try {
    rateLimitHits = await kv.get<number>(`ratelimit:${keyId}:hits`) || 0;
  } catch {
    // Ignore
  }
  
  // Get endpoint usage
  let endpoints: EndpointUsage[] = [];
  try {
    const endpointData = await kv.hgetall<Record<string, number>>(`endpoints:${keyId}`);
    if (endpointData) {
      endpoints = Object.entries(endpointData)
        .map(([endpoint, count]) => ({ endpoint, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
    }
  } catch {
    // Ignore
  }
  
  // Get error counts
  let errors = { total: 0, byStatus: {} as Record<number, number> };
  try {
    const errorData = await kv.hgetall<Record<string, number>>(`errors:${keyId}`);
    if (errorData) {
      errors.byStatus = Object.entries(errorData).reduce((acc, [status, count]) => {
        acc[parseInt(status)] = count;
        errors.total += count;
        return acc;
      }, {} as Record<number, number>);
    }
  } catch {
    // Ignore
  }
  
  // Find peak hour
  const peakHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
  
  // Calculate quota usage
  const tierLimits = API_KEY_TIERS[keyData.tier];
  const dailyLimit = tierLimits.requestsPerDay;
  const todayUsage = keyData.usageToday || 0;
  
  // Generate insights
  const insights = generateInsights(
    totalRequests, 
    days, 
    rateLimitHits, 
    endpoints, 
    dailyLimit,
    todayUsage
  );
  
  return {
    keyId: keyData.id,
    keyPrefix: keyData.keyPrefix,
    tier: keyData.tier,
    period: {
      start: startDate.toISOString(),
      end: now.toISOString(),
    },
    summary: {
      totalRequests,
      uniqueDays: dailyUsage.filter(d => d.count > 0).length,
      avgRequestsPerDay: Math.round(totalRequests / days),
      peakHour: { hour: peakHourIndex, count: hourCounts[peakHourIndex] },
      rateLimitHits,
      quotaUsage: {
        used: todayUsage,
        limit: dailyLimit === -1 ? Infinity : dailyLimit,
        percentage: dailyLimit === -1 ? 0 : Math.round((todayUsage / dailyLimit) * 100),
      },
    },
    timeSeries: {
      daily: dailyUsage,
      hourly: hourlyUsage,
    },
    endpoints,
    errors,
    insights,
  };
}

function generateInsights(
  totalRequests: number,
  days: number,
  rateLimitHits: number,
  endpoints: EndpointUsage[],
  dailyLimit: number,
  todayUsage: number
): string[] {
  const insights: string[] = [];
  
  const avgPerDay = totalRequests / days;
  
  if (avgPerDay > 0) {
    if (dailyLimit !== -1 && avgPerDay > dailyLimit * 0.8) {
      insights.push('⚠️ Your average daily usage is above 80% of your quota. Consider upgrading.');
    }
    
    if (rateLimitHits > 0) {
      insights.push(`🚫 You hit rate limits ${rateLimitHits} times. Implement request throttling.`);
    }
    
    if (endpoints.length > 0) {
      const topEndpoint = endpoints[0];
      insights.push(`📊 Most used endpoint: ${topEndpoint.endpoint} (${topEndpoint.count} requests)`);
    }
    
    if (todayUsage === 0) {
      insights.push('💡 No requests today. Check your integration is working correctly.');
    }
    
    if (dailyLimit !== -1) {
      const daysToLimitAtCurrentRate = dailyLimit / Math.max(avgPerDay, 1);
      if (daysToLimitAtCurrentRate < 1) {
        insights.push(`📈 At your current rate, you\'ll hit your daily limit. Consider caching responses.`);
      }
    }
  } else {
    insights.push('📭 No usage recorded in this period. Start making API requests!');
  }
  
  return insights;
}

function generateMockAnalytics(keyPrefix: string, days: number): UsageAnalytics {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // Generate mock daily usage with some variance
  const dailyUsage: UsageDataPoint[] = [];
  let totalRequests = 0;
  
  for (let d = 0; d < days; d++) {
    const date = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000);
    const baseCount = 50 + Math.floor(Math.random() * 100);
    // Add weekly pattern (higher on weekdays)
    const dayOfWeek = date.getDay();
    const weekdayMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
    const count = Math.floor(baseCount * weekdayMultiplier);
    
    dailyUsage.push({
      timestamp: date.toISOString().split('T')[0],
      count,
    });
    totalRequests += count;
  }
  
  // Generate mock hourly usage
  const hourlyUsage: UsageDataPoint[] = [];
  for (let h = 0; h < 24; h++) {
    const hour = new Date(now.getTime() - (24 - h) * 60 * 60 * 1000);
    // Peak during business hours
    const hourOfDay = hour.getHours();
    const baseCount = 5 + Math.floor(Math.random() * 20);
    const hourMultiplier = hourOfDay >= 9 && hourOfDay <= 17 ? 2 : 0.5;
    
    hourlyUsage.push({
      timestamp: hour.toISOString().slice(0, 13),
      count: Math.floor(baseCount * hourMultiplier),
    });
  }
  
  return {
    keyId: `key_demo_${keyPrefix}`,
    keyPrefix,
    tier: 'free',
    period: {
      start: startDate.toISOString(),
      end: now.toISOString(),
    },
    summary: {
      totalRequests,
      uniqueDays: days - 2,
      avgRequestsPerDay: Math.round(totalRequests / days),
      peakHour: { hour: 14, count: 45 },
      rateLimitHits: 3,
      quotaUsage: { used: 67, limit: 100, percentage: 67 },
    },
    timeSeries: {
      daily: dailyUsage,
      hourly: hourlyUsage,
    },
    endpoints: [
      { endpoint: '/api/news', count: Math.floor(totalRequests * 0.4) },
      { endpoint: '/api/trending', count: Math.floor(totalRequests * 0.25) },
      { endpoint: '/api/market', count: Math.floor(totalRequests * 0.15) },
      { endpoint: '/api/search', count: Math.floor(totalRequests * 0.1) },
      { endpoint: '/api/sentiment', count: Math.floor(totalRequests * 0.1) },
    ],
    errors: {
      total: 12,
      byStatus: { 429: 8, 500: 3, 400: 1 },
    },
    insights: [
      '📊 Most used endpoint: /api/news (40% of requests)',
      '⚠️ You hit rate limits 8 times. Consider implementing request throttling.',
      '💡 Peak usage is around 2 PM. Consider caching during this time.',
      '📈 Usage increased 15% compared to last week.',
    ],
  };
}
