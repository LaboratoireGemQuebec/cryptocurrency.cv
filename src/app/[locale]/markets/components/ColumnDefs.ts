/**
 * Column Definitions for the Markets Table
 * Defines all available columns, their groups, labels, and defaults.
 */

export type ColumnGroup =
  | 'pinned'
  | 'price'
  | 'price_change'
  | 'market_cap'
  | 'volume'
  | 'supply'
  | 'charts'
  | 'others';

export interface ColumnDef {
  id: string;
  label: string;
  group: ColumnGroup;
  groupLabel: string;
  /** If sortable, the sort key */
  sortField?: string;
  /** Whether this column is on by default */
  defaultVisible: boolean;
  /** Text alignment */
  align?: 'left' | 'right' | 'center';
  /** Pinned columns cannot be hidden */
  pinned?: boolean;
}

export const COLUMN_GROUPS: { id: ColumnGroup; label: string }[] = [
  { id: 'pinned', label: 'Fixed' },
  { id: 'price', label: 'Price' },
  { id: 'price_change', label: 'Price Change' },
  { id: 'market_cap', label: 'Market Cap' },
  { id: 'volume', label: 'Volume' },
  { id: 'supply', label: 'Supply' },
  { id: 'charts', label: 'Charts' },
  { id: 'others', label: 'Others' },
];

