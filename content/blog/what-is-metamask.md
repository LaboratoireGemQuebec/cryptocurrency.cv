---
title: "What Is MetaMask? The Complete Beginner's Guide"
description: "A complete beginner's guide to MetaMask — what it is, how to install it, creating or importing a wallet, adding networks, sending and receiving crypto, and connecting to dApps."
date: "2026-03-30"
author: team
category: tutorials
tags: ["metamask", "wallet", "ethereum", "web3", "tutorial"]
image: "/images/blog/what-is-metamask.jpg"
imageAlt: "MetaMask wallet beginner's guide showing browser extension and mobile app"
---

MetaMask is the gateway to Web3 for most people. It's a cryptocurrency wallet that lives in your browser and lets you interact with Ethereum and thousands of other blockchain networks. With over 30 million active users, it's the most widely used Web3 wallet in existence. This guide covers everything a beginner needs to get started.

## What Is MetaMask?

MetaMask is a **self-custody cryptocurrency wallet** available as a browser extension (Chrome, Firefox, Brave, Edge) and mobile app (iOS, Android). It serves multiple functions:

1. **Wallet:** Stores and manages your Ethereum (ETH) and ERC-20 tokens
2. **Key manager:** Holds your private keys locally on your device
3. **Web3 connector:** Lets you interact with decentralized applications (dApps)
4. **Multi-network support:** Works with Ethereum, Polygon, Arbitrum, Base, Binance Smart Chain, and hundreds of other EVM-compatible networks
5. **Transaction signer:** Approves and signs blockchain transactions

**Self-custody means:** MetaMask doesn't hold your funds — it's software that manages your private keys on your own device. MetaMask the company cannot access your funds, freeze your account, or recover lost passwords. You are in complete control.

## Installing MetaMask

### Browser Extension (Recommended for Desktop)

1. Open your browser (Chrome, Brave, or Firefox)
2. Go to **metamask.io** — type this directly, don't Google it
3. Click "Download" and choose your browser
4. Click "Add to Chrome/Firefox" on the extension store page
5. Verify the publisher is "MetaMask" with millions of users before installing

After installation, the MetaMask fox icon appears in your browser's extension toolbar.

### Mobile App

1. Open the App Store (iOS) or Google Play Store (Android)
2. Search for "MetaMask" and verify it's published by "MetaMask"
3. Install the app
4. The icon is the orange fox logo

**Security warning:** Only download from metamask.io or the official app stores. Fake MetaMask apps steal seed phrases. Double-check you're installing the genuine app.

## Creating a New Wallet

When you open MetaMask for the first time:

1. Click "Create a new wallet"
2. Agree to the terms of service
3. Create a password — this encrypts your wallet on this device. Use something strong and unique.
4. **Back up your Secret Recovery Phrase (seed phrase)**

### The Seed Phrase — Critical Step

MetaMask will show you 12 words in a specific order. This is your Secret Recovery Phrase (SRP). It is the master key to everything in your wallet.

**How to store it:**
- Write it on paper with a pen, in order
- Verify what you wrote against the screen
- Store it somewhere physically secure (safe, locked drawer)
- Consider storing copies in multiple locations
- Never take a photo of it
- Never type it into any website, email, or app

After writing it down, MetaMask asks you to confirm the phrase by clicking words in order — this verifies you recorded it correctly.

5. Complete the confirmation quiz
6. Your wallet is created

Your wallet now has an **address** — a string starting with "0x" like `0xAbC123...`. This is your public identifier; share it freely to receive crypto.

## Importing an Existing Wallet

If you already have a wallet from another device or app:

1. Click "Import an existing wallet"
2. Enter your 12 or 24-word seed phrase
3. Set a new password for this device
4. MetaMask reconstructs your wallet, including all ETH and tokens

Use this to:
- Move your wallet to a new computer
- Access the same wallet on mobile
- Recover a wallet after reinstalling the extension

## Adding Networks

By default, MetaMask connects to Ethereum mainnet. To add other networks (Polygon, Arbitrum, Base, etc.):

**Method 1: Automatic via Chainlist**
1. Go to chainlist.org
2. Connect MetaMask
3. Search for the network (e.g., "Arbitrum One")
4. Click "Add to MetaMask" and approve

**Method 2: Manual**
1. Open MetaMask → click the network dropdown at the top
2. Click "Add Network" → "Add a network manually"
3. Enter network details:
   - **Arbitrum One:** RPC: https://arb1.arbitrum.io/rpc | Chain ID: 42161 | Symbol: ETH
   - **Polygon:** RPC: https://polygon-rpc.com | Chain ID: 137 | Symbol: MATIC
   - **Base:** RPC: https://mainnet.base.org | Chain ID: 8453 | Symbol: ETH

## Sending Cryptocurrency

1. Open MetaMask and ensure you're on the correct network
2. Click "Send"
3. Enter the recipient's wallet address (0x...) — triple check this before sending
4. Enter the amount
5. Review the transaction details and estimated gas fee
6. Click "Confirm"

The transaction is sent to the blockchain and typically confirms within seconds (Layer 2) to minutes (Ethereum mainnet).

**Important:** Crypto transactions are irreversible. Always verify the recipient address character by character before confirming.

## Receiving Cryptocurrency

To receive crypto, share your MetaMask address:

1. Open MetaMask
2. Click your account name to copy the address, or click the QR code icon to display a scannable code
3. Share this address with the sender

Make sure both you and the sender are on the same network — sending ETH on Arbitrum to someone expecting Ethereum mainnet ETH requires a bridge, not a direct send.

## Connecting to dApps

This is MetaMask's superpower. To use DeFi protocols, NFT marketplaces, or any Web3 app:

1. Navigate to the dApp (e.g., app.uniswap.org, opensea.io)
2. Click "Connect Wallet" on the dApp
3. Choose "MetaMask"
4. A MetaMask popup asks for permission to connect — review and click "Connect"
5. The dApp can now see your address and request transaction signatures

**You remain in control:** Connecting doesn't grant spending permissions. The dApp can see your address but can only move funds if you explicitly approve a transaction.

## Managing Multiple Accounts

MetaMask supports multiple accounts from the same seed phrase:

1. Click your account icon in the top right
2. Click "Add account"
3. Name the new account

Each account has a different address but is derived from the same seed phrase — one backup phrase recovers all of them.

## Key Security Habits

- **Never share your seed phrase** — not with "MetaMask support," not with any website
- **Bookmark metamask.io** and use only that to access the extension store
- **Read transaction details** before confirming — check what's being approved
- **Revoke unused approvals** regularly at revoke.cash
- **Lock MetaMask** when not in use (click the account icon → Lock)

MetaMask is a powerful tool. Like any tool, proper use requires understanding — which you now have.
