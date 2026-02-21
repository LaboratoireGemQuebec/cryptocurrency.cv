'use client';
import dynamic from 'next/dynamic';

export const LiquidationsFeed = dynamic(
  () => import('@/components/LiquidationsFeed').then(m => ({ default: m.LiquidationsFeed })),
  { ssr: false }
);
