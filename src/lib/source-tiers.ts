/**
 * Canonical News Source Tier Definitions
 *
 * Single source of truth for source quality across the codebase:
 *   - src/lib/crypto-news.ts        → SOURCE_REPUTATION_SCORES (trending feed)
 *   - src/lib/rag/reranker.ts       → SOURCE_CREDIBILITY (RAG re-ranking)
 *   - scripts/archive/services/source-reliability.js → SOURCE_CATEGORIES
 *
 * Tiers
 * ──────────────────────────────────────────────────────────────
 * tier1    Mainstream / institutional media      credibility 0.88–0.98  reputation  90–100
 * tier2    Premium crypto-native outlets         credibility 0.86–0.95  reputation  65–90
 * tier3    Established crypto news               credibility 0.68–0.82  reputation  60–80
 * tier4    Aggregators & volume sources          credibility 0.60–0.70  reputation  50–60
 * research Institutional research firms          credibility 0.90–0.94  reputation  70–72
 * fintech  Fintech/payments (deprioritized)      credibility 0.40–0.50  reputation  30–35
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SourceTier = 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'research' | 'fintech';

export interface SourceTierEntry {
  tier: SourceTier;
  /** Human-readable display name used in UI and SOURCE_REPUTATION_SCORES */
  displayName: string;
  /** Credibility score 0–1 — used by the RAG re-ranking pipeline */
  credibility: number;
  /** Reputation score 0–100 — used by the trending feed scoring pipeline */
  reputation: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Canonical source map  (key = lowercase RSS_SOURCES key)
// ─────────────────────────────────────────────────────────────────────────────

