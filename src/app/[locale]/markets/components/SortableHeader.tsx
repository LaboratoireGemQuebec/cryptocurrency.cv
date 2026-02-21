'use client';

/**
 * Sortable Header Component
 * Clickable table header with sort indicator
 */

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export type SortField = 
  | 'market_cap_rank'
  | 'current_price'
  | 'price_change_percentage_1h_in_currency'
  | 'price_change_percentage_24h'
  | 'price_change_percentage_7d_in_currency'
  | 'price_change_percentage_30d_in_currency'
  | 'price_change_percentage_60d_in_currency'
  | 'price_change_percentage_90d_in_currency'
  | 'price_change_percentage_200d_in_currency'
  | 'market_cap'
  | 'fully_diluted_valuation'
  | 'total_volume'
  | 'circulating_supply'
  | 'ath'
  | 'ath_change_percentage'
  | 'atl'
  | 'atl_change_percentage'
  | 'high_24h'
  | 'low_24h';

export type SortOrder = 'asc' | 'desc';

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentOrder: SortOrder;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export default function SortableHeader({
  label,
  field,
  currentSort,
  currentOrder,
  align = 'right',
  className = '',
}: SortableHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isActive = currentSort === field;

  const handleClick = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Toggle order if same field, otherwise default to desc
    const newOrder: SortOrder = 
      isActive && currentOrder === 'desc' ? 'asc' : 'desc';
    
    params.set('sort', field);
    params.set('order', newOrder);
    
    // Reset to page 1 on sort change
    params.delete('page');
    
    const queryString = params.toString();
    router.push(`/markets${queryString ? `?${queryString}` : ''}`);
  }, [field, isActive, currentOrder, router, searchParams]);

  const alignClass = 
    align === 'left' ? 'text-left' : 
    align === 'center' ? 'text-center' : 
    'text-right';

  return (
    <th 
      className={`${alignClass} text-white/40 text-xs font-semibold uppercase tracking-wide p-4 pr-3 cursor-pointer hover:text-white transition-colors select-none group whitespace-nowrap ${isActive ? 'text-white' : ''} ${className}`}
      onClick={handleClick}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
        <span>{label}</span>
        <span className={`transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-40'}`}>
          {isActive ? (
            currentOrder === 'asc' ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            )
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          )}
        </span>
      </div>
    </th>
  );
}
