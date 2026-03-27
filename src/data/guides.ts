/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

export interface GuideSeries {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  articles: GuideArticle[];
  estimatedTime: string;
}

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  order: number;
  readingTime: string;
}

export const GUIDE_SERIES: GuideSeries[] = [
  {
    slug: 'bitcoin-for-beginners',
    title: 'Bitcoin for Beginners',
    icon: '₿',
    color: '#F7931A',
    difficulty: 'beginner',
    description:
      'Everything you need to know about Bitcoin — from how it works to how to buy your first satoshi.',
    estimatedTime: '45 min',
    articles: [
      {
        slug: 'what-is-bitcoin',
        title: 'What is Bitcoin?',
        description:
          "An introduction to Bitcoin: the world's first cryptocurrency and decentralized digital money.",
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'how-bitcoin-works',
        title: 'How Bitcoin Works',
        description: 'Understand the blockchain, mining, and the technology that powers Bitcoin.',
        order: 2,
        readingTime: '8 min',
      },
      {
        slug: 'bitcoin-mining-explained',
        title: 'Bitcoin Mining Explained',
        description: 'How miners secure the network, earn rewards, and why energy usage matters.',
        order: 3,
        readingTime: '7 min',
      },
      {
        slug: 'how-to-buy-bitcoin',
        title: 'How to Buy Bitcoin',
        description: 'A step-by-step guide to purchasing your first Bitcoin safely.',
        order: 4,
        readingTime: '6 min',
      },
      {
        slug: 'bitcoin-wallets-guide',
        title: 'Bitcoin Wallets: A Complete Guide',
        description:
          'Choose the right wallet for your needs — hot wallets, cold storage, and best practices.',
        order: 5,
        readingTime: '6 min',
      },
      {
        slug: 'bitcoin-halving-explained',
        title: 'What is the Bitcoin Halving?',
        description:
          "How the halving event works and why it matters for Bitcoin's price and supply.",
        order: 6,
        readingTime: '5 min',
      },
      {
        slug: 'bitcoin-vs-traditional-finance',
        title: 'Bitcoin vs Traditional Finance',
        description:
          'Compare Bitcoin with banks, gold, and fiat currencies to understand its unique value proposition.',
        order: 7,
        readingTime: '6 min',
      },
    ],
  },
  {
    slug: 'ethereum-for-beginners',
    title: 'Ethereum for Beginners',
    icon: '⟠',
    color: '#627EEA',
    difficulty: 'beginner',
    description:
      "Understand Ethereum, smart contracts, and why it's the backbone of DeFi and NFTs.",
    estimatedTime: '40 min',
    articles: [
      {
        slug: 'what-is-ethereum',
        title: 'What is Ethereum?',
        description:
          'An introduction to the programmable blockchain that powers smart contracts and dApps.',
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'smart-contracts-explained',
        title: 'Smart Contracts Explained',
        description:
          'How self-executing code on the blockchain automates agreements without middlemen.',
        order: 2,
        readingTime: '7 min',
      },
      {
        slug: 'ethereum-gas-fees',
        title: 'Understanding Gas Fees',
        description:
          'What gas is, how fees are calculated, and tips for reducing transaction costs.',
        order: 3,
        readingTime: '6 min',
      },
      {
        slug: 'erc20-tokens-explained',
        title: 'ERC-20 Tokens Explained',
        description: 'The token standard that powers thousands of cryptocurrencies on Ethereum.',
        order: 4,
        readingTime: '6 min',
      },
      {
        slug: 'ethereum-staking-guide',
        title: 'How to Stake Ethereum',
        description:
          'Earn rewards by staking ETH — solo staking, pools, and liquid staking options.',
        order: 5,
        readingTime: '7 min',
      },
      {
        slug: 'ethereum-roadmap',
        title: 'The Ethereum Roadmap',
        description: "From the Merge to Danksharding: what's next for Ethereum's development.",
        order: 6,
        readingTime: '7 min',
      },
    ],
  },
  {
    slug: 'defi-101',
    title: 'DeFi 101',
    icon: '🏦',
    color: '#00D395',
    difficulty: 'intermediate',
    description:
      'Master decentralized finance: lending, borrowing, yield farming, DEXs, and liquidity pools.',
    estimatedTime: '60 min',
    articles: [
      {
        slug: 'what-is-defi',
        title: 'What is DeFi?',
        description:
          'An introduction to decentralized finance and how it reimagines traditional banking.',
        order: 1,
        readingTime: '8 min',
      },
      {
        slug: 'decentralized-exchanges',
        title: 'DEXs: How Decentralized Exchanges Work',
        description: 'Uniswap, SushiSwap, and the AMM model that powers trustless token swaps.',
        order: 2,
        readingTime: '8 min',
      },
      {
        slug: 'yield-farming-guide',
        title: 'Yield Farming: A Complete Guide',
        description: 'How to earn rewards by providing liquidity to DeFi protocols.',
        order: 3,
        readingTime: '9 min',
      },
      {
        slug: 'liquidity-pools-explained',
        title: 'Liquidity Pools Explained',
        description: 'How pooled assets enable decentralized trading and what LP tokens represent.',
        order: 4,
        readingTime: '7 min',
      },
      {
        slug: 'impermanent-loss',
        title: 'Understanding Impermanent Loss',
        description: 'The hidden cost of liquidity provision and how to minimize it.',
        order: 5,
        readingTime: '8 min',
      },
      {
        slug: 'defi-lending-borrowing',
        title: 'DeFi Lending & Borrowing',
        description:
          'How protocols like Aave and Compound let you earn interest or borrow against collateral.',
        order: 6,
        readingTime: '8 min',
      },
      {
        slug: 'defi-risks',
        title: 'DeFi Risks: What to Watch Out For',
        description: 'Smart contract exploits, rug pulls, oracle attacks, and how to stay safe.',
        order: 7,
        readingTime: '7 min',
      },
    ],
  },
  {
    slug: 'trading-for-beginners',
    title: 'Trading for Beginners',
    icon: '📈',
    color: '#2962FF',
    difficulty: 'beginner',
    description:
      'Learn crypto trading basics: order types, chart reading, risk management, and common strategies.',
    estimatedTime: '50 min',
    articles: [
      {
        slug: 'crypto-trading-fundamentals',
        title: 'Crypto Trading Fundamentals',
        description: 'The basics of buying, selling, and trading cryptocurrencies on exchanges.',
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'order-types-explained',
        title: 'Order Types Explained',
        description: 'Market, limit, stop-loss, and take-profit orders — when and how to use each.',
        order: 2,
        readingTime: '7 min',
      },
      {
        slug: 'reading-crypto-charts',
        title: 'How to Read Crypto Charts',
        description: 'Candlestick patterns, support/resistance, volume, and moving averages.',
        order: 3,
        readingTime: '9 min',
      },
      {
        slug: 'risk-management-guide',
        title: 'Risk Management for Traders',
        description:
          'Position sizing, stop-losses, portfolio allocation, and protecting your capital.',
        order: 4,
        readingTime: '8 min',
      },
      {
        slug: 'trading-strategies-intro',
        title: 'Common Trading Strategies',
        description: 'DCA, swing trading, scalping, and HODLing — find the approach that fits you.',
        order: 5,
        readingTime: '8 min',
      },
      {
        slug: 'trading-mistakes-to-avoid',
        title: 'Trading Mistakes to Avoid',
        description:
          'FOMO, revenge trading, over-leveraging, and other costly errors beginners make.',
        order: 6,
        readingTime: '6 min',
      },
    ],
  },
  {
    slug: 'nfts-explained',
    title: 'NFTs Explained',
    icon: '🎨',
    color: '#FF6B6B',
    difficulty: 'beginner',
    description:
      'Non-fungible tokens demystified: what they are, how to buy and sell, and what gives them value.',
    estimatedTime: '35 min',
    articles: [
      {
        slug: 'what-are-nfts',
        title: 'What are NFTs?',
        description: 'Unique digital assets on the blockchain — how they work and why they matter.',
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'how-to-buy-nfts',
        title: 'How to Buy and Sell NFTs',
        description:
          'A step-by-step guide to NFT marketplaces, wallets, and making your first purchase.',
        order: 2,
        readingTime: '7 min',
      },
      {
        slug: 'nft-use-cases',
        title: 'NFT Use Cases Beyond Art',
        description:
          'Gaming, music, real-world assets, identity, and other real-world NFT applications.',
        order: 3,
        readingTime: '7 min',
      },
      {
        slug: 'nft-valuation',
        title: 'What Gives NFTs Value?',
        description: 'Rarity, utility, community, and provenance: understanding NFT pricing.',
        order: 4,
        readingTime: '6 min',
      },
      {
        slug: 'nft-risks-scams',
        title: 'NFT Risks and Scams',
        description: 'Wash trading, rug pulls, and how to evaluate projects before buying.',
        order: 5,
        readingTime: '6 min',
      },
    ],
  },
  {
    slug: 'web3-for-beginners',
    title: 'Web3 for Beginners',
    icon: '🌐',
    color: '#7C3AED',
    difficulty: 'beginner',
    description:
      'The next generation of the internet: decentralized apps, identity, storage, and governance.',
    estimatedTime: '40 min',
    articles: [
      {
        slug: 'what-is-web3',
        title: 'What is Web3?',
        description: 'From Web1 to Web3: how the internet is evolving toward decentralization.',
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'dapps-explained',
        title: 'Decentralized Apps (dApps) Explained',
        description:
          'How dApps differ from traditional apps and what makes them censorship-resistant.',
        order: 2,
        readingTime: '7 min',
      },
      {
        slug: 'web3-wallets-identity',
        title: 'Web3 Wallets and Digital Identity',
        description: 'How your wallet becomes your identity in the decentralized web.',
        order: 3,
        readingTime: '6 min',
      },
      {
        slug: 'decentralized-storage',
        title: 'Decentralized Storage',
        description: 'IPFS, Arweave, and Filecoin: storing data without centralized servers.',
        order: 4,
        readingTime: '6 min',
      },
      {
        slug: 'web3-social-media',
        title: 'Web3 Social Media',
        description: 'Lens Protocol, Farcaster, and the future of decentralized social platforms.',
        order: 5,
        readingTime: '6 min',
      },
      {
        slug: 'web3-challenges',
        title: 'Web3 Challenges and Criticisms',
        description: 'Scalability, UX, adoption barriers, and honest critiques of the Web3 vision.',
        order: 6,
        readingTime: '7 min',
      },
    ],
  },
  {
    slug: 'crypto-security',
    title: 'Crypto Security & Scams',
    icon: '🛡️',
    color: '#EF4444',
    difficulty: 'beginner',
    description:
      'Protect your crypto: common scams, security best practices, and how to avoid losing funds.',
    estimatedTime: '30 min',
    articles: [
      {
        slug: 'crypto-security-basics',
        title: 'Crypto Security Basics',
        description:
          'Essential practices for keeping your cryptocurrency safe from theft and loss.',
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'common-crypto-scams',
        title: 'Common Crypto Scams',
        description:
          'Phishing, rug pulls, Ponzi schemes, and social engineering attacks to watch for.',
        order: 2,
        readingTime: '8 min',
      },
      {
        slug: 'seed-phrase-security',
        title: 'Seed Phrase Security',
        description: 'How to properly store and protect the master key to your crypto.',
        order: 3,
        readingTime: '5 min',
      },
      {
        slug: 'smart-contract-risks',
        title: 'Smart Contract Risks',
        description:
          'Understanding audit reports, exploit vectors, and how to evaluate contract safety.',
        order: 4,
        readingTime: '7 min',
      },
      {
        slug: 'exchange-security',
        title: 'Exchange Security Best Practices',
        description: '2FA, withdrawal whitelists, and choosing a secure exchange.',
        order: 5,
        readingTime: '5 min',
      },
    ],
  },
  {
    slug: 'crypto-regulation',
    title: 'Crypto Regulation Guide',
    icon: '⚖️',
    color: '#6366F1',
    difficulty: 'intermediate',
    description:
      'Navigate the regulatory landscape: SEC, MiCA, tax requirements, and compliance basics.',
    estimatedTime: '35 min',
    articles: [
      {
        slug: 'crypto-regulation-overview',
        title: 'Crypto Regulation Overview',
        description:
          'The global regulatory landscape for cryptocurrency — who regulates what and where.',
        order: 1,
        readingTime: '8 min',
      },
      {
        slug: 'us-crypto-regulation',
        title: 'US Crypto Regulation',
        description: 'SEC, CFTC, and the evolving legal framework for digital assets in America.',
        order: 2,
        readingTime: '8 min',
      },
      {
        slug: 'eu-mica-regulation',
        title: 'EU MiCA Regulation Explained',
        description: 'The Markets in Crypto-Assets regulation and what it means for the industry.',
        order: 3,
        readingTime: '7 min',
      },
      {
        slug: 'crypto-taxes-guide',
        title: 'Crypto Taxes: What You Need to Know',
        description: 'Capital gains, reporting requirements, and tax tools for crypto investors.',
        order: 4,
        readingTime: '7 min',
      },
      {
        slug: 'kyc-aml-explained',
        title: 'KYC and AML in Crypto',
        description:
          'Know Your Customer and Anti-Money Laundering rules that apply to crypto businesses.',
        order: 5,
        readingTime: '6 min',
      },
    ],
  },
  {
    slug: 'layer-2-scaling',
    title: 'Layer 2 & Scaling',
    icon: '🔗',
    color: '#06B6D4',
    difficulty: 'intermediate',
    description:
      'Rollups, sidechains, and scaling: how Layer 2 solutions make blockchains faster and cheaper.',
    estimatedTime: '40 min',
    articles: [
      {
        slug: 'blockchain-scaling-problem',
        title: 'The Blockchain Scaling Problem',
        description:
          'Why blockchains are slow, the trilemma, and approaches to solving scalability.',
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'what-are-layer-2s',
        title: 'What are Layer 2 Solutions?',
        description: 'How L2s inherit security from L1s while processing transactions off-chain.',
        order: 2,
        readingTime: '7 min',
      },
      {
        slug: 'optimistic-rollups',
        title: 'Optimistic Rollups Explained',
        description:
          'How Optimism and Arbitrum use fraud proofs for cheaper Ethereum transactions.',
        order: 3,
        readingTime: '7 min',
      },
      {
        slug: 'zk-rollups',
        title: 'ZK-Rollups Explained',
        description:
          'Zero-knowledge proofs, zkSync, StarkNet, and the future of rollup technology.',
        order: 4,
        readingTime: '8 min',
      },
      {
        slug: 'bridges-explained',
        title: 'Blockchain Bridges Explained',
        description:
          'How to move assets between chains, bridge risks, and security considerations.',
        order: 5,
        readingTime: '7 min',
      },
      {
        slug: 'choosing-layer-2',
        title: 'Choosing the Right Layer 2',
        description: 'Compare Arbitrum, Optimism, Base, zkSync, and other L2s for your needs.',
        order: 6,
        readingTime: '6 min',
      },
    ],
  },
  {
    slug: 'stablecoins-guide',
    title: 'Stablecoins Guide',
    icon: '💵',
    color: '#22C55E',
    difficulty: 'beginner',
    description:
      'USDT, USDC, DAI and beyond: how stablecoins work and their role in the crypto economy.',
    estimatedTime: '25 min',
    articles: [
      {
        slug: 'what-are-stablecoins',
        title: 'What are Stablecoins?',
        description: 'Digital dollars on the blockchain: how stablecoins maintain their peg.',
        order: 1,
        readingTime: '6 min',
      },
      {
        slug: 'types-of-stablecoins',
        title: 'Types of Stablecoins',
        description:
          'Fiat-backed, crypto-backed, algorithmic, and commodity-backed stablecoins compared.',
        order: 2,
        readingTime: '7 min',
      },
      {
        slug: 'stablecoin-risks',
        title: 'Stablecoin Risks',
        description: 'Depegging, regulatory threats, and counterparty risks in stablecoins.',
        order: 3,
        readingTime: '6 min',
      },
      {
        slug: 'stablecoins-in-defi',
        title: 'Stablecoins in DeFi',
        description:
          'How stablecoins power lending, trading, and yield farming in decentralized finance.',
        order: 4,
        readingTime: '6 min',
      },
    ],
  },
  {
    slug: 'daos-governance',
    title: 'DAOs & Governance',
    icon: '🏛️',
    color: '#F59E0B',
    difficulty: 'intermediate',
    description:
      'Decentralized autonomous organizations: voting, proposals, treasury management, and participation.',
    estimatedTime: '30 min',
    articles: [
      {
        slug: 'what-are-daos',
        title: 'What are DAOs?',
        description:
          'Decentralized organizations governed by token holders through smart contracts.',
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'dao-governance-models',
        title: 'DAO Governance Models',
        description:
          'Token voting, conviction voting, quadratic voting, and other governance mechanisms.',
        order: 2,
        readingTime: '7 min',
      },
      {
        slug: 'participating-in-daos',
        title: 'How to Participate in a DAO',
        description: 'Voting, delegating, writing proposals, and contributing to DAOs.',
        order: 3,
        readingTime: '6 min',
      },
      {
        slug: 'dao-treasury-management',
        title: 'DAO Treasury Management',
        description:
          'How DAOs manage billions in community-owned funds and the challenges involved.',
        order: 4,
        readingTime: '6 min',
      },
      {
        slug: 'dao-challenges',
        title: 'DAO Challenges and Limitations',
        description: 'Voter apathy, plutocracy risks, legal status, and scaling governance.',
        order: 5,
        readingTime: '5 min',
      },
    ],
  },
  {
    slug: 'ai-and-crypto',
    title: 'AI & Crypto',
    icon: '🧠',
    color: '#EC4899',
    difficulty: 'intermediate',
    description:
      'The intersection of artificial intelligence and blockchain: AI tokens, decentralized compute, and AI agents.',
    estimatedTime: '35 min',
    articles: [
      {
        slug: 'ai-crypto-intersection',
        title: 'Where AI Meets Crypto',
        description: 'How artificial intelligence and blockchain technology are converging.',
        order: 1,
        readingTime: '7 min',
      },
      {
        slug: 'ai-tokens-explained',
        title: 'AI Tokens Explained',
        description:
          'Render, Akash, Bittensor, and the tokens powering decentralized AI infrastructure.',
        order: 2,
        readingTime: '7 min',
      },
      {
        slug: 'decentralized-compute',
        title: 'Decentralized Compute Networks',
        description: 'How blockchain enables distributed GPU power for AI training and inference.',
        order: 3,
        readingTime: '7 min',
      },
      {
        slug: 'ai-agents-crypto',
        title: 'AI Agents in Crypto',
        description:
          'Autonomous AI agents that trade, govern, and interact with blockchain protocols.',
        order: 4,
        readingTime: '7 min',
      },
      {
        slug: 'ai-crypto-risks',
        title: 'AI & Crypto: Risks and Hype',
        description: 'Separating genuine innovation from speculation in the AI-crypto narrative.',
        order: 5,
        readingTime: '6 min',
      },
    ],
  },
];

export function getSeriesBySlug(slug: string): GuideSeries | undefined {
  return GUIDE_SERIES.find((s) => s.slug === slug);
}

export function getSeriesArticle(
  seriesSlug: string,
  articleSlug: string,
): { series: GuideSeries; article: GuideArticle } | undefined {
  const series = getSeriesBySlug(seriesSlug);
  if (!series) return undefined;
  const article = series.articles.find((a) => a.slug === articleSlug);
  if (!article) return undefined;
  return { series, article };
}

export function getAdjacentArticles(
  series: GuideSeries,
  articleSlug: string,
): { prev: GuideArticle | null; next: GuideArticle | null } {
  const idx = series.articles.findIndex((a) => a.slug === articleSlug);
  return {
    prev: idx > 0 ? series.articles[idx - 1] : null,
    next: idx < series.articles.length - 1 ? series.articles[idx + 1] : null,
  };
}

export function getTotalArticleCount(): number {
  return GUIDE_SERIES.reduce((sum, s) => sum + s.articles.length, 0);
}
