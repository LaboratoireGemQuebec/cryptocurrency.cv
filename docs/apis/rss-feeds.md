# RSS Feed Sources

> Direct RSS/Atom feed subscriptions for real-time crypto news ingestion.

All feeds consumed in `src/lib/data-pipeline.ts` and `src/lib/crypto-news.ts`.

---

## Primary Feeds

| # | Source | RSS URL |
|---|--------|---------|
| 1 | CoinDesk | `https://www.coindesk.com/arc/outboundfeeds/rss/` |
| 2 | The Block | `https://www.theblock.co/rss.xml` |
| 3 | CoinTelegraph | `https://cointelegraph.com/rss` |
| 4 | Bitcoin Magazine | `https://bitcoinmagazine.com/.rss/full/` |
| 5 | Decrypt | `https://decrypt.co/feed` |
| 6 | DL News | `https://www.dlnews.com/arc/outboundfeeds/rss/` |
| 7 | Blockworks | `https://blockworks.co/feed` |
| 8 | The Defiant | `https://thedefiant.io/feed` |
| 9 | Rekt News | `https://rekt.news/rss.xml` |
| 10 | Messari Blog | `https://messari.io/rss` |
| 11 | U.Today | `https://u.today/rss` |
| 12 | Coinbase Blog | `https://www.coinbase.com/blog/rss.xml` |
| 13 | Solana News | `https://solana.com/news/rss.xml` |
| 14 | Glassnode Insights | `https://insights.glassnode.com/rss/` |
| 15 | Alchemy Blog | `https://www.alchemy.com/blog/rss` |
| 16 | Stacker News | `https://stacker.news/rss` |
| 17 | Reuters Crypto | `https://www.reuters.com/technology/cryptocurrency/rss` |
| 18 | CNBC Crypto | `https://www.cnbc.com/id/100727362/device/rss/rss.html` |
| 19 | Yahoo Finance Crypto | `https://finance.yahoo.com/rss/cryptocurrency` |
| 20 | L2BEAT Blog | `https://l2beat.com/blog/rss.xml` |
| 21 | Watcher Guru | `https://watcher.guru/news/feed` |
| 22 | Cryptopolitan | `https://www.cryptopolitan.com/feed/` |
| 23 | TechCrunch Crypto | `https://techcrunch.com/category/cryptocurrency/feed/` |
| 24 | Coin Center | `https://www.coincenter.org/feed/` |
| 25 | dYdX Blog | `https://dydx.exchange/blog/feed` |
| 26 | Helius Blog | `https://www.helius.dev/blog/feed` |
| 27 | CoinMarketCap Blog | `https://blog.coinmarketcap.com/feed/` |
| 28 | CoinGecko Blog | `https://blog.coingecko.com/feed/` |
| 29 | CryptoSlate | `https://cryptoslate.com/feed/` |
| 30 | The Guardian Tech | `https://www.theguardian.com/technology/rss` |
| 31 | Fortune Crypto | `https://fortune.com/section/crypto/feed/` |
| 32 | Axios Crypto | `https://www.axios.com/pro/crypto-deals/feed` |
| 33 | Santiment Blog | `https://santiment.net/blog/feed/` |
| 34 | Fidelity Digital Assets | `https://www.fidelitydigitalassets.com/blog/rss.xml` |

---

## Extended Sources

The full list of 200+ RSS sources organized by category is maintained in `src/lib/crypto-news.ts`. Categories include:

- **General News** — CoinDesk, The Block, Decrypt, CoinTelegraph, Bitcoin Magazine, etc.
- **DeFi** — DeFi Rate, DeFi Pulse, Uniswap, Aave, Compound, MakerDAO, etc.
- **Trading** — BeInCrypto, U.Today, CryptoQuant, FXStreet, TradingView
- **Mining** — Bitcoin Mining News, Hashrate Index
- **Ethereum** — Etherscan Blog
- **Layer 2** — Optimism, Arbitrum, StarkNet, zkSync, Base
- **Research** — Messari, The DeFi Report, Glassnode, Delphi Digital, The Block Research
- **Developer** — Chainlink, Infura, The Graph, Foundry
- **Security** — SlowMist, CertiK, OpenZeppelin, Trail of Bits, samczsun, Immunefi
- **Solana** — Solana News
- **Asia-Pacific** — Forkast News
- **NFT** — NFT Now, NFT Evening
