/**
 * NFT Market Types — Shared types for NFT data adapters
 *
 * @module providers/adapters/nft-market/types
 */

/** Individual NFT collection summary */
export interface NFTCollection {
  slug: string;
  name: string;
  chain: string;
  floorPrice: number;
  floorPriceCurrency: string;
  volume24h: number;
  volumeChange24h: number;
  sales24h: number;
  numOwners: number;
  totalSupply: number;
  marketCap: number;
  imageUrl: string | null;
  source: string;
  timestamp: string;
}

/** Aggregated NFT market data */
export interface NFTMarketData {
  totalVolume24h: number;
  totalSales24h: number;
  volumeChange24h: number;
  activeCollections: number;
  topCollections: NFTCollection[];
  byChain: { chain: string; volume24h: number; sales24h: number }[];
  source: string;
  timestamp: string;
}
