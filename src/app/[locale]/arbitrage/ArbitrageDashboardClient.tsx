'use client';
import dynamic from 'next/dynamic';

export const ArbitrageDashboard = dynamic(
  () => import('@/components/ArbitrageDashboard').then(m => ({ default: m.ArbitrageDashboard })),
  { ssr: false }
);
