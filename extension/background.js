/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

// Background service worker for Free Crypto News extension (Manifest V3)

const API_BASE = 'https://cryptocurrency.cv/api';
const DEFAULT_INTERVAL = 5; // minutes

// ── Alarm Setup ──────────────────────────────────────────

async function setupAlarm() {
  const result = await chrome.storage.sync.get('settings');
  const interval = (result.settings && result.settings.refreshInterval) || DEFAULT_INTERVAL;
  await chrome.alarms.clearAll();
  chrome.alarms.create('checkBreaking', { periodInMinutes: interval });
}

chrome.runtime.onInstalled.addListener(() => {
  setupAlarm();
  refreshData();
});

chrome.runtime.onStartup.addListener(() => {
  setupAlarm();
});

// Listen for settings changes to update alarm interval
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.settings) {
    setupAlarm();
  }
});

// ── Alarm Handler ────────────────────────────────────────

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkBreaking') {
    await refreshData();
  }
});

// ── Data Refresh ─────────────────────────────────────────

async function refreshData() {
  try {
    // Fetch breaking news
    const breakingRes = await fetch(API_BASE + '/breaking?limit=5');
    if (!breakingRes.ok) return;
    const breakingData = await breakingRes.json();
    const articles = breakingData.articles || [];

    // Cache latest data
    await chrome.storage.local.set({
      cache_breaking: { data: breakingData, ts: Date.now() }
    });

    // Check for new breaking news to notify
    const result = await chrome.storage.local.get('notifiedIds');
    const notifiedIds = new Set(result.notifiedIds || []);

    const newArticles = articles.filter(a => !notifiedIds.has(a.link));

    if (newArticles.length > 0) {
      // Check notification preference
      const settingsResult = await chrome.storage.sync.get('settings');
      const settings = settingsResult.settings || {};

      if (settings.breakingNews !== false) {
        // Show notification for the most recent breaking article
        const article = newArticles[0];
        try {
          chrome.notifications.create('breaking-' + Date.now(), {
            type: 'basic',
            iconUrl: 'icons/icon-128.png',
            title: 'Breaking Crypto News',
            message: article.title,
            priority: 2
          });
        } catch {
          // Notifications may not be available in all contexts
        }
      }

      // Update notified set (keep last 200)
      newArticles.forEach(a => notifiedIds.add(a.link));
      const trimmed = Array.from(notifiedIds).slice(-200);
      await chrome.storage.local.set({ notifiedIds: trimmed });
    }

    // Update badge with unread count
    const unreadCount = newArticles.length;
    if (unreadCount > 0) {
      chrome.action.setBadgeText({ text: String(unreadCount) });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  } catch (error) {
    console.error('[FCN] Failed to refresh data:', error);
  }
}

// ── Notification Click ───────────────────────────────────

chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.tabs.create({ url: 'https://cryptocurrency.cv/breaking' });
  chrome.notifications.clear(notificationId);
});

// ── Badge Reset on Popup Open ────────────────────────────

chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
});
