# ChatGPT Custom GPT Integration

Use the Free Crypto News API in your Custom GPT!

## Setup Instructions

1. Go to [ChatGPT](https://chat.openai.com) → Explore GPTs → Create
2. Click "Configure" → scroll to "Actions" → "Create new action"
3. Copy the contents of `openapi.yaml` and paste into the schema editor
4. No authentication required! Leave auth settings empty
5. Save and test your GPT

## Example GPT Instructions

Add this to your GPT's instructions:

```
You are a crypto news and market data assistant. You have access to real-time crypto news from 130+ sources and comprehensive market data.

When users ask about crypto:
1. Use getLatestNews for general news (supports search, category, source filtering)
2. Use getCryptoPrices for live prices (supports 100+ coins)
3. Use getMarketOverview for market summary with top gainers/losers
4. Use getFearGreedIndex for market sentiment indicator
5. Use getGasPrices for Ethereum gas fees
6. Use getTrendingTopics for trending topics with sentiment
7. Use getDefiData for DeFi ecosystem data
8. Use getDefiYields for yield farming opportunities
9. Use getWhaleAlerts for large transactions
10. Use getMarketSentiment for AI-powered sentiment analysis
11. Use getPricePredictions for price forecasts
12. Use getStablecoinData for stablecoin peg status
13. Use getL2Data for Layer 2 networks
14. Use getLiquidations for exchange liquidation data
15. Use getFundingRates for futures funding rates
16. Use getNftData for NFT market data
17. Use getAirdrops for upcoming airdrops
18. Use getEventsCalendar for crypto events
19. Use getRegulatoryNews for regulation updates
20. Use getMacroData for macroeconomic indicators
21. Use getArbitrageOpportunities for exchange price differences
22. Use getExchangeData for exchange information
23. Use getNewsSources to list available sources
24. Use getCryptoGlossary for term definitions
25. Use askCryptoQuestion (POST) for natural language Q&A

Always format responses nicely with:
- 📰 Headline
- 🔗 Link
- ⏰ Time ago
- 📌 Source
- 💰 Price data when relevant
```

## Available Actions (25 Total)

### 📰 News & Search

| Action | Description |
|--------|-------------|
| `getLatestNews` | Get latest crypto news with search, category, and source filtering |
| `getRegulatoryNews` | Regulatory and legal news (SEC, CFTC, global) |
| `getNewsSources` | List all available news sources |

### 📊 Market Data

| Action | Description |
|--------|-------------|
| `getCryptoPrices` | Live prices for 100+ coins |
| `getMarketOverview` | Market cap, BTC dominance, gainers/losers |
| `getFearGreedIndex` | Fear & Greed sentiment index (0-100) |
| `getGasPrices` | Ethereum gas prices in Gwei |
| `getTrendingTopics` | Trending topics with sentiment |
| `getMarketSentiment` | AI-powered sentiment analysis |
| `getStablecoinData` | Stablecoin market caps and peg status |
| `getExchangeData` | Exchange volumes and trust scores |

### 💹 Trading & Derivatives

| Action | Description |
|--------|-------------|
| `getFundingRates` | Perpetual futures funding rates |
| `getLiquidations` | Exchange liquidation data |
| `getArbitrageOpportunities` | Cross-exchange arbitrage spreads |

### 🔗 DeFi & Layer 2

| Action | Description |
|--------|-------------|
| `getDefiData` | DeFi ecosystem data and news |
| `getDefiYields` | Top yield farming opportunities |
| `getL2Data` | Layer 2 network TVL and stats |

### 🐋 On-Chain & Alerts

| Action | Description |
|--------|-------------|
| `getWhaleAlerts` | Large transaction alerts |
| `getNftData` | NFT collections and market data |
| `getAirdrops` | Upcoming and active airdrops |

### 🤖 AI & Analytics

| Action | Description |
|--------|-------------|
| `getPricePredictions` | AI price predictions and forecasts |
| `askCryptoQuestion` | Natural language Q&A (POST) |

### 📚 Reference & Events

| Action | Description |
|--------|-------------|
| `getEventsCalendar` | Conferences, forks, launches |
| `getMacroData` | Macroeconomic indicators |
| `getCryptoGlossary` | Crypto term definitions |

## Test Prompts

**News:**
- "What's the latest crypto news?"
- "Any news about Ethereum ETF?"
- "Show me regulatory news from the US"
- "What's trending in crypto right now?"

**Market Data:**
- "What's the Bitcoin price?"
- "Give me a market overview"
- "What's the Fear & Greed Index?"
- "How much are Ethereum gas fees?"

**Trading:**
- "Show me BTC funding rates"
- "Any liquidations in the last 24 hours?"
- "Find arbitrage opportunities for ETH"

**DeFi & Yields:**
- "What are the top DeFi yields on Ethereum?"
- "Show me Layer 2 network stats"
- "Any upcoming airdrops?"

**Analysis:**
- "Is market sentiment bullish or bearish?"
- "Price prediction for SOL this week"
- "What does 'impermanent loss' mean?"
- "What happened to Bitcoin this week?" (uses askCryptoQuestion)

**Macro:**
- "How do macro indicators affect crypto?"
- "What events are coming up this month?"

