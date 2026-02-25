/**
 * Drizzle ORM Schema for free-crypto-news
 *
 * Tables:
 *   articles          – 662K+ enriched news articles (mirrors archive/articles/*.jsonl)
 *   prices_history    – BTC/ETH/SOL price snapshots (mirrors archive/market/*.jsonl)
 *   market_snapshots  – hourly market context snapshots (mirrors archive/snapshots/)
 *   predictions       – on-chain / social predictions (mirrors archive/predictions/)
 *   tag_scores        – computed tag relevance scores (mirrors archive/meta/tag-scores.json)
 *   user_watchlists   – per-user ticker watchlists (new; enables personalisation)
 */

import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  serial,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ────────────────────────────────────────────────────────────────────────────
// articles
// ────────────────────────────────────────────────────────────────────────────

export const articles = pgTable(
  'articles',
  {
    /** 16-char hex content-addressed ID (same as archive id field) */
    id: varchar('id', { length: 64 }).primaryKey(),
    /** SEO-friendly slug */
    slug: varchar('slug', { length: 255 }),
    schemaVersion: varchar('schema_version', { length: 16 }).default('2.0.0'),
    title: text('title').notNull(),
    link: text('link').notNull(),
    canonicalLink: text('canonical_link'),
    description: text('description'),
    source: varchar('source', { length: 255 }).notNull(),
    sourceKey: varchar('source_key', { length: 128 }).notNull(),
    category: varchar('category', { length: 64 }).notNull(),
    pubDate: timestamp('pub_date', { withTimezone: true }),
    firstSeen: timestamp('first_seen', { withTimezone: true }).notNull(),
    lastSeen: timestamp('last_seen', { withTimezone: true }).notNull(),
    fetchCount: integer('fetch_count').default(1),
    tickers: text('tickers').array().default(sql`'{}'::text[]`),
    tags: text('tags').array().default(sql`'{}'::text[]`),
    /** Entities extracted from article */
    entities: jsonb('entities').$type<{
      people: string[];
      companies: string[];
      protocols: string[];
    }>(),
    sentimentScore: real('sentiment_score').default(0),
    sentimentLabel: varchar('sentiment_label', { length: 32 }).default('neutral'),
    sentimentConfidence: real('sentiment_confidence').default(0.5),
    /** Snapshot of market at time of article */
    marketContext: jsonb('market_context').$type<{
      btc_price: number | null;
      eth_price: number | null;
      sol_price?: number | null;
      total_market_cap?: number | null;
      btc_dominance?: number | null;
      fear_greed_index: number | null;
    }>(),
    contentHash: varchar('content_hash', { length: 64 }),
    /** Free-form metadata bag */
    meta: jsonb('meta').$type<Record<string, unknown>>(),
    /** Postgres generated tsvector for full-text search */
    searchVector: text('search_vector'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_articles_pub_date').on(table.pubDate),
    index('idx_articles_first_seen').on(table.firstSeen),
    index('idx_articles_source_key').on(table.sourceKey),
    index('idx_articles_category').on(table.category),
    index('idx_articles_sentiment').on(table.sentimentLabel),
    index('idx_articles_tickers').using('gin', table.tickers),
    index('idx_articles_tags').using('gin', table.tags),
    uniqueIndex('idx_articles_slug').on(table.slug),
    // GIN index on the tsvector column (created via raw SQL in migration)
  ]
);

// ────────────────────────────────────────────────────────────────────────────
// prices_history
// ────────────────────────────────────────────────────────────────────────────

export const pricesHistory = pgTable(
  'prices_history',
  {
    id: serial('id').primaryKey(),
    ticker: varchar('ticker', { length: 16 }).notNull(),
    price: real('price').notNull(),
    marketCap: real('market_cap'),
    volume24h: real('volume_24h'),
    change24h: real('change_24h'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    source: varchar('source', { length: 64 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_prices_ticker').on(table.ticker),
    index('idx_prices_timestamp').on(table.timestamp),
    index('idx_prices_ticker_ts').on(table.ticker, table.timestamp),
  ]
);

// ────────────────────────────────────────────────────────────────────────────
// market_snapshots
// ────────────────────────────────────────────────────────────────────────────

export const marketSnapshots = pgTable(
  'market_snapshots',
  {
    id: serial('id').primaryKey(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    hour: integer('hour').notNull(),
    articleCount: integer('article_count').default(0),
    topArticles: text('top_articles').array().default(sql`'{}'::text[]`),
    topTickers: jsonb('top_tickers').$type<{ ticker: string; mention_count: number }[]>(),
    sourceCounts: jsonb('source_counts').$type<Record<string, number>>(),
    btcPrice: real('btc_price'),
    ethPrice: real('eth_price'),
    fearGreedIndex: real('fear_greed_index'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_snapshots_timestamp').on(table.timestamp),
    index('idx_snapshots_hour').on(table.hour),
  ]
);

// ────────────────────────────────────────────────────────────────────────────
// predictions
// ────────────────────────────────────────────────────────────────────────────

export const predictions = pgTable(
  'predictions',
  {
    id: serial('id').primaryKey(),
    ticker: varchar('ticker', { length: 16 }).notNull(),
    predictionType: varchar('prediction_type', { length: 64 }).notNull(),
    direction: varchar('direction', { length: 16 }),
    confidence: real('confidence'),
    source: varchar('source', { length: 128 }),
    reasoning: text('reasoning'),
    targetPrice: real('target_price'),
    targetDate: timestamp('target_date', { withTimezone: true }),
    outcome: varchar('outcome', { length: 32 }),
    meta: jsonb('meta').$type<Record<string, unknown>>(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_predictions_ticker').on(table.ticker),
    index('idx_predictions_ts').on(table.timestamp),
  ]
);

// ────────────────────────────────────────────────────────────────────────────
// tag_scores
// ────────────────────────────────────────────────────────────────────────────

export const tagScores = pgTable(
  'tag_scores',
  {
    id: serial('id').primaryKey(),
    tag: varchar('tag', { length: 128 }).notNull(),
    score: real('score').notNull(),
    articleCount: integer('article_count').default(0),
    lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('idx_tag_scores_tag').on(table.tag),
  ]
);

// ────────────────────────────────────────────────────────────────────────────
// user_watchlists
// ────────────────────────────────────────────────────────────────────────────

export const userWatchlists = pgTable(
  'user_watchlists',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    tickers: text('tickers').array().default(sql`'{}'::text[]`),
    name: varchar('name', { length: 128 }).default('Default'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_watchlists_user').on(table.userId),
  ]
);
