'use client';
import dynamic from 'next/dynamic';

export const Screener = dynamic(
  () => import('@/components/Screener').then(m => ({ default: m.Screener })),
  { ssr: false }
);
