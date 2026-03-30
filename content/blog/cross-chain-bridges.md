---
title: "Cross-Chain Bridges: How to Move Crypto Between Blockchains"
description: "Learn how cross-chain bridges work, why over $600 million has been stolen in bridge hacks, which bridges are safest to use, and how to move crypto between blockchains securely."
date: "2026-03-30"
author: team
category: guides
tags: ["cross-chain", "bridge", "interoperability", "layer 2", "security"]
image: "/images/blog/cross-chain-bridges.jpg"
imageAlt: "Digital bridge connecting different blockchain networks"
---

The crypto ecosystem is not a single, unified network. Ethereum, Solana, BNB Chain, Avalanche, and dozens of other blockchains operate independently, each with their own assets, protocols, and communities. If you want to use your ETH on Solana, or move USDC from Ethereum to Arbitrum, you need a bridge. Understanding how bridges work — and why they're the most dangerous infrastructure in crypto — could save you from losing your funds.

## Why Do We Need Bridges?

Each blockchain is a sovereign system. ETH exists on Ethereum and cannot natively exist on Solana. The two chains have no direct communication — they don't share data, consensus, or state.

Bridges solve this by creating representations of assets from one chain on another chain. When you "bridge" your ETH from Ethereum to Arbitrum, you're not really moving ETH — you're locking it on Ethereum and receiving a corresponding IOU token on Arbitrum. The bridge protocol manages this lock-and-mint process.

As the crypto ecosystem fragmented into dozens of competing chains and Layer 2s, bridges became critical infrastructure. Users need to move between chains to access different DeFi yields, NFT ecosystems, and applications. By 2026, bridged assets represent hundreds of billions of dollars in locked value.

## How Bridges Work

### Lock-and-Mint Model

The most common bridge architecture:

1. You deposit Token A on Chain X into a bridge smart contract (it gets locked)
2. The bridge mints an equivalent "wrapped" Token A on Chain Y
3. When you want to return, you burn the wrapped token on Chain Y
4. The bridge releases the original Token A on Chain X

The bridge contract on Chain X holds all the locked assets as collateral backing the wrapped tokens. This creates a "honey pot" — a massive concentration of funds secured by bridge-specific code rather than the underlying blockchain's consensus.

### Liquidity Pool Model

Some bridges maintain liquidity pools on both chains rather than locking and minting. You deposit Token A on Chain X, liquidity providers on Chain Y receive your transfer and send you Token A from their pool. This avoids wrapped tokens but requires sufficient liquidity on the destination chain.

Hop Protocol and Connext pioneered this model, which is faster for stablecoins and assets that exist natively on multiple chains.

### Message-Passing Bridges

More sophisticated bridges like LayerZero and Axelar don't just move tokens — they pass arbitrary messages between chains. This allows complex cross-chain applications: a lending protocol that accepts collateral on Chain X and issues loans on Chain Y, for example.

## The Bridge Hack Problem: $600M+ Stolen

Bridges are the most hacked category of crypto infrastructure by total value lost. Here's why: they require smart contracts to securely manage enormous locked funds across multiple chains simultaneously. Every added chain increases the attack surface.

### Major Bridge Hacks

**Ronin Bridge ($625M, March 2022):** The Ronin Network bridge, used by Axie Infinity, was hacked through compromised validator keys. Hackers gained control of 5 of 9 validator signatures, the threshold needed to authorize withdrawals. $625M in ETH and USDC was drained — the largest DeFi hack in history. The North Korean Lazarus Group was later attributed.

**Wormhole Bridge ($325M, February 2022):** A bug in Wormhole's Solana smart contract allowed an attacker to mint 120,000 wETH without depositing collateral. Jump Crypto replenished the funds to protect users.

**Nomad Bridge ($190M, August 2022):** A botched software upgrade left Nomad's bridge vulnerable. Once the first attacker found the exploit, it became a public free-for-all — hundreds of accounts copied the attack transactions, draining the bridge in a matter of hours.

**Harmony Horizon Bridge ($100M, June 2022):** Private key compromise similar to Ronin — hackers gained two of five multisig signatures needed to authorize withdrawals.

**BNB Chain Bridge ($570M, October 2022):** A vulnerability in BSC Token Hub allowed an attacker to create a false proof and mint 2M BNB, though most of the funds were frozen before the attacker could fully launder them.

## Why Bridges Are So Vulnerable

**Smart contract complexity:** Bridges require complex logic across multiple chains. More code means more potential bugs.

**Validator/key concentration:** Many bridges rely on a small set of validators or multisig keys. Compromising a handful of signers can drain the entire bridge.

**Novel attack surfaces:** Each new feature or supported chain is another potential vulnerability.

**Slow audit coverage:** The pace of bridge development has outstripped the availability of qualified security auditors.

## Safety Tips for Using Bridges

### Check Bridge Security

Before using any bridge:

- **Total Value Locked (TVL):** Bridges with higher TVL have survived more attacks — though this isn't a guarantee
- **Audit count and recency:** Multiple independent audits by reputable firms (Trail of Bits, Sigma Prime, OpenZeppelin) are essential
- **Time in operation:** Older bridges have more battle-hardening
- **Incident history:** Did they ever get hacked? How did they respond?

### Minimize Bridge Exposure

- Bridge only what you need, not your entire portfolio
- Withdraw bridged assets to native assets as soon as possible
- Avoid storing large amounts in bridge contracts long-term

### Use Official Bridges for L2s

Layer 2 networks like Arbitrum, Optimism, and zkSync have official canonical bridges that inherit Ethereum's security via cryptographic proofs. These are safer than third-party bridges for moving assets to major L2s, though slower (7-day withdrawal delays for optimistic rollups).

## Best Bridges by Use Case

**Ethereum L1 to Arbitrum/Optimism:** Use official bridges (Arbitrum Bridge, Optimism Gateway) for security. Use Hop or Stargate for faster withdrawal.

**Between EVM chains (ETH, BNB, Polygon, Avalanche):** Stargate Finance (powered by LayerZero) for stablecoins; Synapse Protocol for multiple assets.

**To Solana:** Wormhole (post-hack, replenished, with improved security) or Portal Bridge.

**Cross-chain stablecoin transfers:** Circle's CCTP (Cross-Chain Transfer Protocol) for USDC is the gold standard — burns USDC on source chain and natively mints it on destination without wrapped tokens.

## The Future of Bridges

The industry is working on fundamentally safer bridge architectures:

**Light client bridges:** Verify the source chain's consensus directly on the destination chain using ZK proofs, eliminating trusted validators. Projects like Succinct Labs and Telepathy are building this.

**Shared security models:** Using Ethereum's validator set (via EigenLayer) to secure bridge validators rather than maintaining separate validator sets.

**Cross-chain standards:** LayerZero's OFT (Omnichain Fungible Token) standard allows tokens to exist natively on multiple chains without wrapped representations.

Bridges remain the riskiest component of the cross-chain ecosystem. Until light client bridges with ZK proofs become standard, users should treat bridge smart contracts with extreme caution and never bridge more than they can afford to lose.
