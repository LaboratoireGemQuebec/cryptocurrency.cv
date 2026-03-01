/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

// Load saved settings
async function loadSettings() {
  const result = await chrome.storage.local.get('settings');
  const settings = result.settings || {
    notifications: true,
    showSource: true,
    compactMode: false
  };
  
  document.getElementById('notifications').checked = settings.notifications;
  document.getElementById('showSource').checked = settings.showSource;
  document.getElementById('compactMode').checked = settings.compactMode;
}

// Save settings
document.getElementById('save').addEventListener('click', async () => {
  const settings = {
    notifications: document.getElementById('notifications').checked,
    showSource: document.getElementById('showSource').checked,
    compactMode: document.getElementById('compactMode').checked
  };
  
  await chrome.storage.local.set({ settings });
  
  // Show saved message
  const saved = document.getElementById('saved');
  saved.classList.add('show');
  setTimeout(() => saved.classList.remove('show'), 2000);
});

// Clear cache
document.getElementById('clearCache').addEventListener('click', async () => {
  const keys = ['cache_news', 'cache_breaking', 'cache_bitcoin', 'cache_defi', 'notifiedArticles'];
  await chrome.storage.local.remove(keys);
  alert('Cache cleared!');
});

// Initialize
loadSettings();
