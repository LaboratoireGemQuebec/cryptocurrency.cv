---
title: "Stablecoins Explained: USDT, USDC, DAI and How They Work"
description: "A complete guide to stablecoins in 2026 — learn how USDT, USDC, DAI and algorithmic stablecoins work, the risks of each type, the lessons of UST's collapse, and how to earn yield safely."
date: "2026-03-30"
author: team
category: defi
tags: ["stablecoins", "USDT", "USDC", "DAI", "peg mechanism"]
image: "/images/blog/crypto-stablecoins-guide.jpg"
imageAlt: "Dollar sign surrounded by stablecoin logos USDT USDC and DAI"
---

Stablecoins are the backbone of the crypto economy. They allow traders to exit volatile positions without leaving the blockchain, power DeFi lending and borrowing, enable global remittances, and serve as the primary medium of exchange in decentralized finance. Understanding the different types of stablecoins — and their risks — is essential knowledge for any crypto participant.

## What Are Stablecoins?

A stablecoin is a cryptocurrency designed to maintain a stable value, typically pegged to the US dollar. Unlike Bitcoin or Ethereum, whose prices fluctuate dramatically, stablecoins aim for a 1:1 ratio with the dollar.

They solve a critical practical problem: crypto is volatile, but all DeFi activity requires an on-chain unit of account. Without stablecoins, you couldn't lend, borrow, or trade in DeFi without taking on the price risk of native tokens.

## Types of Stablecoins

### Fiat-Backed Stablecoins

Fiat-backed stablecoins are the simplest and most widely used type. A company holds dollars (or dollar-equivalent assets) in reserve and issues an equivalent number of tokens on-chain. Each token can theoretically be redeemed for $1 of underlying reserves.

**Tether (USDT)**

USDT is the oldest and most widely circulated stablecoin, with over $100 billion in circulation. Tether Limited issues USDT and claims to maintain 1:1 dollar backing.

Controversies:
- Tether has historically been opaque about its reserve composition. Reserves have included commercial paper, loans, and other non-cash assets rather than pure dollars
- The company settled with the CFTC and NYAG over misrepresentations
- Regular attestations (not full audits) are published, but critics argue these are insufficient
- Despite controversies, USDT has maintained its peg through multiple market crises

**USD Coin (USDC)**

USDC, issued by Circle (founded with Coinbase), is the preferred stablecoin for institutions and compliance-focused applications. Circle publishes monthly attestation reports from Grant Thornton and maintains reserves in cash and US Treasury securities.

USDC briefly de-pegged in March 2023 when it was revealed Circle had $3.3B in deposits at Silicon Valley Bank, which had just failed. The peg restored immediately when the US government guaranteed all SVB deposits.

USDC is fully regulated as an e-money in multiple jurisdictions and is the recommended stablecoin for applications requiring regulatory clarity.

**PYUSD (PayPal)**

PayPal launched PYUSD in 2023, bringing stablecoin access to PayPal's massive user base. Issued by Paxos, PYUSD is fully backed by US dollar deposits, short-term US Treasuries, and similar cash equivalents.

### Crypto-Backed Stablecoins

Crypto-backed stablecoins use cryptocurrency as collateral rather than fiat. Because crypto collateral is volatile, these systems require overcollateralization — you must lock up more value than you receive.

**DAI (MakerDAO/Sky)**

DAI is the original and most battle-tested crypto-backed stablecoin. Users lock crypto collateral (ETH, wBTC, stETH, and approved assets) in Maker vaults and mint DAI against it at an overcollateralization ratio.

Example: You deposit $150 worth of ETH and mint 100 DAI. If ETH drops and your position falls below the minimum collateralization ratio (typically 150%), your vault is liquidated — the collateral is sold to repay the DAI.

MakerDAO rebranded to Sky in 2024, with DAI evolving toward USDS in the ecosystem, though DAI remains widely used.

DAI is notable for being fully on-chain and non-custodial. No company can freeze your DAI; the smart contracts run autonomously.

