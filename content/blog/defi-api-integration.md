---
title: "Integrating DeFi Protocol APIs into Your App"
description: "A practical guide to integrating DeFi protocol APIs including Uniswap, Aave, Compound, and Curve into web applications using JavaScript and Python."
date: "2026-03-30"
author: team
category: tutorial
tags: ["defi", "api", "uniswap", "aave", "javascript", "developer"]
image: "/images/blog/defi-api-integration.jpg"
imageAlt: "DeFi protocol API integration diagram showing Uniswap, Aave, and Compound connections"
---

DeFi protocols have fundamentally changed how financial applications are built. Unlike traditional fintech APIs that require business agreements and months of integration work, DeFi protocols expose their data and functionality through open smart contracts and public subgraphs. Any developer can query liquidity pools, lending rates, or swap prices with nothing more than an HTTP request.

## The DeFi API Landscape

DeFi data comes from three primary sources:

1. **On-chain RPC calls**: Direct calls to Ethereum or Solana nodes using JSON-RPC
2. **Subgraphs**: GraphQL APIs built on The Graph Protocol that index blockchain data
3. **Protocol REST APIs**: Some protocols and aggregators provide traditional REST endpoints

Each has tradeoffs. RPC calls are the most reliable and real-time but require understanding ABIs. Subgraphs are powerful for historical and aggregated data but have indexing delays. REST APIs are easiest to use but introduce a trusted intermediary.

## Querying Uniswap V3 via The Graph

Uniswap V3 has a public subgraph you can query without any API key:

```javascript
const UNISWAP_V3_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

async function getTopPools(limit = 10) {
  const query = `
    {
      pools(first: ${limit}, orderBy: totalValueLockedUSD, orderDirection: desc) {
        id
        token0 { symbol name decimals }
        token1 { symbol name decimals }
        feeTier
        totalValueLockedUSD
        volumeUSD
        token0Price
        token1Price
      }
    }
  `;

  const response = await fetch(UNISWAP_V3_SUBGRAPH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return data.pools;
}

const pools = await getTopPools(5);
pools.forEach(pool => {
  console.log(`${pool.token0.symbol}/${pool.token1.symbol}`);
  console.log(`  TVL: $${parseFloat(pool.totalValueLockedUSD).toLocaleString()}`);
  console.log(`  Fee: ${pool.feeTier / 10000}%`);
});
```

## Getting Token Swap Quotes from 1inch

1inch is a DEX aggregator with a REST API for getting optimal swap routes:

```javascript
async function getSwapQuote({
  fromToken,
  toToken,
  amount,
  slippage = 0.5,
  chainId = 1
}) {
  const params = new URLSearchParams({
    fromTokenAddress: fromToken,
    toTokenAddress: toToken,
    amount,
    slippage,
    disableEstimate: 'true',
  });

  const response = await fetch(
    `https://api.1inch.dev/swap/v6.0/${chainId}/quote?${params}`,
    { headers: { Authorization: `Bearer ${process.env.ONEINCH_API_KEY}` } }
  );

  if (!response.ok) throw new Error(`1inch API error: ${response.status}`);
  return response.json();
}

// Get quote for 1 ETH -> USDC
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const ONE_ETH = '1000000000000000000'; // 1 ETH in wei

const quote = await getSwapQuote({ fromToken: WETH, toToken: USDC, amount: ONE_ETH });
console.log(`1 ETH = ${(parseInt(quote.toAmount) / 1e6).toFixed(2)} USDC`);
```

## Aave Lending Rate Data

Aave exposes a subgraph for current and historical lending rates:

```javascript
const AAVE_V3_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3';

