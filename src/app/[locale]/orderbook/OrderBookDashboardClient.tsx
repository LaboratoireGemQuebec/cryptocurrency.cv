'use client';
import dynamic from 'next/dynamic';

export const OrderBookDashboard = dynamic(
  () => import('@/components/OrderBookDashboard').then(m => ({ default: m.OrderBookDashboard })),
  { ssr: false }
);
