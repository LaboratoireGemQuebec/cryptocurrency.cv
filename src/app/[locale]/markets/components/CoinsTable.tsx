'use client';

/**
 * Coins Table Component
 * Main table displaying cryptocurrency data with sortable, customizable columns.
 */

import { type TokenPrice } from '@/lib/market-data';
import SortableHeader, { type SortField, type SortOrder } from './SortableHeader';
import CoinRow from './CoinRow';
import TablePagination from './TablePagination';
import ColumnCustomizer, { useColumns, resolveColumns } from './ColumnCustomizer';
import { COLUMN_MAP } from './ColumnDefs';

interface CoinsTableProps {
  coins: TokenPrice[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  currentSort: SortField;
  currentOrder: SortOrder;
  showWatchlist?: boolean;
  /** BTC price in USD (for price_in_btc / change_in_btc columns) */
  btcPrice?: number;
  /** ETH price in USD (for price_in_eth / change_in_eth columns) */
  ethPrice?: number;
  /** BTC 1h % change (for relative BTC change columns) */
  btcChange1h?: number;
  /** BTC 24h % change (for relative BTC change columns) */
  btcChange24h?: number;
  /** ETH 1h % change (for relative ETH change columns) */
  ethChange1h?: number;
  /** ETH 24h % change (for relative ETH change columns) */
  ethChange24h?: number;
  /** Total market cap in USD (for dominance % column) */
  totalMarketCap?: number;
}

export default function CoinsTable({
  coins,
  totalCount,
  currentPage,
  itemsPerPage,
  currentSort,
  currentOrder,
  showWatchlist = false,
  btcPrice,
  ethPrice,
  btcChange1h,
  btcChange24h,
  ethChange1h,
  ethChange24h,
  totalMarketCap,
}: CoinsTableProps) {
  const [activeColumnIds, setActiveColumnIds] = useColumns();
  const activeColumns = resolveColumns(activeColumnIds);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (coins.length === 0) {
    return (
      <div className="bg-black rounded-xl border border-white/10 overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No coins found
          </h3>
          <p className="text-white/50">
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl border border-white/10 overflow-hidden shadow-sm">
      {/* Table toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
        <span className="text-xs text-white/50 font-medium">
          Showing <span className="font-semibold text-white/70">{totalCount.toLocaleString()}</span> cryptocurrencies
        </span>
        <ColumnCustomizer
          activeColumns={activeColumnIds}
          onChange={setActiveColumnIds}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] sticky top-0 z-10">
              {activeColumns.map((col) => {
                if (col.sortField && COLUMN_MAP.has(col.id)) {
                  return (
                    <SortableHeader
                      key={col.id}
                      label={col.label}
                      field={col.sortField as SortField}
                      currentSort={currentSort}
                      currentOrder={currentOrder}
                      align={col.align === 'left' ? 'left' : 'right'}
                      className={col.id === 'rank' ? 'w-12' : ''}
                    />
                  );
                }
                return (
                  <th
                    key={col.id}
                    className={`${
                      col.align === 'left' ? 'text-left' : 'text-right'
                    } text-white/40 text-xs font-semibold uppercase tracking-wide p-4 pr-3 whitespace-nowrap`}
                  >
                    {col.label}
                  </th>
                );
              })}
              {showWatchlist && (
                <th className="text-center text-white/40 text-sm font-medium p-4 w-12">
                  <span className="sr-only">Watchlist</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <CoinRow
                key={coin.id}
                coin={coin}
                activeColumns={activeColumnIds}
                showWatchlist={showWatchlist}
                btcPrice={btcPrice}
                ethPrice={ethPrice}
                btcChange1h={btcChange1h}
                btcChange24h={btcChange24h}
                ethChange1h={ethChange1h}
                ethChange24h={ethChange24h}
                totalMarketCap={totalMarketCap}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
