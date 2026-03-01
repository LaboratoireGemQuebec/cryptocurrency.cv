/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

/**
 * Helius Solana API
 *
 * Enhanced Solana RPC and DAS (Digital Asset Standard) API for token balances,
 * NFTs, transaction history, and compressed NFT data.
 *
 * Free tier: 100k req/day. Developer: $49/mo (5M req/day).
 *
 * @see https://docs.helius.dev/
 * @module lib/apis/helius
 */

import { CircuitBreaker } from '@/lib/circuit-breaker';

const API_KEY = process.env.HELIUS_API_KEY || '';
const BASE_URL = `https://api.helius.xyz/v0`;
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`;

const breaker = CircuitBreaker.for('helius', {
  failureThreshold: 5,
  cooldownMs: 30_000,
});

// =============================================================================
// Types
// =============================================================================

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  tokenAccount: string;
  owner: string;
  name?: string;
  symbol?: string;
  logoURI?: string;
  priceUsd?: number;
  valueUsd?: number;
}

export interface TokenBalancesResponse {
  tokens: TokenBalance[];
  nativeBalance: {
    lamports: number;
    solPrice?: number;
    totalSolValue?: number;
  };
}

export interface HeliusNFT {
  id: string;
  name: string;
  symbol: string;
  uri: string;
  image?: string;
  description?: string;
  collection?: {
    name: string;
    family?: string;
    address?: string;
    verified: boolean;
  };
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  royalty?: {
    royaltyModel: string;
    percent: number;
    primarySaleHappened: boolean;
  };
  compressed: boolean;
  ownership: {
    owner: string;
    delegate?: string;
    frozen: boolean;
  };
}

export interface TransactionHistoryItem {
  signature: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  slot: number;
  timestamp: number;
  description?: string;
  nativeTransfers?: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }>;
  tokenTransfers?: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    fromTokenAccount: string;
    toTokenAccount: string;
    tokenAmount: number;
    mint: string;
    tokenStandard: string;
  }>;
  accountData?: Array<{
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: Array<{
      mint: string;
      rawTokenAmount: { tokenAmount: string; decimals: number };
      userAccount: string;
    }>;
  }>;
}

export interface DASAsset {
  id: string;
  interface: string;
  content: {
    json_uri: string;
    metadata: {
      name: string;
      symbol: string;
      description?: string;
    };
    files?: Array<{
      uri: string;
      mime: string;
    }>;
    links?: Record<string, string>;
  };
  authorities?: Array<{
    address: string;
    scopes: string[];
  }>;
  compression?: {
    eligible: boolean;
    compressed: boolean;
    dataHash: string;
    creatorHash: string;
    assetHash: string;
    tree: string;
    seq: number;
    leafId: number;
  };
  grouping?: Array<{
    group_key: string;
    group_value: string;
  }>;
  royalty?: {
    royalty_model: string;
    percent: number;
    primary_sale_happened: boolean;
  };
  ownership: {
    owner: string;
    frozen: boolean;
    delegated: boolean;
    delegate?: string;
  };
}

export interface DASAssetsResponse {
  total: number;
  limit: number;
  page: number;
  items: DASAsset[];
}

export interface HeliusSolanaSummary {
  address: string;
  tokenBalances: TokenBalancesResponse | null;
  nfts: HeliusNFT[];
  recentTransactions: TransactionHistoryItem[];
  timestamp: string;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Fetch from Helius REST API with key auth.
 */
async function heliusFetch<T>(path: string): Promise<T | null> {
  if (!API_KEY) {
    console.warn('Helius: HELIUS_API_KEY not set — skipping request');
    return null;
  }

  return breaker.call(async () => {
    const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}api-key=${API_KEY}`;
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Helius API error ${res.status}: ${path}`);
    }

    return (await res.json()) as T;
  });
}

/**
 * Fetch from Helius DAS RPC API (JSON-RPC 2.0).
 */
async function heliusRpc<T>(method: string, params: unknown): Promise<T | null> {
  if (!API_KEY) {
    console.warn('Helius: HELIUS_API_KEY not set — skipping request');
    return null;
  }

  return breaker.call(async () => {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `helius-${Date.now()}`,
        method,
        params,
      }),
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Helius RPC error ${res.status}: ${method}`);
    }

    const json = await res.json();
    if (json.error) {
      throw new Error(`Helius RPC error: ${json.error.message || JSON.stringify(json.error)}`);
    }

    return json.result as T;
  });
}