**FRAX (Frax Finance)**

FRAX uses a partially algorithmic, partially collateralized approach. FRAX has evolved significantly toward full collateralization and has launched multiple products including frxETH (liquid staking) and sFRAX (yield-bearing stablecoin backed by US Treasuries on-chain).

### Algorithmic Stablecoins: The Cautionary Tale

Algorithmic stablecoins attempt to maintain their peg through token supply expansion and contraction, using market incentives rather than collateral. The theory: if price drops below $1, token holders have incentive to burn stablecoins for the governance token; if price rises above $1, users can mint stablecoins cheaply.

**The UST/LUNA Collapse: What Happened**

TerraUSD (UST) was the largest algorithmic stablecoin, backed by LUNA tokens and yield incentives from the Anchor Protocol (which offered 20% APY on UST deposits). At its peak, UST had $18 billion in circulation.

In May 2022, coordinated selling pressure on UST triggered a bank run:
- Large withdrawals from Anchor Protocol began
- UST de-pegged slightly, triggering algorithmic LUNA minting to restore the peg
- LUNA supply expansion diluted LUNA's value
- As LUNA fell, confidence in UST's backing collapsed
- Death spiral: more UST selling → more LUNA minting → further LUNA collapse → more UST selling

Within days, UST had collapsed to near zero and LUNA had lost 99.9% of its value, destroying approximately $40 billion in market capitalization. Hundreds of thousands of retail investors lost their savings.

The UST collapse effectively killed pure algorithmic stablecoins as a category. Any stablecoin claiming to maintain its peg through algorithms alone faces profound skepticism from the market.

## Comparing Major Stablecoins

| Stablecoin | Type | Issuer | Backing | Centralized? | Best For |
|-----------|------|--------|---------|--------------|----------|
| USDT | Fiat-backed | Tether | ~1:1 USD assets | Yes | Maximum liquidity |
| USDC | Fiat-backed | Circle | 1:1 Cash+Treasuries | Yes | Regulatory compliance |
| DAI | Crypto-backed | MakerDAO | 150%+ crypto | No | Decentralized use |
| FRAX | Hybrid | Frax Finance | Collateralized | Partial | Yield strategies |
| PYUSD | Fiat-backed | PayPal/Paxos | 1:1 USD assets | Yes | Mainstream users |

## How to Earn Yield on Stablecoins

Stablecoins can earn yield through several mechanisms:

### DeFi Lending

Deposit stablecoins into lending protocols like Aave, Compound, or Morpho. Borrowers pay interest; lenders receive yield. Current rates vary from 3-12% depending on market demand.

### Liquidity Provision

Provide stablecoin liquidity pairs on DEXs like Curve Finance. Curve specializes in stablecoin swaps and offers trading fee revenue plus additional token incentives.

### Yield Aggregators

Yearn Finance and similar aggregators automatically rotate stablecoin deposits through highest-yielding opportunities, saving users the work of manually optimizing.

### RWA-Backed Yield

Protocols like Ondo Finance, Maple Finance, and others offer yield backed by real-world assets (US Treasuries, corporate loans). These on-chain money market products offer 4-6% yields with significantly different risk profiles than DeFi lending.

## Stablecoin Risks

- **Counterparty risk:** Fiat-backed stablecoins require trusting the issuer; a Tether insolvency or USDC bank failure could disrupt holders
- **Smart contract risk:** Crypto-backed stablecoins rely on smart contracts that can be exploited
- **Regulatory risk:** Stablecoin issuers face increasing regulatory requirements; compliance costs could limit services
- **Peg risk:** Even well-designed stablecoins can temporarily de-peg during extreme market stress
- **Algorithmic risk:** As UST proved, algorithmic mechanisms can fail catastrophically

Diversifying stablecoin holdings across USDC, USDT, and DAI reduces single-point-of-failure risk — an approach used by both sophisticated DeFi protocols and institutional participants.
