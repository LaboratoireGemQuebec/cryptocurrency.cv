---
title: "A Developer's Guide to Ethereum JSON-RPC"
description: "Learn how Ethereum's JSON-RPC API works. Covers essential methods, reading balances and transactions, event logs, and connecting via ethers.js and web3.py."
date: "2026-03-30"
author: team
category: guide
tags: ["ethereum", "json-rpc", "web3", "developer", "ethers", "blockchain"]
image: "/images/blog/ethereum-rpc-guide.jpg"
imageAlt: "Ethereum JSON-RPC API diagram showing node connection and method calls"
---

Every interaction with the Ethereum blockchain — checking a balance, submitting a transaction, reading smart contract state — goes through the JSON-RPC API. Whether you use ethers.js, web3.py, or raw curl commands, they all translate to the same underlying protocol. Understanding it directly gives you superpowers as a blockchain developer.

## What Is JSON-RPC?

JSON-RPC is a stateless, lightweight remote procedure call protocol. Requests are JSON objects with a method name and parameters. Responses are JSON objects with a result or error. Ethereum nodes expose this protocol over HTTP and WebSocket endpoints.

A minimal JSON-RPC request looks like:

```json
{
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}
```

And the response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x13a5c4f"
}
```

The `result` value `0x13a5c4f` is the current block number in hexadecimal.

## Getting a Node Endpoint

You need an Ethereum node to query. Options include:

| Provider | Free Tier | Notes |
|----------|-----------|-------|
| Infura | 100K req/day | Most popular, very reliable |
| Alchemy | 300M compute units/month | Feature-rich, good debugging tools |
| QuickNode | 15M credits/month | Fast, global network |
| LlamaRPC | Unlimited (public) | Good for testing, no guarantees |
| Your own node | Unlimited | Full control, requires 2+ TB storage |

For testing and development, the public LlamaRPC endpoint works without any account:

```
https://eth.llamarpc.com
```

## Core JSON-RPC Methods

### eth_blockNumber — Current Block

```bash
curl -X POST https://eth.llamarpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### eth_getBalance — Account Balance

```bash
curl -X POST https://eth.llamarpc.com \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": [
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      "latest"
    ],
    "id": 1
  }'
```

The balance is returned in wei (1 ETH = 10^18 wei) as a hex string.

### eth_getTransactionByHash — Transaction Details

```bash
curl -X POST https://eth.llamarpc.com \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionByHash",
    "params": ["0x...tx_hash..."],
    "id": 1
  }'
```

### eth_call — Read Smart Contract State

This is how you call a read-only function on a smart contract without spending gas:

```bash
# Calling balanceOf(address) on a ERC-20 token
# Function selector: 0x70a08231
# Padded address: 000000000000000000000000{address_without_0x}

curl -X POST https://eth.llamarpc.com \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [{
      "to": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "data": "0x70a08231000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    }, "latest"],
    "id": 1
  }'
```

## Using ethers.js for JSON-RPC

ethers.js abstracts the raw protocol into a clean TypeScript API:

```typescript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

// Get balance
async function getBalance(address: string) {
  const balanceWei = await provider.getBalance(address);
  const balanceEth = ethers.formatEther(balanceWei);
  console.log(`Balance: ${balanceEth} ETH`);
  return balanceEth;
}

// Get current gas price
async function getGasInfo() {
  const feeData = await provider.getFeeData();
  return {
    gasPrice: ethers.formatUnits(feeData.gasPrice ?? 0n, 'gwei'),
    maxFeePerGas: ethers.formatUnits(feeData.maxFeePerGas ?? 0n, 'gwei'),
    maxPriorityFeePerGas: ethers.formatUnits(feeData.maxPriorityFeePerGas ?? 0n, 'gwei'),
  };
}

// Get block details
async function getLatestBlock() {
  const block = await provider.getBlock('latest');
  return {
    number: block?.number,
    timestamp: block?.timestamp,
    transactions: block?.transactions.length,
    baseFeePerGas: block?.baseFeePerGas
      ? ethers.formatUnits(block.baseFeePerGas, 'gwei')
      : null,
  };
}
```

## Reading Smart Contract State

```typescript
// ERC-20 token ABI (minimal)
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
];

async function getTokenInfo(tokenAddress: string, holderAddress: string) {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

  const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
    contract.balanceOf(holderAddress),
  ]);

  const divisor = BigInt(10) ** BigInt(decimals);

  return {
    name,
    symbol,
    decimals,
    totalSupply: (totalSupply / divisor).toString(),
    balance: (balance / divisor).toString(),
  };
}

// USDC contract
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const vitalik = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const info = await getTokenInfo(USDC, vitalik);
console.log(info);
```

## Listening for Events

```typescript
// Listen for USDC transfers in real-time
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const TRANSFER_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

const wsProvider = new ethers.WebSocketProvider(
  `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
);

const usdc = new ethers.Contract(USDC_ADDRESS, TRANSFER_ABI, wsProvider);

usdc.on('Transfer', (from, to, value, event) => {
  const amount = ethers.formatUnits(value, 6); // USDC has 6 decimals
  console.log(`Transfer: ${amount} USDC`);
  console.log(`  From: ${from}`);
  console.log(`  To: ${to}`);
  console.log(`  Tx: ${event.log.transactionHash}`);
});
```

## Using web3.py for JSON-RPC in Python

```python
from web3 import Web3

# Connect to Ethereum mainnet
w3 = Web3(Web3.HTTPProvider('https://eth.llamarpc.com'))
assert w3.is_connected(), "Could not connect to Ethereum"

# Get current block
block_number = w3.eth.block_number
print(f"Current block: {block_number}")

# Get ETH balance
address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
balance_wei = w3.eth.get_balance(address)
balance_eth = w3.from_wei(balance_wei, 'ether')
print(f"Balance: {balance_eth} ETH")

# Read ERC-20 balance
ERC20_ABI = [
    {"constant": True, "inputs": [{"name": "_owner", "type": "address"}],
     "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}],
     "type": "function"},
    {"constant": True, "inputs": [], "name": "decimals",
     "outputs": [{"name": "", "type": "uint8"}], "type": "function"},
]

USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
usdc = w3.eth.contract(address=USDC, abi=ERC20_ABI)
balance = usdc.functions.balanceOf(address).call()
decimals = usdc.functions.decimals().call()
print(f"USDC Balance: {balance / 10**decimals:.2f}")
```

## Batch Requests

Reduce latency by batching multiple JSON-RPC calls:

```javascript
async function batchRequest(provider, calls) {
  // Using raw fetch for batching (ethers doesn't expose batch API directly)
  const batch = calls.map((call, i) => ({
    jsonrpc: '2.0',
    id: i,
    method: call.method,
    params: call.params,
  }));

  const response = await fetch(provider, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batch),
  });

  return response.json();
}

// Get balances for multiple addresses in one request
const addresses = ['0xabc...', '0xdef...', '0x123...'];
const results = await batchRequest('https://eth.llamarpc.com',
  addresses.map(addr => ({
    method: 'eth_getBalance',
    params: [addr, 'latest'],
  }))
);
```

## Conclusion

Understanding Ethereum JSON-RPC at the protocol level makes you a significantly more effective blockchain developer. It demystifies what libraries like ethers.js and web3.py are doing under the hood, helps you debug issues more effectively, and enables you to build optimized clients. Once you are comfortable with the core methods, the entire Ethereum ecosystem opens up.