// ---------------------------------------------------------------------------
// Token Balances
// ---------------------------------------------------------------------------

/**
 * Get all token balances for a Solana wallet address.
 */
export async function getTokenBalances(address: string): Promise<TokenBalancesResponse | null> {
  return heliusFetch<TokenBalancesResponse>(`/addresses/${encodeURIComponent(address)}/balances`);
}

// ---------------------------------------------------------------------------
// NFTs
// ---------------------------------------------------------------------------

/**
 * Get all NFTs owned by a wallet address.
 */
export async function getNFTsByWallet(
  address: string,
  page: number = 1,
  limit: number = 100,
): Promise<HeliusNFT[]> {
  const data = await heliusFetch<HeliusNFT[]>(
    `/addresses/${encodeURIComponent(address)}/nfts?pageNumber=${page}&limit=${limit}`,
  );
  return data || [];
}

// ---------------------------------------------------------------------------
// Transaction History
// ---------------------------------------------------------------------------

/**
 * Get parsed transaction history for an address.
 * Returns human-readable transaction descriptions for Solana.
 */
export async function getTransactionHistory(
  address: string,
  opts?: { before?: string; limit?: number; type?: string },
): Promise<TransactionHistoryItem[]> {
  const params = new URLSearchParams();
  if (opts?.before) params.set('before', opts.before);
  if (opts?.limit) params.set('limit', String(opts.limit));
  if (opts?.type) params.set('type', opts.type);

  const qs = params.toString();
  const path = `/addresses/${encodeURIComponent(address)}/transactions${qs ? `?${qs}` : ''}`;

  const data = await heliusFetch<TransactionHistoryItem[]>(path);
  return data || [];
}

// ---------------------------------------------------------------------------
// DAS (Digital Asset Standard) — Compressed NFTs & Assets
// ---------------------------------------------------------------------------

/**
 * Get all digital assets for an owner via DAS API.
 * Supports compressed NFTs, regular NFTs, and fungible tokens.
 */
export async function getDASAssets(
  ownerAddress: string,
  opts?: { page?: number; limit?: number; displayOptions?: Record<string, boolean> },
): Promise<DASAssetsResponse | null> {
  return heliusRpc<DASAssetsResponse>('getAssetsByOwner', {
    ownerAddress,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? 100,
    displayOptions: opts?.displayOptions ?? { showFungible: true, showNativeBalance: true },
  });
}

/**
 * Get a single digital asset by its ID.
 */
export async function getDASAssetById(assetId: string): Promise<DASAsset | null> {
  return heliusRpc<DASAsset>('getAsset', { id: assetId });
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

/**
 * Get a comprehensive summary for a Solana wallet address.
 */
export async function getWalletSummary(address: string): Promise<HeliusSolanaSummary> {
  const [tokenBalances, nfts, transactions] = await Promise.allSettled([
    getTokenBalances(address),
    getNFTsByWallet(address, 1, 50),
    getTransactionHistory(address, { limit: 20 }),
  ]);

  return {
    address,
    tokenBalances: tokenBalances.status === 'fulfilled' ? tokenBalances.value : null,
    nfts: nfts.status === 'fulfilled' ? nfts.value : [],
    recentTransactions: transactions.status === 'fulfilled' ? transactions.value : [],
    timestamp: new Date().toISOString(),
  };
}
