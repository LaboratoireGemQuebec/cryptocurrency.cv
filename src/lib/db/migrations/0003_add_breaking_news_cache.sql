-- Copyright 2024-2026 nirholas. All rights reserved.
-- SPDX-License-Identifier: SEE LICENSE IN LICENSE
-- https://github.com/nirholas/free-crypto-news
--
-- This file is part of free-crypto-news.
-- Unauthorized copying, modification, or distribution is strictly prohibited.

-- Migration: Add breaking_news_cache table to back /api/breaking
-- Created: 2026-05-07
-- Refactor context:
--   /api/breaking on Vercel Hobby (10s timeout) was timing out because
--   getBreakingNews() aggregates 200+ RSS sources per call. The Inngest
--   function `breaking-news-cache-refresh` runs every minute (5 min event
--   trigger fallback), writes the aggregated payload here, and the route
--   reads a single row in <500ms instead.

CREATE TABLE IF NOT EXISTS breaking_news_cache (
  id           VARCHAR(64) PRIMARY KEY,
  payload      JSONB NOT NULL,
  total_count  INTEGER NOT NULL DEFAULT 0,
  sources      TEXT[] NOT NULL DEFAULT '{}'::text[],
  fetched_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_breaking_cache_fetched_at
  ON breaking_news_cache(fetched_at DESC);
