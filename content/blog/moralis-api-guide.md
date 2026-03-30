---
title: "Getting Started with the Moralis Web3 API"
description: "A beginner's guide to the Moralis Web3 API for fetching wallet data, NFTs, token balances, and transaction history across multiple blockchain networks."
date: "2026-03-30"
author: team
category: tutorial
tags: ["moralis", "web3", "api", "nft", "developer", "multichain"]
image: "/images/blog/moralis-api-guide.jpg"
imageAlt: "Moralis Web3 API dashboard showing cross-chain wallet data and NFT information"
---

Moralis is a Web3 data API that aggregates blockchain data from Ethereum, Polygon, BNB Chain, Solana, Avalanche, and more into a unified REST interface. Instead of writing separate integrations for each chain, you can query a single API for wallet data, NFTs, DeFi positions, and token balances across all supported networks.

## What Moralis Provides

- **Wallet API**: Balance, token holdings, NFTs, transaction history
- **NFT API**: Metadata, collections, transfers, floor prices
- **Token API**: Prices, metadata, swaps, liquidity
- **DeFi API**: Protocol positions, pair data
- **Streams API**: Real-time webhooks for blockchain events

## Setup

Get a free API key at [docs.moralis.io](https://docs.moralis.io):

```bash
npm install moralis
```

```javascript
import Moralis from 'moralis';

await Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});
```

Or use the REST API directly:

```javascript
const MORALIS_BASE = 'https://deep-index.moralis.io/api/v2.2';
const headers = { 'X-API-Key': process.env.MORALIS_API_KEY };
```

## Getting Native Token Balance

```javascript
import Moralis from 'moralis';

async function getNativeBalance(address, chain = '0x1') {
  const response = await Moralis.EvmApi.balance.getNativeBalance({
    chain,
    address,
  });

  return {
    balance: response.raw.balance,
    balanceFormatted: response.result.balance.ether,
  };
}

const balance = await getNativeBalance('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
console.log(`Balance: ${balance.balanceFormatted} ETH`);
```

## Getting ERC-20 Token Balances

```javascript
async function getTokenBalances(address, chain = '0x1') {
  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    chain,
    address,
  });

  return response.result
    .filter(token => parseFloat(token.balance) > 0)
    .map(token => ({
      name: token.name,
      symbol: token.symbol,
      balance: token.balance,
      decimals: token.decimals,
      tokenAddress: token.token_address,
      logo: token.logo,
    }));
}

const tokens = await getTokenBalances('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
tokens.forEach(t => {
  const amount = parseFloat(t.balance) / Math.pow(10, t.decimals);
  console.log(`${t.symbol}: ${amount.toFixed(4)}`);
});
```

## Cross-Chain Portfolio View

One of Moralis's best features is querying multiple chains with the same code:

```javascript
const CHAINS = ['0x1', '0x89', '0x38', '0xa4b1']; // ETH, Polygon, BNB, Arbitrum

async function getCrossChainPortfolio(address) {
  const results = await Promise.allSettled(
    CHAINS.map(chain =>
      Moralis.EvmApi.wallets.getWalletNetWorth({
        address,
        chains: [chain],
      })
    )
  );

  const portfolio = {};
  for (const [i, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      const chain = CHAINS[i];
      portfolio[chain] = {
        netWorthUsd: result.value.raw.total_networth_usd,
        nativeBalance: result.value.raw.native_balance_usd,
        tokenBalance: result.value.raw.token_balance_usd,
      };
    }
  }

  return portfolio;
}

// Get total portfolio value across all chains
async function getTotalPortfolioValue(address) {
  const response = await Moralis.EvmApi.wallets.getWalletNetWorth({
    address,
    chains: CHAINS,
    excludeNativeTokens: false,
  });

  return {
    totalUSD: parseFloat(response.raw.total_networth_usd),
    nativeUSD: parseFloat(response.raw.native_balance_usd),
    tokensUSD: parseFloat(response.raw.token_balance_usd),
    chains: response.raw.chains,
  };
}
```

## NFT Data

```javascript
// Get all NFTs for a wallet
async function getWalletNFTs(address, chain = '0x1') {
  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    chain,
    address,
    mediaItems: false,
    normalizeMetadata: true,
  });

  return response.result.map(nft => ({
    contractAddress: nft.token_address,
    tokenId: nft.token_id,
    name: nft.name,
    symbol: nft.symbol,
    metadata: nft.normalized_metadata,
    image: nft.normalized_metadata?.image,
    attributes: nft.normalized_metadata?.attributes || [],
  }));
}

// Get NFT collection stats
async function getCollectionStats(contractAddress, chain = '0x1') {
  const response = await Moralis.EvmApi.nft.getNFTContractMetadata({
    address: contractAddress,
    chain,
  });

  return {
    name: response.raw.name,
    symbol: response.raw.symbol,
    tokenCount: response.raw.token_count,
    contractType: response.raw.contract_type,
  };
}

// Get NFT floor price
async function getNFTFloorPrice(contractAddress, chain = '0x1') {
  const response = await Moralis.EvmApi.nft.getNFTLowestPrice({
    address: contractAddress,
    chain,
  });

  return {
    price: response.raw.price,
    priceTokenSymbol: response.raw.price_token_symbol,
    marketplace: response.raw.marketplace,
  };
}
```

## Transaction History

```javascript
async function getWalletTransactions(address, chain = '0x1', limit = 50) {
  const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    chain,
    address,
    limit,
    order: 'DESC',
  });

  return response.result.map(tx => ({
    hash: tx.hash,
    blockNumber: tx.block_number,
    timestamp: tx.block_timestamp,
    from: tx.from_address,
    to: tx.to_address,
    value: tx.value,
    valueFormatted: tx.value_decimal,
    gasPrice: tx.gas_price,
    gasUsed: tx.receipt_gas_used,
    status: tx.receipt_status === '1' ? 'success' : 'failed',
  }));
}

// Get decoded transaction details
async function getDecodedTransaction(txHash, chain = '0x1') {
  const response = await Moralis.EvmApi.transaction.getTransaction({
    transactionHash: txHash,
    chain,
    include: 'internal_transactions',
  });

  return {
    hash: response.raw.hash,
    decodedInput: response.raw.decoded_input,
    internalTransactions: response.raw.internal_transactions,
    logs: response.raw.logs,
  };
}
```

## Token Price Data

```javascript
async function getTokenPrice(tokenAddress, chain = '0x1') {
  const response = await Moralis.EvmApi.token.getTokenPrice({
    address: tokenAddress,
    chain,
    include: 'percent_change',
  });

  return {
    symbol: response.raw.token_symbol,
    name: response.raw.token_name,
    priceUSD: response.raw.usd_price,
    priceETH: response.raw.native_price?.value,
    change24h: response.raw['24hrPercentChange'],
    exchange: response.raw.exchange_name,
    pairAddress: response.raw.pair_address,
  };
}

// Get multiple token prices at once
async function getMultipleTokenPrices(tokens, chain = '0x1') {
  const response = await Moralis.EvmApi.token.getMultipleTokenPrices(
    { chain, include: 'percent_change' },
    { tokens: tokens.map(t => ({ token_address: t })) }
  );

  return response.raw;
}
```

## Moralis Streams: Real-Time Webhooks

Streams let you receive webhooks when addresses transact or events are emitted:

```javascript
import Moralis from 'moralis';

async function createAddressStream(address, webhookUrl) {
  const stream = await Moralis.Streams.add({
    chains: ['0x1'],
    description: `Monitor ${address}`,
    tag: 'wallet-monitor',
    webhookUrl,
    includeNativeTxs: true,
    includeContractLogs: true,
    abi: [
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'from', type: 'address' },
          { indexed: true, name: 'to', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ],
    topic0: ['Transfer(address,address,uint256)'],
  });

  // Add the address to monitor
  await Moralis.Streams.addAddress({
    id: stream.id,
    address: [address],
  });

  return stream.id;
}

// Express webhook handler
app.post('/webhook/moralis', express.json(), (req, res) => {
  const data = req.body;
  console.log(`Block: ${data.block.number}`);
  data.logs?.forEach(log => console.log(`Event: ${log.decoded_event?.label}`));
  data.txs?.forEach(tx => console.log(`Tx: ${tx.hash} - ${tx.value} ETH`));
  res.sendStatus(200);
});
```

## Solana Support

```javascript
// Moralis also supports Solana
async function getSolanaTokens(network, address) {
  const response = await Moralis.SolApi.account.getSPL({
    network,
    address,
  });

  return response.raw.map(token => ({
    mint: token.mint,
    amount: token.amount,
    name: token.name,
    symbol: token.symbol,
    logo: token.logo,
  }));
}

// Get Solana NFTs
async function getSolanaNFTs(network, address) {
  const response = await Moralis.SolApi.account.getNFTs({
    network,
    address,
  });
  return response.raw;
}
```

## Conclusion

Moralis accelerates Web3 development by providing a unified API across 20+ chains. The NFT API, Streams, and cross-chain portfolio data are particularly impressive. While there is vendor lock-in to consider, the development speed advantage is significant — features that would take days to build with raw RPC calls take hours with Moralis. Start with the free tier and scale as your application grows.
