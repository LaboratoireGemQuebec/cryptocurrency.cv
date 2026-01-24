import { NextRequest, NextResponse } from 'next/server';
import { generateGroqResponse } from '@/lib/groq';
import { fetchNews } from '@/lib/crypto-news';
import { getTopCoins, getGlobalData } from '@/lib/market-data';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Gather context data
    const [news, coins, globalData] = await Promise.all([
      fetchNews().then(n => n.slice(0, 10)),
      getTopCoins(20),
      getGlobalData()
    ]);

    // Build context for AI
    const context = `
CURRENT MARKET DATA (${new Date().toISOString()}):
- Total Market Cap: $${((globalData?.total_market_cap?.usd || 0) / 1e12).toFixed(2)}T
- 24h Volume: $${((globalData?.total_volume?.usd || 0) / 1e9).toFixed(2)}B
- BTC Dominance: ${globalData?.market_cap_percentage?.btc?.toFixed(1) || 'N/A'}%

TOP COINS:
${coins.slice(0, 10).map(c => `- ${c.name} (${c.symbol}): $${c.current_price?.toLocaleString()} (${c.price_change_percentage_24h > 0 ? '+' : ''}${c.price_change_percentage_24h?.toFixed(2)}%)`).join('\n')}

RECENT NEWS HEADLINES:
${news.map(n => `- ${n.title} (${n.source})`).join('\n')}
`;

    const prompt = `You are The Oracle, an AI crypto intelligence assistant with access to real-time market data and news.

${context}

User Query: ${query}

Provide a helpful, accurate response based on the data above. If the query is about specific data points, cite them. If asking for predictions, be clear these are opinions not financial advice. Keep response concise but informative.`;

    const response = await generateGroqResponse(prompt);
    
    return NextResponse.json({
      query,
      response,
      context_used: {
        news_articles: news.length,
        coins_analyzed: coins.length,
        market_data: !!globalData
      },
      timestamp: new Date().toISOString(),
      disclaimer: 'This is AI-generated analysis, not financial advice.'
    });
  } catch (error) {
    console.error('Oracle error:', error);
    return NextResponse.json({ error: 'Oracle query failed' }, { status: 500 });
  }
}
