---
title: "How to Bridge Crypto Between Networks: A Complete Guide"
description: "Learn how to bridge cryptocurrency between blockchain networks. Official vs third-party bridges, step-by-step bridging to Arbitrum and Base, fees, timing, and safety best practices."
date: "2026-03-30"
author: team
category: tutorials
tags: ["bridge", "layer 2", "cross-chain", "ethereum", "tutorial"]
image: "/images/blog/how-to-bridge-crypto.jpg"
imageAlt: "Cryptocurrency bridging between Ethereum and Layer 2 networks diagram"
---

As the crypto ecosystem has expanded to dozens of Layer 2 networks and alternative blockchains, bridging has become an essential skill. Moving assets between Ethereum, Arbitrum, Base, Optimism, Polygon, and other networks requires understanding how bridges work — and their risks. This guide covers everything you need to bridge safely and efficiently.

## What Is Bridging?

Bridging is the process of moving cryptocurrency from one blockchain network to another. Because blockchains don't natively communicate with each other, bridges are software (smart contracts) that coordinate the transfer.

**Why bridging is necessary:**
- Lower fees on Layer 2 networks for DeFi, gaming, and NFTs
- Access to applications built on specific chains
- Taking advantage of yield opportunities on different networks
- Moving between Ethereum and alternative L1s (Solana, Avalanche)

**The basic mechanism (lock-and-mint):**
1. You deposit ETH into a bridge contract on Ethereum
2. The bridge locks your ETH
3. The bridge mints an equivalent "wrapped" ETH on the destination chain
4. You receive wETH (or native ETH on some L2s) on the new network

When bridging back, the process reverses — wrapped tokens are burned and native tokens are released.

## Types of Bridges

### Official Native Bridges

Layer 2 networks maintain their own bridges directly. These are the most secure options:

- **Arbitrum Bridge** (bridge.arbitrum.io): Official Arbitrum ↔ Ethereum bridge
- **Base Bridge** (bridge.base.org): Official Base ↔ Ethereum bridge
- **Optimism Bridge** (app.optimism.io/bridge): Official OP ↔ Ethereum bridge
- **Polygon Bridge** (wallet.polygon.technology): Official Polygon ↔ Ethereum bridge

**Advantages:** Most secure, directly maintained by the chain's team
**Disadvantages:** Slow for withdrawals (optimistic rollup bridges require 7-day challenge periods), higher ETH gas for Ethereum-side transactions

### Third-Party Bridges

Independent bridge protocols offer speed improvements (bypass the 7-day wait) and cross-chain transfers between multiple networks:

- **Across Protocol** (across.to): Fast, capital-efficient, trusted by many developers
- **Stargate** (stargate.finance): LayerZero-based, supports many chains
- **Hop Protocol** (hop.exchange): Optimistic rollup focused, fast withdrawals
- **Synapse** (synapseprotocol.com): Multi-chain with good liquidity
- **deBridge** (debridge.finance): Cross-chain with support for non-EVM chains

**Advantages:** Faster (minutes vs 7 days), often support more chain combinations
**Disadvantages:** Additional smart contract risk, fees may be higher, liquidity can vary

## Step-by-Step: Bridge ETH to Arbitrum

Using the official Arbitrum bridge:

1. **Set up MetaMask** with both Ethereum mainnet and Arbitrum One network added
2. Ensure you have ETH on Ethereum mainnet plus extra for gas (bridging gas can be $5-30 depending on conditions)
3. Go to **bridge.arbitrum.io**
4. Connect your MetaMask wallet
5. Select **"Deposit"** (Ethereum → Arbitrum)
6. Enter the amount of ETH to bridge
7. Review the transaction: amount, destination address, estimated fees
8. Click **"Move funds to Arbitrum One"**
9. Confirm in MetaMask
10. Wait approximately 10-15 minutes for the transaction to finalize
11. Switch MetaMask to Arbitrum One network — your ETH appears there

The deposit is relatively fast (under 20 minutes). Withdrawals from Arbitrum back to Ethereum via the official bridge take 7 days due to the fraud proof window.

## Step-by-Step: Bridge ETH to Base

Using the official Base bridge:

1. Go to **bridge.base.org**
2. Connect MetaMask (on Ethereum mainnet)
3. Click **"Deposit"**
4. Enter ETH amount
5. Click **"Review deposit"** and confirm details
6. Confirm the transaction in MetaMask
7. After ~5-15 minutes, switch to Base network in MetaMask to see your funds

**Tip:** Base is Coinbase's L2 — if you have a Coinbase account, you can also transfer directly from Coinbase to Base for free in-app.

## Using a Third-Party Bridge (Across Protocol)

For faster bridging, especially withdrawals:

1. Go to **across.to**
2. Connect your wallet
3. Select source chain (e.g., Arbitrum) and destination chain (e.g., Ethereum)
4. Enter amount
5. Review the fee quote — Across charges a small relayer fee for fast finality
6. Click **"Send"**
7. Funds typically arrive in 1-10 minutes

The fee for fast bridging is usually 0.05-0.3% of the bridged amount. For larger amounts, this is worth it for convenience.

## Understanding Fees

Bridging incurs multiple types of fees:

| Fee Type | Description | Typical Amount |
|---|---|---|
| Source gas | Transaction on origin chain | Varies (cheap on L2, expensive on ETH mainnet) |
| Destination gas | Transaction on destination chain | Usually small |
| Bridge fee | Protocol fee | 0-0.3% of amount |
| Relayer fee | Fast bridge speed cost | 0.05-0.15% |

For bridging small amounts (under $100), fees can represent a significant percentage. Batch transfers when possible.

## Bridge Timing Reference

| Bridge | Deposit Time | Withdrawal Time |
|---|---|---|
| Arbitrum Official | ~15 min | 7 days |
| Base Official | ~5-15 min | 7 days |
| Optimism Official | ~5-15 min | 7 days |
| Across Protocol | 1-10 min | 1-10 min |
| Stargate | 2-30 min | 2-30 min |
| Hop Protocol | 5-30 min | 5-30 min |

## Bridge Risks

Bridges have historically been the largest hacked category in DeFi:

- **Ronin Bridge (2022):** $625 million stolen (Axie Infinity's bridge)
- **Wormhole (2022):** $320 million stolen
- **Nomad Bridge (2022):** $190 million drained
- **Harmony Horizon (2022):** $100 million stolen

**Why bridges are targets:** They hold large amounts of locked assets in smart contracts. A single vulnerability in bridge code can expose everything locked in it.

**Mitigations:**
- Use audited, battle-tested bridges — prefer official bridges for large amounts
- Don't leave assets sitting in bridge contracts longer than necessary
- Spread large transfers across multiple bridges if diversification is needed
- Check audit history before using newer or less-established bridges

## Best Practices for Safe Bridging

1. **Start small** — bridge a test amount first when using a bridge for the first time
2. **Verify the destination address** — bridging to the wrong address is irreversible
3. **Use official bridges for large amounts** — the slower speed is worth the security
4. **Check current gas prices** before bridging from Ethereum mainnet (ethgasstation.info)
5. **Keep native tokens** on each chain for gas — you need ETH on Arbitrum to pay Arbitrum gas, even though you just bridged ETH there
6. **Avoid obscure bridges** — stick to well-known, audited protocols
7. **Double-check the correct smart contract address** from the official project website

Bridging is a routine part of multi-chain crypto use in 2026. With the right precautions, it's straightforward and safe. The key is understanding which bridges to trust and never rushing through the verification steps.
