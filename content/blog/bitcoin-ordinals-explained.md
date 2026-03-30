---
title: "Bitcoin Ordinals Explained: NFTs on Bitcoin"
description: "Learn how Bitcoin Ordinals work, what inscriptions are, how BRC-20 tokens function, and why they're controversial in the Bitcoin community. Everything you need to know about NFTs on Bitcoin."
date: "2026-03-30"
author: team
category: bitcoin
tags: ["ordinals", "bitcoin", "NFT", "inscriptions", "BRC-20"]
image: "/images/blog/bitcoin-ordinals-explained.jpg"
imageAlt: "Bitcoin logo with digital inscription art overlay"
---

In January 2023, a developer named Casey Rodarmor launched Ordinals — a protocol that allows arbitrary data to be inscribed permanently onto individual satoshis, the smallest unit of Bitcoin. This created the ability to mint NFTs directly on the Bitcoin blockchain without any separate token standard or sidechain. The reaction from the Bitcoin community was immediate and divided, and the debate continues in 2026.

## Understanding Satoshi Numbering

Every bitcoin can be divided into 100 million satoshis (sats). Ordinal theory assigns each satoshi a unique number based on the order in which it was mined. The very first satoshi ever mined is ordinal #0. The 21 millionth bitcoin's last satoshi will be the final ordinal ever created.

This numbering system is applied retroactively — it doesn't require any changes to Bitcoin's protocol. It's a convention: by tracking which satoshi is transferred in each transaction, you can follow the "identity" of any individual sat through its entire history on the blockchain.

Ordinals also assign rarity classes to satoshis based on mining milestones: common sats are ordinary, uncommon sats are the first sat of each block, rare sats are the first sat of each difficulty adjustment, epic sats are the first sat after each halving, and legendary sats are tied to extremely rare future events.

## What Are Inscriptions?

Inscriptions are the mechanism that makes Ordinals useful as NFTs. Using Bitcoin's Taproot upgrade (activated in November 2021), data can be embedded in the "witness" portion of a Bitcoin transaction. Ordinal inscriptions attach this data — which can be images, text, video, code, or any file — to a specific satoshi.

Once inscribed, that data is permanently stored on the Bitcoin blockchain. Unlike Ethereum NFTs, which often store just a pointer to an image hosted on IPFS or a centralized server, Ordinal inscriptions store the actual content on-chain. A JPEG inscribed as an Ordinal is literally encoded in Bitcoin transactions forever.

This on-chain permanence is one of Ordinals' most appealing properties — and also one of the main points of controversy.

## How Inscriptions Work Technically

Creating an inscription involves a two-step Bitcoin transaction:

1. **Commit transaction:** Creates a Taproot output containing the inscription data in a script
2. **Reveal transaction:** Spends that output, revealing the inscription content to the network

The inscription is "owned" by whoever controls the satoshi it's attached to. Transferring the NFT means sending that specific satoshi to a new address. Ordinal-compatible wallets like Xverse, Leather, and Unisat track ordinals within UTXOs to ensure users don't accidentally spend inscribed satoshis as regular transaction fees.

## BRC-20 Tokens: Fungible Tokens on Bitcoin

BRC-20 is an experimental token standard created by the developer @domo in March 2023. It uses text-based inscriptions in a specific JSON format to deploy, mint, and transfer fungible tokens on Bitcoin.

A BRC-20 deployment inscription defines a token's ticker, supply cap, and mint limit per inscription. Users then inscribe individual "mint" transactions to claim tokens. The token balances are tracked off-chain by indexers that read all inscriptions and calculate each wallet's holdings.

Early BRC-20 tokens like ORDI and SATS reached significant market capitalizations, though the standard has significant limitations compared to Ethereum's ERC-20. There's no smart contract logic, no DeFi integration, and balance tracking requires external indexers that must agree on protocol rules.

## Major Collections and Culture

Ordinals spawned a vibrant digital art community. Notable collections include:

- **Bitcoin Punks:** Replicas of the original CryptoPunks, inscribed on Bitcoin
- **Ordinal Punks:** Original 100-piece collection using early rare ordinal numbers
- **Bitcoin Frogs:** 10,000-piece frog collection with strong community
- **NodeMonkes:** One of the most valuable collections, featuring pixel monkey art
- **Runestones:** Early airdrop collection that converted to the Runes token standard

The culture around Bitcoin Ordinals has a distinct ethos — collectors prize early inscription numbers and inscriptions on rare satoshis as status symbols within the community.

## The Runes Protocol

In April 2024, coinciding with the Bitcoin halving, Casey Rodarmor launched Runes — a fungible token protocol designed to replace the messy BRC-20 standard. Runes stores all token data in Bitcoin transaction outputs using the OP_RETURN opcode, making it cleaner and more efficient than BRC-20 inscriptions.

Runes launched with enormous enthusiasm, temporarily congesting the Bitcoin network and generating millions in fees during the halving block. By 2026, Runes has become the dominant fungible token standard on Bitcoin.

## The Bitcoin Community Controversy

Ordinals and inscriptions have divided the Bitcoin community along philosophical lines.

**Critics argue:**
- Inscriptions bloat the blockchain with "junk data" that has nothing to do with Bitcoin's core purpose as sound money
- High inscription activity drives up transaction fees, potentially pricing out regular Bitcoin users
- Data storage on the blockchain was never intended by Satoshi Nakamoto
- The witness data discount that makes inscriptions economical was designed for smart contract scripts, not arbitrary data

**Supporters counter:**
- Any valid transaction that pays sufficient fees has the right to use Bitcoin's block space — this is a feature, not a bug
- Higher fees from inscription activity strengthens miner revenue, supporting network security long-term
- Bitcoin needs use cases beyond speculation to justify its security model after all 21 million BTC are mined
- Censoring inscription transactions would require changing Bitcoin's consensus rules, which requires community agreement

Some prominent Bitcoin developers have proposed soft fork changes to make inscriptions more expensive or technically impossible. None have achieved consensus.

## Impact on Bitcoin Transaction Fees

Ordinals have had measurable impact on Bitcoin's fee market. During inscription crazes in 2023 and 2024, average transaction fees spiked dramatically — at times making even simple BTC transfers cost $50 or more. This frustrated users trying to make payments while benefiting miners who earned more revenue.

In periods of lower inscription activity, fees return to normal ranges. The dynamic has introduced a new variable into Bitcoin's fee market that didn't exist before 2023.

## Should You Buy Bitcoin Ordinals?

Bitcoin Ordinals occupy a unique position in the NFT market — they have the strongest possible permanence guarantee (secured by Bitcoin's proof-of-work), but they lack the programmability of Ethereum NFTs. The market is illiquid compared to Ethereum NFT markets, and the tooling is still maturing.

For collectors who value provenance and permanence above all else, rare inscriptions on Bitcoin may be compelling. For those who want DeFi integration, royalties, and ecosystem depth, Ethereum NFT platforms remain more mature.

Bitcoin Ordinals represent a genuine innovation in how Bitcoin's block space can be used, regardless of whether you think that's a good thing.
