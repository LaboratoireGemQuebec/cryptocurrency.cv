---
title: "Restaking and EigenLayer Explained: Ethereum's Latest Innovation"
description: "Understand restaking, how EigenLayer works, what Actively Validated Services (AVSs) are, and the risks and rewards of liquid restaking tokens like eETH and ezETH."
date: "2026-03-30"
author: team
category: ethereum
tags: ["restaking", "eigenlayer", "ethereum", "staking", "security"]
image: "/images/blog/restaking-eigenlayer.jpg"
imageAlt: "Ethereum network diagram showing restaking layers and validators"
---

Ethereum's proof-of-stake security model is one of the most battle-tested in crypto. Over 30 million ETH is staked, securing transactions worth trillions of dollars annually. But a question emerged: could that same pooled security be used to protect other protocols too? EigenLayer answered yes — and in doing so, created an entirely new category called restaking.

## What Is Staking and Why Does It Matter?

Before understanding restaking, you need to understand standard ETH staking. Ethereum validators lock up 32 ETH as collateral. If a validator behaves dishonestly — double-signing transactions or going offline for extended periods — their stake is "slashed" (partially destroyed). This economic penalty is what makes Ethereum secure: attacking the network means losing a lot of money.

The problem is that every new protocol that wants crypto-economic security has to build its own validator set from scratch. This is expensive, slow, and creates fragmented security — a new protocol with $50 million staked is far more vulnerable to attack than a protocol backed by Ethereum's hundreds of billions in staked value.

## How EigenLayer Works

EigenLayer, developed by Sreeram Kannan and launched in 2024, allows ETH stakers to "restake" their ETH — meaning they opt in to have their staked ETH also serve as collateral for additional protocols called Actively Validated Services (AVSs).

In practical terms:

1. A validator stakes 32 ETH on Ethereum as normal
2. They then register with EigenLayer and opt into one or more AVSs
3. Those AVSs gain access to the validator's cryptoeconomic security
4. If the validator behaves dishonestly on an AVS, they can be slashed by EigenLayer's slashing conditions in addition to Ethereum's

This is a profound innovation. New protocols can launch with substantial economic security on day one by renting it from Ethereum's existing validator set, rather than attracting their own stakers.

## What Are Actively Validated Services (AVSs)?

AVSs are the protocols that use EigenLayer's pooled security. They span a wide range of use cases:

**Data availability layers:** Services like EigenDA (EigenLayer's own data availability product) provide low-cost, high-throughput data storage for rollups. Rollup operators post transaction data to EigenDA instead of directly to Ethereum, dramatically reducing costs.

**Oracles:** Price feeds and other data oracle networks can use restaked ETH to make data manipulation attacks economically expensive.

**Bridges:** Cross-chain bridges secured by restaked ETH have much stronger security guarantees than bridges with their own small validator sets.

**Decentralized sequencers:** Rollups that want decentralized transaction ordering rather than centralized sequencers can use AVSs.

**Coprocessors:** Off-chain computation networks that need economic accountability.

By 2026, dozens of AVSs have launched on EigenLayer, collectively managing billions in restaked value.

## Liquid Restaking Tokens (LRTs)

Just as liquid staking protocols like Lido gave users stETH (a token representing their staked ETH), liquid restaking protocols give users tokens representing their restaked positions. These LRTs can be used in DeFi while the underlying ETH works to earn restaking rewards.

**eETH (ether.fi):** ether.fi is the largest liquid restaking protocol. Users deposit ETH and receive eETH, which earns staking rewards plus restaking rewards from AVSs that ether.fi opts into.

**ezETH (Renzo):** Renzo's liquid restaking token, which automatically allocates to high-yielding AVSs to maximize returns.

**rsETH (KelpDAO):** Another major liquid restaking token focused on maximizing restaking yield through AVS selection.

**pzETH (Swell):** Swell's restaking product combining native staking with EigenLayer participation.

LRTs have become major DeFi assets, used as collateral in lending markets like Aave and Morpho, as liquidity in DEX pools, and as yield-bearing base assets in structured products.

## Restaking Rewards

Restaking participants earn rewards from multiple sources:

- Standard ETH staking rewards (currently ~3-4% APY)
- AVS rewards paid in the AVS's native token
- Points and potential airdrop allocations from both EigenLayer and individual AVSs

During EigenLayer's points program in 2024, many protocols offered enhanced rewards to attract TVL, creating very high yields for early restakers. By 2026, yields have normalized but remain meaningfully higher than solo staking.

## The Risks of Restaking

Restaking introduces new risk vectors that every participant must understand.

**Slashing risk multiplication.** By opting into multiple AVSs, a validator's ETH can be slashed by any of them. A validator who behaves honestly on Ethereum but makes an error on an AVS could still lose part of their stake. Restakers must trust that the AVSs they opt into have well-designed and correctly implemented slashing conditions.

**Smart contract risk.** EigenLayer itself is a complex smart contract system. Bugs in EigenLayer's contracts could put all restaked ETH at risk simultaneously. Despite multiple audits, smart contract risk can never be entirely eliminated.

**Systemic risk.** If many validators opt into the same AVS and that AVS's slashing conditions contain a bug, a large portion of Ethereum's validator set could be slashed simultaneously. This "correlated slashing" scenario could theoretically destabilize Ethereum itself.

**LRT de-peg risk.** Liquid restaking tokens can de-peg from ETH in the event of a major slash or liquidity crisis, similar to how stETH briefly de-pegged in 2022.

**AVS quality risk.** Not all AVSs are equally well-designed. Restakers must evaluate the quality and security of AVS code before opting in.

## EigenLayer's Impact on Ethereum

EigenLayer has meaningfully changed Ethereum's ecosystem dynamics:

- It has made it economically attractive for validators to remain on Ethereum rather than moving capital elsewhere
- It has accelerated the launch of data availability layers and oracle networks by lowering their security bootstrapping cost
- It has created a new yield source that makes ETH more competitive as a productive asset vs. other proof-of-stake networks
- It has raised deep questions about the limits of shared security and the responsibilities of Ethereum validators

## Is Restaking Right for You?

Restaking suits sophisticated ETH holders who:
- Understand the additional slashing risks
- Are comfortable evaluating AVS quality
- Want to maximize yield on long-term ETH positions
- Have enough capital that gas costs for LRT interactions are economical

For simpler ETH exposure, standard liquid staking via Lido or Rocket Pool remains lower-risk. Restaking is a power user product that rewards those who do their homework.

EigenLayer represents one of the most creative applications of Ethereum's security model since proof-of-stake itself — a genuine protocol-level innovation with real demand and real risks.