async function getLendingRates() {
  const query = `
    {
      reserves(where: { isActive: true }, first: 20) {
        name
        symbol
        liquidityRate
        variableBorrowRate
        stableBorrowRate
        totalLiquidity
        totalCurrentVariableDebt
        decimals
        price { priceInEth }
      }
    }
  `;

  const response = await fetch(AAVE_V3_SUBGRAPH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();

  return data.reserves.map(r => ({
    symbol: r.symbol,
    supplyAPY: (parseFloat(r.liquidityRate) / 1e27 * 100).toFixed(2),
    borrowAPY: (parseFloat(r.variableBorrowRate) / 1e27 * 100).toFixed(2),
    totalLiquidityUSD: parseFloat(r.totalLiquidity) / Math.pow(10, r.decimals),
  }));
}

const rates = await getLendingRates();
console.log('Aave V3 Lending Rates:');
rates.forEach(r => {
  console.log(`${r.symbol}: Supply ${r.supplyAPY}% APY | Borrow ${r.borrowAPY}% APY`);
});
```

## Fetching Curve Pool Data

Curve Finance provides a REST API for pool information:

```javascript
async function getCurvePools(network = 'ethereum') {
  const response = await fetch(
    `https://api.curve.fi/api/getPools/${network}/main`
  );
  const data = await response.json();

  return data.data.poolData.map(pool => ({
    name: pool.name,
    address: pool.address,
    tvl: pool.usdTotal,
    apy: pool.gaugeRewards?.[0]?.apy ?? 0,
    coins: pool.coins.map(c => c.symbol),
  }));
}

const pools = await getCurvePools();
const topPools = pools.sort((a, b) => b.tvl - a.tvl).slice(0, 5);
topPools.forEach(p => {
  console.log(`${p.name}: TVL $${(p.tvl / 1e6).toFixed(1)}M`);
});
```

## Reading Compound Rates with ethers.js

For direct on-chain data, use ethers.js with a public RPC provider:

```bash
npm install ethers
```

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

// cUSDC contract address and minimal ABI
const CUSDC_ADDRESS = '0x39AA39c021dfbaE8faC545936693aC917d5E7563';
const CUSDC_ABI = [
  'function supplyRatePerBlock() external view returns (uint256)',
  'function borrowRatePerBlock() external view returns (uint256)',
  'function exchangeRateCurrent() external view returns (uint256)',
];

const cUSDC = new ethers.Contract(CUSDC_ADDRESS, CUSDC_ABI, provider);

const BLOCKS_PER_YEAR = 2_628_000; // ~12s block time

async function getCompoundUSDCRates() {
  const [supplyRate, borrowRate] = await Promise.all([
    cUSDC.supplyRatePerBlock(),
    cUSDC.borrowRatePerBlock(),
  ]);

  const supplyAPY = (Math.pow(
    (parseFloat(supplyRate) / 1e18) * BLOCKS_PER_YEAR + 1,
    1
  ) - 1) * 100;

  const borrowAPY = (Math.pow(
    (parseFloat(borrowRate) / 1e18) * BLOCKS_PER_YEAR + 1,
    1
  ) - 1) * 100;

  return { supplyAPY: supplyAPY.toFixed(2), borrowAPY: borrowAPY.toFixed(2) };
}

const rates = await getCompoundUSDCRates();
console.log(`Compound USDC: Supply ${rates.supplyAPY}% | Borrow ${rates.borrowAPY}%`);
```

## Building a DeFi Rates Dashboard Component

```jsx
import { useState, useEffect } from 'react';

function DeFiRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRates() {
      try {
        // Aggregate from multiple sources
        const [aave, compound] = await Promise.allSettled([
          fetch('/api/defi/aave-rates').then(r => r.json()),
          fetch('/api/defi/compound-rates').then(r => r.json()),
        ]);

        const combined = [
          ...(aave.status === 'fulfilled' ? aave.value.map(r => ({ ...r, protocol: 'Aave' })) : []),
          ...(compound.status === 'fulfilled' ? compound.value.map(r => ({ ...r, protocol: 'Compound' })) : []),
        ];

        setRates(combined.sort((a, b) => b.supplyAPY - a.supplyAPY));
      } finally {
        setLoading(false);
      }
    }

    loadRates();
    const interval = setInterval(loadRates, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading DeFi rates...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Protocol</th>
          <th>Asset</th>
          <th>Supply APY</th>
          <th>Borrow APY</th>
        </tr>
      </thead>
      <tbody>
        {rates.map((r, i) => (
          <tr key={i}>
            <td>{r.protocol}</td>
            <td>{r.symbol}</td>
            <td className="green">{r.supplyAPY}%</td>
            <td className="red">{r.borrowAPY}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Tracking DeFi News

Stay on top of protocol updates and market movements by pairing your DeFi data with the [free-crypto-news API](https://free-crypto-news.com):

```javascript
async function getDeFiNews() {
  const response = await fetch(
    'https://free-crypto-news.com/api/news?category=defi&limit=10'
  );
  return response.json();
}
```

## Conclusion

DeFi protocol APIs give developers direct access to the most liquid and transparent financial infrastructure ever built. Between The Graph subgraphs, protocol REST APIs, and direct on-chain calls via ethers.js, you have everything you need to build yield trackers, swap interfaces, portfolio managers, and analytics dashboards. The data is open, the protocols are permissionless, and the tools are mature.
