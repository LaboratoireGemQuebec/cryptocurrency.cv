---
title: "Fetching NFT Metadata with APIs"
description: "Learn how to fetch NFT metadata using Alchemy, OpenSea, and Moralis APIs. Covers token URIs, IPFS resolution, on-chain attributes, and building an NFT viewer."
date: "2026-03-30"
author: team
category: tutorial
tags: ["nft", "metadata", "api", "ipfs", "ethereum", "developer"]
image: "/images/blog/nft-metadata-api.jpg"
imageAlt: "NFT metadata viewer showing token attributes, images, and on-chain properties"
---

NFT metadata is the data that gives each token its identity — the image, name, description, and attributes that make a CryptoPunk different from a Bored Ape. Understanding how to fetch and parse this data is essential for building NFT marketplaces, portfolio trackers, rarity tools, and analytics platforms.

## How NFT Metadata Works

Most NFTs follow the ERC-721 or ERC-1155 standard. The smart contract stores a `tokenURI` — a URL pointing to a JSON metadata file. This JSON file follows a standard format:

```json
{
  "name": "Bored Ape #1234",
  "description": "A bored ape from the Bored Ape Yacht Club",
  "image": "ipfs://QmXyz.../1234.png",
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Fur", "value": "Gold" },
    { "trait_type": "Eyes", "value": "Bored" }
  ]
}
```

The `image` field often uses IPFS URIs (`ipfs://`) which need to be resolved through an IPFS gateway.

## Getting tokenURI via JSON-RPC

The most direct approach reads the `tokenURI` from the smart contract:

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

const ERC721_ABI = [
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
];

async function getNFTMetadata(contractAddress, tokenId) {
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

  const [tokenURI, owner, name, symbol] = await Promise.all([
    contract.tokenURI(tokenId),
    contract.ownerOf(tokenId),
    contract.name(),
    contract.symbol(),
  ]);

  // Resolve the metadata
  const metadataUrl = resolveIPFS(tokenURI);
  const response = await fetch(metadataUrl);
  const metadata = await response.json();

  return {
    tokenId,
    owner,
    collection: { name, symbol },
    metadata: {
      ...metadata,
      image: resolveIPFS(metadata.image),
    },
  };
}

function resolveIPFS(uri) {
  if (uri.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  }
  if (uri.startsWith('ipfs/')) {
    return `https://ipfs.io/${uri}`;
  }
  return uri;
}
```

## Using the Alchemy NFT API

Alchemy's NFT API handles all the complexity of metadata resolution, IPFS fetching, and normalization:

```javascript
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const BASE_URL = `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`;

// Get metadata for a single NFT
async function getNFTMetadata(contractAddress, tokenId) {
  const response = await fetch(
    `${BASE_URL}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}&refreshCache=false`
  );
  return response.json();
}

// Get all NFTs owned by an address
async function getWalletNFTs(walletAddress, pageKey) {
  const params = new URLSearchParams({
    owner: walletAddress,
    withMetadata: 'true',
    pageSize: '100',
    ...(pageKey && { pageKey }),
  });

  const response = await fetch(`${BASE_URL}/getNFTsForOwner?${params}`);
  return response.json();
}

// Get all NFTs in a collection
async function getCollectionNFTs(contractAddress, startToken = '0') {
  const params = new URLSearchParams({
    contractAddress,
    withMetadata: 'true',
    limit: '100',
    startToken,
  });

  const response = await fetch(`${BASE_URL}/getNFTsForContract?${params}`);
  return response.json();
}
```

## Using Moralis NFT API

Moralis provides a comprehensive NFT API with cross-chain support:

```javascript
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

async function moralisGetNFT(address, tokenId, chain = '0x1') {
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/nft/${address}/${tokenId}?chain=${chain}&format=decimal`,
    { headers: { 'X-API-Key': MORALIS_API_KEY } }
  );
  return response.json();
}

async function moralisGetWalletNFTs(walletAddress, chain = '0x1') {
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/${walletAddress}/nft?chain=${chain}&format=decimal&media_items=false`,
    { headers: { 'X-API-Key': MORALIS_API_KEY } }
  );
  return response.json();
}

