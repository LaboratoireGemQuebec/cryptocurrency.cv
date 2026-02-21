'use client';
import dynamic from 'next/dynamic';

export const ProtocolHealthDashboard = dynamic(
  () => import('@/components/ProtocolHealthDashboard').then(m => ({ default: m.ProtocolHealthDashboard })),
  { ssr: false }
);
