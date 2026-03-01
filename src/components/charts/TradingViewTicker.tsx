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


import { useEffect, useRef, memo } from 'react';

export interface TradingViewTickerProps {
  symbols?: Array<{
    proName: string;
    title: string;
  }>;
  theme?: 'light' | 'dark';
  isTransparent?: boolean;
  displayMode?: 'adaptive' | 'regular' | 'compact';
  locale?: string;
}

/**
 * TradingView Ticker Tape Widget
 * Scrolling ticker showing multiple crypto prices
 */
function TradingViewTicker({
  symbols = [
    { proName: 'BINANCE:BTCUSDT', title: 'Bitcoin' },
    { proName: 'BINANCE:ETHUSDT', title: 'Ethereum' },
    { proName: 'BINANCE:SOLUSDT', title: 'Solana' },
    { proName: 'BINANCE:BNBUSDT', title: 'BNB' },
    { proName: 'BINANCE:XRPUSDT', title: 'XRP' },
    { proName: 'BINANCE:ADAUSDT', title: 'Cardano' },
    { proName: 'BINANCE:DOGEUSDT', title: 'Dogecoin' },
    { proName: 'BINANCE:DOTUSDT', title: 'Polkadot' },
  ],
  theme = 'dark',
  isTransparent = true,
  displayMode = 'adaptive',
  locale = 'en',
}: TradingViewTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: symbols,
      showSymbolLogo: true,
      colorTheme: theme,
      isTransparent: isTransparent,
      displayMode: displayMode,
      locale: locale,
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbols, theme, isTransparent, displayMode, locale]);

  return (
    <div className="tradingview-widget-container w-full">
      <div ref={containerRef} />
    </div>
  );
}

export default memo(TradingViewTicker);
