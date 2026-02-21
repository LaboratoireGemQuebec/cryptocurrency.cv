'use client';
import dynamic from 'next/dynamic';

export const AIMarketAgentDashboard = dynamic(
  () => import('@/components/AIMarketAgentDashboard').then(m => ({ default: m.AIMarketAgentDashboard })),
  { ssr: false }
);
