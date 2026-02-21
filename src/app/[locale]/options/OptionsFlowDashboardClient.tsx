'use client';
import dynamic from 'next/dynamic';

export const OptionsFlowDashboard = dynamic(
  () => import('@/components/OptionsFlowDashboard').then(m => ({ default: m.OptionsFlowDashboard })),
  { ssr: false }
);
