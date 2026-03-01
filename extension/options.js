/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

// ── Options Page Logic ──────────────────────────────────

const DEFAULTS = {
  theme: 'dark',
  breakingNews: true,
  priceAlerts: false,
  refreshInterval: 5,
  badgeCoin: 'BTC'
};

// ── Apply theme to this page ─────────────────────────────

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// ── Load settings ────────────────────────────────────────

async function loadSettings() {
  const result = await chrome.storage.sync.get('settings');
  const s = Object.assign({}, DEFAULTS, result.settings || {});

  document.getElementById('theme').value = s.theme;
  document.getElementById('breakingNews').checked = s.breakingNews;
  document.getElementById('priceAlerts').checked = s.priceAlerts;
  document.getElementById('refreshInterval').value = String(s.refreshInterval);
  document.getElementById('badgeCoin').value = s.badgeCoin;

  applyTheme(s.theme);
}

// ── Save settings ────────────────────────────────────────

document.getElementById('save').addEventListener('click', async () => {
  const settings = {
    theme: document.getElementById('theme').value,
    breakingNews: document.getElementById('breakingNews').checked,
    priceAlerts: document.getElementById('priceAlerts').checked,
    refreshInterval: Number(document.getElementById('refreshInterval').value),
    badgeCoin: document.getElementById('badgeCoin').value
  };

  await chrome.storage.sync.set({ settings });
  applyTheme(settings.theme);

  // Show toast
  const toast = document.getElementById('toast');
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2000);
});

// Live-preview theme changes
document.getElementById('theme').addEventListener('change', (e) => {
  applyTheme(e.target.value);
});

// ── Clear cache ──────────────────────────────────────────

document.getElementById('clearCache').addEventListener('click', async () => {
  await chrome.storage.local.clear();
  const btn = document.getElementById('clearCache');
  btn.textContent = 'Cleared!';
  setTimeout(() => { btn.textContent = 'Clear'; }, 1500);
});

// ── Init ─────────────────────────────────────────────────

loadSettings();
