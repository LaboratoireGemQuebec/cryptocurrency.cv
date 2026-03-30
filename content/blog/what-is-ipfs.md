---
title: "What Is IPFS? Decentralized Storage for NFTs and Web3"
description: "A clear explanation of IPFS and how it works — content addressing, how NFT metadata uses IPFS, pinning services, and how it compares to Filecoin and Arweave."
date: "2026-03-30"
author: team
category: guides
tags: ["IPFS", "decentralized storage", "NFT", "web3", "Filecoin"]
image: "/images/blog/what-is-ipfs.jpg"
imageAlt: "IPFS decentralized storage network for NFTs and Web3 applications"
---

If you've spent any time in the NFT or Web3 space, you've likely encountered IPFS. Most NFT metadata is stored "on IPFS," decentralized applications host their front-ends on IPFS, and Web3 advocates propose it as an alternative to centralized web hosting. But what is IPFS actually, and how does it work?

## The Problem With HTTP

The traditional web runs on HTTP (HyperText Transfer Protocol). When you request a webpage or file, you're asking for content at a specific location — a server at a specific IP address identified by a domain name.

This creates several problems:

**Link rot:** If the server goes down, changes address, or removes the file, the link breaks. Studies estimate around 25% of web links become broken within a year.

**Censorship:** Anyone controlling the server (or the domain registrar, or the hosting provider) can remove or block content.

**Inefficiency:** If a popular file is hosted in one place, all requests go to that one server — creating bottlenecks even if the same file exists in caches worldwide.

**Centralization:** The web's content is ultimately dependent on a relatively small number of cloud providers (AWS, Google Cloud, Cloudflare). Their outages affect enormous portions of the web.

## How IPFS Works: Content Addressing

IPFS (InterPlanetary File System) is a peer-to-peer protocol that addresses content by what it is rather than where it is. This is called **content addressing**.

Here's the difference:

- **HTTP (location-based):** "Give me the file at this address: server123.example.com/image.jpg"
- **IPFS (content-based):** "Give me the file with this hash: QmXjk..."

### Content Identifiers (CIDs)

When you add a file to IPFS, the protocol generates a cryptographic hash of its contents — a unique fingerprint called a **Content Identifier (CID)**. This CID uniquely and permanently identifies that specific content.

Example CID: `bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi`

**Key properties:**
- The same file always produces the same CID — predictable and verifiable
- Any change to the file produces a completely different CID
- You can request content by CID from any node that has it — no central server required

### How Files Are Retrieved

When you request a CID from IPFS:

1. Your node asks the IPFS network "who has this CID?"
2. Other nodes respond if they have it
3. The file is retrieved from wherever it's available — the nearest or fastest node
4. Your node verifies the content matches the CID (ensuring no tampering)

This makes IPFS resistant to censorship and single points of failure — content exists wherever nodes have chosen to store it.

## How NFT Metadata Uses IPFS

This is the most relevant IPFS use case for most crypto users.

When you own an NFT, the token on the blockchain contains a `tokenURI` — a link to the metadata file that describes the NFT (name, image, attributes). If this metadata is stored on a centralized server:

- The NFT company could change the image (your "rare" NFT becomes a rug image)
- The server could go down, making your NFT display as broken
- The company could delete everything when they shut down

With IPFS:
- The `tokenURI` points to an IPFS CID
- The metadata content is cryptographically tied to that CID — it cannot be changed
- Anyone running an IPFS node can serve this content
- The image and metadata are permanently and verifiably what they were at mint

A properly IPFS-stored NFT looks like:
```
tokenURI: ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
```

This means the metadata's content is immutable and verifiable — a meaningful improvement over centralized storage.

## The Pinning Problem

Here's IPFS's limitation: nodes don't store everything. Files on IPFS are "garbage collected" — if no node maintains ("pins") a file, it eventually disappears from the network.

Simply uploading to IPFS doesn't guarantee persistence. Someone must actively pin the content — agreeing to store and serve it indefinitely.

### Pinning Services

Several services offer persistent IPFS pinning:

- **Pinata (pinata.cloud):** Most popular for NFT projects. Reliable, good API, free tier available
- **nft.storage:** Free storage for NFT data, backed by Filecoin, run by Protocol Labs
- **web3.storage:** General decentralized storage with IPFS + Filecoin backend
- **Infura IPFS:** Developer-focused pinning service

When evaluating whether an NFT's storage is truly decentralized, check whether it's pinned by a reputable service or multiple services — not just uploaded to IPFS once.

## IPFS vs. Filecoin

Filecoin is a complementary protocol that adds **economic incentives** for storage. Where IPFS is a protocol for content-addressed storage, Filecoin is a marketplace where storage providers are paid in FIL tokens to store data for guaranteed periods.

- **IPFS:** Protocol for addressing and sharing content, no economic guarantee of storage
- **Filecoin:** Blockchain-based storage marketplace with cryptographic proofs that data is being stored
- **Together:** Filecoin uses IPFS's content addressing as its foundation, adding guaranteed persistence

For NFT storage, Filecoin-backed solutions (like nft.storage) offer stronger persistence guarantees than IPFS pinning alone.

## IPFS vs. Arweave

Arweave takes a different approach to permanent storage:

- **IPFS/Filecoin:** Subscription or payment model for ongoing storage
- **Arweave:** One-time payment for permanent storage (~200 years+), stored in a "blockweave"

Arweave is increasingly popular for NFT metadata and Web3 applications that need true permanence without ongoing fees. The tradeoff: Arweave has a smaller network than IPFS and data cannot be deleted (which can be a privacy concern).

Projects like Solana's Metaplex use Arweave for NFT metadata. Ethereum projects often use IPFS + Filecoin or Arweave depending on permanence requirements.

## IPFS for Web3 Applications

Beyond NFTs, IPFS serves as decentralized hosting for Web3 frontends. ENS domains can point to IPFS hashes — Uniswap's interface is accessible at uniswap.eth, which resolves to an IPFS hash of the app frontend.

This means even if Uniswap's main website were taken down, the protocol itself (on Ethereum) remains accessible through IPFS-hosted frontends. This is censorship resistance in practice.

## Should You Care About IPFS?

For NFT buyers, check whether your NFT's metadata is stored on IPFS vs. a centralized server. It genuinely matters for long-term persistence.

For developers, IPFS is a foundational Web3 infrastructure component. Understanding content addressing, pinning, and storage guarantees is essential for building durable applications.

IPFS isn't perfect — persistence requires ongoing pinning, and performance can lag centralized CDNs. But as decentralized infrastructure, it's the most mature solution available and an essential building block of Web3.
