'use client';
import dynamic from 'next/dynamic';

export const RegulatoryDashboard = dynamic(
  () => import('@/components/RegulatoryDashboard').then(m => ({ default: m.RegulatoryDashboard })),
  { ssr: false }
);
