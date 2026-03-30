---
title: "EIP-1559 Explained: How Ethereum Burns Fees and Becomes Deflationary"
description: "A complete explanation of EIP-1559 — how it changed Ethereum's fee market, why burning the base fee matters, the ultra-sound money thesis, and its impact on ETH's price."
date: "2026-03-30"
author: team
category: ethereum
tags: ["ethereum", "EIP-1559", "deflation", "gas", "tokenomics"]
image: "/images/blog/eip-1559-explained.jpg"
imageAlt: "Ethereum burning mechanism diagram showing base fee destruction under EIP-1559"
featured: false
---

EIP-1559 is arguably the most significant change to Ethereum's monetary policy since its launch. Implemented in August 2021 as part of the "London" hard fork, it redesigned how transaction fees work and introduced a mechanism that permanently destroys ETH with every transaction. Understanding EIP-1559 is essential for understanding Ethereum's long-term value proposition.

## The Problem EIP-1559 Solved

### Pre-EIP-1559: The First-Price Auction

Before August 2021, Ethereum's fee market used a **first-price auction** model:
- Users submitted transactions with a "gas price" they were willing to pay
- Miners selected whichever transactions offered the highest gas price
- Users had to guess the right bid — too low and the transaction stayed pending; too high and they overpaid

This system had serious problems:
1. **Fee volatility**: Prices could spike 10–100x during busy periods
2. **Overpayment**: Users routinely overbid because the cost of an unconfirmed transaction (opportunity cost) was higher than overpaying by a few dollars
3. **Inefficiency**: Wallets had poor gas estimation tools
4. **Miner extracted value**: Miners could prioritize transactions from themselves or manipulate fee extraction

### EIP-1559's Solution

EIP-1559, proposed by Ethereum co-founder Vitalik Buterin and primarily authored by Eric Conner, Tim Beiko, and others, overhauled the entire fee mechanism.

## How EIP-1559 Works

### The Base Fee

The core innovation is an **algorithmically determined base fee** — a minimum price required for transaction inclusion in a block.

The base fee adjusts automatically:
- If the previous block was **more than 50% full**: base fee increases by up to 12.5%
- If the previous block was **less than 50% full**: base fee decreases by up to 12.5%
- If the previous block was **exactly 50% full**: base fee stays constant

This creates a self-regulating market. When network demand rises, the base fee rises to reduce demand. When activity falls, fees fall to attract more transactions. The mechanism targets 50% block capacity utilization.

### The Priority Fee (Tip)

On top of the base fee, users can add an optional **priority fee** (tip) to incentivize validators to prioritize their transaction over others paying the same base fee.

During normal conditions: 1–2 gwei tip is sufficient
During congestion: Tips spike as users compete for block space

### The Max Fee

Users set a **maximum total fee** they're willing to pay per gas unit. If the actual base fee + their tip is less than this maximum, they receive a refund of the difference.

```
Max Fee = Base Fee + Priority Fee + Buffer
Actual cost ≤ Max Fee (refund issued for any excess)
```

## The Critical Innovation: Fee Burning

Here is what makes EIP-1559 transformative: **the base fee is burned** — permanently destroyed — rather than being paid to validators.

**Before EIP-1559:**
- Transaction fee → 100% to miners

**After EIP-1559:**
- Base fee → **burned** (destroyed forever)
- Priority fee → paid to validators

Every transaction on Ethereum removes ETH from the total supply. This is the opposite of inflation — it is **deflationary pressure**.

## ETH Burn Rate and Deflationary Dynamics

Since EIP-1559's implementation in August 2021:

| Metric | Approximate Value |
|--------|------------------|
| Total ETH burned (by 2026) | 3.5–4+ million ETH |
| Daily burn rate (average) | ~1,500–2,000 ETH |
| Peak daily burn | 20,000+ ETH (during high-activity events) |
| Annual issuance (post-Merge) | ~500,000–600,000 ETH |

### When Ethereum Becomes Deflationary

Ethereum's annual issuance is approximately 500,000–600,000 ETH per year (paid to validators). When the daily burn rate exceeds issuance, the total ETH supply **decreases**.

**Deflationary scenario**: High network activity → high base fees → fast burning → supply decreases
**Inflationary scenario**: Low network activity → low base fees → slow burning → supply increases slightly

In 2022, during the peak DeFi and NFT boom, Ethereum was significantly net deflationary for extended periods. As L2s have shifted activity off mainnet (reducing mainnet fees), Ethereum has been net inflationary at a low rate — but any major mainnet activity surge flips it deflationary.

## The "Ultra-Sound Money" Thesis

The meme "ultra-sound money" emerged from Ethereum's community to contrast with Bitcoin's "sound money" narrative. The argument:

**Bitcoin is "sound money"**: Fixed cap of 21 million, predictable issuance
**Ethereum is "ultra-sound money"**: Burning mechanism can actively reduce total supply below current levels, making it more scarce than Bitcoin in terms of flow

The argument goes: while Bitcoin's supply approaches its cap asymptotically (never going below zero issuance), Ethereum's supply can actually **shrink** during periods of high activity.

Critics note that this depends on sustained high mainnet activity — if L2s offload too much activity, ETH issuance could exceed burns. The ultra-sound money thesis is contingent, not guaranteed.

## Impact on ETH Price

EIP-1559 affects ETH's price through several mechanisms:

### 1. Supply Reduction
Fewer ETH in existence (all else being equal) means each remaining ETH represents a larger share of the total value stored in the network. Simple supply/demand logic supports higher prices.

### 2. Validator Revenue Composition
Pre-Merge miners captured 100% of fees. Post-EIP-1559 + Merge, validators only receive the tips. This reduces the selling pressure from validators (who previously received and sold all fees) by eliminating the base fee entirely from their revenue.

### 3. Network Activity Premium
High network activity is now bullish for ETH specifically. Previously, high fees just meant miners got paid more. Now, high activity means ETH is burned, directly benefiting holders of all remaining ETH.

### 4. Improved Fee Predictability
More predictable fees reduce the "hidden cost" of using Ethereum, making it a more attractive platform. Better UX drives more usage, which drives more burns.

## EIP-1559 Criticisms

Not everyone agrees EIP-1559 was purely beneficial:

- **Miners lost income**: The burning redirected substantial revenue away from miners (now validators). This was a feature, not a bug, from the developers' perspective — but controversial with mining interests.
- **Doesn't solve high fees**: EIP-1559 makes fees more predictable, but doesn't reduce them. High demand still means high fees. The solution to high fees is Layer 2 scaling, not EIP-1559.
- **Ultra-sound money is conditional**: If L2s absorb most activity and mainnet fees stay low, ETH could remain inflationary.

## Conclusion

EIP-1559 was a landmark upgrade that transformed Ethereum from a pure PoW-style fee market to an algorithmically managed, deflationary-leaning monetary system. The base fee burning mechanism has destroyed millions of ETH and has fundamentally changed how analysts think about ETH's long-term supply dynamics.

For every DeFi swap, NFT purchase, or token transfer on Ethereum mainnet, a tiny amount of ETH is permanently removed from supply. At scale, this mechanism provides structural price support that grows with network adoption.

Track Ethereum's real-time burn rate and supply metrics at [Crypto Vision News](/).
