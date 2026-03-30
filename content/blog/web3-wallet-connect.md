---
title: "Integrating Wallet Connect in a Web3 App"
description: "Learn how to integrate WalletConnect v2 into a Web3 application using wagmi and viem. Connect MetaMask, Coinbase Wallet, and mobile wallets with minimal code."
date: "2026-03-30"
author: team
category: tutorial
tags: ["walletconnect", "web3", "wagmi", "react", "developer", "dapp"]
image: "/images/blog/web3-wallet-connect.jpg"
imageAlt: "WalletConnect QR code connecting a mobile crypto wallet to a web3 dApp"
---

Wallet connectivity is the foundation of every Web3 application. Users need to connect their wallets to authenticate, sign transactions, and interact with smart contracts. WalletConnect v2 has become the standard protocol for multi-wallet, multi-chain connectivity. Combined with wagmi, integrating it into a React application takes minutes.

## The Modern Web3 Connection Stack

Modern DApps use a layered stack:

- **WalletConnect v2**: The transport protocol between DApp and wallet (especially mobile wallets)
- **wagmi**: React hooks library that abstracts wallet connection, signing, and contract interaction
- **viem**: Low-level TypeScript library for Ethereum interaction (used by wagmi internally)
- **ConnectKit / RainbowKit / Web3Modal**: Pre-built UI components for the connection modal

## Setup with wagmi and ConnectKit

```bash
npm install wagmi viem @tanstack/react-query connectkit
```

### Configuration

```typescript
// src/config/web3.ts
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains';
import { walletConnect, metaMask, coinbaseWallet, injected } from 'wagmi/connectors';
import { getDefaultConfig } from 'connectkit';

const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = createConfig(
  getDefaultConfig({
    // Supported chains
    chains: [mainnet, sepolia, polygon, arbitrum],
    transports: {
      [mainnet.id]: http('https://eth.llamarpc.com'),
      [sepolia.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
    },
    // WalletConnect Cloud project ID
    walletConnectProjectId: WC_PROJECT_ID,
    // App metadata (shown in wallet connection prompt)
    appName: 'My Crypto App',
    appDescription: 'A Web3 application',
    appUrl: 'https://myapp.com',
    appIcon: 'https://myapp.com/icon.png',
  })
);
```

### Provider Setup

```tsx
// src/app/layout.tsx (Next.js App Router)
'use client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { config } from '@/config/web3';

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## The Connect Button

ConnectKit provides a pre-built button that handles the entire connection flow:

```tsx
import { ConnectKitButton } from 'connectkit';

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My DApp</h1>
      <ConnectKitButton />
    </header>
  );
}
```

## Reading Wallet Data with wagmi Hooks

```tsx
'use client';
import { useAccount, useBalance, useChainId, useEnsName } from 'wagmi';
import { formatEther } from 'viem';

export function WalletInfo() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });

  if (!isConnected) {
    return <p>Connect your wallet to continue</p>;
  }

  return (
    <div className="border rounded-xl p-4">
      <p className="font-mono text-sm">
        {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
      </p>
      <p className="text-lg font-semibold mt-1">
        {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ETH` : '...'}
      </p>
      <p className="text-sm text-gray-500">
        Chain ID: {chainId} | Via {connector?.name}
      </p>
    </div>
  );
}
```

## Sending Transactions

```tsx
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

export function SendETH() {
  const {
    data: hash,
    isPending,
    sendTransaction,
    error,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSend = () => {
    sendTransaction({
      to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      value: parseEther('0.001'),
    });
  };

  return (
    <div>
      <button
        onClick={handleSend}
        disabled={isPending || isConfirming}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : 'Send 0.001 ETH'}
      </button>

      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
      {hash && <p className="mt-2">Tx: {hash.slice(0, 12)}...</p>}
      {isSuccess && <p className="text-green-600 mt-2">Transaction confirmed!</p>}
    </div>
  );
}
```

## Contract Interactions

```tsx
import { useReadContract, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

export function USDCBalance({ address }: { address: `0x${string}` }) {
  const { data: balance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  if (!balance) return <span>...</span>;
  return <span>{(Number(balance) / 1e6).toFixed(2)} USDC</span>;
}

export function TransferUSDC() {
  const { writeContract, isPending } = useWriteContract();

  const handleTransfer = () => {
    writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: ['0xRecipientAddress', parseUnits('10', 6)], // 10 USDC
    });
  };

  return (
    <button onClick={handleTransfer} disabled={isPending}>
      {isPending ? 'Signing...' : 'Transfer 10 USDC'}
    </button>
  );
}
```

## Message Signing

```tsx
import { useSignMessage } from 'wagmi';

export function SignMessage() {
  const { data: signature, signMessage, isPending } = useSignMessage();

  const handleSign = () => {
    signMessage({ message: 'Please sign this message to verify your wallet ownership.' });
  };

  return (
    <div>
      <button onClick={handleSign} disabled={isPending}>
        {isPending ? 'Check wallet...' : 'Sign Message'}
      </button>
      {signature && (
        <p className="mt-2 text-xs break-all font-mono">
          Signature: {signature}
        </p>
      )}
    </div>
  );
}
```

## Using RainbowKit Instead

RainbowKit is a popular alternative to ConnectKit with a distinctive design:

```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
```

```tsx
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'My DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet],
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Handling Network Switching

```tsx
import { useSwitchChain, useChainId } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'wagmi/chains';

export function NetworkSelector() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const networks = [
    { chain: mainnet, label: 'Ethereum' },
    { chain: polygon, label: 'Polygon' },
    { chain: arbitrum, label: 'Arbitrum' },
  ];

  return (
    <div className="flex gap-2">
      {networks.map(({ chain, label }) => (
        <button
          key={chain.id}
          onClick={() => switchChain({ chainId: chain.id })}
          disabled={chainId === chain.id || isPending}
          className={`px-3 py-1 rounded text-sm border ${
            chainId === chain.id ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

## Conclusion

WalletConnect v2, wagmi, and ConnectKit together provide a production-ready Web3 authentication and transaction stack in fewer than 100 lines of configuration. The declarative hook-based API makes it easy to read balances, send transactions, and interact with any smart contract. Get your WalletConnect Cloud project ID, set up the providers, and your DApp will support MetaMask, Coinbase Wallet, every mobile wallet, and hardware wallets out of the box.
