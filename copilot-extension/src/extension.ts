/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import * as vscode from 'vscode';

const API_BASE = 'https://cryptocurrency.cv';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NewsArticle {
  title: string;
  source: string;
  link: string;
  timeAgo: string;
  description?: string;
  sentiment?: string;
  category?: string;
}

interface PriceInfo {
  usd: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
}

interface GasPrice {
  slow: number;
  standard: number;
  fast: number;
  usdSlow?: number;
  usdStandard?: number;
  usdFast?: number;
}

interface FearGreedData {
  value: number;
  classification: string;
  timestamp?: string;
  previous?: { value: number; classification: string };
}

interface GlossaryTerm {
  term: string;
  definition: string;
  category?: string;
  relatedTerms?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getApiBase(): string {
  const config = vscode.workspace.getConfiguration('crypto');
  return config.get<string>('apiUrl') || API_BASE;
}

async function fetchAPI<T = any>(endpoint: string, token?: vscode.CancellationToken): Promise<T> {
  const baseUrl = getApiBase();
  const url = `${baseUrl}${endpoint}`;

  const controller = new AbortController();
  token?.onCancellationRequested(() => controller.abort());

  const response = await fetch(url, { signal: controller.signal });
  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

function formatArticles(articles: NewsArticle[]): string {
  if (articles.length === 0) return '*No articles found.*';
  return articles
    .map((a, i) => {
      const sentiment =
        a.sentiment === 'bullish' ? '🟢' : a.sentiment === 'bearish' ? '🔴' : '⚪';
      const desc = a.description ? `\n   > ${a.description.slice(0, 120)}…` : '';
      return `${i + 1}. ${sentiment} **${a.title}**${desc}\n   📰 ${a.source} • ${a.timeAgo}\n   🔗 [Read more](${a.link})`;
    })
    .join('\n\n');
}

// ---------------------------------------------------------------------------
// Command handlers
// ---------------------------------------------------------------------------

async function handleNews(
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  stream.markdown('📰 **Latest Crypto News**\n\n');
  stream.progress('Fetching latest news…');

  const data = await fetchAPI<{ articles: NewsArticle[] }>('/api/news?limit=10', token);
  const articles = data.articles || [];

  stream.markdown(formatArticles(articles));
  stream.markdown('\n\n---\n*Source: [cryptocurrency.cv](https://cryptocurrency.cv)*');
  return { metadata: { command: 'news' } };
}

async function handlePrice(
  query: string,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  const coin = query.trim().toLowerCase() || 'bitcoin';
  stream.markdown(`💰 **Price: ${coin.charAt(0).toUpperCase() + coin.slice(1)}**\n\n`);
  stream.progress(`Looking up ${coin} price…`);

  const data = await fetchAPI<{ prices: Record<string, PriceInfo> }>(
    `/api/prices?coin=${encodeURIComponent(coin)}`,
    token,
  );
  const prices = data.prices || {};

  if (Object.keys(prices).length === 0) {
    stream.markdown(`*Could not find price data for "${coin}".*`);
    return { metadata: { command: 'price' } };
  }

  stream.markdown('| Coin | Price | 24h Change | Market Cap | Volume (24h) |\n');
  stream.markdown('|------|-------|------------|------------|-------------|\n');

  for (const [symbol, info] of Object.entries(prices).slice(0, 10)) {
    const changeEmoji = info.change24h > 0 ? '📈' : info.change24h < 0 ? '📉' : '➡️';
    const cap = info.marketCap ? `$${(info.marketCap / 1e9).toFixed(2)}B` : '—';
    const vol = info.volume24h ? `$${(info.volume24h / 1e9).toFixed(2)}B` : '—';
    stream.markdown(
      `| ${symbol.toUpperCase()} | $${info.usd?.toLocaleString() ?? 'N/A'} | ${changeEmoji} ${info.change24h?.toFixed(2) ?? 0}% | ${cap} | ${vol} |\n`,
    );
  }

  stream.markdown('\n\n---\n*Source: [cryptocurrency.cv](https://cryptocurrency.cv)*');
  return { metadata: { command: 'price' } };
}

async function handleMarket(
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  stream.markdown('📊 **Market Overview**\n\n');
  stream.progress('Loading market data…');

  const [sentimentData, priceData] = await Promise.all([
    fetchAPI<{ market: { score: number; label: string; bullish: number; bearish: number; neutral: number } }>(
      '/api/sentiment',
      token,
    ),
    fetchAPI<{ prices: Record<string, PriceInfo> }>('/api/prices?limit=5', token),
  ]);

  const market = sentimentData.market;
  const emoji = market.score > 60 ? '🟢' : market.score < 40 ? '🔴' : '🟡';

  stream.markdown(`### Sentiment\n`);
  stream.markdown(`**Overall:** ${emoji} ${market.label} (${market.score}/100)\n\n`);
  stream.markdown(`- 🟢 Bullish: ${market.bullish}%\n`);
  stream.markdown(`- 🔴 Bearish: ${market.bearish}%\n`);
  stream.markdown(`- ⚪ Neutral: ${market.neutral}%\n\n`);

  const prices = priceData.prices || {};
  if (Object.keys(prices).length > 0) {
    stream.markdown('### Top Coins\n\n');
    stream.markdown('| Coin | Price | 24h |\n|------|-------|-----|\n');
    for (const [symbol, info] of Object.entries(prices).slice(0, 5)) {
      const arrow = info.change24h > 0 ? '📈' : info.change24h < 0 ? '📉' : '➡️';
      stream.markdown(`| ${symbol.toUpperCase()} | $${info.usd?.toLocaleString() ?? 'N/A'} | ${arrow} ${info.change24h?.toFixed(2) ?? 0}% |\n`);
    }
  }

  stream.markdown('\n\n---\n*Source: [cryptocurrency.cv](https://cryptocurrency.cv)*');
  return { metadata: { command: 'market' } };
}

async function handleSearch(
  query: string,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  if (!query) {
    stream.markdown('⚠️ Please provide a search term, e.g. `/search bitcoin ETF`');
    return { metadata: { command: 'search' } };
  }

  stream.markdown(`🔍 **Search: "${query}"**\n\n`);
  stream.progress(`Searching for "${query}"…`);

  const data = await fetchAPI<{ articles: NewsArticle[]; total?: number }>(
    `/api/news?search=${encodeURIComponent(query)}&limit=10`,
    token,
  );
  const articles = data.articles || [];

  if (articles.length === 0) {
    stream.markdown(`*No articles found for "${query}".*`);
  } else {
    stream.markdown(`Found **${data.total ?? articles.length}** results:\n\n`);
    stream.markdown(formatArticles(articles));
  }

  stream.markdown('\n\n---\n*Source: [cryptocurrency.cv](https://cryptocurrency.cv)*');
  return { metadata: { command: 'search' } };
}

async function handleGas(
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  stream.markdown('⛽ **Ethereum Gas Prices**\n\n');
  stream.progress('Fetching gas prices…');

  const data = await fetchAPI<{ gas: GasPrice }>('/api/gas', token);
  const gas = data.gas || ({} as GasPrice);

  stream.markdown('| Speed | Gwei | Est. USD |\n');
  stream.markdown('|-------|------|----------|\n');
  stream.markdown(`| 🐢 Slow | ${gas.slow ?? '—'} gwei | ${gas.usdSlow ? '$' + gas.usdSlow.toFixed(2) : '—'} |\n`);
  stream.markdown(`| 🚶 Standard | ${gas.standard ?? '—'} gwei | ${gas.usdStandard ? '$' + gas.usdStandard.toFixed(2) : '—'} |\n`);
  stream.markdown(`| 🚀 Fast | ${gas.fast ?? '—'} gwei | ${gas.usdFast ? '$' + gas.usdFast.toFixed(2) : '—'} |\n`);

  stream.markdown('\n\n---\n*Source: [cryptocurrency.cv](https://cryptocurrency.cv)*');
  return { metadata: { command: 'gas' } };
}

async function handleFearGreed(
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  stream.markdown('😱 **Fear & Greed Index**\n\n');
  stream.progress('Fetching index…');

  const data = await fetchAPI<FearGreedData>('/api/fear-greed', token);

  const value = data.value ?? 50;
  const label = data.classification || 'Neutral';

  let emoji = '😐';
  if (value < 25) emoji = '😱';
  else if (value < 40) emoji = '😨';
  else if (value < 60) emoji = '😐';
  else if (value < 75) emoji = '😀';
  else emoji = '🤑';

  stream.markdown(`**Current:** ${emoji} **${value}** — ${label}\n\n`);
  stream.markdown(
    `\`${'█'.repeat(Math.floor(value / 5))}${'░'.repeat(20 - Math.floor(value / 5))}\` ${value}/100\n\n`,
  );

  if (data.previous) {
    const prev = data.previous;
    const dir = prev.value < value ? '⬆️' : prev.value > value ? '⬇️' : '➡️';
    stream.markdown(`**Previous:** ${prev.value} — ${prev.classification} ${dir}\n\n`);
  }

  stream.markdown(`*Updated: ${data.timestamp || 'Recently'}*\n`);
  stream.markdown('\n---\n*Source: [cryptocurrency.cv](https://cryptocurrency.cv)*');
  return { metadata: { command: 'fear-greed' } };
}

async function handleExplain(
  term: string,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  if (!term) {
    stream.markdown('⚠️ Please provide a term to explain, e.g. `/explain DeFi`');
    return { metadata: { command: 'explain' } };
  }

  stream.markdown(`📖 **Explain: ${term}**\n\n`);
  stream.progress(`Looking up "${term}"…`);

  const data = await fetchAPI<{ term: GlossaryTerm }>(
    `/api/glossary?term=${encodeURIComponent(term)}`,
    token,
  );
  const entry = data.term;

  if (!entry) {
    stream.markdown(`*No glossary entry found for "${term}".*`);
    return { metadata: { command: 'explain' } };
  }

  stream.markdown(`### ${entry.term}\n\n`);
  stream.markdown(`${entry.definition}\n\n`);
  if (entry.category) {
    stream.markdown(`**Category:** ${entry.category}\n\n`);
  }
  if (entry.relatedTerms && entry.relatedTerms.length > 0) {
    stream.markdown(`**Related:** ${entry.relatedTerms.join(', ')}\n`);
  }

  stream.markdown('\n---\n*Source: [cryptocurrency.cv](https://cryptocurrency.cv)*');
  return { metadata: { command: 'explain' } };
}

// ---------------------------------------------------------------------------
// Chat participant
// ---------------------------------------------------------------------------

const chatHandler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> => {
  const command = request.command;
  const query = request.prompt.trim();

  try {
    switch (command) {
      case 'news':
        return await handleNews(stream, token);
      case 'price':
        return await handlePrice(query, stream, token);
      case 'market':
        return await handleMarket(stream, token);
      case 'search':
        return await handleSearch(query, stream, token);
      case 'gas':
        return await handleGas(stream, token);
      case 'fear-greed':
        return await handleFearGreed(stream, token);
      case 'explain':
        return await handleExplain(query, stream, token);
      default:
        // No command — treat prompt as a search if text is present
        if (query) {
          return await handleSearch(query, stream, token);
        }
        // Show help
        stream.markdown('👋 **Welcome to @crypto!**\n\n');
        stream.markdown('Available commands:\n\n');
        stream.markdown('| Command | Description |\n');
        stream.markdown('|---------|-------------|\n');
        stream.markdown('| `/news` | Latest crypto news |\n');
        stream.markdown('| `/price <coin>` | Current price (e.g. `/price bitcoin`) |\n');
        stream.markdown('| `/market` | Market overview & sentiment |\n');
        stream.markdown('| `/search <query>` | Search news articles |\n');
        stream.markdown('| `/gas` | Ethereum gas prices |\n');
        stream.markdown('| `/fear-greed` | Fear & Greed Index |\n');
        stream.markdown('| `/explain <term>` | Explain a crypto term |\n');
        stream.markdown('\nOr just type a question and I\'ll search for relevant news.\n');
        return { metadata: { command: 'help' } };
    }
  } catch (error: any) {
    const message = error.name === 'AbortError'
      ? 'Request was cancelled.'
      : error.message || 'An unknown error occurred.';
    stream.markdown(`\n\n❌ **Error:** ${message}\n\nPlease try again later.`);
    return { metadata: { command: command ?? 'unknown', error: true } };
  }
};

// ---------------------------------------------------------------------------
// Extension lifecycle
// ---------------------------------------------------------------------------

export function activate(context: vscode.ExtensionContext) {
  // Register @crypto chat participant
  const participant = vscode.chat.createChatParticipant('crypto-news.crypto', chatHandler);
  participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.png');
  context.subscriptions.push(participant);

  // Refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand('crypto.refresh', async () => {
      vscode.window.showInformationMessage('Crypto data refreshed!');
    }),
  );

  // Dashboard command
  context.subscriptions.push(
    vscode.commands.registerCommand('crypto.openDashboard', async () => {
      const panel = vscode.window.createWebviewPanel(
        'cryptoDashboard',
        'Crypto Dashboard',
        vscode.ViewColumn.One,
        { enableScripts: true },
      );
      panel.webview.html = getDashboardHTML();
    }),
  );

  console.log('Crypto News Copilot extension activated!');
}

