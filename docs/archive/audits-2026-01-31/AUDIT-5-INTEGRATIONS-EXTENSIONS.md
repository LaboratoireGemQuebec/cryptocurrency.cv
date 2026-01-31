# AUDIT-5: Integrations, SDKs & Extensions

> Comprehensive audit of all integrations, SDKs, extensions, and external tooling for the Free Crypto News platform.

**Audit Date:** January 31, 2026  
**Auditor:** Agent 5 (Integrations Specialist)  
**Scope:** `/mcp`, `/sdk`, `/cli`, `/extension`, `/widget`, `/alfred`, `/raycast`, `/chatgpt`, `/examples`, `/postman`, `/e2e`, root configs

---

## Table of Contents

1. [MCP Server (Model Context Protocol)](#1-mcp-server-model-context-protocol)
2. [Official SDKs](#2-official-sdks)
3. [CLI Tool](#3-cli-tool)
4. [Browser Extension](#4-browser-extension)
5. [Embeddable Widgets](#5-embeddable-widgets)
6. [Alfred Workflow](#6-alfred-workflow)
7. [Raycast Extension](#7-raycast-extension)
8. [ChatGPT Plugin/Action](#8-chatgpt-pluginaction)
9. [Integration Examples](#9-integration-examples)
10. [Postman Collection](#10-postman-collection)
11. [E2E Tests](#11-e2e-tests)
12. [Project Configuration](#12-project-configuration)
13. [Deployment](#13-deployment)
14. [Integration Statistics](#14-integration-statistics)

---

## 1. MCP Server (Model Context Protocol)

**Location:** `/mcp/`

The MCP server enables AI assistants like Claude Desktop and ChatGPT Developer Mode to access real-time crypto news.

### Package Info

| Property     | Value                            |
| ------------ | -------------------------------- |
| Package Name | `@nirholas/free-crypto-news-mcp` |
| Version      | 1.0.0                            |
| License      | MIT                              |
| Main Entry   | `index.js`                       |
| Type         | ES Module                        |

### Available Tools (14 Total)

| Tool Name               | Description                         | Parameters                            |
| ----------------------- | ----------------------------------- | ------------------------------------- |
| `get_crypto_news`       | Get latest news from all 7 sources  | `limit` (1-50), `source`              |
| `search_crypto_news`    | Search news by keywords             | `keywords` (required), `limit` (1-30) |
| `get_defi_news`         | Get DeFi-specific news              | `limit` (1-30)                        |
| `get_bitcoin_news`      | Get Bitcoin-specific news           | `limit` (1-30)                        |
| `get_breaking_news`     | Get news from last 2 hours          | `limit` (1-20)                        |
| `get_news_sources`      | List all available sources          | -                                     |
| `get_api_health`        | Check API and feed health           | -                                     |
| `get_trending_topics`   | Get trending topics with sentiment  | `limit` (1-20), `hours` (1-72)        |
| `get_crypto_stats`      | Get analytics and statistics        | -                                     |
| `analyze_news`          | News with sentiment analysis        | `limit`, `topic`, `sentiment`         |
| `get_archive`           | Query historical news               | `date`, `query`, `limit`              |
| `get_archive_stats`     | Archive statistics                  | -                                     |
| `find_original_sources` | Trace news origins                  | `query`, `category`, `limit`          |
| `get_portfolio_news`    | News for specific coins with prices | `coins`, `limit`, `include_prices`    |

### Transport Modes

#### stdio Mode (Claude Desktop)

```bash
# Start in stdio mode (default)
node index.js
```

#### HTTP/SSE Mode (ChatGPT Developer Mode)

```bash
# Start HTTP server
node http-server.js
# or
npm run start:http

# Custom port
PORT=3001 npm run start:http
```

### Installation Instructions

#### Claude Desktop Setup

1. Clone and install:

```bash
git clone https://github.com/nirholas/free-crypto-news.git
cd free-crypto-news/mcp
npm install
```

2. Add to Claude Desktop config:

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "crypto-news": {
      "command": "node",
      "args": ["/path/to/free-crypto-news/mcp/index.js"]
    }
  }
}
```

3. Restart Claude Desktop

#### ChatGPT Developer Mode Setup

1. Deploy HTTP server or use live endpoint: `https://plugins.support/sse`
2. In ChatGPT, create app with SSE protocol
3. Set endpoint to your deployment URL + `/sse`

### Configuration Options

| Environment Variable | Default                          | Description      |
| -------------------- | -------------------------------- | ---------------- |
| `PORT`               | 3001                             | HTTP server port |
| `API_BASE`           | `https://news-crypto.vercel.app` | Backend API URL  |

### API Endpoints (HTTP Mode)

| Endpoint   | Method | Description                 |
| ---------- | ------ | --------------------------- |
| `/health`  | GET    | Health check                |
| `/sse`     | GET    | Server-Sent Events for MCP  |
| `/message` | POST   | Message endpoint (with SSE) |
| `/mcp`     | POST   | Single request/response     |

### Dependencies

```json
{
  "@modelcontextprotocol/sdk": "^1.0.0"
}
```

---

## 2. Official SDKs

**Location:** `/sdk/`

8 official SDKs supporting multiple languages and frameworks.

### 2.1 TypeScript SDK

**Location:** `/sdk/typescript/`

| Property     | Value                   |
| ------------ | ----------------------- |
| Package Name | `@nirholas/crypto-news` |
| Version      | 1.0.0                   |
| Type         | Full TypeScript support |

#### Available Methods

| Method                                        | Description            | Returns             |
| --------------------------------------------- | ---------------------- | ------------------- |
| `getLatest(limit?, source?)`                  | Get latest news        | `NewsArticle[]`     |
| `search(keywords, limit?)`                    | Search news            | `NewsArticle[]`     |
| `getDefi(limit?)`                             | Get DeFi news          | `NewsArticle[]`     |
| `getBitcoin(limit?)`                          | Get Bitcoin news       | `NewsArticle[]`     |
| `getBreaking(limit?)`                         | Get breaking news      | `NewsArticle[]`     |
| `getSources()`                                | List sources           | `SourceInfo[]`      |
| `getTrending(limit?, hours?)`                 | Get trending topics    | `TrendingResponse`  |
| `getStats()`                                  | Get statistics         | `StatsResponse`     |
| `getHealth()`                                 | Health check           | `HealthStatus`      |
| `analyze(limit?, topic?, sentiment?)`         | Analyze with sentiment | `AnalyzeResponse`   |
| `getArchive(date?, query?, limit?)`           | Historical news        | `ArchiveResponse`   |
| `getOrigins(query?, category?, limit?)`       | Find original sources  | `OriginsResponse`   |
| `getPortfolio(coins, limit?, includePrices?)` | Portfolio news         | `PortfolioResponse` |

#### Type Definitions

- `NewsArticle` - Article with title, link, description, pubDate, source, category, timeAgo
- `NewsResponse` - Response with articles array and metadata
- `SourceInfo` - Source details (key, name, url, category, status)
- `HealthStatus` - API health with source-level details
- `TrendingTopic` - Topic with count, sentiment, articles
- `AnalyzedArticle` - Article with topics and sentiment analysis

#### Usage Example

```typescript
import { CryptoNews } from "@nirholas/crypto-news";

const client = new CryptoNews();
const articles = await client.getLatest(10);
const trending = await client.getTrending(5, 24);
```

### 2.2 Python SDK

**Location:** `/sdk/python/`

| Property     | Value              |
| ------------ | ------------------ |
| File         | `crypto_news.py`   |
| Dependencies | None (stdlib only) |

#### Available Methods

| Method                                        | Description        |
| --------------------------------------------- | ------------------ |
| `get_latest(limit, source)`                   | Get latest news    |
| `search(keywords, limit)`                     | Search news        |
| `get_defi(limit)`                             | DeFi news          |
| `get_bitcoin(limit)`                          | Bitcoin news       |
| `get_breaking(limit)`                         | Breaking news      |
| `get_sources()`                               | List sources       |
| `get_trending(limit, hours)`                  | Trending topics    |
| `get_stats()`                                 | Statistics         |
| `get_health()`                                | Health check       |
| `analyze(limit, topic, sentiment)`            | Sentiment analysis |
| `get_archive(date, query, limit)`             | Historical news    |
| `get_origins(query, category, limit)`         | Original sources   |
| `get_portfolio(coins, limit, include_prices)` | Portfolio news     |

#### Convenience Functions

```python
from crypto_news import get_crypto_news, search_crypto_news, get_trending_topics

# Quick access functions
articles = get_crypto_news(10)
results = search_crypto_news("ethereum", 5)
trending = get_trending_topics(10)
```

#### Usage Example

```python
from crypto_news import CryptoNews

news = CryptoNews()
articles = news.get_latest(limit=10)
for article in articles:
    print(f"{article['title']} - {article['source']}")
```

### 2.3 JavaScript SDK

**Location:** `/sdk/javascript/`

| Property      | Value             |
| ------------- | ----------------- |
| File          | `crypto-news.js`  |
| Compatibility | Node.js & Browser |

#### Methods

Same as TypeScript SDK but without type definitions.

#### Usage Example

```javascript
import { CryptoNews } from "./crypto-news.js";

const news = new CryptoNews();
const articles = await news.getLatest(10);
```

### 2.4 Go SDK

**Location:** `/sdk/go/`

| Property | Value             |
| -------- | ----------------- |
| Package  | `cryptonews`      |
| Module   | `go.mod` included |

#### Types

- `Client` - API client
- `Article` - News article
- `NewsResponse` - API response
- `SourceInfo` - Source details
- `TrendingTopic` - Trending item
- `HealthResponse` - Health status

#### Available Methods

| Method                               | Description      |
| ------------------------------------ | ---------------- |
| `GetLatest(limit)`                   | Get latest news  |
| `GetLatestFromSource(limit, source)` | Filter by source |
| `Search(keywords, limit)`            | Search news      |
| `GetDeFi(limit)`                     | DeFi news        |
| `GetBitcoin(limit)`                  | Bitcoin news     |
| `GetBreaking(limit)`                 | Breaking news    |
| `GetSources()`                       | List sources     |
| `GetTrending(limit, hours)`          | Trending topics  |
| `GetHealth()`                        | Health check     |

#### Usage Example

```go
package main

import "github.com/nirholas/free-crypto-news/sdk/go"

func main() {
    client := cryptonews.NewClient()
    articles, err := client.GetLatest(10)
    if err != nil {
        log.Fatal(err)
    }
    for _, article := range articles {
        fmt.Printf("%s - %s\n", article.Title, article.Source)
    }
}
```

### 2.5 PHP SDK

**Location:** `/sdk/php/`

| Property    | Value            |
| ----------- | ---------------- |
| File        | `CryptoNews.php` |
| PHP Version | 7.4+             |

#### Methods

| Method                             | Description        |
| ---------------------------------- | ------------------ |
| `getLatest(limit, source)`         | Get latest news    |
| `getLatestWithMeta(limit, source)` | With full metadata |
| `search(keywords, limit)`          | Search news        |
| `getDefi(limit)`                   | DeFi news          |
| `getBitcoin(limit)`                | Bitcoin news       |
| `getBreaking(limit)`               | Breaking news      |
| `getTrending(limit, hours)`        | Trending topics    |
| `getSources()`                     | List sources       |
| `getHealth()`                      | Health check       |
| `getStats()`                       | Statistics         |
| `analyze(limit, topic, sentiment)` | Sentiment analysis |
| `getArchive(date, query, limit)`   | Historical news    |

#### Usage Example

```php
require_once 'CryptoNews.php';

$news = new CryptoNews();
$articles = $news->getLatest(10);

foreach ($articles as $article) {
    echo $article['title'] . ' - ' . $article['source'] . "\n";
}
```

### 2.6 Ruby SDK

**Location:** `/sdk/ruby/`

| Property | Value     |
| -------- | --------- |
| Gem Name | `fcn-sdk` |
| Version  | 0.2.0     |
| Module   | `FCN`     |

#### Features

- Automatic retries with exponential backoff
- Rate limit handling
- Configuration management
- Error classes (`APIError`, `RateLimitError`, `AuthenticationError`)

#### Usage Example

```ruby
require 'fcn'

client = FCN::Client.new
news = client.get_news(limit: 10)
news['articles'].each { |a| puts a['title'] }
```

### 2.7 Rust SDK

**Location:** `/sdk/rust/`

| Property   | Value                           |
| ---------- | ------------------------------- |
| Crate Name | `fcn-sdk`                       |
| Features   | async/await, WebSocket, retries |

#### Features

- Built on Tokio for async operations
- WebSocket streaming support
- Automatic exponential backoff retries
- Built-in rate limit handling
- Full Rust type safety with serde

#### Types

- `Article` - News article
- `NewsResponse` - API response
- `NewsFilter` - Query filter
- `Coin` - Market data
- `TrendingItem` - Trending topic
- `DigestResponse` - AI digest
- `TaxReport` - Tax reporting

#### Usage Example

```rust
use fcn_sdk::{Client, NewsFilter};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new(None)?;

    let news = client.get_news(Some(NewsFilter {
        limit: Some(10),
        ticker: Some("BTC".to_string()),
        ..Default::default()
    })).await?;

    for article in news.articles {
        println!("{}: {}", article.source, article.title);
    }
    Ok(())
}
```

### 2.8 React SDK

**Location:** `/sdk/react/`

| Property      | Value                         |
| ------------- | ----------------------------- |
| Package Name  | `@nirholas/react-crypto-news` |
| React Version | 18+                           |

#### Components

##### `<CryptoNews />`

| Prop              | Type                                          | Default  | Description       |
| ----------------- | --------------------------------------------- | -------- | ----------------- |
| `variant`         | `'list' \| 'cards' \| 'compact' \| 'ticker'`  | `'list'` | Display style     |
| `limit`           | `number`                                      | `10`     | Max articles      |
| `endpoint`        | `'news' \| 'bitcoin' \| 'defi' \| 'breaking'` | `'news'` | API endpoint      |
| `source`          | `string`                                      | -        | Filter by source  |
| `showSource`      | `boolean`                                     | `true`   | Show source badge |
| `showTime`        | `boolean`                                     | `true`   | Show time ago     |
| `showDescription` | `boolean`                                     | `true`   | Show description  |
| `refreshInterval` | `number`                                      | `0`      | Auto-refresh (ms) |
| `theme`           | `'light' \| 'dark' \| 'auto'`                 | `'auto'` | Theme             |
| `onArticleClick`  | `function`                                    | -        | Click handler     |
| `renderArticle`   | `function`                                    | -        | Custom renderer   |

#### Hooks

##### `useCryptoNews(options)`

```tsx
const { articles, loading, error, refresh, lastUpdated } = useCryptoNews({
  endpoint: "news",
  limit: 10,
  query: "bitcoin",
  source: "coindesk",
  refreshInterval: 60000,
  baseUrl: "https://news-crypto.vercel.app",
});
```

#### Usage Example

```tsx
import { CryptoNews, useCryptoNews } from "@nirholas/react-crypto-news";

// Simple usage
<CryptoNews limit={10} theme="dark" />;

// With hook for custom UI
const { articles, loading } = useCryptoNews({ limit: 5 });
```

---

## 3. CLI Tool

**Location:** `/cli/`

Command-line interface for accessing crypto news from the terminal.

### Package Info

| Property     | Value             |
| ------------ | ----------------- |
| Package Name | `crypto-news-cli` |
| Version      | 1.0.0             |
| Binary       | `crypto-news`     |
| Node Version | >=14.0.0          |

### Installation

```bash
# Global install
npm install -g crypto-news-cli

# Or run directly
npx crypto-news
```

### Available Commands

| Command                  | Description           |
| ------------------------ | --------------------- |
| `crypto-news`            | Latest news (default) |
| `crypto-news --bitcoin`  | Bitcoin news only     |
| `crypto-news --defi`     | DeFi news only        |
| `crypto-news --breaking` | Breaking news         |
| `crypto-news --trending` | Trending topics       |
| `crypto-news --sources`  | List all sources      |

### Options

| Flag               | Description                      |
| ------------------ | -------------------------------- |
| `-h, --help`       | Show help                        |
| `-n, --limit <n>`  | Number of articles (default: 10) |
| `-s, --search <q>` | Search for keywords              |
| `--json`           | Output as JSON                   |

### Usage Examples

```bash
# Get latest news
crypto-news

# Top 5 articles
crypto-news -n 5

# Search for ethereum
crypto-news -s "ethereum ETF"

# Bitcoin news as JSON
crypto-news --bitcoin --json

# Breaking news
crypto-news --breaking
```

### Output Format

- Color-coded by source
- Title with source and time ago
- Truncated descriptions (100 chars)
- Breaking news with 🔴 indicator

---

## 4. Browser Extension

**Location:** `/extension/`

Chrome/Firefox extension for real-time crypto news in the browser toolbar.

### Manifest Info

| Property         | Value            |
| ---------------- | ---------------- |
| Manifest Version | 3                |
| Name             | Free Crypto News |
| Version          | 1.0.0            |

### Features

- 📰 **Latest News** - Real-time crypto news from 7 sources
- 🔴 **Breaking News** - Urgent news alerts
- ₿ **Bitcoin Tab** - Bitcoin-specific news
- 🔷 **DeFi Tab** - DeFi-specific news
- 🔔 **Notifications** - Optional breaking news alerts
- 💾 **Offline Cache** - Browse previously loaded news offline

### Permissions

| Permission         | Reason                        |
| ------------------ | ----------------------------- |
| `storage`          | Cache news for offline access |
| `alarms`           | Periodic background refresh   |
| `host_permissions` | Fetch from API only           |

### Files

| File            | Purpose            |
| --------------- | ------------------ |
| `manifest.json` | Extension manifest |
| `popup.html`    | Popup UI           |
| `popup.js`      | Popup logic        |
| `background.js` | Service worker     |
| `options.html`  | Settings page      |
| `options.js`    | Settings logic     |

### Installation

#### Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder

#### Firefox (Coming Soon)

Uses Manifest V3 which Firefox now supports.

### Caching

- News cached for 5 minutes
- Shows "Updated X minutes ago" indicator
- Works offline with cached data

---

## 5. Embeddable Widgets

**Location:** `/widget/`

Drop-in widgets for any website.

### 5.1 Main Widget

**File:** `crypto-news-widget.html`

Self-contained HTML widget with embedded CSS and JavaScript.

#### Features

- Dark theme with gradient background
- Tab navigation (Latest, Breaking, DeFi, Bitcoin)
- Auto-refresh every 5 minutes
- Responsive design
- Powered by footer link

#### Embedding

```html
<iframe
  src="https://news-crypto.vercel.app/widget/crypto-news-widget.html"
  width="400"
  height="500"
  frameborder="0"
>
</iframe>
```

### 5.2 Ticker Widget

**File:** `ticker.js`

Scrolling news ticker for website headers/footers.

#### Quick Start

```html
<div id="crypto-ticker"></div>
<script src="https://news-crypto.vercel.app/widget/ticker.js"></script>
```

#### Configuration

```html
<div
  id="crypto-ticker"
  data-speed="30"
  data-limit="20"
  data-category="all"
  data-theme="dark"
></div>
```

| Option          | Default | Description                      |
| --------------- | ------- | -------------------------------- |
| `data-speed`    | `30`    | Scroll speed (lower = faster)    |
| `data-limit`    | `15`    | Number of headlines              |
| `data-category` | `all`   | Filter: `all`, `bitcoin`, `defi` |
| `data-theme`    | `dark`  | Theme: `dark`, `light`           |

#### Features

- Auto-scrolling animation
- Pause on hover
- Live indicator
- Source badges
- Light/dark themes

### 5.3 Carousel Widget

**File:** `carousel.js`, `carousel.html`

Rotating featured news carousel.

#### Quick Start

```html
<div id="crypto-carousel"></div>
<script src="https://news-crypto.vercel.app/widget/carousel.js"></script>
```

#### Configuration

| Option          | Default   | Description              |
| --------------- | --------- | ------------------------ |
| `data-limit`    | `5`       | Number of slides         |
| `data-interval` | `5000`    | Auto-advance (ms)        |
| `data-theme`    | `dark`    | Theme                    |
| `data-variant`  | `default` | Style: `default`, `grid` |
| `data-autoplay` | `true`    | Auto-advance slides      |

### Custom Styling

```css
/* Override ticker styles */
.crypto-ticker-container {
  background: #your-color !important;
}

/* Override carousel styles */
.crypto-carousel-container {
  max-width: 800px !important;
}
```

### Self-Hosted Widget

```html
<script>
  window.CRYPTO_NEWS_API = "https://your-instance.vercel.app";
</script>
```

---

## 6. Alfred Workflow

**Location:** `/alfred/`

macOS Alfred workflow for quick crypto news access.

### Files

| File             | Purpose              |
| ---------------- | -------------------- |
| `crypto-news.sh` | Main script          |
| `info.plist`     | Alfred configuration |
| `README.md`      | Documentation        |

### Commands

| Keyword             | Description               |
| ------------------- | ------------------------- |
| `cn`                | Latest crypto news        |
| `cn breaking`       | Breaking news (< 2 hours) |
| `cn bitcoin`        | Bitcoin-specific news     |
| `cn defi`           | DeFi-specific news        |
| `cn search [query]` | Search for topics         |
| `cn trending`       | Trending topics           |

### Actions

| Key       | Action                        |
| --------- | ----------------------------- |
| Enter     | Open article in browser       |
| Cmd+C     | Copy article link             |
| Cmd+Enter | Open on Free Crypto News site |

### Installation

1. Download `Free-Crypto-News.alfredworkflow`
2. Double-click to install in Alfred
3. Use the `cn` keyword

### Requirements

- Alfred 4 or later
- Powerpack license (for workflows)

---

## 7. Raycast Extension

**Location:** `/raycast/`

Raycast extension for macOS power users.

### Package Info

| Property   | Value            |
| ---------- | ---------------- |
| Name       | `crypto-news`    |
| Title      | Free Crypto News |
| Categories | News, Finance    |

### Commands

| Command    | Title           | Description              |
| ---------- | --------------- | ------------------------ |
| `latest`   | Latest News     | Get latest crypto news   |
| `breaking` | Breaking News   | Get breaking crypto news |
| `bitcoin`  | Bitcoin News    | Bitcoin-specific news    |
| `defi`     | DeFi News       | DeFi-specific news       |
| `search`   | Search News     | Search with query        |
| `trending` | Trending Topics | See trending topics      |

### Source Files

| File               | Purpose                 |
| ------------------ | ----------------------- |
| `src/latest.tsx`   | Latest news command     |
| `src/breaking.tsx` | Breaking news command   |
| `src/trending.tsx` | Trending topics command |

### Actions

| Action          | Shortcut    |
| --------------- | ----------- |
| Open in Browser | Enter       |
| Copy Link       | Cmd+C       |
| Copy Title      | Cmd+Shift+C |

### Dependencies

```json
{
  "@raycast/api": "^1.64.0",
  "node-fetch": "^3.3.2"
}
```

### Installation

1. Clone repository
2. Navigate to `raycast/`
3. Run `npm install && npm run dev`

Or search "Free Crypto News" in Raycast Store (coming soon).

---

## 8. ChatGPT Plugin/Action

**Location:** `/chatgpt/`

OpenAPI specification for ChatGPT Custom GPT integration.

### Files

| File           | Purpose                   |
| -------------- | ------------------------- |
| `openapi.yaml` | OpenAPI 3.1 specification |
| `README.md`    | Setup instructions        |

### Available Actions

| Action            | Operation ID      | Description             |
| ----------------- | ----------------- | ----------------------- |
| Get Latest News   | `getLatestNews`   | Latest from all sources |
| Search News       | `searchNews`      | Search by keywords      |
| Get DeFi News     | `getDefiNews`     | DeFi-specific           |
| Get Bitcoin News  | `getBitcoinNews`  | Bitcoin-specific        |
| Get Breaking News | `getBreakingNews` | Last 2 hours            |
| List Sources      | `getSources`      | All sources with status |

### API Schema

#### NewsArticle

```yaml
type: object
properties:
  title: string
  link: string (uri)
  description: string
  pubDate: string (date-time)
  source: string
  sourceKey: string
  category: enum [general, bitcoin, defi]
  timeAgo: string
```

### Setup Instructions

1. Go to ChatGPT → Explore GPTs → Create
2. Click "Configure" → "Actions" → "Create new action"
3. Paste contents of `openapi.yaml`
4. No authentication required
5. Save and test

### Example GPT Instructions

```
You are a crypto news assistant with access to real-time crypto news.

When users ask about crypto news:
1. Use getLatestNews for general news
2. Use searchNews for specific topics
3. Use getDefiNews for DeFi queries
4. Use getBitcoinNews for Bitcoin queries
5. Use getBreakingNews for "what's happening now"
```

---

## 9. Integration Examples

**Location:** `/examples/`

11 complete integration examples across multiple languages and platforms.

### 9.1 AI Analysis (Python)

**File:** `ai-analysis.py`

Demonstrates using AI endpoints for news analysis.

#### Features

- Article summarization
- Sentiment analysis
- Fact extraction

#### Actions Demonstrated

- `summarize` - Short/medium/long summaries
- `sentiment` - Bullish/bearish/neutral with confidence
- `facts` - Key points extraction

```python
result = analyze_article(title, content, "sentiment")
# Returns: sentiment, confidence, marketImpact, affectedAssets, reasoning
```

### 9.2 LangChain Tool (Python)

**File:** `langchain-tool.py`

Use crypto news as a tool in LangChain agents.

#### Tools Defined

- `get_crypto_news` - Latest news
- `search_crypto_news` - Search by keywords
- `get_defi_news` - DeFi news
- `get_bitcoin_news` - Bitcoin news
- `get_breaking_news` - Breaking news

#### Usage

```python
from langchain.agents import AgentExecutor
agent = create_news_agent()
result = agent.invoke({"input": "What's the latest Bitcoin news?"})
```

### 9.3 Discord Bot (JavaScript)

**File:** `discord-bot.js`

Posts crypto news to Discord channels.

#### Features

- Slash command `/news`
- Embedded message format
- Hourly auto-posting
- Color-coded by breaking status

```javascript
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
// Posts breaking news every hour
```

### 9.4 Telegram Bot (Python)

**File:** `telegram-bot.py`

Telegram bot with news commands.

#### Commands

- `/news` - Latest news
- `/defi` - DeFi news
- `/bitcoin` - Bitcoin news
- `/breaking` - Breaking news

```python
from telegram.ext import Application, CommandHandler
app.add_handler(CommandHandler("news", news_command))
```

### 9.5 Telegram Digest Bot (Python)

**File:** `telegram-digest.py`

Advanced Telegram bot with scheduled digests.

#### Features

- `/digest` - Full digest with analysis
- `/subscribe` - Daily digest subscription
- `/unsubscribe` - Unsubscribe
- Inline keyboard navigation
- Markdown formatting

### 9.6 Slack Bot (JavaScript)

**File:** `slack-bot.js`

Posts news to Slack channels via webhooks.

#### Features

- Block Kit message formatting
- Trending topics with sentiment
- Powered by attribution

```javascript
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
// Uses Slack Block Kit for rich formatting
```

### 9.7 Real-Time Stream (JavaScript)

**File:** `realtime-stream.js`

Server-Sent Events (SSE) for live updates.

#### Events

- `connected` - Connection established
- `news` - New articles
- `breaking` - Breaking news alert
- `price` - Price updates
- `heartbeat` - Keep-alive

#### Features

- Auto-reconnect with exponential backoff
- Event handlers for all types
- Works in browser and Node.js

```javascript
const stream = new CryptoNewsStream({
  onNews: (articles) => {
    /* handle news */
  },
  onBreaking: (article) => {
    /* handle breaking */
  },
});
stream.connect();
```

### 9.8 curl Examples (Shell)

**File:** `curl.sh`

Shell script with curl examples.

```bash
# Latest News
curl -s "$API/api/news?limit=3" | jq '.articles[] | {title, source}'

# Search
curl -s "$API/api/search?q=ethereum&limit=3"

# DeFi News
curl -s "$API/api/defi?limit=3"

# Bitcoin News
curl -s "$API/api/bitcoin?limit=3"

# Breaking News
curl -s "$API/api/breaking?limit=3"

# Sources
curl -s "$API/api/sources"
```

### 9.9 x402 Payment Client (Python)

**File:** `x402-client.py`

Demonstrates x402 payment protocol integration.

#### Features

- 402 Payment Required handling
- Payment signature creation
- Wallet integration with eth-account

### 9.10 x402 Payment Client (TypeScript)

**File:** `x402-client.ts`

TypeScript version of x402 payment client.

### 9.11 x402 Payment Client (Go)

**File:** `x402-client.go`

Go version of x402 payment client.

---

## 10. Postman Collection

**Location:** `/postman/`

Complete Postman collection for API testing.

### Files

| File                                           | Purpose             |
| ---------------------------------------------- | ------------------- |
| `Free_Crypto_News_API.postman_collection.json` | Collection          |
| `README.md`                                    | Import instructions |

### Collection Structure

#### News Folder

- Get Latest News
- Search News
- Get DeFi News
- Get Bitcoin News
- Get Breaking News
- Get Trending Topics

#### Meta Folder

- List Sources
- Health Check
- Get Statistics

#### Feeds Folder

- RSS Feed
- Atom Feed
- OPML Export

#### Webhooks Folder

- Webhook Info
- Register Webhook
- Test Webhook Payload

### Variables

| Variable  | Default Value                    |
| --------- | -------------------------------- |
| `baseUrl` | `https://news-crypto.vercel.app` |

### Query Parameters (by endpoint)

#### /api/news

- `limit` - Max articles (1-50)
- `source` - Filter by source
- `from` - Start date (ISO)
- `to` - End date (ISO)
- `page` - Page number
- `per_page` - Items per page

#### /api/search

- `q` - Search keywords
- `limit` - Max results

#### /api/trending

- `limit` - Max topics (1-20)
- `hours` - Time window (1-72)

### Import Instructions

1. Open Postman
2. Click "Import"
3. Select `Free_Crypto_News_API.postman_collection.json`
4. Start testing!

---

## 11. E2E Tests

**Location:** `/e2e/`

End-to-end tests using Playwright.

### Configuration

**File:** `playwright.config.ts`

| Setting        | Value                   |
| -------------- | ----------------------- |
| Test Directory | `./e2e/tests`           |
| Parallel       | Yes                     |
| Retries (CI)   | 2                       |
| Reporter       | HTML                    |
| Base URL       | `http://localhost:3000` |

### Projects (Browsers)

- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Test Files

| File                    | Tests                                  |
| ----------------------- | -------------------------------------- |
| `home.spec.ts`          | Homepage, navigation, articles, search |
| `api.spec.ts`           | API endpoints, responses, filters      |
| `i18n.spec.ts`          | Internationalization                   |
| `exports.spec.ts`       | Export functionality                   |
| `article-slugs.spec.ts` | Article URL slugs                      |
| `orderbook.spec.ts`     | Orderbook feature                      |
| `regulatory.spec.ts`    | Regulatory content                     |
| `tradingview.spec.ts`   | TradingView integration                |
| `x402.spec.ts`          | x402 payment tests                     |

### Test Coverage

#### Homepage Tests

- ✅ Page loads with correct title
- ✅ Header with navigation visible
- ✅ News articles displayed
- ✅ Footer visible
- ✅ Navigation links work

#### Search Tests

- ✅ Search functionality present
- ✅ Search page navigation
- ✅ Search returns results

#### Category Tests

- ✅ Bitcoin category loads
- ✅ DeFi category loads
- ✅ Trending category loads

#### API Tests

- ✅ GET /api/news returns articles
- ✅ Pagination works
- ✅ Source filtering
- ✅ Category filtering
- ✅ Search returns results
- ✅ Empty search handled
- ✅ Sources endpoint
- ✅ Trending endpoint
- ✅ Breaking endpoint

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run in UI mode
npm run test:e2e:ui

# Run headed (visible browser)
npm run test:e2e:headed

# Run specific file
npx playwright test e2e/home.spec.ts

# Run in specific browser
npx playwright test --project=chromium
```

---

## 12. Project Configuration

### 12.1 package.json

| Property     | Value              |
| ------------ | ------------------ |
| Name         | `free-crypto-news` |
| Version      | 1.0.2              |
| License      | MIT                |
| Node Version | >=18.0.0           |

#### Major Dependencies

| Package         | Version  | Purpose              |
| --------------- | -------- | -------------------- |
| `next`          | ^16.1.1  | React framework      |
| `react`         | ^19.2.3  | UI library           |
| `next-intl`     | ^4.7.0   | Internationalization |
| `framer-motion` | ^12.28.1 | Animations           |
| `recharts`      | ^2.15.4  | Charts               |
| `swr`           | ^2.3.8   | Data fetching        |
| `stripe`        | ^20.2.0  | Payments             |
| `@x402/next`    | ^2.2.0   | x402 payments        |
| `@vercel/kv`    | ^3.0.0   | Key-value storage    |
| `redis`         | ^5.10.0  | Caching              |

#### Dev Dependencies

| Package            | Purpose           |
| ------------------ | ----------------- |
| `@playwright/test` | E2E testing       |
| `vitest`           | Unit testing      |
| `@storybook/*`     | Component stories |
| `typescript`       | Type checking     |
| `tailwindcss`      | Styling           |
| `eslint`           | Linting           |
| `husky`            | Git hooks         |

#### Scripts

| Script            | Command                 |
| ----------------- | ----------------------- |
| `dev`             | `next dev`              |
| `build`           | `next build`            |
| `test`            | `vitest`                |
| `test:e2e`        | `playwright test`       |
| `lint`            | `next lint`             |
| `storybook`       | `storybook dev -p 6006` |
| `mcp:start`       | Start MCP server        |
| `i18n:translate`  | Translate content       |
| `archive:collect` | Archive news            |

### 12.2 next.config.js

#### Features Enabled

- Response compression
- Security headers (HSTS, XSS, etc.)
- Service Worker headers
- PWA manifest headers
- API CORS headers
- Icon caching (1 year)

#### Security Headers

| Header                    | Value                           |
| ------------------------- | ------------------------------- |
| X-DNS-Prefetch-Control    | on                              |
| Strict-Transport-Security | max-age=63072000                |
| X-Content-Type-Options    | nosniff                         |
| X-Frame-Options           | SAMEORIGIN                      |
| X-XSS-Protection          | 1; mode=block                   |
| Referrer-Policy           | strict-origin-when-cross-origin |

### 12.3 tsconfig.json

| Setting           | Value     |
| ----------------- | --------- |
| Target            | ES2017    |
| Module            | ESNext    |
| Module Resolution | Bundler   |
| Strict            | true      |
| JSX               | react-jsx |

#### Path Aliases

```json
{
  "@/*": ["./src/*"]
}
```

### 12.4 tailwind.config.js

#### Theme Extensions

- Custom brand colors (Bitcoin orange)
- Extended font sizes (display, headline, title, body, caption, tiny)
- Custom spacing (18, 88, 100, 120)
- Custom shadows (soft, card, glow)
- Custom animations

#### Dark Mode

- Class-based (`class`)

### 12.5 vitest.config.ts

| Setting           | Value   |
| ----------------- | ------- |
| Environment       | jsdom   |
| Globals           | true    |
| Coverage Provider | v8      |
| Test Timeout      | 10000ms |

---

## 13. Deployment

### 13.1 Vercel Configuration

**File:** `vercel.json`

#### Cron Jobs

| Path                    | Schedule    | Purpose                  |
| ----------------------- | ----------- | ------------------------ |
| `/api/cron/x-sentiment` | `0 0 * * *` | Daily sentiment analysis |

#### Function Configuration

| Function                 | Max Duration |
| ------------------------ | ------------ |
| `api/cron/x-sentiment`   | 300s         |
| `api/social/x/sentiment` | 60s          |

### 13.2 Railway Configuration

**File:** `railway.json`

| Setting        | Value                  |
| -------------- | ---------------------- |
| Builder        | NIXPACKS               |
| Start Command  | `node ws-server.js`    |
| Health Check   | `/health`              |
| Restart Policy | ON_FAILURE (3 retries) |

### 13.3 MCP Server Deployment

#### Vercel

```bash
cd mcp
vercel deploy
```

#### Railway

```bash
cd mcp
railway up
```

### 13.4 Required Environment Variables

| Variable             | Description           | Required           |
| -------------------- | --------------------- | ------------------ |
| `API_BASE`           | Backend API URL       | No (has default)   |
| `PORT`               | HTTP server port      | No (default: 3001) |
| `TELEGRAM_BOT_TOKEN` | For Telegram bots     | For bots           |
| `DISCORD_TOKEN`      | For Discord bots      | For bots           |
| `SLACK_WEBHOOK_URL`  | For Slack integration | For Slack          |
| `WALLET_PRIVATE_KEY` | For x402 payments     | For x402           |

---

## 14. Integration Statistics

### Summary Counts

| Category                | Count |
| ----------------------- | ----- |
| **Total SDKs**          | 8     |
| **Total Examples**      | 11    |
| **Total Integrations**  | 5     |
| **Supported Platforms** | 15+   |

### SDK Breakdown

| Language   | SDK                   |
| ---------- | --------------------- |
| TypeScript | ✅ Full types         |
| JavaScript | ✅ Browser + Node     |
| Python     | ✅ Zero deps          |
| Go         | ✅ With go.mod        |
| PHP        | ✅ 7.4+               |
| Ruby       | ✅ With gem           |
| Rust       | ✅ Async + WebSocket  |
| React      | ✅ Components + hooks |

### Integration Breakdown

| Platform       | Type              | Status     |
| -------------- | ----------------- | ---------- |
| Claude Desktop | MCP (stdio)       | ✅ Ready   |
| ChatGPT        | MCP (HTTP/SSE)    | ✅ Ready   |
| ChatGPT        | OpenAPI Action    | ✅ Ready   |
| Chrome         | Browser Extension | ✅ Ready   |
| Firefox        | Browser Extension | 🔜 Coming  |
| Alfred         | Workflow          | ✅ Ready   |
| Raycast        | Extension         | ✅ Ready   |
| Discord        | Bot               | ✅ Example |
| Telegram       | Bot               | ✅ Example |
| Slack          | Bot               | ✅ Example |
| LangChain      | Tool              | ✅ Example |
| Websites       | Widget (Ticker)   | ✅ Ready   |
| Websites       | Widget (Carousel) | ✅ Ready   |
| Websites       | Widget (Main)     | ✅ Ready   |

### Example Breakdown

| Example          | Language   | Purpose                   |
| ---------------- | ---------- | ------------------------- |
| AI Analysis      | Python     | Sentiment & summarization |
| LangChain Tool   | Python     | AI agent tool             |
| Discord Bot      | JavaScript | Channel posting           |
| Telegram Bot     | Python     | Command handler           |
| Telegram Digest  | Python     | Scheduled digests         |
| Slack Bot        | JavaScript | Webhook posting           |
| Real-time Stream | JavaScript | SSE streaming             |
| curl Examples    | Shell      | API testing               |
| x402 Client      | Python     | Payment protocol          |
| x402 Client      | TypeScript | Payment protocol          |
| x402 Client      | Go         | Payment protocol          |

### API Coverage by SDK

| Endpoint   | TS  | PY  | JS  | Go  | PHP | RB  | RS  | React |
| ---------- | --- | --- | --- | --- | --- | --- | --- | ----- |
| /news      | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅    |
| /search    | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅    |
| /defi      | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅    |
| /bitcoin   | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅    |
| /breaking  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅    |
| /sources   | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅    |
| /trending  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅    |
| /health    | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | -     |
| /stats     | ✅  | ✅  | ✅  | -   | ✅  | ✅  | -   | -     |
| /analyze   | ✅  | ✅  | ✅  | -   | ✅  | -   | -   | -     |
| /archive   | ✅  | ✅  | ✅  | -   | ✅  | -   | -   | -     |
| /origins   | ✅  | ✅  | ✅  | -   | -   | -   | -   | -     |
| /portfolio | ✅  | ✅  | ✅  | -   | -   | -   | -   | -     |

---

## Appendix: File Inventory

### /mcp/

- `index.js` - Main MCP server (stdio)
- `http-server.js` - HTTP/SSE server
- `package.json` - Package config
- `vercel.json` - Vercel config
- `README.md` - Documentation
- `CHATGPT-SETUP.md` - ChatGPT setup guide
- `RAILWAY-DEPLOY.md` - Railway deployment guide

### /sdk/

- `typescript/` - TypeScript SDK
- `python/` - Python SDK
- `javascript/` - JavaScript SDK
- `go/` - Go SDK
- `php/` - PHP SDK
- `ruby/` - Ruby SDK
- `rust/` - Rust SDK
- `react/` - React components

### /cli/

- `index.js` - CLI implementation
- `package.json` - Package config
- `README.md` - Documentation

### /extension/

- `manifest.json` - Extension manifest
- `popup.html` - Popup UI
- `popup.js` - Popup logic
- `background.js` - Service worker
- `options.html` - Settings
- `options.js` - Settings logic
- `README.md` - Documentation

### /widget/

- `crypto-news-widget.html` - Main widget
- `ticker.html` - Ticker demo
- `ticker.js` - Ticker script
- `carousel.html` - Carousel demo
- `carousel.js` - Carousel script
- `README.md` - Documentation

### /alfred/

- `crypto-news.sh` - Main script
- `info.plist` - Alfred config
- `README.md` - Documentation

### /raycast/

- `package.json` - Extension config
- `src/latest.tsx` - Latest news command
- `src/breaking.tsx` - Breaking news command
- `src/trending.tsx` - Trending command
- `README.md` - Documentation

### /chatgpt/

- `openapi.yaml` - OpenAPI spec
- `README.md` - Setup guide

### /examples/

- `ai-analysis.py` - AI analysis
- `langchain-tool.py` - LangChain integration
- `discord-bot.js` - Discord bot
- `telegram-bot.py` - Telegram bot
- `telegram-digest.py` - Telegram digest
- `slack-bot.js` - Slack bot
- `realtime-stream.js` - SSE streaming
- `curl.sh` - curl examples
- `x402-client.py` - Python x402
- `x402-client.ts` - TypeScript x402
- `x402-client.go` - Go x402
- `README.md` - Documentation

### /postman/

- `Free_Crypto_News_API.postman_collection.json` - Collection
- `README.md` - Import guide

### /e2e/

- `home.spec.ts` - Homepage tests
- `api.spec.ts` - API tests
- `i18n.spec.ts` - i18n tests
- `exports.spec.ts` - Export tests
- `article-slugs.spec.ts` - Slug tests
- `orderbook.spec.ts` - Orderbook tests
- `regulatory.spec.ts` - Regulatory tests
- `tradingview.spec.ts` - TradingView tests
- `x402.spec.ts` - Payment tests
- `tests/` - Additional tests
- `README.md` - Test documentation

---

_End of Audit Document_

**Generated:** January 31, 2026  
**Total Items Documented:** 150+  
**Audit Status:** ✅ Complete
