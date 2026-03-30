---
title: "DEX APIs: How to Query Uniswap, Jupiter, and More"
description: "Learn how to query decentralized exchange APIs including Uniswap V3, Jupiter on Solana, and DEX aggregators. Get swap quotes, pool data, and token prices programmatically."
date: "2026-03-30"
author: team
category: tutorial
tags: ["dex", "uniswap", "jupiter", "defi", "api", "developer"]
image: "/images/blog/decentralized-exchange-api.jpg"
imageAlt: "Decentralized exchange API query showing swap routes through Uniswap and Jupiter"
---

Decentralized exchanges are among the most data-rich environments in crypto. Every swap, every liquidity event, every price update is transparent and queryable. Whether you are building a price oracle, a portfolio tracker, a trading interface, or an analytics dashboard, DEX APIs provide the raw data you need.

## The DEX API Landscape

| DEX | Chain | Query Method | Best For |
|-----|-------|-------------|---------|
| Uniswap V3 | Ethereum | Subgraph + SDK | Ethereum token prices, pool data |
| Jupiter | Solana | REST API | Solana swaps and routing |
| 1inch | Multi-chain | REST API | Optimal swap routing |
| PancakeSwap | BNB Chain | Subgraph | BNB ecosystem data |
| Curve | Ethereum | REST + on-chain | Stablecoin pools |
| dYdX | dYdX chain | REST API | Perpetuals |

## Uniswap V3: Getting Token Prices

Uniswap V3 doesn't have a traditional "get token price" endpoint — prices are derived from pool data. The easiest way is via the subgraph:

```javascript
async function getUniswapTokenPrice(tokenAddress, stableAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') {
  const query = `
    {
      pool(id: "${getPoolId(tokenAddress, stableAddress)}") {
        token0Price
        token1Price
        token0 { symbol decimals }
        token1 { symbol decimals }
        liquidity
        volumeUSD
      }
    }
  `;

  const response = await fetch('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return data.pool;
}

// Alternative: use token data directly
async function getTokenPriceUSD(tokenAddress) {
  const query = `
    {
      token(id: "${tokenAddress.toLowerCase()}") {
        symbol
        name
        derivedETH
      }
      bundle(id: "1") {
        ethPriceUSD
      }
    }
  `;

  const response = await fetch('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  const ethPrice = parseFloat(data.bundle.ethPriceUSD);
  const derivedETH = parseFloat(data.token.derivedETH);

  return {
    symbol: data.token.symbol,
    name: data.token.name,
    priceUSD: ethPrice * derivedETH,
  };
}

// LINK price
const link = await getTokenPriceUSD('0x514910771AF9Ca656af840dff83E8264EcF986CA');
console.log(`LINK: $${link.priceUSD.toFixed(4)}`);
```

## Uniswap SDK: Getting Swap Quotes

For getting actual swap quotes (including routing through multiple pools), use the Uniswap SDK:

```bash
npm install @uniswap/v3-sdk @uniswap/sdk-core ethers
```

```typescript
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

// Define tokens
const WETH = new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether');
const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin');

// The Uniswap Quoter contract
const QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
const QUOTER_ABI = [
  'function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)',
];

async function getSwapQuote(amountInWei: bigint, fee: number = 500) {
  const quoter = new ethers.Contract(QUOTER_ADDRESS, QUOTER_ABI, provider);

  const amountOut = await quoter.quoteExactInputSingle.staticCall(
    WETH.address,
    USDC.address,
    fee,
    amountInWei,
    0 // no price limit
  );

  const amountInEth = parseFloat(ethers.formatEther(amountInWei));
  const amountOutUsdc = parseFloat(ethers.formatUnits(amountOut, 6));

  return {
    amountIn: amountInEth,
    amountOut: amountOutUsdc,
    pricePerETH: amountOutUsdc / amountInEth,
  };
}

const quote = await getSwapQuote(ethers.parseEther('1'));
console.log(`1 ETH = ${quote.amountOut.toFixed(2)} USDC`);
```

## Jupiter: Solana's DEX Aggregator

Jupiter is the go-to swap router on Solana with an excellent REST API:

```javascript
const JUPITER_API = 'https://quote-api.jup.ag/v6';

// Get a swap quote
async function getJupiterQuote({
  inputMint,
  outputMint,
  amount,
  slippageBps = 50, // 0.5% slippage
}) {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
    slippageBps: slippageBps.toString(),
  });

  const response = await fetch(`${JUPITER_API}/quote?${params}`);
  if (!response.ok) throw new Error(`Jupiter API error: ${response.status}`);
  return response.json();
}

// SOL to USDC quote
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const ONE_SOL = 1_000_000_000; // 1 SOL in lamports

const quote = await getJupiterQuote({
  inputMint: SOL_MINT,
  outputMint: USDC_MINT,
  amount: ONE_SOL,
});

const solAmount = ONE_SOL / 1e9;
const usdcAmount = parseInt(quote.outAmount) / 1e6;
console.log(`1 SOL = ${usdcAmount.toFixed(2)} USDC`);
console.log(`Route: ${quote.routePlan.map(r => r.swapInfo.label).join(' -> ')}`);
```

### Getting All Available Tokens on Jupiter

```javascript
async function getJupiterTokens() {
  const response = await fetch('https://token.jup.ag/strict');
  const tokens = await response.json();

  // Returns list of all verified tokens
  return tokens.map(t => ({
    address: t.address,
    symbol: t.symbol,
    name: t.name,
    decimals: t.decimals,
    logoURI: t.logoURI,
  }));
}
```

## 1inch: Multi-Chain DEX Aggregator

1inch provides optimal routing across multiple DEXs on every major chain:

```javascript
const ONEINCH_BASE = 'https://api.1inch.dev/swap/v6.0';

async function getOneInchQuote({
  chainId = 1, // 1 = Ethereum
  fromToken,
  toToken,
  amount,
}) {
  const params = new URLSearchParams({
    src: fromToken,
    dst: toToken,
    amount,
    includeProtocols: 'true',
    includeGas: 'true',
  });

  const response = await fetch(`${ONEINCH_BASE}/${chainId}/quote?${params}`, {
    headers: { Authorization: `Bearer ${process.env.ONEINCH_API_KEY}` },
  });

  return response.json();
}

// ETH to USDC on Ethereum mainnet
const quote = await getOneInchQuote({
  chainId: 1,
  fromToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native ETH
  toToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',    // USDC
  amount: '1000000000000000000', // 1 ETH in wei
});

console.log(`Expected: ${parseInt(quote.dstAmount) / 1e6} USDC`);
console.log(`Gas estimate: ${quote.gas}`);
console.log(`Protocols: ${quote.protocols?.flat().map(p => p[0]?.name).join(', ')}`);
```

## Building a Token Price Oracle

Combine multiple DEX sources for robust price data:

```javascript
async function getTokenPriceRobust(tokenSymbol) {
  const sources = await Promise.allSettled([
    getUniswapTokenPrice(TOKEN_ADDRESSES[tokenSymbol]),
    getJupiterPrice(SOLANA_MINTS[tokenSymbol]),
    getCoinGeckoPrice(tokenSymbol),
  ]);

  const prices = sources
    .filter(r => r.status === 'fulfilled')
    .map(r => parseFloat(r.value.priceUSD))
    .filter(p => p > 0);

  if (prices.length === 0) throw new Error('All price sources failed');

  // Median price for robustness
  prices.sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];

  return {
    price: median,
    sources: prices.length,
    spread: Math.abs(Math.max(...prices) - Math.min(...prices)) / median * 100,
  };
}
```

## DEX Pool Analytics

Track liquidity and volume trends:

```javascript
async function getPoolAnalytics(poolAddress) {
  // Uniswap V3 pool data from subgraph
  const query = `
    {
      pool(id: "${poolAddress.toLowerCase()}") {
        token0 { symbol }
        token1 { symbol }
        feeTier
        liquidity
        totalValueLockedUSD
        volumeUSD
        feesUSD
        txCount
        poolDayData(first: 30, orderBy: date, orderDirection: desc) {
          date
          volumeUSD
          feesUSD
          tvlUSD
          token0Price
        }
      }
    }
  `;

  const response = await fetch('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return data.pool;
}
```

## Conclusion

DEX APIs span from simple HTTP REST endpoints (Jupiter, 1inch) to GraphQL subgraphs (Uniswap) to direct on-chain queries via ethers.js. Understanding the trade-offs — latency vs. accuracy, API limits vs. on-chain calls — lets you build reliable price feeds and swap integrations. Combine DEX data with news from the [free-crypto-news API](https://free-crypto-news.com) and you have a comprehensive market intelligence platform.