function getDashboardHTML(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; padding: 20px; background: #1e1e1e; color: #fff; }
    h1 { color: #ffffff; }
    .card { background: #2d2d2d; border-radius: 8px; padding: 16px; margin: 12px 0; }
    .bullish { color: #00ff88; }
    .bearish { color: #ff4444; }
    a { color: #58a6ff; }
    code { background: #3d3d3d; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>📰 Crypto Dashboard</h1>
  <div class="card">
    <p>Use <code>@crypto</code> in Copilot Chat to get started!</p>
    <p>Available commands:</p>
    <ul>
      <li><code>/news</code> — Latest crypto news</li>
      <li><code>/price &lt;coin&gt;</code> — Current price for a coin</li>
      <li><code>/market</code> — Market overview &amp; sentiment</li>
      <li><code>/search &lt;query&gt;</code> — Search news articles</li>
      <li><code>/gas</code> — Ethereum gas prices</li>
      <li><code>/fear-greed</code> — Fear &amp; Greed Index</li>
      <li><code>/explain &lt;term&gt;</code> — Explain a crypto term</li>
    </ul>
  </div>
  <div class="card">
    <p>Powered by <a href="https://cryptocurrency.cv">Free Crypto News API</a></p>
  </div>
</body>
</html>`;
}

export function deactivate() {}
