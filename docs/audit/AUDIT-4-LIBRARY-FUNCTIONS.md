# AUDIT-4: Library Functions & Core Logic

**Audit Date:** January 31, 2026  
**Scope:** `/src/lib/**`, `/src/hooks/**`, `/src/types/**`, `/src/utils/**`, `/src/context/**`  
**Exclusions:** `crypto-news.ts`, `international-sources.ts`, `source-translator.ts`, `cache.ts` (covered by Agent 1)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [AI/ML Functions](#2-aiml-functions)
3. [Market Data Functions](#3-market-data-functions)
4. [Social Intelligence](#4-social-intelligence)
5. [Analytics & Research](#5-analytics--research)
6. [Database & Storage](#6-database--storage)
7. [Authentication & Security](#7-authentication--security)
8. [x402 Micropayments](#8-x402-micropayments)
9. [Utilities](#9-utilities)
10. [Custom Hooks](#10-custom-hooks)
11. [Function Statistics](#11-function-statistics)

---

## 1. Executive Summary

The Free Crypto News library layer is a comprehensive, enterprise-grade system featuring:

- **90+ library files** providing core functionality
- **5 custom React hooks** for client-side state management
- **Multi-provider AI integration** (OpenAI, Anthropic, Groq, OpenRouter)
- **Real-time market data** from multiple exchanges
- **Advanced analytics** including backtesting, predictions, and causal inference
- **Micropayment infrastructure** using x402 protocol
- **Robust alert system** with WebSocket and webhook delivery

---

## 2. AI/ML Functions

### 2.1 AI Provider Architecture

All AI modules share a common multi-provider pattern:

**Supported Providers:**
| Provider | Environment Variable | Default Model |
|----------|---------------------|---------------|
| OpenAI | `OPENAI_API_KEY` | `gpt-4o-mini` |
| Anthropic | `ANTHROPIC_API_KEY` | `claude-3-haiku-20240307` |
| Groq | `GROQ_API_KEY` | `llama-3.3-70b-versatile` |
| OpenRouter | `OPENROUTER_API_KEY` | `meta-llama/llama-3-8b-instruct` |

**Priority Order:** OpenAI → Anthropic → Groq → OpenRouter

---

### 2.2 ai-brief.ts (338 lines)
**Purpose:** AI Daily Brief Generator - comprehensive daily digest of crypto news

**Exported Functions:**
| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `generateDailyBrief(date?, format?)` | Generate comprehensive daily brief | Date string, format | `DailyBrief` object |

**Key Types:**
- `DailyBrief` - Contains executive summary, market overview, top stories, sectors, events, risk alerts
- `BriefFormat` - `'full'` | `'summary'`

**Caching:** 1 hour TTL via `aiCache`

---

### 2.3 ai-content-detection.ts (789 lines)
**Purpose:** Enterprise-grade AI-generated content detection - works entirely offline

**Detection Methods:**
- Perplexity estimation via n-gram frequency analysis
- Burstiness measurement (sentence length variance)
- Vocabulary diversity (Type-Token Ratio)
- Stylometric fingerprinting
- Common AI phrase detection
- Structural pattern analysis

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `detectAIContent(text)` | Analyze text for AI generation | `DetectionResult` |

**Key Types:**
- `DetectionResult` - isLikelyAI, confidence (0-100), humanScore, verdict, analysis, signals
- `PerplexityAnalysis`, `BurstinessAnalysis`, `VocabularyAnalysis`, `StylometryAnalysis`

**No External API Required** - All analysis is local

---

### 2.4 ai-counter.ts (332 lines)
**Purpose:** AI Counter-Arguments Generator - challenge claims with counter-arguments

**Exported Functions:**
| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `generateCounterArguments(input)` | Generate counter-arguments | `CounterInput` | `CounterResult` |

**Key Types:**
- `CounterResult` - counterArguments, assumptions, alternativeInterpretations, missingContext
- Counter-argument types: `factual`, `logical`, `contextual`, `alternative`

**Caching:** 24 hours TTL

---

### 2.5 ai-debate.ts (349 lines)
**Purpose:** Bull vs Bear Debate Generator for articles/topics

**Exported Functions:**
| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `generateDebate(input)` | Generate bull vs bear perspectives | `DebateInput` | `DebateResult` |

**Key Types:**
- `DebateResult` - topic, bullCase, bearCase, neutralAnalysis
- Each case includes: thesis, arguments, supportingEvidence, priceTarget, timeframe, confidence

**Caching:** 24 hours TTL

---

### 2.6 ai-enhanced.ts (442 lines)
**Purpose:** Core AI Enhancement Utilities for news analysis

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `summarizeArticle(title, content, options?)` | AI article summarization | Summary string |
| `analyzeSentiment(title, content)` | Sentiment analysis | `SentimentAnalysis` |
| `extractFacts(title, content)` | Key fact extraction | `ExtractedFacts` |
| `factCheck(title, content)` | Fact-check claims | `FactCheckResult` |

**Key Types:**
- `SentimentAnalysis` - sentiment (bullish/bearish/neutral), confidence, marketImpact, affectedAssets
- `ExtractedFacts` - keyPoints, entities, numbers, dates
- `FactCheckResult` - claims array with verdicts, overallCredibility, warnings

**All functions cache for 24 hours**

---

### 2.7 ai-market-agent.ts (1434 lines)
**Purpose:** Revolutionary AI Market Intelligence Agent - synthesizes multiple data sources

**Core Class:** `AIMarketAgent`

**Key Methods:**
| Method | Purpose |
|--------|---------|
| `generateIntelligence()` | Comprehensive market intelligence |
| `detectMarketRegime()` | Detect accumulation/distribution/markup/markdown phases |
| `calculateFearGreedIndex()` | Aggregate fear/greed calculation |
| `aggregateSignals()` | Multi-source signal aggregation |
| `identifyOpportunities()` | Trading opportunity detection |
| `generateRiskAlerts()` | Risk alert generation |

**Market Regimes:** `accumulation`, `markup`, `distribution`, `markdown`, `ranging`, `capitulation`, `euphoria`

**Signal Sources:** news, social, on-chain, technical, derivatives, whale, regulatory, smart-money, narrative, cross-correlation

**Key Types:**
- `MarketIntelligence` - overallRegime, fearGreedIndex, activeSignals, opportunities, riskAlerts
- `MarketSignal` - source, type, direction, strength, confidence, narrative
- `TradingOpportunity` - asset, type, entry, targets, stopLoss, riskReward
- `RiskAlert` - severity, type, description, recommendation

---

### 2.8 ai-services.ts (829 lines)
**Purpose:** Enterprise AI service layer using Groq Llama 3.3 70B

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `summarize(content, options)` | Text summarization | `Summary` |
| `extractEntities(content)` | Entity extraction | `EntityExtractionResult` |
| `extractRelationships(content)` | Relationship mapping | `RelationshipExtractionResult` |
| `analyzeSentiment(content)` | Deep sentiment analysis | `SentimentResult` |
| `classifyTopics(content)` | Topic classification | `TopicClassification` |
| `extractInsights(content)` | Key insight extraction | `InsightsResult` |

**Entity Types:** person, organization, cryptocurrency, token, exchange, protocol, event, regulation, technology, location, financial_metric

**Summary Styles:** brief, detailed, bullet_points, eli5, technical

---

### 2.9 groq.ts (209 lines)
**Purpose:** Shared Groq AI Client for all AI-powered features

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `isGroqConfigured()` | Check if Groq API key is set |
| `callGroq(messages, options)` | Low-level API call |
| `parseGroqJson<T>(content)` | Parse JSON from response |
| `promptGroq(systemPrompt, userPrompt, options)` | Simple prompt helper |

**Configuration:**
- API URL: `https://api.groq.com/openai/v1/chat/completions`
- Default Model: `llama-3.3-70b-versatile`

**Cache TTLs:**
- summarize: 5 min
- sentiment: 5 min
- entities: 10 min
- digest: 15 min
- narratives: 10 min

---

### 2.10 claim-extractor.ts (402 lines)
**Purpose:** Extract verifiable claims with attribution from news articles

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `isExtractorConfigured()` | Check if AI is configured | boolean |
| `extractClaims(article)` | Extract claims from article | `ClaimExtractionResult` |

**Key Types:**
- `ExtractedClaim` - claim, attribution (source, role, organization), type, verifiability
- `ClaimType` - fact, opinion, prediction, announcement
- `Verifiability` - verifiable, subjective, future

---

### 2.11 premium-ai.ts (374 lines)
**Purpose:** AI-powered analysis endpoints for premium subscribers

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `analyzeSentiment(request)` | Coin sentiment analysis |
| `generateSignals(request)` | Trading signal generation |
| `compareCoin(request)` | Multi-coin comparison |
| `getMarketSummary(request)` | AI market summary |

**Key Types:**
- `SentimentResult` - overall, score, confidence, factors, articles
- `TradingSignal` - action (buy/sell/hold), strength, indicators, entry/target/stopLoss
- `CoinComparison` - rankings, recommendation, summary

---

### 2.12 event-classifier.ts (414 lines)
**Purpose:** Automatic classification of crypto news events

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `isClassifierConfigured()` | Check AI configuration |
| `classifyEvent(article)` | Classify event type |

**Event Types:** funding_round, hack_exploit, regulation, product_launch, partnership, listing, airdrop, network_upgrade, legal_action, market_movement, executive_change, acquisition, general

**Key Types:**
- `EventClassification` - eventType, confidence, subType, entities, magnitude, urgency, marketRelevance

---

## 3. Market Data Functions

### 3.1 market-data.ts (2136 lines)
**Purpose:** Comprehensive cryptocurrency market data service

**Primary API:** CoinGecko  
**Fallback APIs:** CryptoCompare, Binance, DeFiLlama, Alternative.me

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `getTopCoins(limit, sparkline)` | Top coins by market cap |
| `getCoinDetails(coinId)` | Detailed coin information |
| `getSimplePrices(ids, currencies)` | Simple price lookup |
| `getHistoricalPrices(coinId, days)` | Historical price data |
| `getOHLC(coinId, days)` | OHLC candlestick data |
| `getTrendingCoins()` | Currently trending coins |
| `searchCoins(query)` | Coin search |
| `getGlobalMarketData()` | Global market statistics |
| `getFearGreedIndex()` | Fear & Greed Index |
| `getProtocolTVL()` | DeFi protocol TVL (DeFiLlama) |

**Cache TTLs:**
- prices: 30s
- historical_1d: 1 min
- historical_7d: 5 min
- historical_30d: 15 min
- tickers: 2 min
- static: 1 hour
- global: 5 min

---

### 3.2 funding-rates.ts (776 lines)
**Purpose:** Real-time funding rate aggregation across perpetual exchanges

**Supported Exchanges:** Binance Futures, Bybit, OKX, dYdX, Hyperliquid

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `getFundingDashboard()` | Full funding rate dashboard | `FundingDashboard` |
| `getCrossExchangeFunding(symbol)` | Cross-exchange comparison | `CrossExchangeFunding[]` |
| `getFundingHistory(symbol, exchange)` | Historical funding rates | `FundingHistory` |
| `getArbitrageOpportunities()` | Funding arbitrage opportunities | `FundingArbitrage[]` |

**Key Types:**
- `FundingRateData` - symbol, exchange, fundingRate, annualized, markPrice, openInterest
- `FundingArbitrage` - spread, annualizedYield, riskScore, liquidityScore

---

### 3.3 derivatives.ts (482 lines)
**Purpose:** Derivatives data integration from multiple exchanges

**Sources:** Binance Futures, Bybit, dYdX, OKX

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `getBybitTickers(category)` | Bybit perpetual tickers |
| `getBybitFundingHistory(symbol, limit)` | Bybit funding history |
| `getBybitOpenInterest(symbol)` | Bybit open interest |
| `getOKXTickers()` | OKX perpetual tickers |
| `getOKXFundingRate(instId)` | OKX funding rate |
| `getDydxMarkets()` | dYdX market data |
| `getAggregatedFunding()` | Multi-exchange aggregation |

---

### 3.4 binance.ts (462 lines)
**Purpose:** Binance Public API Integration (no API key required)

**Rate Limit:** 1200 requests/minute

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `getAllPrices()` | All spot prices |
| `getPrice(symbol)` | Single symbol price |
| `get24hrTickers()` | 24hr ticker data |
| `getOrderBook(symbol, limit)` | Order book depth |
| `getRecentTrades(symbol, limit)` | Recent trades |
| `getKlines(symbol, interval, limit)` | Candlestick data |
| `getFuturesMarkPrice()` | Futures mark prices |
| `getFuturesFunding()` | Futures funding rates |
| `getLongShortRatio(symbol)` | Long/short ratio |

---

### 3.5 order-book.ts (1207 lines)
**Purpose:** Multi-Exchange Order Book Aggregator

**Supported Exchanges:** Binance, Coinbase, Kraken, Bitfinex, Bitstamp, OKX, Bybit, KuCoin, Huobi, Gemini

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `getAggregatedOrderBook(symbol)` | Unified order book | `AggregatedOrderBook` |
| `getNBBO(symbol)` | National Best Bid/Offer | NBBO data |
| `getDepthAnalysis(symbol)` | Liquidity depth analysis | Depth metrics |
| `detectWhaleOrders(symbol)` | Large order detection | `WhaleOrder[]` |
| `detectPriceWalls(symbol)` | Support/resistance walls | `PriceWall[]` |

**Key Types:**
- `AggregatedOrderBook` - nbbo, aggregatedBids/Asks, exchangeData, metrics
- `OrderBookMetrics` - imbalanceRatio, slippageEstimates, depthScore

---

### 3.6 defi-yields.ts (266 lines)
**Purpose:** DeFi Yields Integration via Llama.fi

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `getAllPools()` | All DeFi yield pools |
| `getPoolChart(poolId)` | Pool historical chart |
| `getMedianYields()` | Median yields by chain |
| `getTopYields(options)` | Top yields with filters |
| `getPoolsByChain(chain)` | Pools for specific chain |
| `getStablePools(options)` | Stablecoin pools |

**Filters:** chain, project, stablecoin, minTvl, limit

---

### 3.7 premium-whales.ts (745 lines)
**Purpose:** Whale Tracking Service - large transaction monitoring

**Whale Threshold:** $1,000,000+ USD

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `getWhaleTransactions(options)` | Fetch whale transactions |
| `createWhaleAlert(config)` | Set up whale alerts |
| `getWhaleAlerts(userId)` | Get user's alerts |

**Key Types:**
- `WhaleTransaction` - hash, blockchain, from, to, amount, amountUsd, type, significance
- Transaction types: transfer, exchange_inflow, exchange_outflow

**Data Sources:** Blockchair (ETH, BTC), Etherscan

---

### 3.8 external-apis.ts (523 lines)
**Purpose:** External API configuration and types

**Configured APIs:**
| API | Base URL |
|-----|----------|
| CoinCap | `https://api.coincap.io/v2` |
| CoinPaprika | `https://api.coinpaprika.com/v1` |
| CoinLore | `https://api.coinlore.net/api` |
| Binance | `https://api.binance.com/api/v3` |
| Binance Futures | `https://fapi.binance.com` |
| Bybit | `https://api.bybit.com/v5` |
| dYdX | `https://api.dydx.exchange/v3` |
| OKX | `https://www.okx.com/api/v5` |
| Mempool | `https://mempool.space/api` |
| Llama Yields | `https://yields.llama.fi` |

---

## 4. Social Intelligence

### 4.1 social-intelligence.ts (1261 lines)
**Purpose:** Enterprise-grade social data aggregation and analysis

**Integrations:** Discord, Telegram, LunarCrush, Santiment

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `getDiscordMessages(channelIds)` | Fetch Discord messages | `SocialMessage[]` |
| `getTelegramMessages(channels)` | Fetch Telegram messages | `SocialMessage[]` |
| `getSocialTrends(options)` | Aggregate social trends | `SocialTrend[]` |
| `getInfluencerProfiles(usernames)` | Influencer data | `InfluencerProfile[]` |
| `getLunarCrushMetrics(symbol)` | Galaxy Score, AltRank | LunarCrush data |
| `getSantimentMetrics(asset)` | Social volume/sentiment | Santiment data |

**Key Types:**
- `SocialMessage` - platform, content, sentiment, tickers, engagement
- `SocialTrend` - ticker, mentions, sentiment, topChannels, topInfluencers
- `InfluencerProfile` - reliabilityScore, accuracyRate, sentimentBias

**Rate Limits:** Discord (50/min), Telegram (30/min), LunarCrush (10/min), Santiment (10/min)

---

### 4.2 x-scraper.ts (612 lines)
**Purpose:** X/Twitter Scraper - sentiment analysis without paid API

**Strategies:**
1. Nitter RSS feeds (primary - no auth needed)
2. Direct scraping with session cookies (fallback)
3. Cached results from Vercel KV

**Nitter Instances:**
- nitter.privacydev.net
- nitter.poast.org
- nitter.woodland.cafe
- nitter.esmailelbob.xyz
- nitter.1d4.us

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `fetchInfluencerSentiment(list)` | Aggregate sentiment | `SentimentResult` |
| `getTweets(username, count)` | Get user tweets | `XTweet[]` |
| `createInfluencerList(config)` | Create custom list | `InfluencerList` |

**Default Influencers:** VitalikButerin, saborski, CryptoCred, lookonchain, APompliano, etc.

**NO API KEY REQUIRED** - Works with Nitter RSS

---

### 4.3 influencer-tracker.ts (758 lines)
**Purpose:** Influencer Reliability Tracker - prediction accuracy scoring

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `trackInfluencer(config)` | Start tracking influencer | `Influencer` |
| `recordCall(influencerId, call)` | Record trading call | `TradingCall` |
| `resolveCall(callId, exitPrice)` | Resolve call outcome | Updated call |
| `getInfluencerStats(influencerId)` | Performance statistics | `Influencer` stats |
| `getLeaderboard(options)` | Top performers | `Influencer[]` |

**Scoring Metrics:**
- `reliabilityScore` - 0-100 overall reliability
- `accuracyRate` - % of correct calls
- `avgReturn` - Average return per call
- `sharpeRatio` - Risk-adjusted returns
- `maxDrawdown` - Worst peak-to-trough

**Call Detection Patterns:** Regex-based detection of long/short signals in text

---

## 5. Analytics & Research

### 5.1 backtesting.ts (987 lines)
**Purpose:** Enterprise-grade backtesting infrastructure

**Features:**
- Historical news-price correlation analysis
- Multiple strategy templates
- Risk metrics (Sharpe, Sortino, Max Drawdown)
- Monte Carlo simulations
- Walk-forward optimization

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `runBacktest(config)` | Execute backtest | `BacktestResult` |
| `getStrategyTemplates()` | Available strategies | Strategy list |
| `analyzePerformance(trades)` | Performance metrics | `PerformanceMetrics` |
| `calculateRiskMetrics(equityCurve)` | Risk analysis | `RiskMetrics` |

**Key Types:**
- `BacktestConfig` - strategyId, assets, startDate, endDate, initialCapital, positionSizing, riskManagement
- `BacktestResult` - performance, trades, risk, equityCurve, drawdownCurve
- `RiskMetrics` - sharpeRatio, sortinoRatio, maxDrawdown, VaR, expectedShortfall

---

### 5.2 predictions.ts (744 lines)
**Purpose:** Prediction Tracking System with leaderboards

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `createPrediction(input)` | Create new prediction | `Prediction` |
| `resolvePrediction(id)` | Resolve against price | Updated prediction |
| `getUserStats(userId)` | User accuracy stats | `UserStats` |
| `getLeaderboard(options)` | Top predictors | `LeaderboardEntry[]` |
| `getPredictionHistory(userId)` | User's predictions | `Prediction[]` |

**Prediction Types:** price_above, price_below, price_range, percentage_up, percentage_down, event, trend, dominance, custom

**Key Types:**
- `Prediction` - type, asset, targetValue, targetDate, confidence, status, outcome
- `UserStats` - accuracyRate, streak, totalPoints, rank, badges

---

### 5.3 anomaly-detector.ts (728 lines)
**Purpose:** Detect unusual patterns in news flow

**Anomaly Types:**
- `volume_spike` - Unusual article volume
- `coordinated_publishing` - Multiple sources publish similar content
- `sentiment_shift` - Dramatic sentiment changes
- `ticker_surge` - Unusual ticker mentions
- `source_outage` - Source goes silent
- `unusual_timing` - Off-hours publishing

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `detectAnomalies(articles)` | Run all detectors | `AnomalyReport` |
| `getSystemHealth()` | Current system status | `SystemHealth` |
| `getAnomalyHistory(hours)` | Recent anomalies | `AnomalyEvent[]` |

**Detection Thresholds:**
- Volume spike: >3 std deviations
- Coordinated: 3+ sources within 5 min, 80% similarity
- Sentiment shift: >0.4 change in 6 hours
- Ticker surge: 5x baseline

---

### 5.4 headline-tracker.ts (407 lines)
**Purpose:** Track headline evolution - detect modifications over time

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `trackHeadline(article)` | Start tracking article | `HeadlineEvolution` |
| `checkForChanges(url)` | Check for headline changes | Changes or null |
| `getHeadlineHistory(url)` | Full change history | `HeadlineEvolution` |
| `getRecentChanges(hours)` | Recent headline changes | `RecentChange[]` |
| `calculateSimilarity(str1, str2)` | Levenshtein similarity | 0-1 score |
| `calculateSentiment(title)` | Simple sentiment score | -1 to 1 |

**Change Classifications:** minor (>90% similar), moderate (60-90%), major (<60%)

---

### 5.5 coverage-gap.ts (636 lines)
**Purpose:** News coverage gap analysis

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `getCoverageReport(period)` | Full coverage analysis | `CoverageReport` |
| `detectGaps(articles)` | Find under-covered topics | `CoverageGap[]` |
| `getTopicTrends(articles)` | Topic trend analysis | `TopicTrend[]` |

**Key Types:**
- `CoverageGap` - topic, type, severity, suggestedAngle, marketImpact
- Gap types: asset, category, event, narrative

**Important Categories:** bitcoin, ethereum, defi, nft, regulation, security, exchange, stablecoin, layer2, web3

---

### 5.6 causal-inference.ts (886 lines)
**Purpose:** Causal analysis for news-market relationships

**Methods:**
- Granger causality testing
- Difference-in-differences analysis
- Event study methodology
- Synthetic control estimation
- Regression discontinuity design

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `analyzeCausation(request)` | Full causal analysis | `CausalAnalysisResult` |
| `runGrangerTest(series1, series2)` | Granger causality | `GrangerCausalityResult` |
| `eventStudy(event, asset)` | Event study analysis | Event study metrics |

**Key Types:**
- `CausalEvent` - timestamp, eventType, assets, magnitude
- `CausalEffect` - direction, magnitude, peakEffect, persistence
- Event types: news, regulatory, hack, listing, partnership, etc.

---

### 5.7 citation-network.ts (1096 lines)
**Purpose:** Academic citation network tracking and analysis

**Features:**
- Citation graph construction
- Impact factor calculation
- H-index computation
- Co-citation analysis
- Research front detection
- Export to BibTeX, RIS, CSL-JSON

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `addCitation(node)` | Add citation to network | `CitationNode` |
| `getCitationMetrics(nodeId)` | Bibliometric metrics | `BibliometricMetrics` |
| `getAuthorMetrics(authorName)` | Author h-index, etc. | `AuthorMetrics` |
| `getNetworkMetrics()` | Network-level stats | `NetworkMetrics` |
| `detectResearchFronts()` | Emerging research areas | `ResearchFront[]` |

---

### 5.8 alpha-signal-engine.ts (294 lines)
**Purpose:** AI-powered early market-moving signal detection

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `calculateAlphaScore(title, content, source, time)` | Score article's alpha potential | 0-100 |
| `detectAlphaSignal(article)` | Full signal analysis | `AlphaSignal` |
| `getNarrativeClusters()` | Current narrative themes | `NarrativeCluster[]` |

**Key Types:**
- `AlphaSignal` - signalType, signalStrength, alphaScore, urgency, expectedImpactWindow
- Urgency levels: critical, high, medium, low

**Alpha Keywords:**
- Critical: exclusive, breaking, leaked, hack, ban, lawsuit
- High: partnership, acquisition, airdrop, listing, whale
- Medium: update, announcement, milestone, growth

---

### 5.9 source-credibility.ts (461 lines)
**Purpose:** Score news sources on accuracy, consistency, and bias

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `getSourceCredibility(source)` | Source credibility score | `SourceCredibility` |
| `getCredibilityReport()` | All sources analysis | `CredibilityReport` |
| `calculateClickbaitScore(title)` | Clickbait detection | 0-1 score |

**Metrics:**
- `accuracy` - Factual accuracy (0-100)
- `timeliness` - Reporting speed (0-100)
- `consistency` - Reporting consistency (0-100)
- `bias` - Sentiment bias (-1 to 1)
- `clickbait` - Clickbait score (0-1)

**Baseline Scores:** CoinDesk (85), TheBlock (88), Decrypt (82), etc.

---

### 5.10 regulatory-intelligence.ts (1270 lines)
**Purpose:** Comprehensive regulatory development monitoring

**Jurisdictions:** US, EU, UK, China, Japan, Singapore, UAE, Korea, Australia, Brazil, Switzerland, Hong Kong, Canada, India, Global

**Agencies Tracked:** SEC, CFTC, FinCEN, ESMA, FCA, MAS, SFC, and 20+ more

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `getRegulatoryEvents(filters)` | Filter regulatory news | `RegulatoryEvent[]` |
| `getJurisdictionOverview(jurisdiction)` | Jurisdiction summary | Overview data |
| `getComplianceDeadlines()` | Upcoming deadlines | Deadline list |
| `getImpactAssessment(event)` | Compliance impact | Impact analysis |

**Key Types:**
- `RegulatoryEvent` - jurisdiction, agency, actionType, impactLevel, affectedSectors
- Action types: enforcement, guidance, rule-proposal, rule-final, investigation, settlement

---

## 6. Database & Storage

### 6.1 database.ts (830 lines)
**Purpose:** Enterprise-grade storage abstraction layer

**Supported Backends:**
| Backend | Use Case |
|---------|----------|
| `vercel-kv` | Production (Vercel) |
| `upstash` | Serverless Redis |
| `memory` | Development/Testing |
| `file` | Local persistence |

**Exported Class/Functions:**
```typescript
class Database {
  async get<T>(key: string): Promise<T | null>
  async set(key: string, value: unknown, ttl?: number): Promise<void>
  async delete(key: string): Promise<boolean>
  async exists(key: string): Promise<boolean>
  async keys(pattern: string): Promise<string[]>
  async mget(keys: string[]): Promise<(unknown | null)[]>
  async mset(entries: Array<{key, value, ttl}>): Promise<void>
  async incr(key: string): Promise<number>
  async expire(key: string, ttl: number): Promise<boolean>
  
  // Document operations
  async getDocument<T>(collection, id): Promise<StoredDocument<T>>
  async saveDocument(collection, id, data, metadata?): Promise<void>
  async deleteDocument(collection, id): Promise<boolean>
  async listDocuments<T>(collection, options?): Promise<StoredDocument<T>[]>
}

export const db: Database // Singleton instance
```

**Key Types:**
- `StoredDocument<T>` - id, data, createdAt, updatedAt, version, metadata
- `DatabaseStats` - backend, connected, totalKeys, memoryUsage

---

### 6.2 content-addressable.ts (971 lines)
**Purpose:** IPFS-style content-addressable storage (CAS)

**Features:**
- SHA-256 content hashing
- Deduplication of identical content
- Merkle DAG for hierarchical data
- Content verification
- Pinning system
- Garbage collection
- Block-level chunking

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `put(content, options?)` | Store content | `ContentIdentifier` |
| `get(cid)` | Retrieve content | Content data |
| `pin(cid, name?, recursive?)` | Pin for persistence | `PinnedContent` |
| `unpin(cid)` | Remove pin | boolean |
| `resolve(cid, path)` | Traverse links | `ResolveResult` |
| `gc()` | Garbage collection | `GarbageCollectionResult` |
| `getStats()` | Storage statistics | `ContentStats` |

**Content Identifier Format:** `cas_{codec}{hash}`

---

## 7. Authentication & Security

### 7.1 admin-auth.ts (169 lines)
**Purpose:** Centralized admin authentication

**Environment Variables:**
- `ADMIN_API_KEY` or `ADMIN_TOKEN`

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `isAdminAuthorized(request)` | Check admin access | boolean |
| `verifyAdminAuth(request)` | Alias for above | boolean |
| `isAdminConfigured()` | Check if token is set | boolean |
| `requireAdminAuth(request)` | Middleware helper | NextResponse or null |

**Security Features:**
- Constant-time string comparison (prevents timing attacks)
- No hardcoded fallback in production
- Supports Bearer token and X-Admin-Key header

---

### 7.2 api-keys.ts (701 lines)
**Purpose:** API Key Management System

**Tiers:**
| Tier | Requests/Day | Requests/Min | Features |
|------|--------------|--------------|----------|
| Free | 100 | 10 | Basic reads |
| Pro | 10,000 | 100 | Premium + export |
| Enterprise | Unlimited | 1,000 | All features |

**Key Format:** `cda_{tier}_{random}` (e.g., `cda_pro_abc123...`)

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `generateApiKey(tier)` | Generate new key | Key string |
| `hashApiKey(key)` | Hash for storage | Hash string |
| `validateApiKey(key)` | Validate and lookup | `ApiKeyData` |
| `checkRateLimit(keyId)` | Rate limit check | `RateLimitResult` |
| `getApiKeyUsage(keyId)` | Usage statistics | Usage data |

**Storage:** Vercel KV

---

### 7.3 rate-limit.ts (209 lines)
**Purpose:** Simple in-memory rate limiter

**Configuration:**
- Window: 60 seconds
- Max requests: 60/minute

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `checkRateLimit(request)` | Check if allowed | `RateLimitResult` |
| `rateLimitResponse(result)` | 429 response | `NextResponse` |
| `addRateLimitHeaders(response, result)` | Add headers | `NextResponse` |
| `withRateLimit(handler)` | Middleware wrapper | Wrapped handler |

**Headers Added:** X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After

---

### 7.4 alert-rules.ts (364 lines)
**Purpose:** Alert rule type definitions

**Alert Condition Types:**
- `price_above` / `price_below` - Price thresholds
- `price_change_pct` - Percentage change (1h/24h)
- `volume_spike` - Volume multiplier
- `breaking_news` - With optional keywords
- `ticker_mention` - With optional sentiment filter
- `whale_movement` - Min USD threshold
- `fear_greed_change` - Index change threshold

**Exported Types:**
- `AlertCondition` - Union of all condition types
- `AlertRule` - id, name, condition, channels, cooldown, enabled
- `AlertEvent` - type, severity, data, message
- `AlertChannel` - websocket, webhook

---

## 8. x402 Micropayments

### 8.1 x402.ts (739 lines)
**Purpose:** x402 Payment Protocol main configuration

**Payment Address:** Set via `X402_PAYMENT_ADDRESS`

**Networks:**
- Base Mainnet: `eip155:8453`
- Base Sepolia: `eip155:84532`

**USDC Addresses:**
- Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

**Pricing:**
| Endpoint Type | Price (USD) |
|---------------|-------------|
| Coin Details | $0.001 |
| Analytics | $0.005 |
| Portfolio | $0.002 |
| Export | $0.10 |
| Historical/year | $0.02 |
| Screener | $0.05 |

---

### 8.2 x402-config.ts (436 lines)
**Purpose:** Premium API pricing configuration

**Categories:**
- **AI-Powered Analysis:** $0.01 - $0.05 per request
- **Whale Tracking:** $0.05 - $0.10 per request
- **Advanced Screener:** $0.02 per request
- **Historical Data:** $0.005 per request

**Exported Constants:**
- `PREMIUM_PRICING` - All endpoint prices
- `USDC_BASE` / `USDC_BASE_SEPOLIA` - Token addresses
- `SUPPORTED_NETWORKS` - Network identifiers

---

### 8.3 x402-middleware.ts (396 lines)
**Purpose:** Payment middleware for Next.js

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `verifyPaymentWithFacilitator(header, amount, resource)` | Verify payment |
| `checkAccessPass(walletAddress)` | Check for valid pass |
| `premiumMiddleware(request)` | Full middleware handler |
| `create402Response(requirements)` | Generate 402 response |

---

### 8.4 x402-client.ts (649 lines)
**Purpose:** Client-side utilities for paid API requests

**Exported Hooks/Functions:**
| Export | Purpose |
|--------|---------|
| `usePremiumFetch()` | Hook for paid requests |
| `createPaymentPayload(requirements)` | Build payment data |
| `signPayment(walletClient, payload)` | EIP-3009 signing |

**Types:**
- `PaymentRequirement` - scheme, network, asset, payTo, amount
- `PaymentResult` - success, transactionHash, error

---

### 8.5 x402-server.ts (460 lines)
**Purpose:** Server-side x402 resource server

**Exported:**
- `x402Server` - Resource server instance
- `premiumRoutes` - Route configurations
- `pricing` - Pricing tiers

---

### 8.6 x402/index.ts (Re-exports)
**Purpose:** Unified x402 module exports

Aggregates all x402 functionality:
- Configuration (networks, addresses)
- Pricing
- Routes
- Server
- Rate limiting
- Middleware
- Features
- Hooks

---

## 9. Utilities

### 9.1 validation.ts (300 lines)
**Purpose:** Input validation and sanitization

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `sanitizeString(input, maxLength)` | Remove dangerous characters |
| `sanitizeQuery(query)` | Validate search query |
| `validateSource(source)` | Validate source parameter |
| `validateNumber(value, min, max, default)` | Numeric validation |
| `validateUrl(url)` | URL validation |
| `validateCoins(coins)` | Coin symbols validation |
| `validateDate(date)` | Date string validation |

**Max Lengths:**
- query: 200
- source: 50
- topic: 100
- url: 2000
- coins: 500

---

### 9.2 logger.ts (166 lines)
**Purpose:** Centralized logging utility

**Log Levels:** debug, info, warn, error

**Environment Behavior:**
- Production: info and above
- Development: all levels
- Override: `DEBUG=true`

**Exported Functions:**
```typescript
createLogger(module: string) => {
  debug(message, data?): void
  info(message, data?): void
  warn(message, data?): void
  error(message, data?): void
}
```

---

### 9.3 reading-time.ts (~100 lines)
**Purpose:** Article reading time estimation

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `calculateReadingTime(text)` | From full text | `ReadingTimeResult` |
| `estimateReadingTime(title, desc)` | From metadata | `ReadingTimeResult` |
| `getReadingTimeBadgeColor(minutes)` | Color class | Tailwind classes |

**Reading Speed:** 200 words per minute

---

### 9.4 seo.ts (240 lines)
**Purpose:** SEO metadata generation

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `generateSEOMetadata(config)` | Full page metadata | Next.js `Metadata` |
| `generateArticleMetadata(article)` | Article-specific | `Metadata` |
| `generateJsonLd(type, data)` | Structured data | JSON-LD string |

**Includes:** Open Graph, Twitter Cards, canonical URLs, robots directives

---

### 9.5 translate.ts (282 lines)
**Purpose:** News translation service using Groq

**Supported Languages:** 18 languages (en, es, fr, de, pt, ja, zh-CN, zh-TW, ko, ar, ru, it, nl, pl, tr, vi, th, id)

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `isTranslationEnabled()` | Check feature flag |
| `isLanguageSupported(lang)` | Check language support |
| `translateArticles(articles, targetLang)` | Batch translate |

**Feature Flag:** `FEATURE_TRANSLATION=true`

---

### 9.6 dedupe.ts (~50 lines)
**Purpose:** Request deduplication

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `dedupe<T>(key, fn)` | Deduplicate async operations |
| `getPendingCount()` | Count pending requests |
| `clearPending()` | Clear all pending |

---

### 9.7 utils/id.ts (~90 lines)
**Purpose:** Cryptographically secure ID generation

**Exported Functions:**
| Function | Format | Example |
|----------|--------|---------|
| `generateId(prefix?)` | UUID or prefix_UUID | `alert_550e8400...` |
| `generateShortId(prefix)` | prefix_timestamp_random | `bt_l8x9y2z3_a1b2c3d4` |
| `generateVerificationToken()` | 64-char hex | Long token |
| `isValidId(id, expectedPrefix?)` | Validation | boolean |

---

### 9.8 webhooks.ts (834 lines)
**Purpose:** Webhook notification system

**Event Types:**
- API Key: key.created, key.usage.limit, key.upgraded, payment.received
- Content: news.new, news.breaking, news.trending, price.alert, market.significant, source.new, system.health

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `createWebhook(keyId, url, events)` | Create subscription |
| `deleteWebhook(webhookId)` | Remove subscription |
| `sendWebhook(event, data)` | Trigger webhook |
| `getWebhookLogs(webhookId)` | Delivery history |
| `generateSignature(payload, secret)` | HMAC-SHA256 signature |
| `verifySignature(payload, signature, secret)` | Verify signature |

**Storage:** Vercel KV with in-memory fallback

---

### 9.9 websocket.ts (290 lines)
**Purpose:** WebSocket server for real-time updates

**Message Types:** news, breaking, price, alert, ping, subscribe, unsubscribe

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `handleConnection(ws)` | Handle new connection |
| `handleDisconnection(clientId)` | Handle disconnect |
| `handleMessage(clientId, message)` | Process incoming message |
| `broadcastNews(update)` | Broadcast to subscribers |
| `broadcastPrice(update)` | Broadcast price update |

**Subscriptions:** sources, categories, keywords, coins

---

### 9.10 alerts.ts (1034 lines)
**Purpose:** Complete Price & Keyword Alerts System

**Alert Types:**
- Price threshold (above/below)
- Percent change (24h)
- Keyword mention

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `createPriceAlert(userId, config)` | Create price alert |
| `createKeywordAlert(userId, config)` | Create keyword alert |
| `getUserAlerts(userId)` | Get user's alerts |
| `deleteAlert(alertId)` | Delete alert |
| `checkPriceAlerts()` | Process price alerts |
| `checkKeywordAlerts(articles)` | Process keyword alerts |
| `getAlertHistory(userId)` | Alert notification history |

**Storage:** Database abstraction layer (KV/memory)

---

### 9.11 watchlist.ts (181 lines)
**Purpose:** Coin watchlist management

**Exported Functions:**
| Function | Purpose |
|----------|---------|
| `getWatchlist()` | Get from localStorage |
| `addToWatchlist(coinId)` | Add coin |
| `removeFromWatchlist(coinId)` | Remove coin |
| `isInWatchlist(coinId)` | Check membership |
| `reorderWatchlist(coinIds)` | Reorder items |
| `clearWatchlist()` | Clear all |
| `exportWatchlist()` | Export to JSON |
| `importWatchlist(data)` | Import from JSON |

**Max Size:** 100 coins

---

### 9.12 portfolio.ts (350 lines)
**Purpose:** Portfolio tracking

**Exported Functions:**
| Function | Purpose | Output |
|----------|---------|--------|
| `createPortfolio(userId, name)` | Create portfolio | `Portfolio` |
| `getUserPortfolios(userId)` | Get user's portfolios | `Portfolio[]` |
| `addHolding(portfolioId, holding)` | Add/update holding | `Portfolio` |
| `removeHolding(portfolioId, coinId)` | Remove holding | `Portfolio` |
| `calculatePortfolioValue(portfolioId)` | Current value | `PortfolioValue` |
| `getCorrelatedNews(portfolioId)` | News for holdings | News articles |

---

## 10. Custom Hooks

### 10.1 useAlphaSignals.ts (237 lines)
**Purpose:** Alpha signal management hook

**Hooks:**
```typescript
useAlphaSignals(options?): {
  signals: AlphaSignal[]
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
  lastUpdated: Date | null
  criticalSignals: AlphaSignal[]
  stats: { totalSignals, avgAlphaScore, bullishCount, bearishCount, accuracyRate }
}

useAlphaLeaderboard(userId?): {
  entries: AlphaLeaderboardEntry[]
  isLoading: boolean
  error: Error | null
  userRank: AlphaLeaderboardEntry | null
  refresh: () => Promise<void>
}

useNarrativeClusters(): {
  clusters: NarrativeCluster[]
  isLoading: boolean
  refresh: () => Promise<void>
}
```

**Options:**
- `autoRefresh` - Enable auto-refresh (default: true)
- `refreshInterval` - Interval in ms (default: 30000)
- `filter` - Signal filters (signalType, minAlphaScore, assets, urgency)

---

### 10.2 useApiKey.tsx (279 lines)
**Purpose:** API key state management with localStorage persistence

**Exports:**
```typescript
ApiKeyProvider: React.FC<{ children: ReactNode }>

useApiKey(): {
  apiKey: string | null
  keyInfo: ApiKeyInfo | null
  isLoading: boolean
  error: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  refreshKeyInfo: () => Promise<void>
  isAuthenticated: boolean
}
```

**Storage Keys:**
- `fcn_api_key` - API key
- `fcn_key_info` - Cached key info

**Cache Duration:** 5 minutes

---

### 10.3 useBookmarks.ts (~120 lines)
**Purpose:** Article bookmark management

```typescript
useBookmarks(): {
  bookmarks: BookmarkedArticle[]
  isLoaded: boolean
  count: number
  isBookmarked: (id: string) => boolean
  addBookmark: (article: Omit<BookmarkedArticle, 'bookmarkedAt'>) => void
  removeBookmark: (id: string) => void
  toggleBookmark: (article) => boolean
  clearBookmarks: () => void
}
```

**Storage Key:** `fcn_bookmarks`  
**Max Bookmarks:** 100

---

### 10.4 useLivePrice.ts (466 lines)
**Purpose:** Real-time price WebSocket hook

**Features:**
- Automatic reconnection with exponential backoff
- Batched updates (100ms intervals)
- Shared WebSocket connection
- Subscription management

```typescript
useLivePrice(options: UseLivePriceOptions): {
  price: number | null
  change24h: number | null
  isLive: boolean
  lastUpdate: Date | null
  isConnecting: boolean
  error: string | null
}
```

**WebSocket:** Binance stream (`wss://stream.binance.com:9443/ws`)

**Reconnection:**
- Max attempts: 10
- Base delay: 1000ms
- Max delay: 30000ms (exponential backoff)

---

### 10.5 usePriceFlash.ts (~120 lines)
**Purpose:** Price change visual feedback

```typescript
usePriceFlash(options: UsePriceFlashOptions): {
  flashDirection: 'up' | 'down' | null
  isFlashing: boolean
  previousPrice: number | null
  priceChange: number
  priceChangePercent: number
}
```

**Options:**
- `price` - Current price
- `debounceMs` - Debounce delay (default: 100ms)
- `flashDurationMs` - Flash duration (default: 500ms)
- `threshold` - Min % change to trigger (default: 0)

---

## 11. Function Statistics

### 11.1 File Counts by Category

| Category | File Count |
|----------|------------|
| AI/ML Functions | 12 |
| Market Data | 10 |
| Social Intelligence | 3 |
| Analytics & Research | 10 |
| Database & Storage | 2 |
| Authentication & Security | 4 |
| x402 Micropayments | 9 |
| Alerts & Webhooks | 5 |
| Utilities | 12 |
| Custom Hooks | 5 |
| **Total** | **72** |

### 11.2 Lines of Code

| Category | Approx. Lines |
|----------|---------------|
| AI/ML Functions | ~6,800 |
| Market Data | ~5,800 |
| Social Intelligence | ~2,600 |
| Analytics & Research | ~7,400 |
| Database & Storage | ~1,800 |
| Auth & Security | ~1,600 |
| x402 Micropayments | ~3,200 |
| Alerts & Webhooks | ~2,500 |
| Utilities | ~2,400 |
| Custom Hooks | ~1,200 |
| **Total** | **~35,300** |

### 11.3 Exported Functions Summary

| Module | Exported Functions |
|--------|-------------------|
| AI/ML | ~45 |
| Market Data | ~60 |
| Social Intelligence | ~20 |
| Analytics | ~40 |
| Database | ~25 |
| Auth/Security | ~15 |
| x402 | ~35 |
| Utilities | ~50 |
| Hooks | ~8 (5 hooks) |
| **Total** | **~298** |

### 11.4 External API Dependencies

| Provider | APIs Used |
|----------|-----------|
| CoinGecko | Primary market data |
| Binance | Real-time prices, derivatives |
| Bybit | Derivatives data |
| OKX | Derivatives data |
| dYdX | Derivatives data |
| DeFiLlama | TVL, DeFi yields |
| Alternative.me | Fear & Greed Index |
| LunarCrush | Social metrics |
| Santiment | Social analytics |
| Discord/Telegram | Social messages |
| Nitter | X/Twitter scraping |
| Blockchair | Whale transactions |
| x402.org | Payment facilitator |

### 11.5 AI Provider Usage

| Provider | Modules Using |
|----------|---------------|
| Groq | groq.ts, ai-services.ts, translate.ts, claim-extractor.ts |
| OpenAI | All ai-*.ts modules |
| Anthropic | All ai-*.ts modules |
| OpenRouter | All ai-*.ts modules |

---

## Appendix: Key Type Definitions

### NewsArticle (from crypto-news.ts - excluded)
Used throughout the codebase, referenced in AI and analytics modules.

### TokenPrice / CoinData
```typescript
interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  // ...
}
```

### Common Sentiment Types
```typescript
type Sentiment = 'bullish' | 'bearish' | 'neutral';
type SentimentScore = number; // -1 to 1
```

### Common Time Horizons
```typescript
type TimeHorizon = '1h' | '4h' | '1d' | '1w' | '1m';
```

---

*End of Audit Document*
