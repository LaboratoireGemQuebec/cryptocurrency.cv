---
title: "What Is Uniswap? The World's Largest DEX Explained"
description: "Learn everything about Uniswap: its history from v1 to v4, how the AMM works, the UNI token, fees, concentrated liquidity, and a step-by-step guide to trading."
date: "2026-03-30"
author: team
category: defi
tags: ["uniswap", "DEX", "AMM", "ethereum", "trading"]
image: "/images/blog/what-is-uniswap.jpg"
imageAlt: "What is Uniswap - the world's largest decentralized exchange explained"
---

Uniswap is the protocol that proved decentralized exchanges could work at scale. Launched in November 2018, it has grown from a weekend project into the world's largest DEX by volume, processing billions of dollars in daily swaps without a central company controlling trades, holding funds, or requiring accounts.

If you have ever swapped tokens in a DeFi wallet, you have likely used Uniswap — directly or through an aggregator routing through it. Here is everything you need to know. For more DeFi analysis, visit [Crypto Vision News](/).

## A Brief History of Uniswap

### Uniswap v1 (November 2018)

Hayden Adams launched Uniswap v1 on Ethereum mainnet after learning Solidity from scratch, inspired by a post from Ethereum founder Vitalik Buterin. The original protocol was remarkably simple: ETH and one ERC-20 token per pool, using the constant product formula x*y=k. It proved the concept worked.

### Uniswap v2 (May 2020)

Version 2 introduced direct ERC-20 to ERC-20 pools (no ETH wrapping required), time-weighted average price oracles (TWAP), and flash swaps. It became the dominant DEX during DeFi Summer 2020.

### Uniswap v3 (May 2021)

The most significant upgrade: concentrated liquidity. LPs could choose price ranges rather than providing liquidity uniformly across all prices. This made capital up to 4,000x more efficient in some configurations. It also introduced multiple fee tiers (0.01%, 0.05%, 0.3%, 1%).

### Uniswap v4 (2024)

Version 4 introduced "hooks" — smart contracts that attach to pools and execute custom logic before and after swaps, liquidity changes, or fee collection. This enabled native limit orders, dynamic fees, TWAP-based pricing, and entirely new pool mechanics. Combined with singleton architecture (all pools in one contract) and flash accounting, v4 dramatically reduced gas costs.

## How Uniswap's AMM Works

Uniswap uses an Automated Market Maker rather than an order book. The math governing pricing is:

**x * y = k**

Where x and y are the quantities of the two tokens in the pool, and k remains constant. When you buy token A, you add token B to the pool, changing the ratio and thus the price.

**Price impact:** Large trades relative to pool size cause significant price impact. A $100,000 trade in a $10 million pool has 1% price impact. The same trade in a $100,000 pool would completely drain it.

**Arbitrage keeps prices accurate:** When Uniswap's price diverges from Coinbase or Binance, arbitrageurs buy on the cheaper venue and sell on the more expensive one, quickly bringing prices back into alignment.

## Uniswap Fee Structure

| Fee Tier | Best For | Example Pairs |
|---------|---------|---------------|
| 0.01% | Stable/stable | USDC/USDT |
| 0.05% | Correlated assets | ETH/stETH, WBTC/WETH |
| 0.3% | Standard pairs | ETH/USDC |
| 1% | Exotic/volatile | New tokens, low-cap alts |

100% of fees go to liquidity providers — Uniswap Labs has not yet activated its protocol fee switch for most pools.

## The UNI Token

UNI launched in September 2020 via airdrop to all historical users — approximately 400 UNI per address, worth thousands of dollars at peak. Today, UNI is a governance token allowing holders to vote on:

- Activating the protocol fee switch
- Adding new fee tiers
- Deploying Uniswap to new chains
- Treasury grants and initiatives

**Tokenomics:** 1 billion UNI total supply, with tokens allocated to the community (60%), team (21.5%), investors (18.5%). Significant portions remain in the community treasury.

UNI does not currently capture protocol revenue directly, which has been a governance debate since launch. A fee switch vote has periodically come close to passing.

## Concentrated Liquidity in Practice

To understand the power of v3 concentrated liquidity:

**v2 scenario:** $10,000 spread across all ETH prices from $0 to infinity. Most capital sits idle at extreme prices that ETH never trades at.

**v3 scenario:** Same $10,000 concentrated between $2,500 and $3,500 ETH. Assuming ETH trades in this range, your capital earns fees as if you had deposited $40,000+ in a v2 pool.

The tradeoff: if ETH moves outside your range, you stop earning fees and become 100% exposed to one token. Active management or automated tools like Gamma are recommended for v3 positions.

## Uniswap Across Chains

Uniswap v3 and v4 are deployed on:
- Ethereum mainnet
- Arbitrum
- Optimism
- Polygon
- Base
- BNB Chain
- Avalanche
- And numerous other EVM chains

For most users, Arbitrum and Base offer the best combination of liquidity and low gas fees for everyday swaps.

## How to Trade on Uniswap: Step-by-Step

1. **Visit** [app.uniswap.org](https://app.uniswap.org) in your browser
2. **Connect wallet** — MetaMask, Coinbase Wallet, WalletConnect, or hardware wallet
3. **Select network** — Ethereum, Arbitrum, Base, etc.
4. **Choose tokens** — select what you want to swap from and to
5. **Check price impact** — displayed below the swap box; above 1% is significant
6. **Set slippage** — auto is usually fine; increase to 0.5–1% for volatile tokens
7. **Review and swap** — confirm in your wallet and wait for the transaction

**Pro tip:** For large trades, check aggregators like 1inch or Paraswap first — they may route through multiple pools for better pricing.

## Uniswap vs Competitors

| Exchange | Type | Volume Rank | Key Advantage |
|----------|------|-------------|--------------|
| Uniswap | AMM DEX | #1 DEX | Deepest ETH liquidity, v4 hooks |
| Curve | AMM DEX | #2 DEX | Best stable/stable rates |
| dYdX | Orderbook DEX | Top 5 | Derivatives, perps |
| Aerodrome | AMM DEX | Top Base | Highest Base TVL |
| PancakeSwap | AMM DEX | Top BNB | Largest on BNB Chain |

## Common Uniswap Mistakes to Avoid

- **Not checking price impact** on small-cap token swaps — 10–30% price impact on illiquid tokens is common
- **Approving unlimited token spend** — use limited approvals via Revoke.cash for safety
- **Ignoring deadline settings** — transactions pending too long can execute at unfavorable prices
- **Using Ethereum mainnet for small swaps** — gas costs can exceed the swap value; use L2s

Uniswap remains the backbone of onchain DeFi trading. Understanding how it works makes you a more informed trader and helps you use it to maximum advantage.

Follow [Crypto Vision News](/) for Uniswap governance updates, fee analysis, and DEX market coverage.
