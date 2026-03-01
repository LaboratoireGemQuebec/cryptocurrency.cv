# Crypto News for GitHub Copilot

Query real-time crypto news, prices, gas fees, Fear & Greed Index, and more — directly in GitHub Copilot Chat.

Powered by the free [cryptocurrency.cv](https://cryptocurrency.cv) API. No API key required.

## Features

- 📰 **Latest News** — Top crypto headlines from 200+ sources
- 💰 **Live Prices** — Real-time coin prices with 24h change
- 📊 **Market Overview** — Sentiment analysis & top coins
- 🔍 **Search** — Full-text search across news articles
- ⛽ **Gas Prices** — Current Ethereum gas (slow / standard / fast)
- 😱 **Fear & Greed** — Market emotion gauge with trend
- 📖 **Glossary** — Explain any crypto term

## Installation

### From VS Code Marketplace

1. Open **Extensions** in VS Code (`Ctrl+Shift+X`)
2. Search for **"Crypto News for Copilot"**
3. Click **Install**
4. Ensure GitHub Copilot Chat is enabled

### Manual / Dev Install

```bash
cd copilot-extension
pnpm install
bun run compile
# Press F5 in VS Code to launch Extension Development Host
```

## Usage

Open **Copilot Chat** and type `@crypto` followed by a command:

```
@crypto /news
@crypto /price bitcoin
@crypto /market
@crypto /search ethereum ETF
@crypto /gas
@crypto /fear-greed
@crypto /explain DeFi
```

Or type a free-form question:

```
@crypto what's happening with Solana?
@crypto latest Ethereum news
```

<!-- screenshot placeholder -->
<!-- ![screenshot](media/screenshot.png) -->

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/news` | Latest crypto news | `@crypto /news` |
| `/price <coin>` | Current price for a coin | `@crypto /price bitcoin` |
| `/market` | Market overview & sentiment | `@crypto /market` |
| `/search <query>` | Search news articles | `@crypto /search SEC` |
| `/gas` | Ethereum gas prices | `@crypto /gas` |
| `/fear-greed` | Fear & Greed Index | `@crypto /fear-greed` |
| `/explain <term>` | Explain a crypto term | `@crypto /explain staking` |

## Configuration

Access via **Settings → Extensions → Crypto News**:

| Setting | Default | Description |
|---------|---------|-------------|
| `crypto.apiUrl` | `https://cryptocurrency.cv` | API base URL |
| `crypto.defaultLimit` | `10` | Items per request |
| `crypto.showSentiment` | `true` | Show sentiment indicators |

## API

This extension uses the [Free Crypto News API](https://cryptocurrency.cv):

- 200+ news sources aggregated in real time
- No API key required for basic usage
- JSON REST endpoints, RSS/Atom feeds
- [Full API docs](https://cryptocurrency.cv/developers)

## Development

```bash
cd copilot-extension
pnpm install
bun run watch          # compile in watch mode
# Press F5 to launch Extension Development Host
bun run compile        # one-time build
bun run lint           # lint sources
```

## License

See [LICENSE](../LICENSE) file.

## Links

- [cryptocurrency.cv](https://cryptocurrency.cv)
- [API Documentation](https://cryptocurrency.cv/developers)
- [GitHub Repository](https://github.com/nirholas/free-crypto-news)

