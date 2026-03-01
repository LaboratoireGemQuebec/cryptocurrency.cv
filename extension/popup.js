/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

const API_BASE = 'https://cryptocurrency.cv/api';
const CACHE_TTL = 60 * 1000; // 60 seconds

// ── Helpers ──────────────────────────────────────────────

function escapeHtml(text) {
  const el = document.createElement('span');
  el.textContent = text;
  return el.innerHTML;
}

function formatPrice(n) {
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function formatChange(pct) {
  const sign = pct >= 0 ? '+' : '';
  return sign + pct.toFixed(2) + '%';
}

async function cachedFetch(url, cacheKey) {
  const result = await chrome.storage.local.get(cacheKey);
  const cached = result[cacheKey];
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return { data: cached.data, fromCache: true };
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    await chrome.storage.local.set({ [cacheKey]: { data, ts: Date.now() } });
    return { data, fromCache: false };
  } catch (err) {
    if (cached) return { data: cached.data, fromCache: true, offline: true };
    throw err;
  }
}

// ── Theme ────────────────────────────────────────────────

async function applyTheme() {
  const result = await chrome.storage.sync.get('settings');
  const theme = (result.settings && result.settings.theme) || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

// ── Prices ───────────────────────────────────────────────

async function loadPrices() {
  try {
    const { data, offline } = await cachedFetch(API_BASE + '/prices', 'cache_prices');
    const prices = data.prices || data;

    const coins = { btc: 'bitcoin', eth: 'ethereum', sol: 'solana' };
    for (const [key, id] of Object.entries(coins)) {
      const coin = Array.isArray(prices)
        ? prices.find(p => p.id === id || p.symbol === key.toUpperCase())
        : prices[id] || prices[key];

      const priceEl = document.getElementById('price' + key.charAt(0).toUpperCase() + key.slice(1));
      const changeEl = document.getElementById('change' + key.charAt(0).toUpperCase() + key.slice(1));

      if (coin) {
        const price = coin.price || coin.current_price || coin.usd || 0;
        const change = coin.change24h || coin.price_change_percentage_24h || coin.change || 0;

        priceEl.className = 'price-value';
        priceEl.textContent = formatPrice(price);

        changeEl.className = 'price-change ' + (change >= 0 ? 'up' : 'down');
        changeEl.textContent = formatChange(change);
      } else {
        priceEl.className = 'price-value';
        priceEl.textContent = '--';
        changeEl.className = 'price-change';
        changeEl.textContent = '--';
      }
    }
  } catch {
    ['Btc', 'Eth', 'Sol'].forEach(k => {
      const priceEl = document.getElementById('price' + k);
      const changeEl = document.getElementById('change' + k);
      priceEl.className = 'price-value';
      priceEl.textContent = '--';
      changeEl.className = 'price-change';
      changeEl.textContent = '--';
    });
  }
}

// ── News ─────────────────────────────────────────────────

async function loadNews() {
  const newsList = document.getElementById('newsList');

  try {
    const { data, offline } = await cachedFetch(API_BASE + '/news?limit=5', 'cache_news_popup');
    const articles = data.articles || [];

    if (offline) {
      document.querySelector('.section-label').textContent = 'Offline \u2014 showing cached data';
    } else {
      document.querySelector('.section-label').textContent = 'Latest Headlines';
    }

    if (articles.length === 0) {
      newsList.innerHTML = '<div class="error-state"><div class="error-icon">&#x1f4f0;</div><div class="error-msg">No articles found</div></div>';
      return;
    }

    newsList.innerHTML = articles.map(a => `
      <div class="news-item" data-url="${escapeHtml(a.link)}">
        <div class="news-body">
          <span class="news-source">${escapeHtml(a.source)}</span>
          <div class="news-title">${escapeHtml(a.title)}</div>
          <div class="news-meta">${escapeHtml(a.timeAgo || '')}</div>
        </div>
      </div>
    `).join('');

    newsList.querySelectorAll('.news-item').forEach(el => {
      el.addEventListener('click', () => chrome.tabs.create({ url: el.dataset.url }));
    });
  } catch (err) {
    newsList.innerHTML = `
      <div class="error-state">
        <div class="error-icon">&#x26a0;&#xfe0f;</div>
        <div class="error-msg">Offline \u2014 showing cached data</div>
        <div class="error-sub">${escapeHtml(err.message)}</div>
      </div>`;
  }
}

// ── Quick Links ──────────────────────────────────────────

document.getElementById('linkOpen').addEventListener('click', () =>
  chrome.tabs.create({ url: 'https://cryptocurrency.cv' }));
document.getElementById('linkMarkets').addEventListener('click', () =>
  chrome.tabs.create({ url: 'https://cryptocurrency.cv/markets' }));
document.getElementById('linkSearch').addEventListener('click', () =>
  chrome.tabs.create({ url: 'https://cryptocurrency.cv/search' }));
document.getElementById('linkPortfolio').addEventListener('click', () =>
  chrome.tabs.create({ url: 'https://cryptocurrency.cv/portfolio' }));

// ── Footer Controls ──────────────────────────────────────

document.getElementById('themeToggle').addEventListener('click', async () => {
  const result = await chrome.storage.sync.get('settings');
  const settings = result.settings || {};
  const order = ['dark', 'light', 'system'];
  const current = settings.theme || 'dark';
  settings.theme = order[(order.indexOf(current) + 1) % order.length];
  await chrome.storage.sync.set({ settings });
  applyTheme();
  const label = settings.theme === 'dark' ? '\ud83c\udf19' : settings.theme === 'light' ? '\u2600\ufe0f' : '\ud83d\udcbb';
  document.getElementById('themeToggle').textContent = label + ' ' + settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1);
});

document.getElementById('notifToggle').addEventListener('click', async () => {
  const result = await chrome.storage.sync.get('settings');
  const settings = result.settings || {};
  settings.breakingNews = !settings.breakingNews;
  await chrome.storage.sync.set({ settings });
  const label = settings.breakingNews ? '\ud83d\udd14 On' : '\ud83d\udd15 Off';
  document.getElementById('notifToggle').textContent = label;
});

document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('refreshBtn').addEventListener('click', () => {
  chrome.storage.local.remove(['cache_prices', 'cache_news_popup']);
  loadPrices();
  loadNews();
});

// ── Init ─────────────────────────────────────────────────

async function init() {
  await applyTheme();

  const result = await chrome.storage.sync.get('settings');
  const settings = result.settings || {};

  const themeLabel = (settings.theme || 'dark');
  const themeIcon = themeLabel === 'dark' ? '\ud83c\udf19' : themeLabel === 'light' ? '\u2600\ufe0f' : '\ud83d\udcbb';
  document.getElementById('themeToggle').textContent = themeIcon + ' ' + themeLabel.charAt(0).toUpperCase() + themeLabel.slice(1);

  const notifOn = settings.breakingNews !== false;
  document.getElementById('notifToggle').textContent = notifOn ? '\ud83d\udd14 On' : '\ud83d\udd15 Off';

  loadPrices();
  loadNews();
}

init();
