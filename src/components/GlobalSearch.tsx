'use client';

/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */


/**
 * @fileoverview Global Search Component
 * 
 * A wrapper component that connects the SearchModal to the keyboard shortcuts system.
 * Opens via Cmd+K (macOS) / Ctrl+K (Windows/Linux) or the "/" key.
 * 
 * @module components/GlobalSearch
 */

import { useShortcuts } from './KeyboardShortcuts';
import { SearchModal } from './SearchModal';

export function GlobalSearch() {
  const { openSearch, setOpenSearch } = useShortcuts();

  return (
    <SearchModal 
      isOpen={openSearch} 
      onClose={() => setOpenSearch(false)} 
    />
  );
}

export default GlobalSearch;
