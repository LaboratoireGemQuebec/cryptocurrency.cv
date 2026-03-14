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
 * In-Memory Queue Adapter
 *
 * Non-persistent job queue for development and testing. All data is lost on
 * process restart. Implements the same QueueAdapter interface as RedisQueueAdapter
 * so the JobQueue can swap between them transparently.
 *
 * @module lib/scale/memory-queue
 */

import type { Job, JobPriority, QueueMetrics } from './index';
import type { QueueAdapter, EnqueueOptions } from './queue-interface';

const PRIORITY_SCORES: Record<JobPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

const DEFAULT_MAX_ATTEMPTS = 3;

export class MemoryQueueAdapter implements QueueAdapter {
  private jobs = new Map<string, Job>();
  private pending = new Map<string, { id: string; score: number }[]>();
  private active = new Set<string>();
  private deadLetter: string[] = [];
  private dedupKeys = new Map<string, string>();
  private completedCount = 0;
  private failedCount = 0;
  private totalProcessingTime = 0;
  private retryCount = 0;

  async enqueue<T>(type: string, data: T, options?: EnqueueOptions): Promise<string> {
    // Deduplication check
    if (options?.deduplicationKey) {
      const existingId = this.dedupKeys.get(options.deduplicationKey);
      if (existingId && this.jobs.has(existingId)) {
        return existingId;
      }
    }

    const id = `${type}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
    const now = Date.now();
    const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    const priority = options?.priority ?? 'normal';

    const job: Job<T> = {
      id,
      type,
      payload: data,
      status: 'pending',
      priority,
      attempts: 0,
      maxAttempts,
      createdAt: now,
      metadata: options?.metadata,
    };

    this.jobs.set(id, job as Job);

    const delayMs = options?.delayMs ?? 0;
    const score = PRIORITY_SCORES[priority] * 1e13 + now + delayMs;

    if (!this.pending.has(type)) {
      this.pending.set(type, []);
    }
    const queue = this.pending.get(type)!;
    // Insert sorted by score (ascending)
    const insertIdx = queue.findIndex((entry) => entry.score > score);
    if (insertIdx === -1) {
      queue.push({ id, score });
    } else {
      queue.splice(insertIdx, 0, { id, score });
    }

    if (options?.deduplicationKey) {
      this.dedupKeys.set(options.deduplicationKey, id);
    }

    return id;
  }

  async dequeue(type: string, count = 1): Promise<Job[]> {
    const queue = this.pending.get(type);
    if (!queue || queue.length === 0) return [];

    const now = Date.now();
    const jobs: Job[] = [];

    for (let i = 0; i < count; i++) {
      // Find the first job whose score <= now (ready to process)
      const readyIdx = queue.findIndex((entry) => entry.score <= now);
      if (readyIdx === -1) break;

      const entry = queue.splice(readyIdx, 1)[0];
      const job = this.jobs.get(entry.id);
      if (!job) continue;

      job.status = 'active';
      job.startedAt = Date.now();
      job.attempts++;
      this.active.add(job.id);
      jobs.push(job);
    }

    return jobs;
  }

  async ack(jobId: string, result?: unknown): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'completed';
    job.completedAt = Date.now();
    job.result = result;

    const processingTime = job.completedAt - (job.startedAt ?? job.createdAt);
    this.totalProcessingTime += processingTime;
    this.completedCount++;
    this.active.delete(jobId);
  }

  async nack(jobId: string, error: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.error = error;
    this.active.delete(jobId);

    if (job.attempts < job.maxAttempts) {
      job.status = 'retrying';
      const delay = Math.min(1000 * Math.pow(2, job.attempts - 1), 60_000);
      const score = Date.now() + delay;

      if (!this.pending.has(job.type)) {
        this.pending.set(job.type, []);
      }
      const queue = this.pending.get(job.type)!;
      const insertIdx = queue.findIndex((entry) => entry.score > score);
      if (insertIdx === -1) {
        queue.push({ id: jobId, score });
      } else {
        queue.splice(insertIdx, 0, { id: jobId, score });
      }
      this.retryCount++;
    } else {
      await this.moveToDeadLetter(jobId);
    }
  }

  async moveToDeadLetter(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'dead';
    this.active.delete(jobId);
    this.deadLetter.push(jobId);
    this.failedCount++;
  }

  async getMetrics(): Promise<QueueMetrics> {
    let pendingCount = 0;
    for (const queue of this.pending.values()) {
      pendingCount += queue.length;
    }

    const total = this.completedCount + this.failedCount;

    return {
      pending: pendingCount,
      active: this.active.size,
      completed: this.completedCount,
      failed: this.failedCount,
      dead: this.deadLetter.length,
      avgProcessingTimeMs: this.completedCount > 0 ? this.totalProcessingTime / this.completedCount : 0,
      throughputPerMinute: 0,
      errorRate: total > 0 ? this.failedCount / total : 0,
    };
  }

  async getJob(jobId: string): Promise<Job | null> {
    return this.jobs.get(jobId) ?? null;
  }

  async getDeadLetterJobs(limit = 100): Promise<Job[]> {
    const ids = this.deadLetter.slice(0, limit);
    const jobs: Job[] = [];
    for (const id of ids) {
      const job = this.jobs.get(id);
      if (job) jobs.push(job);
    }
    return jobs;
  }

  async retryDeadLetterJob(jobId: string): Promise<void> {
    const idx = this.deadLetter.indexOf(jobId);
    if (idx === -1) return;

    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'pending';
    job.attempts = 0;
    job.error = undefined;

    this.deadLetter.splice(idx, 1);

    const score = PRIORITY_SCORES[job.priority] * 1e13 + Date.now();
    if (!this.pending.has(job.type)) {
      this.pending.set(job.type, []);
    }
    const queue = this.pending.get(job.type)!;
    const insertIdx = queue.findIndex((entry) => entry.score > score);
    if (insertIdx === -1) {
      queue.push({ id: jobId, score });
    } else {
      queue.splice(insertIdx, 0, { id: jobId, score });
    }
  }

  async purgeDeadLetter(): Promise<number> {
    const count = this.deadLetter.length;
    for (const id of this.deadLetter) {
      this.jobs.delete(id);
    }
    this.deadLetter = [];
    return count;
  }

  async size(type?: string): Promise<number> {
    if (type) {
      return this.pending.get(type)?.length ?? 0;
    }
    let total = 0;
    for (const queue of this.pending.values()) {
      total += queue.length;
    }
    return total;
  }
}
