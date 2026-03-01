"use client";

/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  imageUrl?: string;
}

export function CoinStickyHeader({
  name,
  symbol,
  price,
  priceChange24h,
  imageUrl,
}: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isPositive = priceChange24h >= 0;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-black/95 backdrop-blur-sm transition-transform duration-200 ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
        <span className="font-bold text-gray-900 dark:text-white">{name}</span>
        <span className="text-sm text-gray-500 dark:text-slate-400 uppercase">
          {symbol}
        </span>
        <span className="font-mono font-semibold text-gray-900 dark:text-white">
          {formatted}
        </span>
        <span
          className={`text-sm font-semibold ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(priceChange24h).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