export const SOURCE_TIERS: Record<string, SourceTierEntry> = {

  // ═══════════════════════════════════════════════════════════════
  // Tier 1 — Mainstream / institutional media
  // ═══════════════════════════════════════════════════════════════
  bloomberg:      { tier: 'tier1', displayName: 'Bloomberg Crypto',    credibility: 0.98, reputation: 100 },
  reuters:        { tier: 'tier1', displayName: 'Reuters Crypto',      credibility: 0.98, reputation: 100 },
  wsj:            { tier: 'tier1', displayName: 'WSJ Crypto',          credibility: 0.97, reputation: 100 },
  ft:             { tier: 'tier1', displayName: 'Financial Times',     credibility: 0.97, reputation: 98  },
  cnbc:           { tier: 'tier1', displayName: 'CNBC Crypto',         credibility: 0.93, reputation: 95  },
  forbes:         { tier: 'tier1', displayName: 'Forbes Crypto',       credibility: 0.90, reputation: 95  },
  yahoofinance:   { tier: 'tier1', displayName: 'Yahoo Finance Crypto', credibility: 0.88, reputation: 90 },
  techcrunch:     { tier: 'tier1', displayName: 'TechCrunch Crypto',  credibility: 0.90, reputation: 92 },
  wired:          { tier: 'tier1', displayName: 'Wired Crypto',       credibility: 0.88, reputation: 88 },

  // ═══════════════════════════════════════════════════════════════
  // Tier 2 — Premium crypto-native outlets
  // ═══════════════════════════════════════════════════════════════
  coindesk:       { tier: 'tier2', displayName: 'CoinDesk',            credibility: 0.95, reputation: 90 },
  theblock:       { tier: 'tier2', displayName: 'The Block',           credibility: 0.93, reputation: 88 },
  blockworks:     { tier: 'tier2', displayName: 'Blockworks',          credibility: 0.90, reputation: 85 },
  decrypt:        { tier: 'tier2', displayName: 'Decrypt',             credibility: 0.88, reputation: 85 },
  unchained:      { tier: 'tier2', displayName: 'Unchained Crypto',    credibility: 0.88, reputation: 68 },
  defiant:        { tier: 'tier2', displayName: 'The Defiant',         credibility: 0.87, reputation: 75 },
  dlnews:         { tier: 'tier2', displayName: 'DL News',             credibility: 0.86, reputation: 68 },

  // ═══════════════════════════════════════════════════════════════
  // Tier 3 — Established crypto news
  // ═══════════════════════════════════════════════════════════════
  bitcoinmagazine:{ tier: 'tier3', displayName: 'Bitcoin Magazine',    credibility: 0.82, reputation: 78 },
  cointelegraph:  { tier: 'tier3', displayName: 'CoinTelegraph',       credibility: 0.78, reputation: 80 },
  bankless:       { tier: 'tier3', displayName: 'Bankless',            credibility: 0.78, reputation: 68 },
  cryptoslate:    { tier: 'tier3', displayName: 'CryptoSlate',         credibility: 0.75, reputation: 75 },
  bitcoinist:     { tier: 'tier3', displayName: 'Bitcoinist',          credibility: 0.72, reputation: 68 },
  beincrypto:     { tier: 'tier3', displayName: 'BeInCrypto',          credibility: 0.70, reputation: 60 },
  newsbtc:        { tier: 'tier3', displayName: 'NewsBTC',             credibility: 0.70, reputation: 65 },

  // ═══════════════════════════════════════════════════════════════
  // Tier 4 — Aggregators & volume sources
  // ═══════════════════════════════════════════════════════════════
  cryptonews:     { tier: 'tier4', displayName: 'Crypto.news',         credibility: 0.68, reputation: 58 },
  ambcrypto:      { tier: 'tier4', displayName: 'AMBCrypto',           credibility: 0.65, reputation: 55 },
  cryptopotato:   { tier: 'tier4', displayName: 'CryptoPotato',        credibility: 0.65, reputation: 55 },
  watcherguru:    { tier: 'tier4', displayName: 'Watcher Guru',        credibility: 0.62, reputation: 52 },
  cryptopolitan:  { tier: 'tier4', displayName: 'Cryptopolitan',       credibility: 0.62, reputation: 52 },
  coinedition:    { tier: 'tier4', displayName: 'CoinEdition',         credibility: 0.60, reputation: 50 },
  bitcoinworld:   { tier: 'tier4', displayName: 'BitcoinWorld',        credibility: 0.60, reputation: 50 },
  invezz:         { tier: 'tier4', displayName: 'Invezz Crypto',       credibility: 0.60, reputation: 50 },

  // ═══════════════════════════════════════════════════════════════
  // Research — Institutional research & investor publications
  // ═══════════════════════════════════════════════════════════════
  messari:        { tier: 'research', displayName: 'Messari',          credibility: 0.92, reputation: 72 },
  delphi:         { tier: 'research', displayName: 'Delphi Digital',   credibility: 0.90, reputation: 70 },
  paradigm:       { tier: 'research', displayName: 'Paradigm',         credibility: 0.94, reputation: 72 },
  a16z:           { tier: 'research', displayName: 'a16z Crypto',      credibility: 0.93, reputation: 72 },
  nansen:         { tier: 'research', displayName: 'Nansen',           credibility: 0.90, reputation: 70 },
  dune:           { tier: 'research', displayName: 'Dune Analytics',   credibility: 0.88, reputation: 68 },
  artemis:        { tier: 'research', displayName: 'Artemis',          credibility: 0.88, reputation: 68 },
  coinmarketcap:  { tier: 'research', displayName: 'CoinMarketCap',   credibility: 0.85, reputation: 70 },
  coingecko:      { tier: 'research', displayName: 'CoinGecko',        credibility: 0.85, reputation: 70 },

  // ═══════════════════════════════════════════════════════════════
  // Fintech — Payments/fintech outlets (deprioritized for crypto)
  // ═══════════════════════════════════════════════════════════════
  finextra:       { tier: 'fintech', displayName: 'Finextra',          credibility: 0.50, reputation: 35 },
  pymnts:         { tier: 'fintech', displayName: 'PYMNTS Crypto',     credibility: 0.45, reputation: 35 },
  fintechfutures: { tier: 'fintech', displayName: 'Fintech Futures',   credibility: 0.40, reputation: 30 },

  // ═══════════════════════════════════════════════════════════════
  // Tier 3 — Notable new sources
  // ═══════════════════════════════════════════════════════════════
  protos:         { tier: 'tier3', displayName: 'Protos',              credibility: 0.75, reputation: 68 },
  dailyhodl:      { tier: 'tier3', displayName: 'The Daily Hodl',      credibility: 0.72, reputation: 65 },
  u_today:        { tier: 'tier3', displayName: 'U.Today',             credibility: 0.70, reputation: 62 },
  watcherguru:    { tier: 'tier3', displayName: 'Watcher Guru',        credibility: 0.68, reputation: 60 },
  cryptopolitan:  { tier: 'tier3', displayName: 'Cryptopolitan',       credibility: 0.68, reputation: 60 },

  // ═══════════════════════════════════════════════════════════════
  // Tier 4 — Volume / aggregator new sources
  // ═══════════════════════════════════════════════════════════════
  coingape:       { tier: 'tier4', displayName: 'CoinGape',            credibility: 0.65, reputation: 55 },
  coinpedia:      { tier: 'tier4', displayName: 'CoinPedia',           credibility: 0.62, reputation: 52 },
  blockonomi:     { tier: 'tier4', displayName: 'Blockonomi',          credibility: 0.65, reputation: 55 },
  zycrypto:       { tier: 'tier4', displayName: 'ZyCrypto',            credibility: 0.62, reputation: 52 },
  dailycoin:      { tier: 'tier4', displayName: 'DailyCoin',           credibility: 0.62, reputation: 52 },
  thecoinrepublic: { tier: 'tier4', displayName: 'The Coin Republic',  credibility: 0.60, reputation: 50 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Fallback defaults
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_CREDIBILITY = 0.60;
export const DEFAULT_REPUTATION  = 50;

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get credibility score (0–1) for a source key.
 * Used by the RAG re-ranking pipeline.
 */
export function getSourceCredibility(sourceKey: string): number {
  return SOURCE_TIERS[sourceKey.toLowerCase()]?.credibility ?? DEFAULT_CREDIBILITY;
}

/**
 * Get reputation score (0–100) for a display name or source key.
 * Used by the trending feed scoring pipeline.
 */
export function getSourceReputation(sourceNameOrKey: string): number {
  const lower = sourceNameOrKey.toLowerCase();
  if (SOURCE_TIERS[lower]) return SOURCE_TIERS[lower].reputation;
  // Fall back to display-name match
  const entry = Object.values(SOURCE_TIERS).find(
    e => e.displayName.toLowerCase() === lower
  );
  return entry?.reputation ?? DEFAULT_REPUTATION;
}

/**
 * Get the tier label for a source key, or null if unknown.
 */
export function getSourceTier(sourceKey: string): SourceTier | null {
  return SOURCE_TIERS[sourceKey.toLowerCase()]?.tier ?? null;
}

/**
 * Returns true when the source belongs to the deprioritized 'fintech' tier.
 */
export function isFintechSource(sourceNameOrKey: string): boolean {
  const lower = sourceNameOrKey.toLowerCase();
  if (SOURCE_TIERS[lower]) return SOURCE_TIERS[lower].tier === 'fintech';
  return ['finextra', 'pymnts', 'fintech'].some(t => lower.includes(t));
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward-compatible derived records
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Drop-in replacement for the old SOURCE_REPUTATION_SCORES constant
 * (display-name → 0–100).  Used by crypto-news.ts.
 */
export const SOURCE_REPUTATION_SCORES: Record<string, number> = {
  ...Object.fromEntries(
    Object.values(SOURCE_TIERS).map(e => [e.displayName, e.reputation])
  ),
  default: DEFAULT_REPUTATION,
};

/**
 * Drop-in replacement for the old SOURCE_CREDIBILITY constant
 * (lowercase key → 0–1).  Used by rag/reranker.ts.
 */
export const SOURCE_CREDIBILITY: Record<string, number> = {
  ...Object.fromEntries(
    Object.entries(SOURCE_TIERS).map(([k, e]) => [k, e.credibility])
  ),
  default: DEFAULT_CREDIBILITY,
};
