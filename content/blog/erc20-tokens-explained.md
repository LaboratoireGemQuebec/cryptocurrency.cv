---
title: "ERC-20 Tokens Explained: The Standard Behind Most Crypto"
description: "Learn what ERC-20 tokens are, how they're created on Ethereum, examples like LINK and USDC, how to add them to MetaMask, and the gas costs involved."
date: "2026-03-30"
author: team
category: ethereum
tags: ["ethereum", "ERC-20", "tokens", "altcoins"]
image: "/images/blog/erc20-tokens-explained.jpg"
imageAlt: "Collection of ERC-20 token logos including USDC, LINK, UNI, and AAVE on Ethereum"
featured: false
---

If you've ever wondered why thousands of different cryptocurrencies all "live on Ethereum," ERC-20 tokens are the answer. The ERC-20 standard is the technical framework that allows anyone to create a new fungible token on Ethereum — and it's the foundation for most of the crypto assets you've heard of outside of Bitcoin and ETH.

## What Is ERC-20?

**ERC-20** stands for "Ethereum Request for Comment 20." It is a technical standard that defines a common interface (a set of rules and functions) that all compatible tokens must implement. Proposed by Fabian Vogelsteller in 2015 and finalized as a standard in 2017, ERC-20 enabled the explosion of the ICO (Initial Coin Offering) era and the subsequent DeFi ecosystem.

Before ERC-20, every token on Ethereum implemented its own unique interface. Exchanges, wallets, and DeFi protocols would need to write custom code for each new token — an enormous inefficiency. ERC-20 solved this by standardizing six required functions and three events that every token must support.

## The ERC-20 Standard Functions

A compliant ERC-20 token must implement these functions:

```solidity
// Returns the total token supply
function totalSupply() external view returns (uint256);

// Returns the balance of an account
function balanceOf(address account) external view returns (uint256);

// Transfers tokens from sender to recipient
function transfer(address recipient, uint256 amount) external returns (bool);

// Returns remaining allowance for a spender
function allowance(address owner, address spender) external view returns (uint256);

// Approves a spender to use a certain amount of tokens
function approve(address spender, uint256 amount) external returns (bool);

// Transfers tokens on behalf of approved address
function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
```

These six functions plus the name, symbol, and decimals metadata constitute an ERC-20 token. Any wallet or DeFi protocol that supports "ERC-20 tokens" can automatically work with any token that implements this standard.

## Major ERC-20 Tokens

Thousands of ERC-20 tokens exist. Here are some of the most significant by market cap and utility:

| Token | Symbol | Use Case | Market Cap Rank |
|-------|--------|----------|-----------------|
| Tether | USDT | USD stablecoin | Top 3 overall |
| USD Coin | USDC | USD stablecoin | Top 10 overall |
| Chainlink | LINK | Oracle network payments | Top 20 |
| Uniswap | UNI | DEX governance | Top 30 |
| Aave | AAVE | DeFi lending governance | Top 40 |
| Shiba Inu | SHIB | Meme token | Variable |
| Maker | MKR | DAI stablecoin governance | Top 40 |

### Stablecoins (USDC, USDT)

The largest ERC-20 tokens by usage are stablecoins — tokens that maintain a 1:1 peg to the US dollar. USDC (by Circle) and USDT (by Tether) together represent hundreds of billions in value on Ethereum. They are the lifeblood of DeFi, providing a stable medium of exchange within the ecosystem.

### Governance Tokens (UNI, AAVE, MKR)

DeFi protocols issue ERC-20 governance tokens to give their communities voting rights over protocol upgrades, fee parameters, and treasury management. Holding UNI gives you a vote in Uniswap governance; holding AAVE gives you a vote in Aave's DAO.

### Utility Tokens (LINK)

Chainlink's LINK token is used to pay oracle node operators for fetching and delivering real-world data to smart contracts. It has genuine utility within its ecosystem — more than speculative governance rights.

## How ERC-20 Tokens Are Created

Creating an ERC-20 token is surprisingly straightforward with tools like OpenZeppelin's token library:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
```

This ~10-line contract creates a fully functional ERC-20 token. Deploying it to Ethereum mainnet costs gas — typically $50–$500 depending on network conditions. The ease of token creation is why thousands of new tokens launch each month.

## How to Add ERC-20 Tokens to MetaMask

By default, MetaMask only shows ETH and tokens it automatically detects. To add a custom ERC-20 token:

### Method 1: Auto-Detection
MetaMask now automatically detects many popular ERC-20 tokens from your activity. Check the "Tokens" tab — it may already appear.

### Method 2: Import Token
1. Open MetaMask and go to the "Tokens" tab
2. Click "Import tokens" at the bottom
3. Switch to "Custom token" tab
4. Enter the **contract address** (from Etherscan or the project's official documentation)
5. Symbol and decimals will auto-fill
6. Click "Add Custom Token" then "Import Tokens"

### Finding the Contract Address
Always get token contract addresses from:
- The project's official website
- CoinGecko or CoinMarketCap token pages (look for "Contract" under "Token Information")
- Etherscan's verified token list

**Warning**: Scammers create fake tokens with identical names and logos. Always verify you're adding the correct contract address from an official source.

## Gas Costs for ERC-20 Tokens

ERC-20 token transfers cost more gas than simple ETH transfers because they require executing the smart contract's `transfer()` function:

| Operation | Gas Units | Cost at 20 gwei, ETH=$3,000 |
|-----------|-----------|------------------------------|
| ETH transfer | 21,000 | ~$1.26 |
| ERC-20 transfer | 45,000–65,000 | ~$2.70–$3.90 |
| ERC-20 approve + transferFrom | 50,000–90,000 | ~$3–$5.40 |
| Uniswap swap (ERC-20) | 100,000–150,000 | ~$6–$9 |

This is why using ERC-20 tokens on Ethereum mainnet can be expensive during busy periods. For high-frequency token trading, Layer 2 networks like Arbitrum or Base reduce these costs by 95%+.

## ERC-20 vs Other Token Standards

| Standard | Use Case | Fungibility |
|----------|----------|-------------|
| ERC-20 | Fungible tokens (currencies, governance) | Fully fungible |
| ERC-721 | Non-fungible tokens (NFTs) | Unique, non-fungible |
| ERC-1155 | Multi-token (gaming items) | Mixed (fungible + NFT) |
| ERC-4626 | Tokenized vaults (DeFi yield) | Fungible, specialized |

ERC-721 NFTs follow the same "request for comment" process but implement a different interface for unique tokens rather than identical fungible ones.

## Token Approval Security

One important security concept for ERC-20 users: the **approve** function allows a smart contract (like Uniswap) to spend tokens from your wallet. If you've used DeFi, you've approved token allowances.

**Best practices:**
- Revoke unused approvals using tools like **Revoke.cash** or **Etherscan's Token Approvals** feature
- Never grant unlimited approvals to unaudited contracts
- Review approval amounts before confirming DeFi transactions

## Conclusion

ERC-20 is the invisible infrastructure behind the majority of the crypto ecosystem. Every stablecoin, governance token, and DeFi utility token you interact with is almost certainly an ERC-20 contract. Understanding the standard helps you navigate wallets, DeFi protocols, and security best practices with confidence.

For the latest ERC-20 token news and Ethereum ecosystem updates, visit [Crypto Vision News](/).
