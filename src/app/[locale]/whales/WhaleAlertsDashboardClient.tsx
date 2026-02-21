'use client';
import dynamic from 'next/dynamic';

export const WhaleAlertsDashboard = dynamic(
  () => import('@/components/WhaleAlertsDashboard').then(m => ({ default: m.WhaleAlertsDashboard })),
  { ssr: false }
);