export const ALL_COLUMNS: ColumnDef[] = [
  // ── Pinned (always visible) ────────────────────────────────────────────────
  {
    id: 'rank',
    label: '#',
    group: 'pinned',
    groupLabel: 'Fixed',
    sortField: 'market_cap_rank',
    defaultVisible: true,
    align: 'left',
    pinned: true,
  },
  {
    id: 'coin',
    label: 'Coin',
    group: 'pinned',
    groupLabel: 'Fixed',
    defaultVisible: true,
    align: 'left',
    pinned: true,
  },

  // ── Price ─────────────────────────────────────────────────────────────────
  {
    id: 'price',
    label: 'Price',
    group: 'price',
    groupLabel: 'Price',
    sortField: 'current_price',
    defaultVisible: true,
    pinned: true,
  },
  {
    id: 'price_btc',
    label: 'Price in BTC',
    group: 'price',
    groupLabel: 'Price',
    defaultVisible: false,
  },
  {
    id: 'price_eth',
    label: 'Price in ETH',
    group: 'price',
    groupLabel: 'Price',
    defaultVisible: false,
  },
  {
    id: 'ath',
    label: 'ATH',
    group: 'price',
    groupLabel: 'Price',
    sortField: 'ath',
    defaultVisible: false,
  },
  {
    id: 'atl',
    label: 'ATL',
    group: 'price',
    groupLabel: 'Price',
    sortField: 'atl',
    defaultVisible: false,
  },
  {
    id: 'high_24h',
    label: '24h High',
    group: 'price',
    groupLabel: 'Price',
    sortField: 'high_24h',
    defaultVisible: false,
  },
  {
    id: 'low_24h',
    label: '24h Low',
    group: 'price',
    groupLabel: 'Price',
    sortField: 'low_24h',
    defaultVisible: false,
  },
  {
    id: 'from_ath',
    label: 'From ATH',
    group: 'price',
    groupLabel: 'Price',
    sortField: 'ath_change_percentage',
    defaultVisible: false,
  },
  {
    id: 'from_atl',
    label: 'From ATL',
    group: 'price',
    groupLabel: 'Price',
    sortField: 'atl_change_percentage',
    defaultVisible: false,
  },

  // ── Price Change ───────────────────────────────────────────────────────────
  {
    id: 'change_1h',
    label: '1h %',
    group: 'price_change',
    groupLabel: 'Price Change',
    sortField: 'price_change_percentage_1h_in_currency',
    defaultVisible: true,
  },
  {
    id: 'change_24h',
    label: '24h %',
    group: 'price_change',
    groupLabel: 'Price Change',
    sortField: 'price_change_percentage_24h',
    defaultVisible: true,
  },
  {
    id: 'change_7d',
    label: '7d %',
    group: 'price_change',
    groupLabel: 'Price Change',
    sortField: 'price_change_percentage_7d_in_currency',
    defaultVisible: true,
  },
  {
    id: 'change_30d',
    label: '30d %',
    group: 'price_change',
    groupLabel: 'Price Change',
    sortField: 'price_change_percentage_30d_in_currency',
    defaultVisible: false,
  },
  {
    id: 'change_60d',
    label: '60d %',
    group: 'price_change',
    groupLabel: 'Price Change',
    sortField: 'price_change_percentage_60d_in_currency',
    defaultVisible: false,
  },
  {
    id: 'change_90d',
    label: '90d %',
    group: 'price_change',
    groupLabel: 'Price Change',
    sortField: 'price_change_percentage_90d_in_currency',
    defaultVisible: false,
  },
  {
    id: 'change_200d',
    label: 'YTD %',
    group: 'price_change',
    groupLabel: 'Price Change',
    sortField: 'price_change_percentage_200d_in_currency',
    defaultVisible: false,
  },
  {
    id: 'change_1h_btc',
    label: '1h% in BTC',
    group: 'price_change',
    groupLabel: 'Price Change',
    defaultVisible: false,
  },
  {
    id: 'change_24h_btc',
    label: '24h% in BTC',
    group: 'price_change',
    groupLabel: 'Price Change',
    defaultVisible: false,
  },
  {
    id: 'change_1h_eth',
    label: '1h% in ETH',
    group: 'price_change',
    groupLabel: 'Price Change',
    defaultVisible: false,
  },
  {
    id: 'change_24h_eth',
    label: '24h% in ETH',
    group: 'price_change',
    groupLabel: 'Price Change',
    defaultVisible: false,
  },

  // ── Market Cap ─────────────────────────────────────────────────────────────
  {
    id: 'market_cap',
    label: 'Market Cap',
    group: 'market_cap',
    groupLabel: 'Market Cap',
    sortField: 'market_cap',
    defaultVisible: true,
  },
  {
    id: 'fdv',
    label: 'Fully Diluted Mcap',
    group: 'market_cap',
    groupLabel: 'Market Cap',
    sortField: 'fully_diluted_valuation',
    defaultVisible: false,
  },

  // ── Volume ─────────────────────────────────────────────────────────────────
  {
    id: 'volume_24h',
    label: 'Volume (24h)',
    group: 'volume',
    groupLabel: 'Volume',
    sortField: 'total_volume',
    defaultVisible: true,
  },
  {
    id: 'volume_market_cap',
    label: 'Volume / Mcap',
    group: 'volume',
    groupLabel: 'Volume',
    defaultVisible: false,
  },

  // ── Supply ─────────────────────────────────────────────────────────────────
  {
    id: 'circulating_supply',
    label: 'Circulating Supply',
    group: 'supply',
    groupLabel: 'Supply',
    sortField: 'circulating_supply',
    defaultVisible: false,
  },
  {
    id: 'total_supply',
    label: 'Total Supply',
    group: 'supply',
    groupLabel: 'Supply',
    defaultVisible: false,
  },
  {
    id: 'max_supply',
    label: 'Max Supply',
    group: 'supply',
    groupLabel: 'Supply',
    defaultVisible: false,
  },

  // ── Charts ─────────────────────────────────────────────────────────────────
  {
    id: 'sparkline_7d',
    label: '7d Chart',
    group: 'charts',
    groupLabel: 'Charts',
    defaultVisible: true,
  },

  // ── Others ─────────────────────────────────────────────────────────────────
  {
    id: 'dominance',
    label: 'Dominance %',
    group: 'others',
    groupLabel: 'Others',
    defaultVisible: false,
  },
];

/** Default ordered list of visible column IDs */
export const DEFAULT_VISIBLE_COLUMNS: string[] = ALL_COLUMNS.filter(
  (c) => c.defaultVisible,
).map((c) => c.id);

export const COLUMN_MAP = new Map<string, ColumnDef>(
  ALL_COLUMNS.map((c) => [c.id, c]),
);
