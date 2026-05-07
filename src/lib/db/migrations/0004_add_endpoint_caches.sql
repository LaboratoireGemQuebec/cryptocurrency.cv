-- Migration 0004: add 12 endpoint cache tables for the Cloudflare Worker
-- news-aggregator (cron */1 UTC). Idempotent (CREATE TABLE IF NOT EXISTS) so a
-- partial failure can be retried safely.
--
-- The Worker writes each row keyed `<endpoint>:default` once per minute.
-- Vercel routes read the row, slice/filter to the request shape, and serve
-- in <100ms. Stale-after thresholds are enforced at the route layer, not in
-- this schema (expires_at is advisory only).

CREATE TABLE IF NOT EXISTS "clickbait_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_clickbait_cache_fetched_at"
  ON "clickbait_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "ai_brief_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ai_brief_cache_fetched_at"
  ON "ai_brief_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "ai_digest_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ai_digest_cache_fetched_at"
  ON "ai_digest_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "trending_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_trending_cache_fetched_at"
  ON "trending_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "whale_alerts_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_whale_alerts_cache_fetched_at"
  ON "whale_alerts_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "airdrops_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_airdrops_cache_fetched_at"
  ON "airdrops_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "arbitrage_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_arbitrage_cache_fetched_at"
  ON "arbitrage_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "fear_greed_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_fear_greed_cache_fetched_at"
  ON "fear_greed_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "macro_indicators_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_macro_indicators_cache_fetched_at"
  ON "macro_indicators_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "influencers_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_influencers_cache_fetched_at"
  ON "influencers_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "analytics_anomalies_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_analytics_anomalies_cache_fetched_at"
  ON "analytics_anomalies_cache" ("fetched_at" DESC);

CREATE TABLE IF NOT EXISTS "analytics_credibility_cache" (
  "id"          varchar(64) PRIMARY KEY,
  "payload"     jsonb       NOT NULL,
  "fetched_at"  timestamptz NOT NULL DEFAULT now(),
  "expires_at"  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_analytics_credibility_cache_fetched_at"
  ON "analytics_credibility_cache" ("fetched_at" DESC);
