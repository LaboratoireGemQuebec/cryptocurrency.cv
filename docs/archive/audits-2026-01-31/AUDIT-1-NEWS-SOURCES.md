# AUDIT-1: News Sources & Data Fetching Audit

**Audit Date:** January 31, 2026  
**Auditor:** Agent 1 (Claude Opus 4.5)  
**Scope:** News sources, RSS feeds, data fetching, caching, and API endpoints

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [English RSS Sources](#english-rss-sources)
3. [International Sources](#international-sources)
4. [Source Categories](#source-categories)
5. [Data Fetching Logic](#data-fetching-logic)
6. [API Endpoints for News](#api-endpoints-for-news)
7. [Source Statistics](#source-statistics)

---

## Executive Summary

The Free Crypto News aggregator is a comprehensive news aggregation platform that collects articles from **116 English sources** and **74 international sources** across **18 languages** and **5 geographic regions**. The system uses RSS feed parsing with intelligent caching, rate limiting, and optional AI-powered translation for international content.

**Total Sources: 190**

**Key Files Audited:**

- `/src/lib/crypto-news.ts` - Main RSS sources (1,437 lines)
- `/src/lib/international-sources.ts` - International sources (1,303 lines)
- `/src/lib/source-translator.ts` - Translation logic (403 lines)
- `/src/lib/cache.ts` - Caching mechanisms (165 lines)
- `/src/app/api/news/*` - News API routes
- `/src/app/api/bitcoin/route.ts` - Bitcoin news endpoint
- `/src/app/api/defi/route.ts` - DeFi news endpoint
- `/src/app/api/breaking/route.ts` - Breaking news endpoint
- `/src/app/api/search/route.ts` - Search endpoint
- `/src/app/api/trending/route.ts` - Trending topics endpoint

---

## English RSS Sources

### Tier 1: Major News Outlets (7 sources)

| Key             | Name             | Category | RSS URL                                         |
| --------------- | ---------------- | -------- | ----------------------------------------------- |
| coindesk        | CoinDesk         | general  | https://www.coindesk.com/arc/outboundfeeds/rss/ |
| theblock        | The Block        | general  | https://www.theblock.co/rss.xml                 |
| decrypt         | Decrypt          | general  | https://decrypt.co/feed                         |
| cointelegraph   | CoinTelegraph    | general  | https://cointelegraph.com/rss                   |
| bitcoinmagazine | Bitcoin Magazine | bitcoin  | https://bitcoinmagazine.com/.rss/full/          |
| blockworks      | Blockworks       | general  | https://blockworks.co/feed                      |
| defiant         | The Defiant      | defi     | https://thedefiant.io/feed                      |

### Tier 2: Established News Sources (5 sources)

| Key          | Name         | Category | RSS URL                        |
| ------------ | ------------ | -------- | ------------------------------ |
| bitcoinist   | Bitcoinist   | bitcoin  | https://bitcoinist.com/feed/   |
| cryptoslate  | CryptoSlate  | general  | https://cryptoslate.com/feed/  |
| newsbtc      | NewsBTC      | general  | https://www.newsbtc.com/feed/  |
| cryptonews   | Crypto.news  | general  | https://crypto.news/feed/      |
| cryptopotato | CryptoPotato | general  | https://cryptopotato.com/feed/ |

### DeFi & Web3 Sources (3 sources)

| Key       | Name       | Category | RSS URL                     |
| --------- | ---------- | -------- | --------------------------- |
| defirate  | DeFi Rate  | defi     | https://defirate.com/feed/  |
| dailydefi | Daily DeFi | defi     | https://dailydefi.org/feed/ |
| rekt      | Rekt News  | defi     | https://rekt.news/rss.xml   |

### NFT & Metaverse Sources (2 sources)

| Key        | Name        | Category | RSS URL                      |
| ---------- | ----------- | -------- | ---------------------------- |
| nftnow     | NFT Now     | nft      | https://nftnow.com/feed/     |
| nftevening | NFT Evening | nft      | https://nftevening.com/feed/ |

### Research & Analysis Sources (4 sources)

| Key            | Name               | Category | RSS URL                                 |
| -------------- | ------------------ | -------- | --------------------------------------- |
| messari        | Messari            | research | https://messari.io/rss                  |
| thedefireport  | The DeFi Report    | research | https://thedefireport.substack.com/feed |
| cryptobriefing | Crypto Briefing    | research | https://cryptobriefing.com/feed/        |
| glassnode      | Glassnode Insights | research | https://insights.glassnode.com/rss/     |

### Trading & Market Analysis (6 sources)

| Key                | Name                     | Category | RSS URL                                                     |
| ------------------ | ------------------------ | -------- | ----------------------------------------------------------- |
| ambcrypto          | AMBCrypto                | trading  | https://ambcrypto.com/feed/                                 |
| beincrypto         | BeInCrypto               | trading  | https://beincrypto.com/feed/                                |
| u_today            | U.Today                  | trading  | https://u.today/rss                                         |
| fxstreet_crypto    | FXStreet Crypto          | trading  | https://www.fxstreet.com/cryptocurrencies/news/feed         |
| tradingview_crypto | TradingView Crypto Ideas | trading  | https://www.tradingview.com/feed/?sort=recent&stream=crypto |
| cryptoquant_blog   | CryptoQuant Blog         | trading  | https://cryptoquant.com/blog/feed                           |

### Mining & Infrastructure (3 sources)

| Key                | Name                | Category | RSS URL                                            |
| ------------------ | ------------------- | -------- | -------------------------------------------------- |
| bitcoinmining      | Bitcoin Mining News | mining   | https://bitcoinmagazine.com/tags/mining/.rss/full/ |
| hashrateindex      | Hashrate Index      | mining   | https://hashrateindex.com/blog/feed/               |
| compassmining_blog | Compass Mining Blog | mining   | https://compassmining.io/education/feed/           |

### Ethereum-Focused Sources (4 sources)

| Key                | Name             | Category | RSS URL                                |
| ------------------ | ---------------- | -------- | -------------------------------------- |
| weekinethereumnews | Week in Ethereum | ethereum | https://weekinethereumnews.com/feed/   |
| etherscan          | Etherscan Blog   | ethereum | https://etherscan.io/blog?rss          |
| daily_gwei         | The Daily Gwei   | ethereum | https://thedailygwei.substack.com/feed |
| week_in_ethereum   | Week in Ethereum | ethereum | https://weekinethereumnews.com/feed/   |

### Layer 2 & Scaling Solutions (7 sources)

| Key           | Name          | Category | RSS URL                               |
| ------------- | ------------- | -------- | ------------------------------------- |
| l2beat        | L2BEAT Blog   | layer2   | https://l2beat.com/blog/rss.xml       |
| optimism_blog | Optimism Blog | layer2   | https://optimism.mirror.xyz/feed/atom |
| arbitrum_blog | Arbitrum Blog | layer2   | https://arbitrum.io/blog/rss.xml      |
| polygon_blog  | Polygon Blog  | layer2   | https://polygon.technology/blog/feed  |
| starknet_blog | StarkNet Blog | layer2   | https://starkware.medium.com/feed     |
| zksync_blog   | zkSync Blog   | layer2   | https://zksync.mirror.xyz/feed/atom   |
| base_blog     | Base Blog     | layer2   | https://base.mirror.xyz/feed/atom     |

### Institutional & Exchange (4 sources)

| Key             | Name                    | Category      | RSS URL                                 |
| --------------- | ----------------------- | ------------- | --------------------------------------- |
| coinbase_blog   | Coinbase Blog           | institutional | https://www.coinbase.com/blog/rss.xml   |
| binance_blog    | Binance Blog            | institutional | https://www.binance.com/en/blog/rss.xml |
| galaxy_research | Galaxy Digital Research | institutional | https://www.galaxy.com/insights/feed/   |
| pantera_capital | Pantera Capital         | institutional | https://panteracapital.com/feed/        |

### Institutional Research & VC (6 sources)

| Key                | Name               | Category      | RSS URL                                    |
| ------------------ | ------------------ | ------------- | ------------------------------------------ |
| multicoin_capital  | Multicoin Capital  | institutional | https://multicoin.capital/feed/            |
| placeholder_vc     | Placeholder VC     | institutional | https://www.placeholder.vc/blog?format=rss |
| variant_fund       | Variant Fund       | institutional | https://variant.fund/writing/rss           |
| dragonfly_research | Dragonfly Research | institutional | https://medium.com/feed/dragonfly-research |
| delphi_digital     | Delphi Digital     | research      | https://members.delphidigital.io/feed      |
| paradigm_research  | Paradigm Research  | research      | https://www.paradigm.xyz/feed.xml          |

### Research Deep Dive (2 sources)

| Key              | Name               | Category | RSS URL                               |
| ---------------- | ------------------ | -------- | ------------------------------------- |
| a16z_crypto      | a16z Crypto        | research | https://a16zcrypto.com/feed/          |
| theblockresearch | The Block Research | research | https://www.theblock.co/research/feed |

### Developer & Tech Sources (6 sources)

| Key            | Name           | Category  | RSS URL                             |
| -------------- | -------------- | --------- | ----------------------------------- |
| alchemy_blog   | Alchemy Blog   | developer | https://www.alchemy.com/blog/rss    |
| chainlink_blog | Chainlink Blog | developer | https://blog.chain.link/feed/       |
| infura_blog    | Infura Blog    | developer | https://blog.infura.io/feed/        |
| thegraph_blog  | The Graph Blog | developer | https://thegraph.com/blog/feed      |
| hardhat_blog   | Hardhat Blog   | developer | https://hardhat.org/blog/rss.xml    |
| foundry_blog   | Foundry Blog   | developer | https://book.getfoundry.sh/feed.xml |

### Security & Auditing (5 sources)

| Key               | Name               | Category | RSS URL                                       |
| ----------------- | ------------------ | -------- | --------------------------------------------- |
| certik_blog       | CertiK Blog        | security | https://www.certik.com/resources/blog/rss.xml |
| openzeppelin_blog | OpenZeppelin Blog  | security | https://blog.openzeppelin.com/feed/           |
| trailofbits       | Trail of Bits Blog | security | https://blog.trailofbits.com/feed/            |
| samczsun          | samczsun Blog      | security | https://samczsun.com/rss/                     |
| immunefi_blog     | Immunefi Blog      | security | https://immunefi.medium.com/feed              |
| slowmist          | SlowMist Blog      | security | https://slowmist.medium.com/feed              |

### Mainstream Finance Crypto Coverage (7 sources)

| Key              | Name                       | Category   | RSS URL                                               |
| ---------------- | -------------------------- | ---------- | ----------------------------------------------------- |
| bloomberg_crypto | Bloomberg Crypto           | mainstream | https://www.bloomberg.com/crypto/feed                 |
| reuters_crypto   | Reuters Crypto             | mainstream | https://www.reuters.com/technology/cryptocurrency/rss |
| forbes_crypto    | Forbes Crypto              | mainstream | https://www.forbes.com/crypto-blockchain/feed/        |
| cnbc_crypto      | CNBC Crypto                | mainstream | https://www.cnbc.com/id/100727362/device/rss/rss.html |
| yahoo_crypto     | Yahoo Finance Crypto       | mainstream | https://finance.yahoo.com/rss/cryptocurrency          |
| wsj_crypto       | Wall Street Journal Crypto | mainstream | https://feeds.a.dj.com/rss/RSSWSJD.xml                |
| ft_crypto        | Financial Times Crypto     | mainstream | https://www.ft.com/cryptocurrencies?format=rss        |

### NFT & Gaming Extended (3 sources)

| Key            | Name           | Category | RSS URL                         |
| -------------- | -------------- | -------- | ------------------------------- |
| nftplazas      | NFT Plazas     | nft      | https://nftplazas.com/feed/     |
| playtoearn     | PlayToEarn     | gaming   | https://playtoearn.net/feed/    |
| dappradar_blog | DappRadar Blog | nft      | https://dappradar.com/blog/feed |

### Bitcoin Ecosystem Extended (3 sources)

| Key                | Name                | Category | RSS URL                            |
| ------------------ | ------------------- | -------- | ---------------------------------- |
| btctimes           | BTC Times           | bitcoin  | https://www.btctimes.com/feed/     |
| lightninglabs_blog | Lightning Labs Blog | bitcoin  | https://lightning.engineering/feed |
| stackernews        | Stacker News        | bitcoin  | https://stacker.news/rss           |

### Solana Ecosystem (1 source)

| Key         | Name        | Category | RSS URL                         |
| ----------- | ----------- | -------- | ------------------------------- |
| solana_news | Solana News | solana   | https://solana.com/news/rss.xml |

### Alternative L1 Ecosystems (7 sources)

| Key            | Name               | Category | RSS URL                                |
| -------------- | ------------------ | -------- | -------------------------------------- |
| near_blog      | NEAR Protocol Blog | altl1    | https://near.org/blog/feed/            |
| cosmos_blog    | Cosmos Blog        | altl1    | https://blog.cosmos.network/feed       |
| avalanche_blog | Avalanche Blog     | altl1    | https://medium.com/feed/avalancheavax  |
| sui_blog       | Sui Blog           | altl1    | https://blog.sui.io/feed/              |
| aptos_blog     | Aptos Blog         | altl1    | https://medium.com/feed/aptoslabs      |
| cardano_blog   | Cardano Blog       | altl1    | https://iohk.io/en/blog/posts/feed.rss |
| polkadot_blog  | Polkadot Blog      | altl1    | https://polkadot.network/blog/feed/    |

### Stablecoin & CBDC News (2 sources)

| Key         | Name        | Category   | RSS URL                          |
| ----------- | ----------- | ---------- | -------------------------------- |
| circle_blog | Circle Blog | stablecoin | https://www.circle.com/blog/feed |
| tether_news | Tether News | stablecoin | https://tether.to/en/news/feed/  |

### ETF & Asset Managers (7 sources)

| Key                 | Name                | Category | RSS URL                                 |
| ------------------- | ------------------- | -------- | --------------------------------------- |
| grayscale_insights  | Grayscale Insights  | etf      | https://grayscale.com/insights/feed/    |
| bitwise_research    | Bitwise Research    | etf      | https://bitwiseinvestments.com/feed/    |
| vaneck_blog         | VanEck Blog         | etf      | https://www.vaneck.com/us/en/blogs/rss/ |
| coinshares_research | CoinShares Research | etf      | https://blog.coinshares.com/feed        |
| ark_invest          | ARK Invest          | etf      | https://ark-invest.com/articles/feed/   |
| twentyone_shares    | 21Shares Research   | etf      | https://21shares.com/research/feed/     |
| wisdomtree_blog     | WisdomTree Blog     | etf      | https://www.wisdomtree.com/blog/feed    |

### Derivatives & Options (1 source)

| Key              | Name             | Category    | RSS URL                            |
| ---------------- | ---------------- | ----------- | ---------------------------------- |
| deribit_insights | Deribit Insights | derivatives | https://insights.deribit.com/feed/ |

### On-Chain Analytics (5 sources)

| Key             | Name                | Category | RSS URL                               |
| --------------- | ------------------- | -------- | ------------------------------------- |
| kaiko_research  | Kaiko Research      | onchain  | https://blog.kaiko.com/rss/           |
| intotheblock    | IntoTheBlock        | onchain  | https://medium.com/feed/intotheblock  |
| coin_metrics    | Coin Metrics        | onchain  | https://coinmetrics.substack.com/feed |
| thetie_research | The Tie Research    | onchain  | https://blog.thetie.io/feed/          |
| woobull         | Willy Woo (Woobull) | onchain  | https://woobull.com/feed/             |

### Fintech & Payments (3 sources)

| Key             | Name            | Category | RSS URL                                     |
| --------------- | --------------- | -------- | ------------------------------------------- |
| finextra        | Finextra        | fintech  | https://www.finextra.com/rss/headlines.aspx |
| pymnts_crypto   | PYMNTS Crypto   | fintech  | https://www.pymnts.com/cryptocurrency/feed/ |
| fintech_futures | Fintech Futures | fintech  | https://www.fintechfutures.com/feed/        |

### Macro Analysis (3 sources)

| Key               | Name              | Category | RSS URL                                |
| ----------------- | ----------------- | -------- | -------------------------------------- |
| lyn_alden         | Lyn Alden         | macro    | https://www.lynalden.com/feed/         |
| alhambra_partners | Alhambra Partners | macro    | https://www.alhambrapartners.com/feed/ |
| macro_voices      | Macro Voices      | macro    | https://www.macrovoices.com/feed       |

### Quantitative & Systematic Trading (5 sources)

| Key                | Name               | Category | RSS URL                                  |
| ------------------ | ------------------ | -------- | ---------------------------------------- |
| aqr_insights       | AQR Insights       | quant    | https://www.aqr.com/Insights/feed        |
| two_sigma_insights | Two Sigma Insights | quant    | https://www.twosigma.com/insights/rss/   |
| man_institute      | Man Institute      | quant    | https://www.man.com/maninstitute/feed    |
| alpha_architect    | Alpha Architect    | quant    | https://alphaarchitect.com/feed/         |
| quantstart         | QuantStart         | quant    | https://www.quantstart.com/articles/rss/ |

### Additional Journalism (4 sources)

| Key              | Name             | Category   | RSS URL                           |
| ---------------- | ---------------- | ---------- | --------------------------------- |
| unchained_crypto | Unchained Crypto | journalism | https://unchainedcrypto.com/feed/ |
| dl_news          | DL News          | journalism | https://www.dlnews.com/feed/      |
| protos           | Protos           | journalism | https://protos.com/feed/          |
| wu_blockchain    | Wu Blockchain    | asia       | https://wublock.substack.com/feed |

### Asia-Pacific English Sources (2 sources)

| Key      | Name         | Category | RSS URL                    |
| -------- | ------------ | -------- | -------------------------- |
| forkast  | Forkast News | asia     | https://forkast.news/feed/ |
| coingape | CoinGape     | general  | https://coingape.com/feed/ |

### Additional General News (10 sources)

| Key           | Name           | Category | RSS URL                                  |
| ------------- | -------------- | -------- | ---------------------------------------- |
| dailyhodl     | The Daily Hodl | general  | https://dailyhodl.com/feed/              |
| coinjournal   | CoinJournal    | general  | https://coinjournal.net/feed/            |
| cryptoglobe   | CryptoGlobe    | general  | https://www.cryptoglobe.com/latest/feed/ |
| zycrypto      | ZyCrypto       | general  | https://zycrypto.com/feed/               |
| cryptodaily   | Crypto Daily   | general  | https://cryptodaily.co.uk/feed           |
| blockonomi    | Blockonomi     | general  | https://blockonomi.com/feed/             |
| usethebitcoin | UseTheBitcoin  | general  | https://usethebitcoin.com/feed/          |
| nulltx        | NullTX         | general  | https://nulltx.com/feed/                 |
| coinspeaker   | Coinspeaker    | general  | https://www.coinspeaker.com/feed/        |
| cryptoninjas  | CryptoNinjas   | general  | https://www.cryptoninjas.net/feed/       |

### Additional DeFi Sources (7 sources)

| Key            | Name               | Category | RSS URL                                  |
| -------------- | ------------------ | -------- | ---------------------------------------- |
| defipulse      | DeFi Pulse Blog    | defi     | https://defipulse.com/blog/feed/         |
| bankless       | Bankless           | defi     | https://newsletter.banklesshq.com/feed   |
| defillama_news | DefiLlama News     | defi     | https://defillama.com/feed               |
| yearn_blog     | Yearn Finance Blog | defi     | https://blog.yearn.finance/feed          |
| uniswap_blog   | Uniswap Blog       | defi     | https://uniswap.org/blog/feed.xml        |
| aave_blog      | Aave Blog          | defi     | https://aave.mirror.xyz/feed/atom        |
| compound_blog  | Compound Blog      | defi     | https://medium.com/feed/compound-finance |
| makerdao_blog  | MakerDAO Blog      | defi     | https://blog.makerdao.com/feed/          |

### Traditional Finance (2 sources)

| Key              | Name                   | Category | RSS URL                                                           |
| ---------------- | ---------------------- | -------- | ----------------------------------------------------------------- |
| goldman_insights | Goldman Sachs Insights | tradfi   | https://www.goldmansachs.com/insights/feed.rss                    |
| bny_mellon       | BNY Mellon Aerial View | tradfi   | https://www.bnymellon.com/us/en/insights/aerial-view-magazine.rss |

---

## International Sources

### Korean Sources (9 sources)

**Language:** ko | **Region:** asia

| Key                | Name                   | Category | RSS URL                                       |
| ------------------ | ---------------------- | -------- | --------------------------------------------- |
| blockmedia         | Block Media            | general  | https://www.blockmedia.co.kr/feed/            |
| tokenpost          | TokenPost              | general  | https://www.tokenpost.kr/rss                  |
| coindeskkorea      | CoinDesk Korea         | general  | https://www.coindeskkorea.com/feed/           |
| blockchaintoday_ko | Blockchain Today Korea | general  | https://www.blockchaintoday.co.kr/rss/        |
| decenter           | Decenter               | general  | https://decenter.kr/rss/allArticle.xml        |
| thebchain          | The B.Chain            | general  | https://www.thebchain.co.kr/rss/              |
| cryptoquant_blog   | CryptoQuant Blog       | analysis | https://cryptoquant.com/blog/feed/            |
| cobak              | Cobak                  | general  | https://cobak.co.kr/feed/                     |
| upbit_blog         | Upbit Blog             | exchange | https://upbit.com/service_center/notice/feed/ |

### Chinese Sources (10 sources)

**Language:** zh | **Region:** asia

| Key           | Name                     | Category | RSS URL                            |
| ------------- | ------------------------ | -------- | ---------------------------------- |
| 8btc          | 8BTC (巴比特)            | general  | https://www.8btc.com/feed          |
| jinse         | Jinse Finance (金色财经) | general  | https://www.jinse.com/rss          |
| odaily        | Odaily (星球日报)        | general  | https://www.odaily.news/rss        |
| chainnews     | ChainNews (链闻)         | general  | https://www.chainnews.com/rss      |
| panewslab     | PANews (PA财经)          | general  | https://www.panewslab.com/rss      |
| techflow      | TechFlow (深潮)          | general  | https://www.techflowpost.com/rss   |
| foresightnews | Foresight News           | general  | https://foresightnews.pro/rss      |
| blockbeats    | BlockBeats (律动)        | general  | https://www.theblockbeats.info/rss |
| marsbit       | MarsBit (火星财经)       | general  | https://news.marsbit.co/rss        |
| wublockchain  | Wu Blockchain            | analysis | https://wublock.substack.com/feed  |

### Japanese Sources (6 sources)

**Language:** ja | **Region:** asia

| Key             | Name                | Category | RSS URL                             |
| --------------- | ------------------- | -------- | ----------------------------------- |
| coinpost        | CoinPost            | general  | https://coinpost.jp/rss             |
| coindeskjapan   | CoinDesk Japan      | general  | https://www.coindeskjapan.com/feed/ |
| cointelegraphjp | Cointelegraph Japan | general  | https://jp.cointelegraph.com/rss    |
| btcnewsjp       | btcnews.jp          | general  | https://btcnews.jp/feed/            |
| crypto_times_jp | Crypto Times Japan  | general  | https://crypto-times.jp/feed/       |
| coinjinja       | CoinJinja           | general  | https://www.coinjinja.com/feed/     |

### Spanish Sources (5 sources)

**Language:** es | **Region:** latam

| Key             | Name                  | Category | RSS URL                              |
| --------------- | --------------------- | -------- | ------------------------------------ |
| cointelegraphes | Cointelegraph Español | general  | https://es.cointelegraph.com/rss     |
| diariobitcoin   | Diario Bitcoin        | general  | https://www.diariobitcoin.com/feed/  |
| criptonoticias  | CriptoNoticias        | general  | https://www.criptonoticias.com/feed/ |
| beincryptoes    | BeInCrypto Español    | general  | https://es.beincrypto.com/feed/      |
| bitcoinertoday  | Bitcoiner Today       | general  | https://bitcoinertoday.com/feed/     |

### Portuguese Sources (5 sources)

**Language:** pt | **Region:** latam

| Key             | Name                 | Category | RSS URL                                  |
| --------------- | -------------------- | -------- | ---------------------------------------- |
| cointelegraphbr | Cointelegraph Brasil | general  | https://br.cointelegraph.com/rss         |
| livecoins       | Livecoins            | general  | https://livecoins.com.br/feed/           |
| portaldobitcoin | Portal do Bitcoin    | general  | https://portaldobitcoin.uol.com.br/feed/ |
| beincryptopr    | BeInCrypto Brasil    | general  | https://br.beincrypto.com/feed/          |
| bitcoinblock    | Bitcoin Block        | bitcoin  | https://bitcoinblock.com.br/feed/        |

### German Sources (4 sources)

**Language:** de | **Region:** europe

| Key             | Name                  | Category | RSS URL                          |
| --------------- | --------------------- | -------- | -------------------------------- |
| btcecho         | BTC-ECHO              | general  | https://www.btc-echo.de/feed/    |
| cointelegraphde | Cointelegraph Deutsch | general  | https://de.cointelegraph.com/rss |
| coincierge      | Coincierge            | general  | https://coincierge.de/feed/      |
| cryptomonday    | CryptoMonday          | general  | https://cryptomonday.de/feed/    |

### French Sources (4 sources)

**Language:** fr | **Region:** europe

| Key             | Name                 | Category | RSS URL                          |
| --------------- | -------------------- | -------- | -------------------------------- |
| journalducoin   | Journal du Coin      | general  | https://journalducoin.com/feed/  |
| cryptonaute     | Cryptonaute          | general  | https://cryptonaute.fr/feed/     |
| cointelegraphfr | Cointelegraph France | general  | https://fr.cointelegraph.com/rss |
| cryptoast       | Cryptoast            | general  | https://cryptoast.fr/feed/       |

### Russian Sources (3 sources)

**Language:** ru | **Region:** europe

| Key             | Name                 | Category | RSS URL                          |
| --------------- | -------------------- | -------- | -------------------------------- |
| forklog         | ForkLog              | general  | https://forklog.com/feed/        |
| cointelegraphru | Cointelegraph Russia | general  | https://ru.cointelegraph.com/rss |
| bits_media      | Bits.Media           | general  | https://bits.media/rss/          |

### Turkish Sources (3 sources)

**Language:** tr | **Region:** europe

| Key             | Name                 | Category | RSS URL                          |
| --------------- | -------------------- | -------- | -------------------------------- |
| cointelegraphtr | Cointelegraph Türkçe | general  | https://tr.cointelegraph.com/rss |
| koinmedya       | Koin Medya           | general  | https://koinmedya.com/feed/      |
| coinsider       | Coinsider            | general  | https://coinsider.com.tr/feed/   |

### Italian Sources (3 sources)

**Language:** it | **Region:** europe

| Key             | Name                 | Category | RSS URL                           |
| --------------- | -------------------- | -------- | --------------------------------- |
| cointelegraphit | Cointelegraph Italia | general  | https://it.cointelegraph.com/rss  |
| cryptonomist    | The Cryptonomist     | general  | https://it.cryptonomist.ch/feed/  |
| criptovaluteit  | Criptovalute.it      | general  | https://www.criptovalute.it/feed/ |

### Indonesian Sources (3 sources)

**Language:** id | **Region:** asia (SEA)

| Key             | Name                    | Category  | RSS URL                           |
| --------------- | ----------------------- | --------- | --------------------------------- |
| cointelegraphid | Cointelegraph Indonesia | general   | https://id.cointelegraph.com/rss  |
| blockchainmedia | Blockchain Media        | general   | https://blockchainmedia.id/feed/  |
| pintu_academy   | Pintu Academy           | education | https://pintu.co.id/academy/feed/ |

### Dutch Sources (2 sources)

**Language:** nl | **Region:** europe

| Key                | Name                | Category | RSS URL                              |
| ------------------ | ------------------- | -------- | ------------------------------------ |
| bitcoinmagazine_nl | Bitcoin Magazine NL | bitcoin  | https://bitcoinmagazine.nl/feed/     |
| crypto_insiders    | Crypto Insiders     | general  | https://www.crypto-insiders.nl/feed/ |

### Polish Sources (2 sources)

**Language:** pl | **Region:** europe

| Key          | Name            | Category | RSS URL                       |
| ------------ | --------------- | -------- | ----------------------------- |
| kryptowaluty | Kryptowaluty.pl | general  | https://kryptowaluty.pl/feed/ |
| bitcoin_pl   | Bitcoin.pl      | bitcoin  | https://bitcoin.pl/feed/      |

### Vietnamese Sources (2 sources)

**Language:** vi | **Region:** asia (SEA)

| Key           | Name            | Category | RSS URL                        |
| ------------- | --------------- | -------- | ------------------------------ |
| tapchibitcoin | Tạp chí Bitcoin | general  | https://tapchibitcoin.io/feed/ |
| coin68        | Coin68          | general  | https://coin68.com/feed/       |

### Thai Sources (2 sources)

**Language:** th | **Region:** asia (SEA)

| Key             | Name                    | Category | RSS URL                          |
| --------------- | ----------------------- | -------- | -------------------------------- |
| siamblockchain  | Siam Blockchain         | general  | https://siamblockchain.com/feed/ |
| bitcoinaddictth | Bitcoin Addict Thailand | general  | https://bitcoinaddict.org/feed/  |

### Arabic Sources (2 sources)

**Language:** ar | **Region:** mena

| Key             | Name                 | Category | RSS URL                          |
| --------------- | -------------------- | -------- | -------------------------------- |
| cointelegraphar | Cointelegraph Arabic | general  | https://ar.cointelegraph.com/rss |
| arabicrypto     | ArabiCrypto          | general  | https://arabicrypto.io/feed/     |

### Hindi/Indian Sources (5 sources)

**Language:** hi | **Region:** asia

| Key             | Name                  | Category | RSS URL                           |
| --------------- | --------------------- | -------- | --------------------------------- |
| coinswitch      | CoinSwitch Kuber Blog | general  | https://coinswitch.co/blog/feed   |
| coindcx         | CoinDCX Blog          | general  | https://coindcx.com/blog/feed/    |
| wazirx          | WazirX Blog           | general  | https://wazirx.com/blog/feed/     |
| zebpay          | ZebPay Blog           | general  | https://zebpay.com/blog/feed/     |
| cryptonewsindia | Crypto News India     | general  | https://cryptonewsindia.com/feed/ |

### Persian/Farsi Sources (4 sources)

**Language:** fa | **Region:** mena

| Key             | Name                            | Category | RSS URL                           |
| --------------- | ------------------------------- | -------- | --------------------------------- |
| arzdigital      | Arz Digital (ارز دیجیتال)       | general  | https://arzdigital.com/feed/      |
| mihanblockchain | Mihan Blockchain (میهن بلاکچین) | general  | https://mihanblockchain.com/feed/ |
| ramzarz         | Ramz Arz (رمزارز)               | general  | https://ramzarz.news/feed/        |
| nobitex         | Nobitex Blog                    | general  | https://nobitex.ir/blog/feed/     |

---

## Source Categories

### English Source Categories (21 unique categories)

| Category ID   | Display Name  | Description                                | Source Count |
| ------------- | ------------- | ------------------------------------------ | ------------ |
| general       | General       | Broad crypto industry news                 | 25           |
| defi          | DeFi          | Decentralized finance protocols and yields | 12           |
| bitcoin       | Bitcoin       | Bitcoin-specific news and analysis         | 5            |
| ethereum      | Ethereum      | Ethereum ecosystem news                    | 4            |
| research      | Research      | Deep-dive analysis and reports             | 7            |
| institutional | Institutional | VC and institutional investor insights     | 8            |
| etf           | ETFs          | Crypto ETF and asset manager news          | 7            |
| layer2        | Layer 2       | L2 scaling solutions                       | 7            |
| trading       | Trading       | Market analysis and trading                | 6            |
| security      | Security      | Smart contract security and auditing       | 6            |
| developer     | Developer     | Developer tools and tech                   | 6            |
| mainstream    | Mainstream    | Major media crypto coverage                | 7            |
| nft           | NFTs          | Non-fungible tokens and collectibles       | 5            |
| altl1         | Alt L1s       | Alternative layer-1 blockchains            | 7            |
| mining        | Mining        | Bitcoin mining and hashrate                | 3            |
| onchain       | On-Chain      | Blockchain data and analytics              | 5            |
| fintech       | Fintech       | Financial technology and payments          | 3            |
| macro         | Macro         | Macroeconomic analysis                     | 3            |
| quant         | Quant         | Quantitative trading research              | 5            |
| journalism    | Investigative | In-depth journalism                        | 3            |
| asia          | Asia          | Asian market coverage                      | 2            |
| tradfi        | TradFi        | Traditional finance                        | 2            |
| gaming        | Gaming        | Blockchain gaming                          | 1            |
| stablecoin    | Stablecoins   | Stablecoin and CBDC news                   | 2            |
| derivatives   | Derivatives   | Options and futures                        | 1            |
| solana        | Solana        | Solana ecosystem                           | 1            |

### International Source Categories

| Category ID | Description              | Usage                     |
| ----------- | ------------------------ | ------------------------- |
| general     | General crypto news      | Most common (90%+)        |
| analysis    | Market/on-chain analysis | Korean, Chinese sources   |
| exchange    | Exchange announcements   | Korean sources            |
| education   | Educational content      | Indonesian sources        |
| bitcoin     | Bitcoin-focused          | Portuguese, Dutch, Polish |

---

## Data Fetching Logic

### 1. Feed Fetching (`fetchFeed`)

**Location:** `/src/lib/crypto-news.ts` (lines 957-988)

```
Flow:
1. Check cache first (key: `feed:{sourceKey}`)
2. If cache miss, fetch RSS feed with:
   - 10 second timeout (AbortController)
   - Custom User-Agent header
   - Accept headers for RSS/XML
3. Parse RSS XML using regex patterns
4. Sanitize HTML in descriptions (max 200 chars)
5. Cache result for 180 seconds (3 minutes)
6. Return parsed NewsArticle array
```

### 2. Multiple Source Fetching (`fetchMultipleSources`)

**Location:** `/src/lib/crypto-news.ts` (lines 990-1005)

```
- Uses Promise.allSettled for parallel fetching
- Aggregates results from all fulfilled promises
- Sorts articles by publication date (newest first)
- Failed sources are silently ignored
```

### 3. International Feed Fetching (`fetchInternationalFeed`)

**Location:** `/src/lib/international-sources.ts` (lines 1039-1100)

```
Flow:
1. Check source health (skip if 3+ consecutive failures)
2. Check cache (key: `intl-feed:{sourceKey}`)
3. Fetch with 15 second timeout (longer for international)
4. Handle encoding detection (UTF-8, GBK for Chinese)
5. Parse RSS with enhanced regex (supports Atom)
6. Record source health result
7. Cache result for 300 seconds (5 minutes)
```

### 4. Caching Strategy

**Location:** `/src/lib/cache.ts`

| Cache Type       | Instance               | Max Size    | Purpose           |
| ---------------- | ---------------------- | ----------- | ----------------- |
| newsCache        | `new MemoryCache(500)` | 500 entries | RSS feed cache    |
| aiCache          | `new MemoryCache(200)` | 200 entries | AI response cache |
| translationCache | `new MemoryCache(300)` | 300 entries | Translation cache |
| cache            | `new MemoryCache(500)` | 500 entries | General purpose   |

**Cache TTLs:**

- English feeds: 180 seconds (3 minutes)
- International feeds: 300 seconds (5 minutes)
- Translations: 604,800 seconds (7 days)
- API revalidation: 300 seconds (5 minutes)

**Cache Features:**

- Automatic expiration cleanup (every 60 seconds)
- LRU eviction when at max capacity
- Cache statistics API
- `withCache()` wrapper for async functions

### 5. Rate Limiting

**Location:** `/src/lib/source-translator.ts` (lines 35-47)

```
- Translation API: 1 request per second minimum
- Implemented via timestamp tracking
- Automatic wait before each translation call
```

### 6. Source Health Tracking

**Location:** `/src/lib/international-sources.ts` (lines 1006-1037)

```
- Track consecutive failures per source
- Mark unhealthy after 3 failures
- Auto-reset after 1 hour
- Provides health stats API
```

### 7. Deduplication Logic

**Location:** `/src/lib/international-sources.ts` (lines 1115-1130)

```
- Deduplication by article link URL
- Uses Set to track seen links
- Applied during multi-source aggregation
```

### 8. Translation Pipeline

**Location:** `/src/lib/source-translator.ts`

```
Flow:
1. Check for GROQ_API_KEY
2. Separate cached vs uncached articles
3. Batch uncached (10 articles per batch)
4. Group by language for accurate translation
5. Call Groq API (llama-3.3-70b-versatile model)
6. Parse JSON response
7. Cache translations for 7 days
8. Merge cached and new translations
9. Return enriched articles with titleEnglish/descriptionEnglish
```

---

## API Endpoints for News

### 1. GET `/api/news`

**File:** `/src/app/api/news/route.ts`

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 10 | Number of articles (max 50) |
| source | string | all | Specific source key |
| category | string | all | Filter by category |
| from | string | - | Start date (ISO format) |
| to | string | - | End date (ISO format) |
| page | number | 1 | Pagination page |
| per_page | number | limit | Items per page |
| lang | string | en | Target language for translation |

**Response Format:**

```json
{
  "articles": [
    {
      "title": "string",
      "link": "string",
      "description": "string",
      "pubDate": "ISO string",
      "source": "string",
      "sourceKey": "string",
      "category": "string",
      "timeAgo": "string"
    }
  ],
  "totalCount": 100,
  "sources": ["CoinDesk", "The Block"],
  "fetchedAt": "ISO string",
  "lang": "en",
  "availableLanguages": ["en", "es", "de", ...],
  "availableCategories": ["general", "bitcoin", ...],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "totalPages": 10,
    "hasMore": true
  }
}
```

### 2. GET `/api/news/international`

**File:** `/src/app/api/news/international/route.ts`

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| language | string | all | ko, zh, ja, es, pt, de, fr, ru, tr, it, nl, pl, id, vi, th, ar, all |
| region | string | all | asia, europe, latam, mena, sea, all |
| limit | number | 20 | Number of articles (max 100) |
| translate | boolean | false | Enable English translation |
| sources | boolean | false | Return source list instead of articles |

**Response Format:**

```json
{
  "articles": [
    {
      "id": "string",
      "title": "string",
      "titleEnglish": "string (if translated)",
      "description": "string",
      "descriptionEnglish": "string (if translated)",
      "link": "string",
      "source": "string",
      "sourceKey": "string",
      "language": "ko",
      "pubDate": "ISO string",
      "category": "string",
      "region": "asia",
      "timeAgo": "string"
    }
  ],
  "meta": {
    "total": 50,
    "languages": ["ko", "zh"],
    "regions": ["asia"],
    "translationEnabled": true,
    "translationAvailable": true,
    "translated": true
  }
}
```

### 3. GET `/api/news/categories`

**File:** `/src/app/api/news/categories/route.ts`

**Response Format:**

```json
{
  "categories": [
    {
      "id": "general",
      "name": "General",
      "description": "Broad crypto industry news",
      "sourceCount": 25
    }
  ],
  "usage": {
    "example": "/api/news?category=institutional",
    "description": "Use the category parameter to filter news by category"
  }
}
```

### 4. POST `/api/news/extract`

**File:** `/src/app/api/news/extract/route.ts`

**Request Body:**

```json
{
  "url": "https://example.com/article"
}
```

**Response Format:**

```json
{
  "url": "string",
  "title": "string",
  "content": "string (max 10000 chars)",
  "author": "string",
  "published_date": "ISO string",
  "word_count": 1500,
  "reading_time_minutes": 8
}
```

### 5. GET `/api/rss`

**File:** `/src/app/api/rss/route.ts`

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| feed | string | all | all, defi, bitcoin |
| limit | number | 20 | Number of articles (max 50) |

**Response:** RSS 2.0 XML feed

### 6. GET `/api/opml`

**File:** `/src/app/api/opml/route.ts`

**Response:** OPML 2.0 file for RSS reader import

### 7. GET `/api/sources`

**File:** `/src/app/api/sources/route.ts`

**Response Format:**

```json
{
  "sources": [
    {
      "key": "coindesk",
      "name": "CoinDesk",
      "url": "https://...",
      "category": "general",
      "status": "active" | "unavailable"
    }
  ]
}
```

### 8. GET `/api/bitcoin`

**File:** `/src/app/api/bitcoin/route.ts`

Bitcoin-specific news from sources with category "bitcoin" and keyword matching.

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 10 | Number of articles |
| lang | string | en | Language code for translation |

**Cache:** 5 minutes (revalidate: 300)

### 9. GET `/api/defi`

**File:** `/src/app/api/defi/route.ts`

DeFi-specific news from sources with category "defi" and keyword matching.

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 10 | Number of articles |
| lang | string | en | Language code for translation |

**Cache:** 5 minutes (revalidate: 300)

### 10. GET `/api/breaking`

**File:** `/src/app/api/breaking/route.ts`

Latest breaking news (articles from last 2 hours).

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 5 | Number of articles |
| lang | string | en | Language code for translation |

**Cache:** 1 minute (revalidate: 60) - faster refresh for breaking news

### 11. GET `/api/search`

**File:** `/src/app/api/search/route.ts`

Search news by keywords across all sources.

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| q | string | **required** | Search keywords (comma-separated) |
| limit | number | 10 | Number of results (max 30) |
| lang | string | en | Language code for translation |

**Cache:** 1 minute (revalidate: 60)

### 12. GET `/api/trending`

**File:** `/src/app/api/trending/route.ts`

Trending topics extracted from recent news with sentiment analysis.

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 10 | Number of trending topics |

**Tracked Topics:** Bitcoin, Ethereum, Solana, XRP, Cardano, Dogecoin, Polygon, Avalanche, Chainlink, DeFi, NFTs, ETF, SEC/Regulation, Stablecoins, Layer 2, AI, Security, Airdrops, Memecoins, Binance, Coinbase, Institutions

**Response Format:**

```json
{
  "topics": [
    {
      "topic": "Bitcoin",
      "count": 45,
      "sentiment": "bullish",
      "recentHeadlines": ["Bitcoin Surges...", "BTC Hits..."]
    }
  ]
}
```

**Cache:** 5 minutes (revalidate: 300)

---

## Source Statistics

### Summary Counts

| Metric                               | Count                             |
| ------------------------------------ | --------------------------------- |
| **Total English Sources**            | 116                               |
| **Total International Sources**      | 74                                |
| **Total All Sources**                | 190                               |
| **Total Languages**                  | 19 (1 English + 18 International) |
| **Total Regions**                    | 5                                 |
| **Total Categories (English)**       | 21                                |
| **Total Categories (International)** | 5                                 |

### International Sources by Language

| Language      | Code | Sources | Region |
| ------------- | ---- | ------- | ------ |
| Korean        | ko   | 9       | asia   |
| Chinese       | zh   | 10      | asia   |
| Japanese      | ja   | 6       | asia   |
| Spanish       | es   | 5       | latam  |
| Portuguese    | pt   | 5       | latam  |
| German        | de   | 4       | europe |
| French        | fr   | 4       | europe |
| Russian       | ru   | 3       | europe |
| Turkish       | tr   | 3       | europe |
| Italian       | it   | 3       | europe |
| Indonesian    | id   | 3       | sea    |
| Dutch         | nl   | 2       | europe |
| Polish        | pl   | 2       | europe |
| Vietnamese    | vi   | 2       | sea    |
| Thai          | th   | 2       | sea    |
| Arabic        | ar   | 2       | mena   |
| Hindi         | hi   | 5       | asia   |
| Persian/Farsi | fa   | 4       | mena   |
| **Total**     |      | **74**  |        |

### International Sources by Region

| Region | Full Name                  | Languages                  | Sources |
| ------ | -------------------------- | -------------------------- | ------- |
| asia   | East Asia + India          | ko, zh, ja, hi             | 30      |
| europe | Europe                     | de, fr, ru, tr, it, nl, pl | 21      |
| latam  | Latin America              | es, pt                     | 10      |
| mena   | Middle East & North Africa | ar, fa                     | 6       |
| sea    | Southeast Asia             | id, vi, th                 | 7       |

### English Sources by Category

| Category      | Source Count |
| ------------- | ------------ |
| general       | 25           |
| defi          | 12           |
| institutional | 8            |
| etf           | 7            |
| layer2        | 7            |
| altl1         | 7            |
| mainstream    | 7            |
| research      | 7            |
| trading       | 6            |
| security      | 6            |
| developer     | 6            |
| onchain       | 5            |
| bitcoin       | 5            |
| quant         | 5            |
| nft           | 5            |
| ethereum      | 4            |
| fintech       | 3            |
| macro         | 3            |
| mining        | 3            |
| journalism    | 3            |
| asia          | 2            |
| tradfi        | 2            |
| stablecoin    | 2            |
| gaming        | 1            |
| derivatives   | 1            |
| solana        | 1            |

---

## Appendix: File Summary

| File                                       | Lines | Purpose                           |
| ------------------------------------------ | ----- | --------------------------------- |
| `/src/lib/crypto-news.ts`                  | 1,437 | Main RSS sources & fetching logic |
| `/src/lib/international-sources.ts`        | 1,303 | International sources & fetching  |
| `/src/lib/source-translator.ts`            | 403   | Groq-based translation            |
| `/src/lib/cache.ts`                        | 165   | In-memory caching                 |
| `/src/app/api/news/route.ts`               | 77    | Main news API                     |
| `/src/app/api/news/international/route.ts` | 166   | International news API            |
| `/src/app/api/news/categories/route.ts`    | 36    | Categories API                    |
| `/src/app/api/news/extract/route.ts`       | 79    | Article extraction                |
| `/src/app/api/bitcoin/route.ts`            | 62    | Bitcoin news API                  |
| `/src/app/api/defi/route.ts`               | ~62   | DeFi news API                     |
| `/src/app/api/breaking/route.ts`           | 62    | Breaking news API                 |
| `/src/app/api/search/route.ts`             | 69    | Search API                        |
| `/src/app/api/trending/route.ts`           | 122   | Trending topics API               |
| `/src/app/api/rss/route.ts`                | 82    | RSS feed generation               |
| `/src/app/api/opml/route.ts`               | 51    | OPML export                       |
| `/src/app/api/sources/route.ts`            | 22    | Source status                     |

---

## Documentation Cross-Reference

The following existing documentation files were consulted:

| Document                        | Relevant Sections                                                               |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `/docs/API.md`                  | Full API reference (4,101 lines) - confirms 75 international sources documented |
| `/docs/INTERNATIONALIZATION.md` | i18n guide (571 lines) - confirms 18 languages, 75 sources                      |

**Note:** Documentation claims 75 international sources, but code contains 74. This is a minor discrepancy.

---

_End of Audit Document_
