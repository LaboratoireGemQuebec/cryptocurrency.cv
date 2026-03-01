# 20 MORE Agent Build Prompts (Batch 2: Prompts 21–40)

> Continuation of [build-agents.md](build-agents.md). Each prompt is self-contained. Paste one per chat session.

---

## PROMPT 21 — Whale Alerts & On-Chain Activity Page

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts (e.g. `bun run build`, `bun run dev`)
- Use `pnpm` for package management (e.g. `pnpm install`, `pnpm add <pkg>`)
- Always use background terminals (isBackground: true) and kill them after
- Never create or modify GitHub Actions workflows
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM:
- Fonts: Inter (sans), Source Serif 4 (serif), JetBrains Mono (mono)
- Colors via CSS vars: --color-surface (#fff / dark #0a0a0a), --color-text-primary, --color-text-secondary, --color-text-tertiary, --color-accent (#3b82f6), --color-border (#e2e8f0 / dark #262626), --color-surface-secondary, --color-surface-tertiary
- Container: .container-main (max-width 1280px, auto margins, responsive padding)
- Headings use font-serif; body uses font-sans
- Use `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- UI primitives in `src/components/ui/` (Button, Badge, Card, Skeleton)
- Icons: lucide-react
- i18n: use `Link` from `@/i18n/navigation`, `useTranslations` from `next-intl`
- SEO: use `generateSEOMetadata` from `@/lib/seo`

API ROUTES AVAILABLE:
- `/api/whale-alerts` — Large wallet transfers (coin, amount, from, to, hash, timestamp)
- `/api/whales` — Top whale wallets and balances
- `/api/on-chain` or `/api/onchain` — On-chain metrics (active addresses, hash rate, etc.)
- `/api/flows` — Exchange inflow/outflow data

TASK: Create a Whale Alerts & On-Chain dashboard.

### PAGE: `src/app/[locale]/whales/page.tsx`

SECTIONS:
1. **Live Whale Feed** — Real-time scrolling feed of large transactions:
   - Create `src/components/WhaleAlertFeed.tsx` ("use client")
   - Each alert shows: 🐋 icon, amount (formatted), coin, from → to (truncated addresses), time ago
   - Color-code: green for exchange outflows (bullish), red for exchange inflows (bearish)
   - Auto-refresh every 30 seconds
   - Filter by coin: BTC, ETH, All
   - Filter by minimum amount

2. **On-Chain Stats Grid** — 6 metric cards:
   - BTC Active Addresses (24h), ETH Gas Price, BTC Hash Rate, Exchange Netflow, Staking Rate, Transaction Count

3. **Exchange Flows** — Simple bar chart or table showing net in/out for top 5 exchanges

4. **Notable Wallets** — Table of tracked whale addresses with balances and recent activity

### FILES TO CREATE:
- `src/app/[locale]/whales/page.tsx`
- `src/components/WhaleAlertFeed.tsx` ("use client" — live feed with auto-refresh)

After changes, run `bun run build` to verify. Commit: "feat: add whale alerts and on-chain activity page"
```

---

## PROMPT 22 — Liquidations & Derivatives Dashboard

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM:
- CSS vars: --color-surface, --color-accent (#3b82f6), --color-border
- .container-main, font-serif headings, cn() from @/lib/utils
- UI: Button, Badge, Card, Skeleton from src/components/ui/
- Icons: lucide-react

API ROUTES:
- `/api/liquidations` — Recent liquidation data (coin, size, side long/short, exchange, timestamp)
- `/api/derivatives` — Derivatives market data (open interest, volume)
- `/api/funding-rates` — Perpetual futures funding rates
- `/api/options` — Options market data (call/put ratio, max pain)
- `/api/hyperliquid` — Hyperliquid-specific data

TASK: Build a derivatives & liquidations dashboard.

### PAGE: `src/app/[locale]/derivatives/page.tsx`

SECTIONS:
1. **Liquidation Heatmap** — Create `src/components/LiquidationFeed.tsx` ("use client"):
   - Live feed of liquidations with animation (slide in from right)
   - Each: 💥 Long Liquidated / 📉 Short Liquidated — $amount — coin — exchange
   - Color: red for long liquidations, green for short
   - Running total: "Total liquidations (24h): $XXM"
   - Sound toggle (click sound on big liquidations > $1M)

2. **Funding Rates Table** — Create `src/components/FundingRates.tsx` ("use client"):
   - Table: Coin, Exchange, Funding Rate, Annualized %, Next Funding
   - Color: green for positive (longs pay shorts), red for negative
   - Sort by absolute rate value
   - Fetches from `/api/funding-rates`

3. **Open Interest Cards** — 4 stat cards showing total OI for BTC, ETH, SOL, Total across exchanges

4. **Options Overview** — Put/Call ratio gauge, Max Pain price for BTC and ETH

### FILES TO CREATE:
- `src/app/[locale]/derivatives/page.tsx`
- `src/components/LiquidationFeed.tsx`
- `src/components/FundingRates.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add liquidations and derivatives dashboard"
```

---

## PROMPT 23 — NFT & Gaming Page

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars (--color-surface, --color-accent, --color-border), .container-main, font-serif headings, cn(), UI: Button/Badge/Card/Skeleton, Icons: lucide-react

API ROUTES:
- `/api/nft` — NFT market data (top collections, volume, floor prices)
- `/api/gaming` — Crypto gaming & metaverse data
- `/api/news?category=nft&limit=20` — NFT news

TASK: Create NFT & Gaming page.

### PAGE: `src/app/[locale]/nft/page.tsx`

SECTIONS:
1. **NFT Market Stats** — Total NFT Market Volume (24h), Top Chain by NFT Volume, Number of Collections, Average Sale Price

2. **Top Collections Table** — Create `src/components/NFTCollections.tsx` ("use client"):
   - Columns: Rank, Collection (name + thumbnail), Floor Price, Volume (24h), % Change, Sales Count
   - Sortable columns, paginated (20 per page)
   - Collection images: small 40x40 rounded thumbnails

3. **Trending Mints** — Card grid of currently trending NFT mints with collection name, chain, mint price, minted count

4. **Gaming Section** — Separate tab or section:
   - Top blockchain games by players/volume
   - Table: Game Name, Chain, Players (24h), Volume (24h), Token Price

5. **NFT News Feed** — Latest 8 NFT news articles using `NewsCardCompact`

### FILES TO CREATE:
- `src/app/[locale]/nft/page.tsx`
- `src/components/NFTCollections.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add NFT collections and gaming dashboard"
```

---

## PROMPT 24 — Sentiment & Social Analytics Page

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI primitives, lucide-react

API ROUTES:
- `/api/sentiment` — Market sentiment scores by coin
- `/api/social` — Social media metrics (mentions, trending topics)
- `/api/influencers` — Crypto influencer data and recent posts
- `/api/narratives` — Trending crypto narratives/themes

TASK: Build a Sentiment & Social Intelligence page.

### PAGE: `src/app/[locale]/sentiment/page.tsx`

SECTIONS:
1. **Overall Market Sentiment** — Large gauge showing aggregate market sentiment (Bullish/Neutral/Bearish):
   - Reuse or adapt the FearGreedGauge component pattern (SVG semi-circle)
   - Show score, label, and trend arrow (up/down vs yesterday)

2. **Coin Sentiment Table** — Create `src/components/SentimentTable.tsx` ("use client"):
   - Columns: Coin, Sentiment Score (0-100 with colored bar), Social Volume, News Mentions, 24h Change
   - Sort by sentiment score
   - Sparkline-style sentiment history bars for last 7 days

3. **Trending Narratives** — Cards showing current hot themes:
   - e.g., "AI Tokens", "Layer 2 Season", "RWA Narrative", "Meme Coins"
   - Each card: narrative name, related coins, momentum score, trend direction
   - Fetch from `/api/narratives`

4. **Influencer Feed** — Create `src/components/InfluencerFeed.tsx` ("use client"):
   - List of top crypto influencers with recent posts/takes
   - Each: avatar, name, platform badge (Twitter/YouTube), recent post preview, follower count
   - Fetch from `/api/influencers`

5. **Social Buzz Cloud** — Visual word cloud or tag cloud of trending crypto topics (pure CSS — sized spans with varying font-size based on mention count)

### FILES TO CREATE:
- `src/app/[locale]/sentiment/page.tsx`
- `src/components/SentimentTable.tsx`
- `src/components/InfluencerFeed.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add sentiment analysis and social intelligence page"
```

---

## PROMPT 25 — Stablecoins & L2 Analytics Pages

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI primitives, lucide-react

API ROUTES:
- `/api/stablecoins` — Stablecoin market data (supply, peg health, market cap per stablecoin)
- `/api/l2` — Layer 2 data (TVL per L2, TPS, fees)
- `/api/bridges` — Cross-chain bridge volume data

TASK: Create two analytics pages.

### PAGE 1: Stablecoins — `src/app/[locale]/stablecoins/page.tsx`
1. **Total Stablecoin Supply** — Large stat card with trend
2. **Stablecoin Market Share** — Donut chart (CSS conic-gradient) showing USDT, USDC, DAI, BUSD, etc. share
3. **Stablecoin Table** — Create `src/components/StablecoinTable.tsx` ("use client"):
   - Columns: Rank, Name, Symbol, Market Cap, 24h Volume, Peg (show deviation from $1.00 — green if within 0.1%, amber if 0.1-0.5%, red if >0.5%), 7d Supply Change
   - Sortable columns
4. **De-Peg Monitor** — Highlight any stablecoins currently off-peg with warning badges

### PAGE 2: Layer 2 Analytics — `src/app/[locale]/l2/page.tsx`
1. **Total L2 TVL** — Large stat card
2. **L2 Comparison Table** — Create `src/components/L2Table.tsx` ("use client"):
   - Columns: Rank, L2 Name, Type (Optimistic/ZK), TVL, TPS, Average Fee, 7d Change
   - Visual bar indicating relative TVL per L2
3. **Bridge Volume** — Card grid of top cross-chain bridges with 24h volume
4. **Fee Comparison** — Side-by-side comparison of transaction fees: Ethereum L1 vs Arbitrum vs Optimism vs Base vs ZkSync

### FILES TO CREATE:
- `src/app/[locale]/stablecoins/page.tsx`
- `src/components/StablecoinTable.tsx`
- `src/app/[locale]/l2/page.tsx`
- `src/components/L2Table.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add stablecoin analytics and L2 comparison pages"
```

---

## PROMPT 26 — Token Unlocks & Events Calendar

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI primitives, lucide-react

API ROUTES:
- `/api/token-unlocks` or `/api/unlocks` — Upcoming token unlock events
- `/api/events` — Crypto calendar events (conferences, launches, upgrades)

TASK: Create Token Unlocks and Events Calendar pages.

### PAGE 1: Token Unlocks — `src/app/[locale]/unlocks/page.tsx`
1. **Upcoming Unlocks Timeline** — Create `src/components/UnlocksTimeline.tsx` ("use client"):
   - Vertical timeline of next 30 days of token unlocks
   - Each entry: token name, unlock date, amount unlocked, value in USD, % of circulating supply
   - Color-coded severity: red for >5% of supply, amber for 2-5%, green for <2%
   - Sort by date (nearest first)
2. **This Week's Unlocks** — Summary cards for the biggest unlocks happening this week
3. **Impact Analysis** — For top upcoming unlocks, show historical price impact of previous unlocks

### PAGE 2: Crypto Events Calendar — `src/app/[locale]/events/page.tsx`
1. **Calendar View** — Create `src/components/EventCalendar.tsx` ("use client"):
   - Month calendar grid view (pure CSS grid, 7 columns for days)
   - Events shown as colored dots/badges on their dates
   - Click a date to see events for that day in a panel below
   - Navigate months with prev/next buttons
   - Category badges: Conference (blue), Upgrade (purple), Launch (green), AMA (orange), Other (gray)
2. **Upcoming Events List** — Scrollable list view of next 30 events
   - Each: title, date, type badge, description, link
3. **Featured Events** — Top 3 events this week shown as large cards

### FILES TO CREATE:
- `src/app/[locale]/unlocks/page.tsx`
- `src/components/UnlocksTimeline.tsx`
- `src/app/[locale]/events/page.tsx`
- `src/components/EventCalendar.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add token unlocks timeline and events calendar pages"
```

---

## PROMPT 27 — Regulatory Tracker & Macro Page

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI primitives, lucide-react

API ROUTES:
- `/api/regulatory` — Crypto regulation news and updates by jurisdiction
- `/api/macro` — Macroeconomic data (interest rates, CPI, DXY, gold price)
- `/api/news?category=regulation&limit=20` — Regulation category news

TASK: Build Regulatory Tracker and Macro Dashboard pages.

### PAGE 1: Regulatory Tracker — `src/app/[locale]/regulation/page.tsx`
1. **Global Regulation Map** — Create `src/components/RegulationMap.tsx`:
   - Simplified world map showing regulatory stance per country (use color-coded country badges instead of actual SVG map for simplicity)
   - Categories: Friendly (green), Cautious (yellow), Restrictive (red), Banned (dark red), Unknown (gray)
   - Countries to include: US, EU, UK, China, Japan, Singapore, UAE, South Korea, India, Brazil, Australia, Canada, Hong Kong, Switzerland, Nigeria
   - Click country → show detail panel with latest regulatory actions
2. **Recent Regulatory Actions** — Timeline of recent regulatory decisions
   - Each: country flag/name, title, date, impact badge (Bullish/Bearish/Neutral)
3. **Regulation News** — Latest 10 regulation news articles using `NewsCardCompact`

### PAGE 2: Macro Dashboard — `src/app/[locale]/macro/page.tsx`
1. **Key Macro Indicators** — Cards showing: Fed Rate, CPI, DXY Index, Gold Price, S&P 500, 10Y Treasury Yield
2. **Crypto vs Macro Correlation** — Table showing correlation between BTC and each macro indicator (if data available)
3. **Upcoming Events** — Next FOMC meeting, CPI release date, etc.
4. **Impact Analysis** — "How macro affects crypto" educational cards

### FILES TO CREATE:
- `src/app/[locale]/regulation/page.tsx`
- `src/components/RegulationMap.tsx`
- `src/app/[locale]/macro/page.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add regulatory tracker and macro dashboard pages"
```

---

## PROMPT 28 — Predictions & Research Page

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI primitives, lucide-react

API ROUTES:
- `/api/predictions` — Price predictions/forecasts
- `/api/forecast` — Market forecasts (AI-generated)
- `/api/research` — Research reports and analysis
- `/api/signals` — Trading signals data
- `/api/backtest` — Strategy backtesting results

TASK: Create Predictions and Research pages.

### PAGE 1: Predictions — `src/app/[locale]/predictions/page.tsx`
1. **AI Price Predictions** — Create `src/components/PredictionCards.tsx` ("use client"):
   - Cards for BTC, ETH, SOL showing: current price, 7d prediction, 30d prediction, confidence level
   - Visual gauge for confidence (low/medium/high)
   - Disclaimer: "Not financial advice. AI-generated predictions for educational purposes only."
   - Fetch from `/api/predictions` or `/api/forecast`
2. **Prediction History** — Track record: how accurate were past predictions?
   - Table: Date, Coin, Predicted, Actual, Accuracy %
3. **Trading Signals** — Recent signals with Buy/Sell/Hold badges
   - Each: coin, signal type, strength (1-10), reason, timestamp

### PAGE 2: Research — `src/app/[locale]/research/page.tsx`
1. **Latest Research** — Card grid of research reports/analyses:
   - Each card: title, excerpt, date, category badge (Market Analysis, Token Review, Sector Report)
   - Rich card design with serif title, category badge, read time
2. **Research Categories** — Filter by: Market Analysis, Token Reports, Sector Deep Dives, Weekly Digest
3. **AI-Powered Analysis** — Featured card linking to ask/AI analysis features
   - "Ask AI about any crypto topic" CTA

### FILES TO CREATE:
- `src/app/[locale]/predictions/page.tsx`
- `src/components/PredictionCards.tsx`
- `src/app/[locale]/research/page.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add predictions dashboard and research hub"
```

---

## PROMPT 29 — Arbitrage Scanner & Trading Tools

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI primitives, lucide-react

API ROUTES:
- `/api/arbitrage` — Cross-exchange arbitrage opportunities
- `/api/trading` — Trading data
- `/api/orderbook` — Order book data for coins
- `/api/exchanges` — Exchange info and comparison
- `/api/exchange-rates` — Exchange rates

TASK: Create Arbitrage Scanner and Exchanges pages.

### PAGE 1: Arbitrage Scanner — `src/app/[locale]/arbitrage/page.tsx`
1. **Live Arbitrage Opportunities** — Create `src/components/ArbitrageTable.tsx` ("use client"):
   - Table: Coin, Buy Exchange, Buy Price, Sell Exchange, Sell Price, Spread %, Est. Profit
   - Auto-refresh every 15 seconds
   - Sort by spread % (highest first)
   - Filter by minimum spread (0.5%, 1%, 2%, 5%)
   - Color intensity: darker green for higher spreads
   - Disclaimer: "Arbitrage profits are theoretical. Account for fees, withdrawal times, and slippage."
2. **Top Opportunities Cards** — 3 featured cards for the highest-spread pairs

### PAGE 2: Exchanges — `src/app/[locale]/exchanges/page.tsx`
1. **Exchange Ranking Table** — Create `src/components/ExchangeTable.tsx` ("use client"):
   - Columns: Rank, Exchange Name, 24h Volume, # of Markets, Trust Score, Year Est.
   - Sortable by any column
   - External link to exchange website
   - Category tabs: Centralized (CEX) / Decentralized (DEX)
2. **Volume Distribution** — CSS donut chart showing volume share of top 10 exchanges
3. **Exchange Comparison** — Quick compare 2 exchanges side by side (fees, features, supported coins)

### FILES TO CREATE:
- `src/app/[locale]/arbitrage/page.tsx`
- `src/components/ArbitrageTable.tsx`
- `src/app/[locale]/exchanges/page.tsx`
- `src/components/ExchangeTable.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add arbitrage scanner and exchange comparison pages"
```

---

## PROMPT 30 — Ecosystem Pages: Solana, Bitcoin, Ethereum Hubs

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI primitives, lucide-react. News components: FeaturedCard, NewsCard, NewsCardCompact, NewsCardHeadline from @/components/NewsCard.

API ROUTES:
- `/api/solana` — Solana ecosystem data (TPS, validators, DEX volume)
- `/api/bitcoin` — Bitcoin network data (hash rate, blocks, mempool)
- `/api/news?category=bitcoin&limit=20`, `/api/news?category=ethereum&limit=20`, `/api/news?search=solana&limit=20`
- `getBitcoinNews(limit)`, `getEthereumNews(limit)` from `@/lib/crypto-news`

TASK: Create 3 ecosystem hub pages — each a dedicated landing page for a major blockchain.

### PAGE 1: Bitcoin Hub — `src/app/[locale]/bitcoin/page.tsx`
1. **Hero** — "Bitcoin" with live BTC price (large), 24h change, all-time high
2. **Network Stats** — Cards: Hash Rate, Block Height, Difficulty, Mempool Size, Avg Fee, Avg Block Time
3. **Price Chart** — Embed the PriceChart component (already exists at `src/components/PriceChart.tsx`) for BTC
4. **Bitcoin News** — Latest 10 Bitcoin news using `NewsCardCompact`
5. **Educational Links** — "What is Bitcoin?", "Bitcoin Whitepaper", "Lightning Network"

### PAGE 2: Ethereum Hub — `src/app/[locale]/ethereum/page.tsx`
1. **Hero** — "Ethereum" with live ETH price, 24h change, ATH
2. **Network Stats** — Cards: Gas Price (gwei), Staking APR, Total Staked, Burn Rate, Active Validators, TPS
3. **Price Chart** — PriceChart for ETH
4. **Top DeFi on Ethereum** — 5 largest DeFi protocols on Ethereum (name, TVL)
5. **Ethereum News** — Latest 10 ETH news

### PAGE 3: Solana Hub — `src/app/[locale]/solana/page.tsx`
1. **Hero** — "Solana" with SOL price, 24h change
2. **Network Stats** — TPS, Validators, Slot Height, SOL Staked, Avg Fee
3. **Price Chart** — PriceChart for SOL
4. **Solana Ecosystem** — Top Solana DeFi/DEX protocols
5. **Solana News** — Latest 10 Solana news

Each page: Server Component, use `generateSEOMetadata` for SEO, `revalidate = 300`.

### FILES TO CREATE:
- `src/app/[locale]/bitcoin/page.tsx`
- `src/app/[locale]/ethereum/page.tsx`
- `src/app/[locale]/solana/page.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add Bitcoin, Ethereum, and Solana ecosystem hub pages"
```

---

## PROMPT 31 — Settings Page & User Preferences

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI: Button/Card, Icons: lucide-react. Theme hook: `useTheme()` from `@/components/ThemeProvider`.

EXISTING: 98 locale message files in `messages/` (af.json, ar.json, ... zh.json). The i18n locales list is in `src/i18n/config.ts`.

TASK: Build a comprehensive settings page.

### PAGE: `src/app/[locale]/settings/page.tsx` ("use client")

Create `src/components/SettingsPanel.tsx` ("use client") with tabbed sections:

1. **Appearance Tab**:
   - Theme: Light / Dark / System radio buttons (uses `setTheme` from `useTheme()`)
   - Font size: Small / Default / Large / Extra Large
   - Compact mode: toggle (reduces padding/spacing throughout the site)
   - Store in localStorage `"fcn-settings"`

2. **Language Tab**:
   - Searchable list of 98 languages
   - Current language highlighted
   - Clicking a language navigates to `/{locale}/settings`
   - Use `useRouter` from `@/i18n/navigation` for locale switching
   - Group by region: Americas, Europe, Asia, Africa, Middle East

3. **Content Preferences Tab**:
   - Default news category: dropdown of all categories
   - Show AI summaries: toggle (default on)
   - Show price changes: toggle (default on)
   - Default currency: USD / EUR / GBP / JPY / BTC dropdown
   - Articles per page: 10 / 20 / 30 / 50

4. **Notifications Tab**:
   - Browser notifications: toggle + request permission button
   - Price alert notifications: toggle
   - Breaking news notifications: toggle
   - Sound effects: toggle

5. **Data & Privacy Tab**:
   - Export data: button to download all localStorage data as JSON
   - Clear all data: button with confirmation dialog
   - Cookie preferences: manage
   - Shows storage usage
   
6. **Danger Zone**:
   - "Reset All Settings" with confirmation

### FILES TO CREATE:
- `src/app/[locale]/settings/page.tsx`
- `src/components/SettingsPanel.tsx`
- `src/hooks/useSettings.ts` (settings context/hook with localStorage persistence)

After changes, run `bun run build` to verify. Commit: "feat: add comprehensive settings page with preferences"
```

---

## PROMPT 32 — Digest / Newsletter Archive Page

```
You are building the frontend for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9, next-intl.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: CSS vars, .container-main, font-serif headings, cn(), UI primitives, lucide-react

API ROUTES:
- `/api/digest` — Daily/weekly crypto news digests
- `/api/newsletter` — Newsletter subscription endpoint
- `/api/summarize` — AI summarization

TASK: Build a newsletter/digest page.

### PAGE: `src/app/[locale]/digest/page.tsx`

SECTIONS:
1. **Subscribe CTA** — Prominent email signup form:
   - Email input + "Subscribe" button
   - Frequency toggle: Daily / Weekly
   - POST to `/api/newsletter`
   - Success/error toast feedback

2. **Latest Digest** — Featured card showing today's or most recent digest:
   - Date, title ("Crypto Daily: March 1, 2026"), key highlights (3-5 bullet points)
   - Full digest link
   - AI-generated summary of top stories

3. **Digest Archive** — Create `src/components/DigestArchive.tsx` ("use client"):
   - Chronological list of past digests
   - Each entry: date, title, number of stories covered, "Read" link
   - Filter: Daily / Weekly
   - Paginated (10 per page)
   - Expandable preview showing the digest content inline

4. **What's Included** — Feature cards explaining:
   - Top Stories, Market Movers, DeFi Updates, Regulatory News, Predictions

### FILES TO CREATE:
- `src/app/[locale]/digest/page.tsx`
- `src/components/DigestArchive.tsx`

After changes, run `bun run build` to verify. Commit: "feat: add newsletter digest page with archive"
```

---

## PROMPT 33 — E2E Test Suite Update (Playwright)

```
You are maintaining the test suite for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

EXISTING E2E TESTS in `e2e/`:
- accessibility.spec.ts, home.spec.ts, markets.spec.ts, api.spec.ts, developers.spec.ts, status.spec.ts, i18n.spec.ts, trading.spec.ts, console-errors.spec.ts, etc.

These tests were written for the OLD frontend and will fail on the new design. The pages now use:
- `container-main` class for layout
- `font-serif` class on headings
- CSS variables (--color-*)
- Server Components with data from @/lib/crypto-news
- Components: Header (with mobile menu, theme toggle), Footer, NewsCard variants

PLAYWRIGHT CONFIG: `playwright.config.ts` in project root.

TASK: Update ALL existing e2e tests to work with the new frontend, and add new tests for new pages.

### UPDATES NEEDED:
1. **`e2e/home.spec.ts`** — Update selectors:
   - Check for `h1` or `h2` with "Latest News", hero section
   - Verify NewsCard elements render
   - Check Header nav items presence
   - Check Footer renders
   - Verify structured data in `<head>`

2. **`e2e/markets.spec.ts`** — Update for new MarketTable:
   - Check for market stat cards
   - Verify table headers (Coin, Price, Market Cap, etc.)
   - Test sort functionality

3. **`e2e/accessibility.spec.ts`** — Update:
   - Check skip link (`.skip-link`) exists
   - Verify focus management
   - Check color contrast (--color-text-primary vs --color-surface)
   - Check all images have alt text
   - ARIA landmarks: header, main, footer

4. **NEW `e2e/search.spec.ts`** — Test search page:
   - Type query, see results
   - Filter by category
   - Clear search

5. **NEW `e2e/navigation.spec.ts`** — Test site navigation:
   - All main nav links work
   - Mobile menu opens/closes
   - Theme toggle switches between light/dark
   - Breadcrumbs on subpages

6. **NEW `e2e/defi.spec.ts`** — Test DeFi page renders tables

7. **Update `e2e/i18n.spec.ts`** — Ensure locale switching works with new layout

### APPROACH:
- Read each existing test file first to understand what it tests
- Update selectors and assertions for new design
- Don't change the test structure, just update the DOM queries
- Run `bunx playwright test --reporter=list` to verify (start dev server first with `bun run dev`)

### FILES TO MODIFY:
- Update: `e2e/home.spec.ts`
- Update: `e2e/markets.spec.ts`
- Update: `e2e/accessibility.spec.ts`
- Update: `e2e/i18n.spec.ts`
- Update: `e2e/console-errors.spec.ts`
- Create: `e2e/search.spec.ts`
- Create: `e2e/navigation.spec.ts`
- Create: `e2e/defi.spec.ts`

After changes, run `bun run build` to verify. Commit: "test: update e2e tests for new frontend design"
```

---

## PROMPT 34 — Unit Test Suite for New Components (Vitest)

```
You are maintaining the test suite for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, TypeScript 5.9.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

TEST FRAMEWORK: Vitest (configured in `vitest.config.ts`, setup in `vitest.setup.ts`). Run with `bun run test`.

EXISTING: 46 test files under `src/`, but many test OLD components that no longer exist.

COMPONENTS TO TEST (all in `src/components/`):
- `ThemeProvider.tsx` — Context provider with light/dark/system theme
- `Toast.tsx` — Toast notification system with auto-dismiss
- `NewsCard.tsx` — 4 variants: FeaturedCard, NewsCard, NewsCardCompact, NewsCardHeadline
- `ui/Button.tsx` — CVA-based button with 6 variants and 4 sizes
- `ui/Badge.tsx` — CVA badges with category color mapping
- `ui/Card.tsx` — Card with Header/Title/Content/Footer subcomponents
- `BookmarksProvider.tsx` — localStorage-backed bookmarks context
- `watchlist/index.tsx` — localStorage-backed watchlist context
- `portfolio/index.tsx` — Portfolio tracker context with PnL calculation

UTILITY: `src/lib/utils.ts` — `cn()`, `formatTimeAgo()`, `truncate()`

TASK: Write comprehensive unit tests for all new components and utilities.

### TEST FILES TO CREATE:
1. **`src/lib/__tests__/utils.test.ts`** — Test cn(), formatTimeAgo(), truncate()
2. **`src/components/__tests__/Button.test.tsx`** — Render all variants/sizes, asChild prop, disabled state
3. **`src/components/__tests__/Badge.test.tsx`** — All variants, categoryToBadgeVariant mapping
4. **`src/components/__tests__/Card.test.tsx`** — Render Card with all sub-components
5. **`src/components/__tests__/NewsCard.test.tsx`** — All 4 variants with mock article data
6. **`src/components/__tests__/ThemeProvider.test.tsx`** — Theme switching, localStorage persistence, system preference detection
7. **`src/components/__tests__/Toast.test.tsx`** — Show toast, auto-dismiss, different types
8. **`src/components/__tests__/BookmarksProvider.test.tsx`** — CRUD operations, localStorage sync
9. **`src/components/__tests__/WatchlistProvider.test.tsx`** — Add/remove coins, max limit
10. **`src/components/__tests__/PortfolioProvider.test.tsx`** — Holdings CRUD, PnL calculation

### TEST APPROACH:
- Use `@testing-library/react` for component rendering
- Mock localStorage with a simple in-memory implementation
- Mock fetch with `vi.fn()`
- Mock next-intl with `vi.mock('next-intl')`
- Test both rendering and interaction
- Each file should have 5-10 test cases

### ALSO: Check `vitest.setup.ts` and ensure it has proper DOM setup (jsdom or happy-dom). Add `@testing-library/react` if not installed:
```bash
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

After changes, run `bun run test:run` to verify. Commit: "test: add unit tests for new UI components and providers"
```

---

## PROMPT 35 — Responsive Design Audit & Mobile Polish

```
You are doing a responsive design audit for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM:
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Container: .container-main (max-width 1280px, responsive padding: 1rem → 1.5rem → 2rem)
- Header height: 64px (--header-height)

TASK: Audit every page and component for mobile responsiveness, fix issues, and add mobile-specific enhancements.

### AUDIT CHECKLIST — Check and fix each:

1. **Header** (`src/components/Header.tsx`):
   - Mobile menu animation (slide in from right)
   - All dropdowns replaced with accordion-style on mobile
   - Search button always visible
   - Theme toggle accessible
   - Proper z-index layering
   - Body scroll lock when menu is open

2. **Homepage** (`src/app/[locale]/page.tsx`):
   - Hero: stack vertically on mobile (image on top, text below)
   - Top stories: 1 column on mobile, 2 on sm, 4 on lg
   - Sidebar: stack below main content on mobile
   - Trending section: horizontal scroll on mobile

3. **MarketTable** (`src/components/MarketTable.tsx`):
   - Horizontal scroll with sticky first column (coin name)
   - Hide less important columns on mobile (volume, market cap on sm screens)
   - Compact row height on mobile

4. **All Tables** (DefiTable, FundingRates, etc.):
   - Same sticky column + horizontal scroll pattern
   - Minimum touch target size (44px) for all interactive elements

5. **Footer** (`src/components/Footer.tsx`):
   - Stack columns vertically on mobile
   - Collapsible sections on mobile (tap to expand)

6. **Cards** (all Card-based layouts):
   - Full-width on mobile
   - Proper padding reduction on small screens
   - Image aspect ratio maintained

7. **Typography**:
   - Font sizes scale down on mobile (h1: text-2xl on mobile vs text-4xl on desktop)
   - Line lengths comfortable (max 65ch for prose content)

8. **Touch Targets**:
   - All buttons/links minimum 44x44px on mobile
   - Adequate spacing between tap targets

9. **Print Styles** — Add `@media print` rules to `globals.css`:
   - Hide header, footer, nav, ads
   - Black text on white background
   - Show full URLs after links

### FILES TO MODIFY:
- `src/app/globals.css` (add print styles, mobile utilities)
- `src/components/Header.tsx` (mobile menu polish)
- `src/components/Footer.tsx` (mobile collapsible sections)
- `src/components/MarketTable.tsx` (mobile table handling)
- `src/app/[locale]/page.tsx` (responsive grid fixes)
- Any other components that need responsive fixes

After changes, run `bun run build` to verify. Commit: "fix: comprehensive responsive design audit and mobile polish"
```

---

## PROMPT 36 — SEO Enhancement: Sitemap, Robots, OG Images, Structured Data

```
You are optimizing SEO for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, TypeScript 5.9.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

SITE URL: https://cryptocurrency.cv
EXISTING: `src/lib/seo.ts` has generateSEOMetadata, generateArticleMetadata, generateCoinMetadata, generateCategoryMetadata
EXISTING: `src/components/StructuredData.tsx` has WebsiteStructuredData, OrganizationStructuredData, NewsListStructuredData

TASK: Enhance SEO across the entire site.

### 1. Dynamic Sitemap — `src/app/sitemap.ts`
Create a Next.js sitemap.ts that generates a comprehensive XML sitemap:
- Static pages: /, /markets, /defi, /search, /about, /pricing, /developers, /contact, /sources, /status, /privacy, /terms, /learn, /whales, /derivatives, /nft, /sentiment, /stablecoins, /l2, /unlocks, /events, /regulation, /macro, /predictions, /research, /arbitrage, /exchanges, /bitcoin, /ethereum, /solana, /settings, /digest, /fear-greed, /heatmap, /screener, /gas, /calculator, /compare, /watchlist, /portfolio, /bookmarks, /alerts, /blog
- Include all locale variants for top 10 locales
- Set priority: homepage 1.0, major sections 0.8, subpages 0.6
- lastModified: current date
- changeFrequency: hourly for news pages, daily for static

### 2. Robots.txt — `src/app/robots.ts`
- Allow all crawlers
- Disallow: /api/, /_next/, /admin
- Sitemap: https://cryptocurrency.cv/sitemap.xml

### 3. OG Image Route — `src/app/api/og/route.tsx`
- Check if this already exists (it's in the API routes list)
- If exists, update styling to match new design (Inter font, accent blue, clean layout)
- If not, create dynamic OG image generation using `next/og` (ImageResponse):
  - Accept query params: title, description, category
  - Generate 1200x630 image with: site name, title, category badge, gradient background
  - Dark theme with accent color

### 4. Enhanced Structured Data — Update `src/components/StructuredData.tsx`:
- Add `BreadcrumbStructuredData` component for breadcrumb rich results
- Add `FAQStructuredData` component for FAQ pages (pricing, about)
- Add `ArticleStructuredData` using NewsArticle schema (for article pages)
- Add `SoftwareApplicationStructuredData` for the API product
- Ensure all structured data passes Google Rich Results Test

### 5. Meta Tags Audit:
- Ensure every page has unique title and description
- Add `canonical` URLs to all pages
- Add `hreflang` alternate links (already exists in AlternateLinks.tsx — verify it works)

### FILES TO CREATE/MODIFY:
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify or create: `src/app/api/og/route.tsx`
- Enhance: `src/components/StructuredData.tsx`

After changes, run `bun run build` to verify. Commit: "feat: enhance SEO with sitemap, robots, OG images, and rich structured data"
```

---

## PROMPT 37 — Performance Optimization: Loading States, Suspense, Caching

```
You are optimizing performance for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, TypeScript 5.9.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

DESIGN SYSTEM: Skeleton component at `src/components/ui/Skeleton.tsx`, `.skeleton` CSS class with shimmer animation in globals.css.

TASK: Optimize performance and loading experience across the site.

### 1. Page-Level Loading States:
Create proper `loading.tsx` files with skeleton UIs matching the actual page layout:

- **`src/app/[locale]/loading.tsx`** (already exists — enhance it):
  - Full skeleton of homepage: hero skeleton, grid of card skeletons, sidebar skeletons
  
- **`src/app/[locale]/markets/loading.tsx`**:
  - Stat card skeletons (6), table header skeleton, 10 table row skeletons

- **`src/app/[locale]/coin/[id]/loading.tsx`**:
  - Coin header skeleton, chart placeholder, stats grid skeletons

- **`src/app/[locale]/defi/loading.tsx`**:
  - Stats row skeletons, table skeletons

- **`src/app/[locale]/article/[id]/loading.tsx`**:
  - Title skeleton, meta skeletons, content paragraph skeletons

### 2. Suspense Boundaries:
Add `<Suspense>` boundaries with skeleton fallbacks inside pages that have multiple data-fetching sections. This allows independent sections to stream in as they load.

Example for homepage: wrap the sidebar trending section in its own Suspense so the main feed appears first.

### 3. Image Optimization:
- Create `src/components/OptimizedImage.tsx`:
  - Wrapper around `<img>` that adds: lazy loading, blur placeholder, error fallback, aspect ratio container
  - Handle broken image URLs gracefully (show category-colored placeholder)
  - Use Intersection Observer for lazy loading instead of native `loading="lazy"` for better control

### 4. Data Caching Strategy:
- Check all API fetch calls on server components and ensure proper `next: { revalidate: N }` options
- Group fetch calls using `Promise.all()` where possible (some pages may be doing sequential fetches)
- Add `export const revalidate = 300` to all server component pages that don't have it

### 5. Bundle Analysis:
- Add `"analyze": "ANALYZE=true bun run build"` script to package.json
- Check `next.config.analyzer.js` — ensure bundle analyzer is properly configured

### FILES TO CREATE/MODIFY:
- Enhance: `src/app/[locale]/loading.tsx`
- Create: `src/app/[locale]/markets/loading.tsx`
- Create: `src/app/[locale]/coin/[id]/loading.tsx`
- Create: `src/app/[locale]/defi/loading.tsx`
- Create: `src/app/[locale]/article/[id]/loading.tsx`
- Create: `src/components/OptimizedImage.tsx`
- Audit & modify: Multiple page files for Suspense boundaries and caching

After changes, run `bun run build` to verify. Commit: "perf: add loading skeletons, suspense boundaries, and image optimization"
```

---

## PROMPT 38 — Accessibility Deep Dive (WCAG 2.1 AA Compliance)

```
You are performing an accessibility audit for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

EXISTING A11Y FEATURES:
- Skip link (`.skip-link` in globals.css and layout.tsx)
- Focus ring (`:focus-visible` with --color-accent)
- ARIA landmarks in layout (header, main, footer)
- `alt` text on article images

TASK: Achieve WCAG 2.1 AA compliance across the entire site.

### 1. Focus Management:
- Ensure every interactive element is keyboard-accessible
- Add `tabindex` where needed
- Focus trap in modals (GlobalSearch, AddHoldingModal, etc.)
- Focus restoration when closing modals (return to trigger element)

### 2. ARIA Labels — Audit and add to:
- Header: `<nav aria-label="Main navigation">`, mobile menu button: `aria-expanded`, `aria-controls`
- Theme toggle: `aria-label="Switch to dark/light mode"`
- All icon-only buttons need `aria-label` (search, bookmark, watchlist star, share buttons)
- Tables: `<table aria-label="...">`, sortable columns: `aria-sort="ascending/descending/none"`
- Cards: consider `role="article"` for news cards for screen readers
- Live regions: `aria-live="polite"` for live price ticker, toast notifications

### 3. Color Contrast:
- Verify all text/background combinations meet 4.5:1 ratio (AA normal text)
- Check both light and dark mode
- Fix any insufficient contrast in: --color-text-tertiary on --color-surface, Badge variants, category colors
- Ensure green/red price change colors are accessible (add ▲/▼ arrows so color isn't the only indicator)

### 4. Screen Reader Enhancements:
- Add `sr-only` descriptive text (Tailwind: `.sr-only` class) for visual elements
- Price changes: "Bitcoin $42,000 up 3.5%" not just "$42,000 +3.5%"
- Badge labels: announce category names
- Charts: provide text alternatives for visual data

### 5. Reduced Motion:
Add to globals.css:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 6. Form Accessibility:
- All inputs have associated `<label>`
- Error messages linked via `aria-describedby`
- Required fields marked with `aria-required="true"`
- Form submission success/error announced via `aria-live`

### FILES TO MODIFY:
- `src/app/globals.css` (reduced motion, sr-only utilities)
- `src/components/Header.tsx` (ARIA labels, roles, expanded states)
- `src/components/Footer.tsx` (ARIA labels)
- `src/components/NewsCard.tsx` (semantic article markup)
- `src/components/GlobalSearch.tsx` (focus trap, ARIA)
- `src/components/Toast.tsx` (aria-live region)
- `src/components/ui/Button.tsx` (ensure a11y defaults)
- Any other components with a11y gaps

After changes, run `bun run build` to verify. Commit: "a11y: comprehensive WCAG 2.1 AA accessibility audit and fixes"
```

---

## PROMPT 39 — i18n Message Audit & Translation Key Sync

```
You are maintaining internationalization for cryptocurrency.cv — a crypto news aggregator with 98 locale message files.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

EXISTING:
- 98 JSON message files in `messages/` (af.json through zh.json)
- `src/i18n/config.ts` — locale list, RTL locale detection
- `src/i18n/request.ts` — next-intl request config
- `src/i18n/navigation.ts` — navigation helpers
- Components use `useTranslations()` from `next-intl`
- Scripts: `bun run i18n:check`, `bun run i18n:validate`

TASK: Audit and sync all i18n translation keys to match the new frontend.

### 1. AUDIT: Check what translation keys the new components actually use:
- Search all `*.tsx` files for `t("...")` calls, `useTranslations("namespace")` calls
- List every translation key needed by the new frontend
- Compare against the keys in `messages/en.json`

### 2. UPDATE `messages/en.json`:
Add all missing keys used by new components. Organize by namespace. Expected namespaces:
- `common`: navigation labels, buttons, footer text
- `home`: homepage section titles, CTAs
- `markets`: table headers, stats labels
- `search`: placeholder text, result labels, filter labels
- `article`: reading labels, share buttons, related articles
- `defi`: DeFi-specific labels
- `settings`: settings page labels
- `errors`: error messages, not found, error boundary
- `a11y`: screen reader labels

### 3. SYNC OTHER LOCALES:
- For the top 10 locales (es, fr, de, ja, ko, zh-CN, pt, ru, ar, hi), add placeholder translations using the English key as a fallback
- For all other locales, just add the keys with English values (will be translated later)
- Run `bun run i18n:check` to verify sync

### 4. UPDATE COMPONENTS to use `t()`:
Some components may have hardcoded English text. Find and replace with translation keys:
- Header: nav labels ("Home", "Markets", "News", etc.)
- Footer: section titles
- Button text: "Load More", "Subscribe", "Search", etc.
- Error pages: "Page Not Found", "Something went wrong"
- Empty states: "No results found", "Your watchlist is empty"

### FILES TO MODIFY:
- Update: `messages/en.json` (canonical keys)
- Update: Top 10 locale files
- Update: Components with hardcoded English text
- May run: `bun run i18n:check` to validate

After changes, run `bun run build` to verify. Commit: "i18n: audit and sync translation keys for new frontend"
```

---

## PROMPT 40 — Build Fix, TypeScript Audit & Integration Verification

```
You are doing a final integration pass for cryptocurrency.cv — a crypto news aggregator built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 5.9.

IMPORTANT RULES:
- Use `bun` to run scripts; Use `pnpm` for packages
- Always use background terminals (isBackground: true) and kill them after
- Commit and push as `nirholas` (email: 22895867+nirholas@users.noreply.github.com)

CONTEXT: 40 separate agents have been building different parts of the frontend in parallel. There may be:
- Import conflicts (multiple agents modifying the same file differently)
- TypeScript errors from incompatible type assumptions
- Missing dependencies
- Duplicate component implementations
- Broken imports to files that were moved/renamed
- CSS class conflicts

TASK: Fix EVERYTHING until `bun run build` succeeds with zero errors.

### STEP-BY-STEP:

1. **Run build, capture ALL errors:**
   ```bash
   bun run build 2>&1 | tee /tmp/build-errors.log
   ```

2. **Run TypeScript check:**
   ```bash
   bunx tsc --noEmit 2>&1 | tee /tmp/ts-errors.log
   ```

3. **Fix every error** — Common issues to look for:
   - Missing imports: add the import or create the missing file
   - Type mismatches: align types (check the canonical types in `@/lib/crypto-news`)
   - Duplicate exports: merge or remove duplicates
   - Module not found: check the actual file path, fix import paths
   - Unused imports: remove them
   - "Cannot use import statement outside a module": fix module format

4. **Verify all navigation links:**
   - Check Header NAV_ITEMS — all href values should point to pages that exist
   - Check Footer links
   - Check all `<Link href="...">` calls across all pages

5. **Verify layout integration:**
   - All pages should render within the locale layout (Header + Footer)
   - All providers in layout.tsx should still work
   - No duplicate Header/Footer renders (pages include their own, which is intentional)

6. **Check for unused code:**
   - Run `bun run audit:unused` (knip) to find dead imports
   - Remove any orphaned components/files

7. **Run lint:**
   ```bash
   bun run lint 2>&1 | head -50
   ```
   Fix any critical lint errors.

8. **Final build verification:**
   ```bash
   bun run build
   ```
   Must complete with 0 errors.

### APPROACH:
- Do NOT rewrite components — only fix errors
- When two components conflict, check which one matches the design system better
- If a file is genuinely broken, check git log for the most recent working version
- Be methodical: fix one error at a time, re-run build, repeat

After ALL errors are fixed, commit: "fix: resolve all build errors and integration conflicts from parallel agent work"
```

---

## Summary Table (Prompts 21–40)

| # | Prompt | New Pages/Components | Priority |
|---|--------|---------------------|----------|
| 21 | Whale Alerts & On-Chain | whales page, WhaleAlertFeed | MEDIUM |
| 22 | Liquidations & Derivatives | derivatives page, LiquidationFeed, FundingRates | MEDIUM |
| 23 | NFT & Gaming | nft page, NFTCollections | MEDIUM |
| 24 | Sentiment & Social | sentiment page, SentimentTable, InfluencerFeed | MEDIUM |
| 25 | Stablecoins & L2 | 2 pages, StablecoinTable, L2Table | MEDIUM |
| 26 | Token Unlocks & Events | 2 pages, UnlocksTimeline, EventCalendar | MEDIUM |
| 27 | Regulatory & Macro | 2 pages, RegulationMap | MEDIUM |
| 28 | Predictions & Research | 2 pages, PredictionCards | MEDIUM |
| 29 | Arbitrage & Exchanges | 2 pages, ArbitrageTable, ExchangeTable | MEDIUM |
| 30 | Bitcoin/ETH/SOL Hubs | 3 ecosystem pages | HIGH |
| 31 | Settings Page | settings page, SettingsPanel, useSettings | HIGH |
| 32 | Digest/Newsletter | digest page, DigestArchive | MEDIUM |
| 33 | E2E Test Update | 8 e2e test files | HIGH |
| 34 | Unit Tests | 10 test files | HIGH |
| 35 | Responsive Audit | Multiple component fixes | HIGH |
| 36 | SEO Enhancement | sitemap, robots, OG, structured data | HIGH |
| 37 | Performance Optimization | Loading states, Suspense, images | HIGH |
| 38 | Accessibility (WCAG) | Multiple component fixes | HIGH |
| 39 | i18n Message Sync | 98+ message files, component updates | MEDIUM |
| 40 | Build Fix & Integration | Fix everything until build passes | CRITICAL (run last) |

**Parallel-safe groups:**
- Group A: 21, 22, 23, 24 (separate feature pages, no shared files)
- Group B: 25, 26, 27, 28, 29 (separate feature pages, no shared files)
- Group C: 30, 31, 32 (separate pages, no conflicts)
- Group D: 33, 34 (different test frameworks, different files)
- Group E: 35, 36, 37, 38 (may touch same files — use caution)

**Run 39 after most pages are built.** **Run 40 LAST — it's the integration fixer.**
