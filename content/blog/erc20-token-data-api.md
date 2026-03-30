---
title: "How to Fetch ERC-20 Token Data from APIs"
description: "Learn how to query ERC-20 token data including balances, transfers, supply, and holders using ethers.js, Alchemy, Moralis, and The Graph subgraphs."
date: "2026-03-30"
author: team
category: tutorial
tags: ["erc20", "ethereum", "api", "token", "developer", "ethers"]
image: "/images/blog/erc20-token-data-api.jpg"
imageAlt: "ERC-20 token data dashboard showing balance, supply, and transfer information"
---

ERC-20 is the token standard that powers thousands of cryptocurrencies on Ethereum and EVM-compatible chains. USDC, LINK, UNI, AAVE — every major Ethereum token follows this standard. Knowing how to query ERC-20 data efficiently is a core skill for any Ethereum developer.

## The ERC-20 Standard Interface

Every ERC-20 token implements these functions and events:

```solidity
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Optional but standard
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}
```

## Reading Token Data with ethers.js

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

async function getTokenInfo(tokenAddress) {
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    token.name(),
    token.symbol(),
    token.decimals(),
    token.totalSupply(),
  ]);

  const decimalsNum = Number(decimals);
  const supply = Number(totalSupply) / Math.pow(10, decimalsNum);

  return { name, symbol, decimals: decimalsNum, totalSupply: supply };
}

async function getTokenBalance(tokenAddress, walletAddress) {
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const decimals = await token.decimals();
  const balance = await token.balanceOf(walletAddress);
  return Number(balance) / Math.pow(10, Number(decimals));
}

// USDC
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const info = await getTokenInfo(USDC);
console.log(`${info.name} (${info.symbol}): ${info.totalSupply.toLocaleString()} supply`);
```

## Getting All Token Balances for a Wallet

Querying each token individually is slow. Use a multicall contract or provider-specific APIs:

```javascript
// Using Alchemy's getTokenBalances
async function getWalletTokenBalances(walletAddress) {
  const response = await fetch(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenBalances',
        params: [walletAddress, 'DEFAULT_TOKENS'],
      }),
    }
  );

  const { result } = await response.json();
  const nonZero = result.tokenBalances.filter(
    tb => tb.tokenBalance !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  );

  // Fetch metadata for each token
  const metadataPromises = nonZero.map(tb =>
    fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getTokenMetadata',
          params: [tb.contractAddress],
        }),
      }
    ).then(r => r.json()).then(d => d.result)
  );

  const metadata = await Promise.all(metadataPromises);

  return nonZero.map((tb, i) => {
    const meta = metadata[i];
    const rawBalance = BigInt(tb.tokenBalance);
    const decimals = meta?.decimals ?? 18;
    const balance = Number(rawBalance) / Math.pow(10, decimals);

    return {
      contract: tb.contractAddress,
      symbol: meta?.symbol ?? '???',
      name: meta?.name ?? 'Unknown',
      balance,
      decimals,
    };
  }).filter(t => t.balance > 0.000001);
}
```

## Fetching Transfer History

### Via Etherscan API

```javascript
async function getTokenTransfers(tokenAddress, walletAddress, apiKey) {
  const response = await fetch(
    `https://api.etherscan.io/api?` +
    `module=account&action=tokentx` +
    `&contractaddress=${tokenAddress}` +
    `&address=${walletAddress}` +
    `&startblock=0&endblock=99999999&sort=desc` +
    `&apikey=${apiKey}`
  );

  const { result } = await response.json();

  return result.map(tx => {
    const decimals = parseInt(tx.tokenDecimal);
    return {
      hash: tx.hash,
      blockNumber: parseInt(tx.blockNumber),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000),
      from: tx.from,
      to: tx.to,
      amount: parseInt(tx.value) / Math.pow(10, decimals),
      symbol: tx.tokenSymbol,
      direction: tx.to.toLowerCase() === walletAddress.toLowerCase() ? 'IN' : 'OUT',
    };
  });
}

