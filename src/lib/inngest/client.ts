/**
 * Inngest Client
 *
 * Centralised Inngest client used by all background functions.
 * Replace Vercel Cron with reliable, retryable background jobs.
 *
 * Environment variables:
 *   INNGEST_EVENT_KEY  — Inngest event key (production)
 *   INNGEST_SIGNING_KEY — Inngest signing key for webhook verification
 *
 * @see https://www.inngest.com/docs
 */

import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'free-crypto-news',
  /**
   * Event key is optional in dev (Inngest Dev Server doesn't require it).
   * In production Inngest reads INNGEST_EVENT_KEY automatically.
   */
});