// Get NFT transfers for a contract
async function getNFTTransfers(contractAddress, chain = '0x1') {
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/nft/${contractAddress}/transfers?chain=${chain}&format=decimal`,
    { headers: { 'X-API-Key': MORALIS_API_KEY } }
  );
  return response.json();
}
```

## Parsing NFT Attributes for Rarity

NFT rarity is calculated from trait frequency. Here is how to compute it:

```python
from collections import Counter
from typing import Any
import math

def calculate_rarity_scores(nfts: list[dict]) -> list[dict]:
    """
    Calculate rarity scores using the 'rarity score' method:
    Score = sum of (1 / trait_frequency) for each trait
    """
    total = len(nfts)

    # Count trait frequencies
    trait_counts: dict[str, Counter] = {}
    for nft in nfts:
        for attr in nft.get("attributes", []):
            trait = attr.get("trait_type", "")
            value = str(attr.get("value", ""))

            if trait not in trait_counts:
                trait_counts[trait] = Counter()
            trait_counts[trait][value] += 1

    # Calculate rarity score for each NFT
    scored = []
    for nft in nfts:
        score = 0
        trait_rarities = []

        for attr in nft.get("attributes", []):
            trait = attr.get("trait_type", "")
            value = str(attr.get("value", ""))
            count = trait_counts.get(trait, Counter()).get(value, 1)
            frequency = count / total
            trait_score = 1 / frequency

            score += trait_score
            trait_rarities.append({
                "trait_type": trait,
                "value": value,
                "count": count,
                "frequency": f"{frequency * 100:.2f}%",
                "score": trait_score,
            })

        scored.append({
            **nft,
            "rarity_score": score,
            "trait_rarities": sorted(trait_rarities, key=lambda x: x["score"], reverse=True),
        })

    return sorted(scored, key=lambda x: x["rarity_score"], reverse=True)
```

## Building an NFT Viewer Component

```tsx
interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

interface NFTData {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  owner: string;
  tokenId: number | string;
}

function NFTCard({ nft }: { nft: NFTData }) {
  const imageUrl = nft.image.startsWith('ipfs://')
    ? `https://ipfs.io/ipfs/${nft.image.slice(7)}`
    : nft.image;

  return (
    <div className="border rounded-xl overflow-hidden shadow-md max-w-sm">
      <img
        src={imageUrl}
        alt={nft.name}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold">{nft.name}</h2>
        <p className="text-sm text-gray-500 mt-1">#{nft.tokenId}</p>
        <p className="text-sm mt-2">{nft.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {nft.attributes.map((attr, i) => (
            <div key={i} className="bg-blue-50 rounded-lg p-2">
              <div className="text-xs text-gray-500">{attr.trait_type}</div>
              <div className="text-sm font-medium">{attr.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
        </div>
      </div>
    </div>
  );
}
```

## Handling Edge Cases in NFT Metadata

### Base64-encoded On-Chain Metadata

Some NFTs store metadata entirely on-chain as base64-encoded JSON:

```javascript
function decodeTokenURI(tokenURI) {
  if (tokenURI.startsWith('data:application/json;base64,')) {
    const base64 = tokenURI.split(',')[1];
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json);
  }
  return null; // not base64, needs HTTP fetch
}
```

### Rate Limiting and Caching

```javascript
const metadataCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

async function getCachedMetadata(contractAddress, tokenId) {
  const key = `${contractAddress}:${tokenId}`;
  const cached = metadataCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await getNFTMetadata(contractAddress, tokenId);
  metadataCache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

## Conclusion

Fetching NFT metadata requires understanding the ERC-721 standard, IPFS resolution, and the various API providers that abstract this complexity. Whether you use direct on-chain queries via ethers.js, the Alchemy NFT API, or Moralis, you now have the building blocks to create NFT viewers, rarity tools, portfolio trackers, and analytics dashboards.
