/**
 * Pipeline Status Admin Endpoint
 *
 * GET /api/admin/pipeline-status
 *
 * Returns real-time health information about the data ingestion pipeline:
 *   - Whether the pipeline is running
 *   - Per-source last fetch time, error counts, latency, circuit breaker state
 *   - Redis connectivity
 *   - Overall uptime
 *
 * Requires admin authentication (ADMIN_API_KEY header or ?key= query param).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { getPipelineStatus } from '@/lib/data-pipeline';
import { requireAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Require admin auth (same pattern as other admin endpoints)
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const status = getPipelineStatus();

  // Compute a simple overall health score: % of sources with no errors
  const sourceNames = Object.keys(status.sources);
  const healthySources = sourceNames.filter(
    (name) => status.sources[name].consecutiveErrors === 0,
  ).length;
  const healthScore =
    sourceNames.length > 0
      ? Math.round((healthySources / sourceNames.length) * 100)
      : 0;

  return NextResponse.json(
    {
      ok: status.running && healthScore >= 60,
      healthScore,
      ...status,
      _generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
