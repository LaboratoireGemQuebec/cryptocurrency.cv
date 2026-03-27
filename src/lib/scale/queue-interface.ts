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
 * Queue Adapter Interface
 *
 * Common interface implemented by both MemoryQueueAdapter and RedisQueueAdapter.
 * Allows the JobQueue to switch between in-memory (development) and Redis (production)
 * without any code changes.
 *
 * @module lib/scale/queue-interface
 */

import type { Job, JobPriority, QueueMetrics } from './index';

// ═══════════════════════════════════════════════════════════════
// ENQUEUE OPTIONS
// ═══════════════════════════════════════════════════════════════

export interface EnqueueOptions {
  priority?: JobPriority;
  maxAttempts?: number;
  metadata?: Record<string, unknown>;
  /** Delay in ms before the job becomes available */
  delayMs?: number;
  /** Deduplication key — if a job with the same key exists, skip enqueue */
  deduplicationKey?: string;
}

// ═══════════════════════════════════════════════════════════════
// QUEUE ADAPTER INTERFACE
// ═══════════════════════════════════════════════════════════════

export interface QueueAdapter {
  /** Add a job to the queue. Returns the job ID. */
  enqueue<T>(type: string, data: T, options?: EnqueueOptions): Promise<string>;

  /** Dequeue up to `count` pending jobs of the given type. */
  dequeue(type: string, count?: number): Promise<Job[]>;

  /** Acknowledge successful completion of a job. */
  ack(jobId: string, result?: unknown): Promise<void>;

  /** Negative-acknowledge a job (failed attempt). Handles retry or dead-letter. */
  nack(jobId: string, error: string): Promise<void>;

  /** Move a job directly to the dead letter queue. */
  moveToDeadLetter(jobId: string): Promise<void>;

  /** Get current queue metrics. */
  getMetrics(): Promise<QueueMetrics>;

  /** Get a specific job by ID. */
  getJob(jobId: string): Promise<Job | null>;

  /** Get dead letter jobs. */
  getDeadLetterJobs(limit?: number): Promise<Job[]>;

  /** Retry a specific dead letter job (moves it back to pending). */
  retryDeadLetterJob(jobId: string): Promise<void>;

  /** Purge all dead letter jobs. Returns the number removed. */
  purgeDeadLetter(): Promise<number>;

  /** Get the total number of pending jobs, optionally filtered by type. */
  size(type?: string): Promise<number>;
}
