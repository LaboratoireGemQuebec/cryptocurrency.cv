---
title: "On-Chain Analysis for Beginners: How to Read Blockchain Data"
description: "Learn on-chain analysis from scratch: key metrics including MVRV, SOPR, active addresses, exchange flows, and NVT ratio. Where to find data and how to use it for trading."
date: "2026-03-30"
author: team
category: research
tags: ["on-chain analysis", "blockchain data", "metrics", "bitcoin", "trading"]
image: "/images/blog/on-chain-analysis-guide.jpg"
imageAlt: "On-chain analysis guide for beginners - reading blockchain data"
---

Every Bitcoin and Ethereum transaction is permanently recorded on a public blockchain, visible to anyone with the right tools. On-chain analysis is the practice of reading this data to understand market structure, investor behavior, and potential price turning points.

Unlike traditional technical analysis (which only looks at price and volume), on-chain analysis looks at fundamental behavioral data: are long-term holders buying or selling? Is there more Bitcoin on exchanges than usual? Are holders, on average, in profit or at a loss?

This guide introduces the most important metrics and where to find them. For on-chain data updates, follow [Crypto Vision News](/).

## Why On-Chain Analysis Works

On-chain data is fundamentally different from price data because it reflects the actual behavior of participants:

- A holder moving Bitcoin from an exchange to a private wallet signals long-term storage intent
- A holder moving Bitcoin onto an exchange may be preparing to sell
- When the average holder is in loss, capitulation and bottoms are nearby
- When the average holder is in large profit, distribution (selling to new buyers) becomes attractive

This behavioral data provides context that price charts alone cannot.

## Where to Access On-Chain Data

### Glassnode (glassnode.com)

The most comprehensive on-chain data platform. Free tier covers many basic metrics; premium (~$39–$99/month) unlocks advanced indicators. Industry standard for professional on-chain analysis.

### Dune Analytics (dune.com)

Community-built dashboards querying blockchain data via SQL. Free to use. Best for custom queries, DeFi protocol metrics, and multi-chain data not covered by Glassnode.

### IntoTheBlock (intotheblock.com)

User-friendly on-chain metrics with explanatory context. Good for beginners.

### CryptoQuant (cryptoquant.com)

Strong focus on exchange flows, miner data, and derivatives market metrics.

## Key On-Chain Metrics Explained

### 1. MVRV Ratio (Market Value to Realized Value)

**What it is:** Compares Bitcoin's market cap (current price × supply) to its realized cap (the price each coin last moved × supply).

**Formula:** MVRV = Market Cap / Realized Cap

**Interpretation:**
- **MVRV > 3.5:** Market is significantly overvalued relative to the average holder's cost basis — historically near cycle peaks
- **MVRV 1–2:** Healthy range, moderate bull market
- **MVRV < 1:** Market is undervalued; average holder is at a loss — historically near cycle bottoms

**Historical accuracy:** MVRV below 1 has marked bottom zones in every major Bitcoin bear market.

### 2. SOPR (Spent Output Profit Ratio)

**What it is:** The average profit ratio of all coins moved on a given day. If SOPR = 1.05, coins that moved that day were, on average, sold at 5% profit.

**Interpretation:**
- **SOPR > 1:** Holders are taking profits (selling above cost basis)
- **SOPR < 1:** Holders are selling at a loss (capitulation behavior)
- **SOPR consistently below 1 for extended period:** Classic bear market behavior with forced selling
- **SOPR bouncing from 1 (support) in bull market:** Bull market trend intact

**Adjusted SOPR (aSOPR)** filters out short-term holders and noise for cleaner signals.

### 3. Exchange Flows (Net Transfer Volume)

**What it is:** The net flow of Bitcoin onto or off of exchanges.

- **Exchange inflows** (coins entering exchanges): Potential selling pressure — holders preparing to sell
- **Exchange outflows** (coins leaving exchanges): Accumulation signal — holders withdrawing to cold storage, reducing sell supply

**Interpretation:**
- Sustained exchange outflows during price increases = healthy bull market with supply reducing
- Spike in exchange inflows = warning signal, potential selling incoming
- Exchange outflows during price dips = HODLers buying the dip

Track exchange balances over time — declining exchange balances across multiple months signal structural supply reduction.

### 4. Active Addresses

**What it is:** The number of unique addresses sending or receiving transactions daily.

**Interpretation:**
- Rising active addresses during price increase: Genuine adoption and new users
- Rising price with falling active addresses: Price-driven speculation without fundamental growth (warning sign)
- Bottom formation often shows stable or recovering active addresses before price recovers

**Limitation:** Address counts can be gamed; one entity can use many addresses. Look for trends over months, not days.

### 5. NVT Ratio (Network Value to Transactions)

**What it is:** Compares Bitcoin's market cap to the dollar value of transactions processed. Analogous to P/E ratio.

**Formula:** NVT = Market Cap / Daily Transaction Volume

**Interpretation:**
- **Low NVT:** Network is highly utilized relative to market cap — potentially undervalued
- **High NVT:** Market cap is high relative to transaction activity — potentially overvalued

**Limitation:** Large volume of DeFi and L2 transactions may not be fully captured in on-chain BTC metrics.

### 6. LTH vs STH Supply (Long-Term vs Short-Term Holders)

**Long-Term Holders (LTH):** Addresses that have held Bitcoin for over 155 days. These are the "smart money" of Bitcoin — they accumulate during bear markets and distribute during bull markets.

**Short-Term Holders (STH):** Addresses holding less than 155 days. More likely to be recent buyers or active traders.

**Signals:**
- **LTH accumulation rising:** Conviction that price is undervalued; bear market buying
- **LTH distribution (selling) rising:** Late-stage bull market, experienced holders taking profits from new buyers
- **STH supply in loss:** Recent buyers underwater — potential capitulation risk, but also potential bottom signal

## Building a Simple On-Chain Dashboard

A practical beginner setup on Glassnode:

1. **MVRV Ratio** — for macro cycle positioning
2. **Exchange Net Flow** — for near-term supply pressure
3. **LTH Supply** — for accumulation/distribution cycle confirmation
4. **Funding Rates** (from CryptoQuant or Coinglass) — derivatives market sentiment
5. **Fear & Greed Index** — retail sentiment context

Review this dashboard weekly. You do not need to make decisions daily based on on-chain data — it is a slower-moving, macro-level signal that complements technical analysis.

## On-Chain Signals vs Price: Timing Differences

On-chain analysis identifies market phases with high accuracy but often without precise timing. A MVRV signal below 1 may persist for 3–6 months before price bottoms. An LTH distribution signal may precede the actual top by 3–12 months.

Use on-chain analysis to:
- Confirm which phase of the market cycle you are in
- Increase conviction for accumulation or distribution decisions
- Avoid the biggest mistakes (buying at peak euphoria, selling at capitulation bottoms)

Do not use it to:
- Call exact tops and bottoms with precision
- Make short-term (days/weeks) trading decisions

On-chain analysis rewards patience and macro perspective. Combined with fundamental research and technical levels, it gives you an edge that pure chart-reading cannot provide.

Follow [Crypto Vision News](/) for on-chain metric updates, cycle analysis, and blockchain research.
