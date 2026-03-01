# Free Crypto News Browser Extension

> Real-time crypto news and live prices directly in your browser toolbar. Powered by [cryptocurrency.cv](https://cryptocurrency.cv).

## Features

- **Live Price Bar** — BTC, ETH, SOL prices with 24h change percentage
- **Latest Headlines** — 5 most recent articles from 130+ trusted sources
- **Breaking News Alerts** — Desktop notifications for urgent news
- **Badge Count** — Unread breaking news count on the toolbar icon
- **Quick Links** — One-click access to FCN, Markets, Search, Portfolio
- **Theme Support** — Dark, Light, or System preference
- **Offline Mode** — Cached data shown when network is unavailable
- **Configurable Refresh** — 1, 5, 15, or 30 minute intervals
- **Zero API Keys** — 100% free, no registration required

## Screenshots

<!-- Add screenshots here -->
![Popup](./screenshots/popup.png)
![Options](./screenshots/options.png)

## Installation

### Chrome

1. Download or clone this repository
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `extension/` folder
6. Pin the extension to your toolbar

### Edge

1. Open `edge://extensions/`
2. Enable **Developer mode** (left sidebar)
3. Click **Load unpacked**
4. Select the `extension/` folder

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `extension/manifest.json`

> **Note:** Firefox temporary add-ons are removed on restart. A signed Firefox add-on is planned.

## Settings

Right-click the extension icon → **Options**, or click **Settings →** in the popup footer.

| Setting | Options | Default |
|---------|---------|---------|
| Theme | Dark / Light / System | Dark |
| Breaking News Alerts | On / Off | On |
| Price Alerts | On / Off | Off |
| Refresh Interval | 1 / 5 / 15 / 30 min | 5 min |
| Default Badge Coin | BTC / ETH / SOL | BTC |

## Architecture

```
extension/
├── manifest.json      # Manifest V3 configuration
├── background.js      # Service worker (alarms, notifications, badge)
├── popup.html         # Extension popup UI (400×500px)
├── popup.js           # Popup logic (prices, news, theme, caching)
├── options.html       # Settings page
├── options.js         # Settings logic (chrome.storage.sync)
├── icons/             # Extension icons (16, 32, 48, 128px)
└── README.md          # This file
```

## API

All data is fetched from the public API at `https://cryptocurrency.cv/api`:

| Endpoint | Description |
|----------|-------------|
| `/api/news` | Latest news articles |
| `/api/breaking` | Breaking / urgent news |
| `/api/prices` | Live cryptocurrency prices |

No API key required. See [API docs](https://cryptocurrency.cv/docs) for full reference.

## Development

```bash
# Clone the repo
git clone https://github.com/nirholas/free-crypto-news.git
cd free-crypto-news/extension

# Load in Chrome
# 1. Go to chrome://extensions
# 2. Enable Developer mode
# 3. Click "Load unpacked" → select this folder

# Edit files and click the reload button on chrome://extensions to test changes
```

## Privacy

- Only fetches from `cryptocurrency.cv` — no third-party tracking
- Caches data locally in `chrome.storage.local`
- Settings synced via `chrome.storage.sync` (across your Chrome profile)
- No personal data collected
- Open source — audit the code yourself

## Permissions

| Permission | Reason |
|------------|--------|
| `storage` | Cache news/prices locally and sync settings |
| `alarms` | Periodic background checks for breaking news |
| `notifications` | Desktop alerts for breaking news |
| `host_permissions` | Fetch data from `cryptocurrency.cv` only |

## License

See [LICENSE](../LICENSE) in the project root.
