---
title: "Aave Protocol Guide: How to Lend and Borrow on Aave"
description: "Complete Aave guide for 2026. Learn how to lend and borrow on Aave, understand aTokens, flash loans, the AAVE token, and walk through the step-by-step borrowing process."
date: "2026-03-30"
author: team
category: defi
tags: ["aave", "lending", "borrowing", "defi", "tutorial"]
image: "/images/blog/aave-protocol-guide.jpg"
imageAlt: "Aave protocol guide for lending and borrowing crypto in 2026"
---

Aave is one of the oldest and most trusted DeFi protocols, holding over $20 billion in assets across multiple blockchain networks. Whether you want to earn interest on stablecoins, borrow liquidity without selling your crypto, or execute flash loans, Aave provides the infrastructure to do it — transparently and without a bank.

This guide explains how Aave works from the ground up and walks you through using it step by step. For current Aave rates and DeFi news, follow [Crypto Vision News](/).

## How Aave Works

Aave is a decentralized money market where lenders supply assets and earn interest, while borrowers deposit collateral and take out overcollateralized loans. All terms are set algorithmically based on supply and demand — no human underwriters, no credit checks.

**The core mechanics:**

- Interest rates adjust in real time based on how much of a pool is borrowed (utilization rate)
- All loans are overcollateralized — you must put up more value than you borrow
- Smart contracts handle liquidations automatically if collateral falls below safety thresholds
- Everything is non-custodial: Aave never holds your keys

## Understanding aTokens

When you supply assets to Aave, you receive aTokens (e.g., aUSDC, aETH, aWBTC) representing your deposit. These tokens:

- Automatically increase in quantity as interest accrues — your balance grows in your wallet in real time
- Can be transferred like any ERC-20 token
- Can be used as collateral in other DeFi protocols
- Are redeemable 1:1 for the underlying asset at any time (subject to pool liquidity)

**Example:** You supply 1,000 USDC and receive 1,000 aUSDC. At 6% APY, after one year you hold approximately 1,060 aUSDC redeemable for 1,060 USDC.

## Aave v3: Key Features

Aave v3, deployed in 2022 and now the standard version, introduced significant improvements:

### Efficiency Mode (eMode)

eMode allows users to borrow highly correlated assets at much higher LTVs. For example:
- Normal ETH supply → borrow USDC: 80% max LTV
- eMode ETH supply → borrow stETH or rETH: up to 93% LTV

This is designed for looping correlated assets (e.g., stETH/ETH) at high leverage to amplify staking yields.

### Cross-Chain Liquidity Portals

Aave v3 enables moving supplied liquidity across supported networks without bridging. Supply ETH on Ethereum, withdraw USDC on Arbitrum — the protocol handles the underlying bridge logic.

### Risk Parameter Isolation

Newer or riskier assets can be listed in "isolated mode" — meaning they can be used as collateral for specific stablecoins only, limiting contagion risk if the asset price crashes.

## Flash Loans

Flash loans are Aave's most advanced feature. A flash loan allows borrowing any amount from any pool with zero collateral, provided the loan is repaid within the same transaction block.

**Use cases:**
- Arbitrage between DEXs without capital
- Self-liquidating positions
- Collateral swaps (switch from ETH to WBTC collateral without repaying the loan first)
- DeFi protocol interactions requiring temporary capital

Flash loans charge a 0.05% fee. If the loan is not repaid within the same transaction, the entire transaction reverts as if it never happened.

## The AAVE Token

AAVE is the governance and safety token of the protocol.

**Governance:** AAVE holders vote on protocol parameters — which assets to list, LTV ratios, fee settings, and treasury spending.

**Safety Module:** Users can stake AAVE or ABPT (Aave/ETH Balancer pool token) in the Safety Module to earn ~4–8% staking APY. In return, up to 30% of staked AAVE can be slashed to cover protocol shortfalls in case of a bad debt event.

**GHO Stablecoin:** Aave's native decentralized stablecoin, GHO, can be minted by Aave users against their collateral at a fixed borrow rate set by governance.

## Supported Assets (2026 Selection)

| Asset | Supply APY | Borrow APY | Max LTV |
|-------|-----------|-----------|---------|
| USDC | 4–8% | 5–10% | N/A (stablecoin) |
| USDT | 4–7% | 5–9% | N/A |
| ETH | 2–4% | 3–5% | 80% |
| WBTC | 0.5–1.5% | 2–4% | 70% |
| stETH | 0.5–1% | 1–2% | 75% |
| DAI | 3–6% | 4–8% | N/A |

*Rates are variable and change with market conditions.*

## Step-by-Step: How to Lend on Aave

1. **Go to** [aave.com](https://aave.com) and click "Launch App"
2. **Connect your wallet** — MetaMask, Coinbase Wallet, or hardware wallet via WalletConnect
3. **Select your network** — choose Ethereum, Arbitrum, Optimism, or Polygon based on gas preferences
4. **Click "Supply"** on your chosen asset in the supply table
5. **Enter the amount** you want to supply
6. **Approve the token** (first-time only — grants Aave permission to use your tokens)
7. **Confirm the supply transaction** in your wallet
8. You will now see aTokens in your wallet balance growing in real time

## Step-by-Step: How to Borrow on Aave

1. **First supply collateral** following the steps above
2. **Check your borrowing power** in the dashboard — shows maximum borrowable amount
3. **Click "Borrow"** on your chosen asset
4. **Choose variable or stable rate** — variable tracks market demand; stable rates are higher but predictable
5. **Enter borrow amount** — stay well below maximum to maintain a healthy buffer
6. **Confirm the transaction** in your wallet
7. **Monitor your Health Factor** — keep it above 1.5; set up alerts on DeBank or DeFiSaver

## Risk Management on Aave

**Liquidation protection steps:**
- Never borrow more than 50–60% of your collateral value
- Use DeFiSaver's "Automation" to automatically repay or add collateral when Health Factor drops
- Borrow stablecoins against ETH/BTC rather than volatile assets against volatile collateral
- Monitor your positions daily during periods of high market volatility

**Smart contract risk:** Aave has been audited by Trail of Bits, OpenZeppelin, Sigma Prime, and others. It carries bug bounties on Immunefi. Despite this, no smart contract is risk-free.

## Aave Across Multiple Chains

Aave v3 is live on Ethereum, Arbitrum, Optimism, Polygon, Avalanche, Base, and other chains. For daily users:

- **Ethereum mainnet:** Deepest liquidity, highest gas costs
- **Arbitrum:** Near-identical liquidity for major assets, $0.01–0.10 gas
- **Base:** Growing liquidity, lowest fees for new users

For most borrowers and lenders under $100,000, Arbitrum or Base provide an optimal experience at a fraction of mainnet gas costs.

Aave is a foundational piece of DeFi infrastructure — used as both a standalone protocol and as building blocks by hundreds of other protocols. Understanding it deeply gives you the tools to execute sophisticated DeFi strategies safely.

Follow [Crypto Vision News](/) for Aave governance votes, rate analysis, and protocol security updates.
