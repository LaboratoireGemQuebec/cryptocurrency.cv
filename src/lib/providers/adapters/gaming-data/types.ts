/**
 * Gaming Data Types — Shared types for gaming/metaverse adapters
 *
 * @module providers/adapters/gaming-data/types
 */

/** Individual game stats */
export interface GameData {
  id: string;
  name: string;
  chain: string;
  dau: number;           // Daily Active Users
  transactions24h: number;
  volume24h: number;     // USD
  volumeChange24h: number;
  category: string;      // 'game' | 'metaverse' | 'gamefi'
  balance: number;       // USD in contracts
  imageUrl: string | null;
  source: string;
  timestamp: string;
}

/** Aggregated gaming market data */
export interface GamingData {
  totalDau: number;
  totalTransactions24h: number;
  totalVolume24h: number;
  games: GameData[];
  byChain: { chain: string; dau: number; volume24h: number }[];
  source: string;
  timestamp: string;
}
