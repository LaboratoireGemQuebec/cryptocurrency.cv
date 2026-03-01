/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

export interface LearnArticle {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: string;
  content: string;
  relatedSlugs: string[];
}

export const learnArticles: LearnArticle[] = [
  {
    slug: "what-is-bitcoin",
    title: "What is Bitcoin?",
    description:
      "Understand the world's first cryptocurrency — how it works, why it matters, and what makes Bitcoin unique.",
    icon: "₿",
    category: "Cryptocurrency",
    difficulty: "beginner",
    readTime: "8 min",
    relatedSlugs: ["what-is-ethereum", "crypto-wallet-guide", "understanding-market-cap"],
    content: `
## What is Bitcoin?

Bitcoin (BTC) is the world's first and most valuable cryptocurrency, created in 2009 by the pseudonymous **Satoshi Nakamoto**. It introduced the concept of a decentralized, peer-to-peer electronic cash system — one that operates without any central authority like a bank or government.

## How Does Bitcoin Work?

Bitcoin runs on a technology called **blockchain** — a public, distributed ledger that records every transaction ever made. Here's how it works:

1. **You initiate a transaction** — sending BTC from your wallet to another address.
2. **Miners verify** the transaction and group it into a block.
3. **Proof of Work** — miners compete to solve a cryptographic puzzle to add the block.
4. **The block is confirmed** and permanently added to the chain.

### Key Properties

- **Limited supply**: Only 21 million BTC will ever exist, making it inherently scarce.
- **Decentralized**: No single entity controls the network — thousands of nodes maintain it globally.
- **Transparent**: Every transaction is publicly verifiable on the blockchain.
- **Pseudonymous**: Wallet addresses don't reveal personal identity directly.

## Why Does Bitcoin Matter?

Bitcoin was the first practical solution to the "double-spending problem" in digital currencies. Before Bitcoin, digital money could be copied. Bitcoin's blockchain ensures each coin can only be spent once.

### Bitcoin as a Store of Value

Many investors view Bitcoin as "digital gold" — a hedge against inflation and currency debasement. With spot Bitcoin ETFs now managing over $100 billion in assets, institutional adoption has reached unprecedented levels.

## Getting Started with Bitcoin

1. **Choose a wallet** — software wallets (like Exodus or BlueWallet) or hardware wallets (Ledger, Trezor).
2. **Buy Bitcoin** — through exchanges like Coinbase, Kraken, or Binance.
3. **Secure your keys** — write down your seed phrase and store it safely offline.
4. **Start small** — only invest what you can afford to lose.

## Summary

Bitcoin is the foundational cryptocurrency that started the entire industry. Understanding Bitcoin is the first step to understanding everything else in the crypto ecosystem.
    `,
  },
  {
    slug: "what-is-ethereum",
    title: "What is Ethereum?",
    description:
      "Learn about Ethereum — the programmable blockchain powering smart contracts, DeFi, NFTs, and the Web3 ecosystem.",
    icon: "⟠",
    category: "Cryptocurrency",
    difficulty: "beginner",
    readTime: "8 min",
    relatedSlugs: ["what-is-bitcoin", "what-is-defi", "what-are-nfts"],
    content: `
## What is Ethereum?

Ethereum (ETH) is a programmable blockchain platform that goes beyond simple payments. Created by **Vitalik Buterin** in 2015, Ethereum introduced **smart contracts** — self-executing programs that run on the blockchain.

## Smart Contracts

A smart contract is code stored on the blockchain that automatically executes when predefined conditions are met. Think of it as a vending machine: insert the right input, get the guaranteed output — no middleman needed.

### What Can You Build on Ethereum?

- **DeFi protocols** — lending, borrowing, and trading without banks
- **NFT marketplaces** — for digital art, collectibles, and media
- **DAOs** — community-governed organizations
- **Layer 2 networks** — faster, cheaper transactions (Optimism, Arbitrum, Base)
- **Gaming and metaverse** applications

## Ethereum vs Bitcoin

| Feature | Bitcoin | Ethereum |
|---------|---------|----------|
| Purpose | Digital money / store of value | Programmable platform |
| Supply | Fixed 21M | No hard cap (but deflationary post-Merge) |
| Consensus | Proof of Work | Proof of Stake |
| Smart Contracts | Limited | Full support |

## The Merge and Proof of Stake

In September 2022, Ethereum transitioned from Proof of Work to **Proof of Stake**, reducing energy consumption by ~99.95%. Validators now stake 32 ETH to secure the network and earn rewards.

## Getting Started

1. Install a wallet like **MetaMask** or **Rainbow**
2. Purchase ETH on an exchange
3. Explore dApps on platforms like DeFi Llama or Dapp Radar
4. Consider staking ETH for passive rewards

## Summary

Ethereum is the backbone of Web3. If Bitcoin is digital gold, Ethereum is the decentralized computer powering the next generation of the internet.
    `,
  },
  {
    slug: "what-is-defi",
    title: "What is DeFi?",
    description:
      "Explore Decentralized Finance — how DeFi protocols enable lending, borrowing, and trading without intermediaries.",
    icon: "🏦",
    category: "DeFi",
    difficulty: "beginner",
    readTime: "10 min",
    relatedSlugs: ["what-is-ethereum", "understanding-market-cap", "crypto-trading-basics"],
    content: `
## What is DeFi?

**Decentralized Finance (DeFi)** refers to an ecosystem of financial applications built on blockchain technology. DeFi recreates traditional financial services — lending, borrowing, trading, insurance — without relying on intermediaries like banks.

## How Does DeFi Work?

DeFi applications use **smart contracts** on blockchains like Ethereum to automate financial transactions. Instead of a bank approving your loan, code executes the terms automatically.

### Core DeFi Services

- **Decentralized Exchanges (DEXs)** — Swap tokens directly from your wallet (Uniswap, SushiSwap)
- **Lending & Borrowing** — Earn interest or borrow against your crypto (Aave, Compound)
- **Yield Farming** — Provide liquidity and earn rewards
- **Stablecoins** — Crypto pegged to fiat currencies (USDC, DAI)
- **Derivatives** — On-chain options and futures trading

## Key Concepts

### Total Value Locked (TVL)
TVL measures the total assets deposited in DeFi protocols. It's the primary metric for gauging DeFi adoption.

### Liquidity Pools
Users deposit token pairs into pools that facilitate trading. In return, they earn fees from every swap.

### Impermanent Loss
When providing liquidity, the value of your deposited tokens can change relative to simply holding them. This temporary difference is called impermanent loss.

## Risks to Understand

- **Smart contract bugs** — Code vulnerabilities can be exploited
- **Rug pulls** — Malicious projects that steal deposited funds
- **Liquidation risk** — Borrowed positions can be liquidated if collateral drops
- **Regulatory uncertainty** — Rules are still evolving globally

## Getting Started with DeFi

1. Get a Web3 wallet (MetaMask, Rabby, or Phantom)
2. Bridge funds to the chain you want to use
3. Start with established protocols (Aave, Uniswap)
4. Begin with small amounts you can afford to lose
5. Always verify contract addresses

## Summary

DeFi is rebuilding the financial system to be open, permissionless, and transparent. While it offers exciting opportunities, understanding the risks is essential before participating.
    `,
  },
  {
    slug: "how-to-read-charts",
    title: "How to Read Charts",
    description:
      "Learn the basics of reading crypto price charts — candlesticks, support/resistance, volume, and common patterns.",
    icon: "📊",
    category: "Trading",
    difficulty: "intermediate",
    readTime: "12 min",
    relatedSlugs: ["crypto-trading-basics", "understanding-market-cap", "what-is-bitcoin"],
    content: `
## Why Learn to Read Charts?

Reading price charts is a fundamental skill for any crypto investor or trader. Charts help you understand market trends, identify potential entry and exit points, and make more informed decisions.

## Candlestick Basics

Most crypto charts use **candlesticks**, which show four data points per time period:

- **Open** — the price at the start of the period
- **Close** — the price at the end of the period
- **High** — the highest price reached
- **Low** — the lowest price reached

**Green/white candles** = price went up (close > open)
**Red/black candles** = price went down (close < open)

## Key Chart Concepts

### Support and Resistance
- **Support** — a price level where buying pressure tends to prevent further decline
- **Resistance** — a price level where selling pressure tends to prevent further increase

### Volume
Volume represents how many units were traded during a period. High volume confirms the strength of a price move. Low volume moves are often unreliable.

### Moving Averages
- **SMA (Simple Moving Average)** — the average price over a set period
- **EMA (Exponential Moving Average)** — weights recent prices more heavily
- Common periods: 20, 50, 100, 200 days

## Common Patterns

### Trend Patterns
- **Uptrend** — higher highs and higher lows
- **Downtrend** — lower highs and lower lows
- **Sideways** — range-bound movement

### Reversal Patterns
- **Double Top/Bottom** — potential trend reversal signals
- **Head and Shoulders** — bearish reversal pattern
- **Hammer/Doji** — single-candle reversal indicators

## Tips for Beginners

1. Start with longer timeframes (daily/weekly) before shorter ones
2. Don't rely on a single indicator — use multiple confirmations
3. Volume is as important as price
4. Practice with paper trading before risking real money
5. Zoom out — short-term noise can be misleading

## Summary

Chart reading is a skill that improves with practice. Focus on understanding the basics — candlesticks, support/resistance, volume, and trends — before diving into complex indicators.
    `,
  },
  {
    slug: "crypto-wallet-guide",
    title: "Crypto Wallet Guide",
    description:
      "Everything you need to know about crypto wallets — types, security best practices, and how to choose the right one.",
    icon: "👛",
    category: "Security",
    difficulty: "beginner",
    readTime: "7 min",
    relatedSlugs: ["what-is-bitcoin", "what-is-ethereum", "what-is-defi"],
    content: `
## What is a Crypto Wallet?

A crypto wallet stores the **private keys** that give you access to your cryptocurrency on the blockchain. Your wallet doesn't actually hold crypto — it holds the keys that prove ownership.

## Types of Wallets

### Hot Wallets (Software)
Connected to the internet for easy access.

- **Browser extensions** — MetaMask, Rabby, Phantom
- **Mobile apps** — Trust Wallet, Coinbase Wallet, Rainbow
- **Desktop apps** — Exodus, Electrum

**Pros:** Convenient, free, easy to use
**Cons:** Vulnerable to hacking, malware

### Cold Wallets (Hardware)
Offline devices for maximum security.

- **Ledger** (Nano S Plus, Nano X, Stax)
- **Trezor** (Model One, Model T, Safe 3)
- **GridPlus Lattice1**

**Pros:** Very secure, immune to online attacks
**Cons:** Cost money, less convenient for frequent trading

### Paper Wallets
Private keys printed or written on paper. Highly secure but impractical for regular use.

## Security Best Practices

1. **Never share your seed phrase** — no legitimate service will ask for it
2. **Write your seed phrase on paper** — don't store it digitally
3. **Use a hardware wallet** for significant holdings
4. **Enable 2FA** on exchange accounts
5. **Verify addresses** before sending — crypto transactions are irreversible
6. **Beware of phishing** — always double-check URLs
7. **Use separate wallets** — one for trading, one for long-term storage

## Choosing the Right Wallet

| Need | Recommended |
|------|-------------|
| Daily DeFi usage | MetaMask or Rabby |
| Long-term holding | Ledger or Trezor |
| Mobile convenience | Trust Wallet or Rainbow |
| Bitcoin only | BlueWallet or Coldcard |
| Multi-chain | Rabby or Phantom |

## Summary

Your wallet is the gateway to crypto. Choose the right type for your needs, prioritize security, and never compromise on protecting your seed phrase.
    `,
  },
  {
    slug: "understanding-market-cap",
    title: "Understanding Market Cap",
    description:
      "Learn what market capitalization means in crypto, how it's calculated, and why it matters for evaluating projects.",
    icon: "💰",
    category: "Trading",
    difficulty: "beginner",
    readTime: "5 min",
    relatedSlugs: ["how-to-read-charts", "crypto-trading-basics", "what-is-bitcoin"],
    content: `
## What is Market Cap?

**Market capitalization (market cap)** is the total value of a cryptocurrency. It's calculated by multiplying the current price by the circulating supply:

**Market Cap = Price × Circulating Supply**

For example, if a token costs $50 and has 10 million coins in circulation, its market cap is $500 million.

## Why Market Cap Matters

Market cap gives you a better sense of a project's size than price alone. A coin priced at $0.01 with a 100 billion supply has a $1 billion market cap — it's not "cheap." 

### Market Cap Categories

| Category | Market Cap Range | Examples |
|----------|-----------------|----------|
| Large-cap | >$10 billion | BTC, ETH, SOL |
| Mid-cap | $1B – $10B | AAVE, ARB, OP |
| Small-cap | $100M – $1B | Various DeFi/L2 tokens |
| Micro-cap | <$100M | Early-stage projects |

## Important Metrics

### Circulating Supply vs Total Supply
- **Circulating supply** — tokens currently available and trading
- **Total supply** — all tokens that exist (including locked or unvested)
- **Max supply** — the maximum that will ever exist (e.g., Bitcoin's 21M)

### Fully Diluted Valuation (FDV)
FDV = Price × Max Supply. This shows what the market cap would be if all tokens were in circulation. A large gap between market cap and FDV indicates significant future dilution.

## Common Mistakes

1. **Comparing prices across different tokens** — a $1 token isn't "cheaper" than a $50,000 token
2. **Ignoring tokenomics** — unlock schedules can dramatically impact price
3. **Chasing low market cap alone** — small doesn't mean undervalued
4. **Forgetting about FDV** — check how much supply is still locked

## Summary

Market cap is the starting point for evaluating any crypto project. Always look beyond price and consider supply metrics, FDV, and tokenomics for a complete picture.
    `,
  },
  {
    slug: "what-are-nfts",
    title: "What are NFTs?",
    description:
      "Understand Non-Fungible Tokens — how they work, their use cases beyond art, and the current state of the NFT market.",
    icon: "🎨",
    category: "NFTs",
    difficulty: "beginner",
    readTime: "7 min",
    relatedSlugs: ["what-is-ethereum", "crypto-wallet-guide", "what-is-defi"],
    content: `
## What are NFTs?

**Non-Fungible Tokens (NFTs)** are unique digital assets recorded on a blockchain. Unlike Bitcoin or ETH (which are "fungible" — each unit is identical), each NFT is one-of-a-kind and cannot be replicated.

## How Do NFTs Work?

NFTs are created ("minted") using smart contracts on blockchains like Ethereum, Solana, or Polygon. The smart contract records:

- **Ownership** — who currently owns the NFT
- **Provenance** — the complete history of ownership
- **Metadata** — links to the digital content (image, video, etc.)
- **Royalties** — automatic creator payments on resale

## Use Cases

### Digital Art & Collectibles
The most well-known use case. Artists can sell directly to collectors without galleries.

### Gaming
In-game items (skins, weapons, characters) as NFTs that players truly own and can trade.

### Music & Media
Musicians releasing songs/albums as NFTs, giving fans ownership and exclusive access.

### Real-World Assets (RWAs)
Tokenizing real estate, luxury goods, or financial instruments as NFTs.

### Identity & Credentials
Digital identity documents, certificates, and memberships on-chain.

### Domain Names
Blockchain-based domain names (ENS, Unstoppable Domains) as NFTs.

## The Current State of NFTs

The NFT market has matured significantly since the 2021 boom:

- Focus has shifted from speculation to **utility and community**
- **Real-World Asset (RWA)** tokenization is a growing sector
- Gaming NFTs continue to gain traction
- Creator-focused models with sustainable royalties are emerging

## How to Get Started

1. Set up a wallet that supports NFTs (MetaMask, Phantom)
2. Browse marketplaces (OpenSea, Blur, Magic Eden)
3. Research projects before buying — understand the team and roadmap
4. Start small and learn the space before major investments

## Summary

NFTs represent verifiable digital ownership. While the speculative hype has cooled, the underlying technology enables entirely new models for creators, gamers, and asset ownership.
    `,
  },
  {
    slug: "crypto-trading-basics",
    title: "Crypto Trading Basics",
    description:
      "Learn the fundamentals of cryptocurrency trading — order types, strategies, risk management, and common mistakes to avoid.",
    icon: "📈",
    category: "Trading",
    difficulty: "intermediate",
    readTime: "10 min",
    relatedSlugs: ["how-to-read-charts", "understanding-market-cap", "what-is-defi"],
    content: `
## Getting Started with Crypto Trading

Crypto trading involves buying and selling digital assets to generate profit. Before you start, understanding the basics is essential for managing risk and making informed decisions.

## Types of Trading

### Spot Trading
Buying and selling crypto at current market prices. You own the actual asset. This is the simplest and safest form of trading.

### Margin/Leverage Trading
Borrowing funds to trade larger positions. Amplifies both gains **and losses**. Not recommended for beginners.

### Futures Trading
Contracts to buy/sell an asset at a future date and price. Can be used for hedging or speculation.

## Order Types

### Market Order
Buy or sell immediately at the current best available price. Fast execution but you accept whatever price is available.

### Limit Order
Buy or sell at a specific price or better. You set the price, but the order may not fill if the market doesn't reach it.

### Stop-Loss Order
Automatically sells your position if the price drops to a set level. Essential for risk management.

### Take-Profit Order
Automatically sells when a target profit price is reached. Locks in gains without constant monitoring.

## Risk Management

The most important aspect of trading:

1. **Never invest more than you can afford to lose**
2. **Use stop-losses** on every trade
3. **Position sizing** — risk no more than 1-2% of your portfolio per trade
4. **Diversify** — don't put everything in one asset
5. **Take profits** — don't let greed override your plan
6. **Keep emotions in check** — fear and greed are your worst enemies

## Common Mistakes

- **FOMO buying** — chasing pumps usually ends badly
- **Revenge trading** — trying to recover losses with bigger bets
- **Over-leveraging** — leverage is the fastest way to lose everything
- **Ignoring fees** — frequent trading fees add up quickly
- **No plan** — trading without a clear strategy is gambling

## Key Trading Terms

- **Bull market** — prices trending upward
- **Bear market** — prices trending downward
- **Liquidity** — how easily an asset can be bought/sold
- **Spread** — difference between buy and sell price
- **ROI** — Return on Investment

## Summary

Successful trading is about risk management, not prediction. Start with spot trading, use stop-losses, size positions conservatively, and develop a plan before placing any trade.
    `,
  },
];

export function getArticleBySlug(slug: string): LearnArticle | undefined {
  return learnArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(article: LearnArticle): LearnArticle[] {
  return article.relatedSlugs
    .map((slug) => learnArticles.find((a) => a.slug === slug))
    .filter(Boolean) as LearnArticle[];
}