const transfers = await getTokenTransfers(
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Wallet
  process.env.ETHERSCAN_API_KEY
);
```

### Via Alchemy getLogs

```javascript
async function getTransfersFromLogs(tokenAddress, walletAddress, fromBlock = -1000) {
  const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');
  const paddedAddress = ethers.zeroPadValue(walletAddress, 32);

  // Get both incoming and outgoing transfers
  const [incoming, outgoing] = await Promise.all([
    provider.getLogs({
      address: tokenAddress,
      topics: [TRANSFER_TOPIC, null, paddedAddress], // to = wallet
      fromBlock,
    }),
    provider.getLogs({
      address: tokenAddress,
      topics: [TRANSFER_TOPIC, paddedAddress, null], // from = wallet
      fromBlock,
    }),
  ]);

  const ERC20_ABI = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
  const iface = new ethers.Interface(ERC20_ABI);

  const parseLog = (log, direction) => {
    const parsed = iface.parseLog({ topics: log.topics, data: log.data });
    return {
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      direction,
      from: parsed.args.from,
      to: parsed.args.to,
      rawAmount: parsed.args.value.toString(),
    };
  };

  return [
    ...incoming.map(l => parseLog(l, 'IN')),
    ...outgoing.map(l => parseLog(l, 'OUT')),
  ].sort((a, b) => b.blockNumber - a.blockNumber);
}
```

## Token Holder Analytics

```javascript
async function getTokenHolderCount(tokenAddress) {
  // This requires a subgraph or specialized provider - can't do it with vanilla RPC
  // Using The Graph
  const query = `
    {
      token(id: "${tokenAddress.toLowerCase()}") {
        holderCount
        totalSupply
        transferCount
      }
    }
  `;

  const response = await fetch(
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }
  );

  const { data } = await response.json();
  return data.token;
}
```

## Token Price from DEX

```javascript
async function getTokenPriceFromUniswap(tokenAddress) {
  // Get price in ETH from Uniswap subgraph
  const query = `
    {
      token(id: "${tokenAddress.toLowerCase()}") {
        symbol
        derivedETH
      }
      bundle(id: "1") {
        ethPriceUSD
      }
    }
  `;

  const response = await fetch(
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }
  );

  const { data } = await response.json();
  const ethPrice = parseFloat(data.bundle.ethPriceUSD);
  const derivedETH = parseFloat(data.token.derivedETH);

  return {
    symbol: data.token.symbol,
    priceUSD: ethPrice * derivedETH,
    priceETH: derivedETH,
  };
}
```

## Building an ERC-20 Token Dashboard

```typescript
interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  price?: number;
  balance?: number;
}

async function buildTokenDashboard(
  tokenAddress: string,
  walletAddress?: string
): Promise<TokenData> {
  const [info, price] = await Promise.allSettled([
    getTokenInfo(tokenAddress),
    getTokenPriceFromUniswap(tokenAddress),
  ]);

  const tokenInfo = info.status === 'fulfilled' ? info.value : null;
  const priceData = price.status === 'fulfilled' ? price.value : null;

  const balance = walletAddress
    ? await getTokenBalance(tokenAddress, walletAddress)
    : undefined;

  return {
    address: tokenAddress,
    name: tokenInfo?.name ?? 'Unknown',
    symbol: tokenInfo?.symbol ?? '???',
    decimals: tokenInfo?.decimals ?? 18,
    totalSupply: tokenInfo?.totalSupply ?? 0,
    price: priceData?.priceUSD,
    balance,
  };
}
```

## Conclusion

ERC-20 token data is accessible through multiple layers: direct contract calls via ethers.js for precision, Alchemy/Moralis APIs for efficiency, and The Graph subgraphs for historical and aggregate queries. Understanding all three approaches lets you choose the right tool for each use case — whether you are building a wallet balance display, a transfer history viewer, or a token analytics platform.
