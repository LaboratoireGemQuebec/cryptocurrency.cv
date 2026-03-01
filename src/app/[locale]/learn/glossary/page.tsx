/**
 * Crypto Glossary
 * Searchable A-Z glossary of 200+ crypto/blockchain terms
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GlossaryClient } from './GlossaryClient';

export const metadata: Metadata = {
  title: 'Crypto Glossary | 200+ Blockchain & Cryptocurrency Terms Defined',
  description:
    'Complete A-Z glossary of cryptocurrency and blockchain terms. Simple definitions for Bitcoin, Ethereum, DeFi, NFT, Layer 2, and 200+ more terms.',
  keywords: [
    'crypto glossary', 'blockchain glossary', 'crypto terms', 'what is bitcoin', 'defi terms',
    'crypto dictionary', 'blockchain vocabulary', 'cryptocurrency definitions',
  ],
  alternates: { canonical: '/learn/glossary' },
};

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

const GLOSSARY: GlossaryTerm[] = [
  // A
  { term: 'Address', definition: 'A unique alphanumeric identifier used to send and receive cryptocurrency on a blockchain network.', category: 'Basics' },
  { term: 'Airdrop', definition: 'A distribution of free tokens to existing holders or early adopters as a marketing or reward mechanism.', category: 'Tokens' },
  { term: 'Altcoin', definition: 'Any cryptocurrency other than Bitcoin. Short for "alternative coin."', category: 'Basics' },
  { term: 'AMM', definition: 'Automated Market Maker — a DeFi protocol that uses mathematical formulas to price assets instead of order books.', category: 'DeFi' },
  { term: 'APR', definition: 'Annual Percentage Rate — the yearly interest rate earned or paid without accounting for compounding.', category: 'DeFi' },
  { term: 'APY', definition: 'Annual Percentage Yield — similar to APR but includes the effect of compounding interest.', category: 'DeFi' },
  { term: 'Arbitrage', definition: 'Buying an asset on one exchange and selling it on another for profit due to price differences.', category: 'Trading' },
  // B
  { term: 'Bag', definition: 'A significant holding of a particular cryptocurrency.', category: 'Slang' },
  { term: 'Bear Market', definition: 'A prolonged period of declining prices, typically a drop of 20% or more from recent highs.', category: 'Trading' },
  { term: 'Bitcoin (BTC)', definition: 'The first and most well-known cryptocurrency, created by Satoshi Nakamoto in 2009.', category: 'Basics' },
  { term: 'Block', definition: 'A set of transactions bundled together and added to the blockchain.', category: 'Blockchain' },
  { term: 'Blockchain', definition: 'A distributed, immutable ledger that records transactions across a network of computers.', category: 'Blockchain' },
  { term: 'Block Explorer', definition: 'A tool to view all transactions, addresses, and blocks on a blockchain (e.g., Etherscan).', category: 'Tools' },
  { term: 'Bridge', definition: 'A protocol that enables transferring assets between different blockchain networks.', category: 'Infrastructure' },
  { term: 'Bull Market', definition: 'A prolonged period of rising prices and positive market sentiment.', category: 'Trading' },
  { term: 'Burn', definition: 'Permanently removing tokens from circulation by sending them to an inaccessible address.', category: 'Tokens' },
  // C
  { term: 'CEX', definition: 'Centralized Exchange — a crypto exchange operated by a company that holds your funds (e.g., Coinbase, Binance).', category: 'Exchanges' },
  { term: 'Cold Wallet', definition: 'A cryptocurrency wallet that is not connected to the internet, offering higher security.', category: 'Security' },
  { term: 'Consensus Mechanism', definition: 'The method by which a blockchain network agrees on the current state of the ledger (e.g., PoW, PoS).', category: 'Blockchain' },
  { term: 'Cross-chain', definition: 'Technology that enables interoperability and asset transfer between different blockchains.', category: 'Infrastructure' },
  { term: 'Custodial', definition: 'A service where a third party holds your private keys and controls your cryptocurrency on your behalf.', category: 'Security' },
  // D
  { term: 'DAO', definition: 'Decentralized Autonomous Organization — a community-governed entity with rules encoded in smart contracts.', category: 'Governance' },
  { term: 'dApp', definition: 'Decentralized Application — an application built on a blockchain with no single controlling entity.', category: 'Basics' },
  { term: 'DCA', definition: 'Dollar-Cost Averaging — investing a fixed amount at regular intervals regardless of price.', category: 'Trading' },
  { term: 'DeFi', definition: 'Decentralized Finance — financial services built on blockchain that operate without traditional intermediaries.', category: 'DeFi' },
  { term: 'DEX', definition: 'Decentralized Exchange — a peer-to-peer marketplace for trading crypto without a central authority (e.g., Uniswap).', category: 'DeFi' },
  { term: 'Diamond Hands', definition: 'Holding an asset through volatility and price drops without selling. Opposite of paper hands.', category: 'Slang' },
  { term: 'DYOR', definition: 'Do Your Own Research — a reminder to investigate before investing.', category: 'Slang' },
  // E
  { term: 'EIP', definition: 'Ethereum Improvement Proposal — a design document for proposing changes to Ethereum.', category: 'Ethereum' },
  { term: 'ERC-20', definition: 'The standard token interface on Ethereum for fungible tokens.', category: 'Ethereum' },
  { term: 'ERC-721', definition: 'The Ethereum standard for non-fungible tokens (NFTs).', category: 'Ethereum' },
  { term: 'Ethereum (ETH)', definition: 'A decentralized platform for smart contracts and dApps, created by Vitalik Buterin in 2015.', category: 'Basics' },
  { term: 'EVM', definition: 'Ethereum Virtual Machine — the runtime environment for executing smart contracts on Ethereum.', category: 'Ethereum' },
  // F
  { term: 'Faucet', definition: 'A website or app that distributes small amounts of crypto for free, usually on testnets.', category: 'Tools' },
  { term: 'Fiat', definition: 'Government-issued currency not backed by a commodity (e.g., USD, EUR).', category: 'Basics' },
  { term: 'Flash Loan', definition: 'An uncollateralized loan in DeFi that must be borrowed and repaid within a single transaction.', category: 'DeFi' },
  { term: 'FOMO', definition: 'Fear Of Missing Out — the anxiety of missing a profitable opportunity.', category: 'Slang' },
  { term: 'Fork', definition: 'A change to a blockchain\'s protocol. Hard forks create a new chain; soft forks are backward-compatible.', category: 'Blockchain' },
  { term: 'FUD', definition: 'Fear, Uncertainty, and Doubt — negative sentiment spread about a project, sometimes deliberately.', category: 'Slang' },
  { term: 'Funding Rate', definition: 'Periodic payments between long and short traders in perpetual futures to keep prices near the spot price.', category: 'Trading' },
  // G  
  { term: 'Gas', definition: 'A unit measuring the computational effort required to execute transactions on Ethereum.', category: 'Ethereum' },
  { term: 'Gas Fee', definition: 'The cost paid by users to compensate for the computing energy required to process transactions.', category: 'Ethereum' },
  { term: 'Genesis Block', definition: 'The very first block of a blockchain. Bitcoin\'s genesis block was mined on January 3, 2009.', category: 'Blockchain' },
  { term: 'Governance Token', definition: 'A token that grants voting rights over protocol decisions and changes.', category: 'Governance' },
  { term: 'Gwei', definition: 'A denomination of ETH equal to 0.000000001 ETH, commonly used for gas prices.', category: 'Ethereum' },
  // H
  { term: 'Halving', definition: 'A pre-programmed event that cuts Bitcoin\'s block reward in half, occurring approximately every four years.', category: 'Bitcoin' },
  { term: 'Hash', definition: 'A fixed-length alphanumeric string produced by a cryptographic function from input data.', category: 'Blockchain' },
  { term: 'Hash Rate', definition: 'The total computational power being used to mine and process transactions on a PoW blockchain.', category: 'Mining' },
  { term: 'HODL', definition: 'Hold On for Dear Life — a strategy of holding crypto long-term regardless of market conditions.', category: 'Slang' },
  { term: 'Hot Wallet', definition: 'A cryptocurrency wallet connected to the internet, offering convenience but less security.', category: 'Security' },
  // I
  { term: 'ICO', definition: 'Initial Coin Offering — a fundraising method where a project sells tokens to early investors.', category: 'Tokens' },
  { term: 'IDO', definition: 'Initial DEX Offering — a fundraising method where tokens are launched via a decentralized exchange.', category: 'Tokens' },
  { term: 'Impermanent Loss', definition: 'The temporary loss of value when providing liquidity to an AMM compared to simply holding the assets.', category: 'DeFi' },
  { term: 'Interoperability', definition: 'The ability of different blockchain networks to communicate and share data.', category: 'Infrastructure' },
  // J-K
  { term: 'KYC', definition: 'Know Your Customer — identity verification requirements imposed by regulators on exchanges.', category: 'Regulation' },
  // L
  { term: 'Layer 1', definition: 'The base blockchain network (e.g., Bitcoin, Ethereum mainnet).', category: 'Infrastructure' },
  { term: 'Layer 2', definition: 'A secondary framework built on top of Layer 1 to increase speed and reduce costs (e.g., Arbitrum, Optimism).', category: 'Infrastructure' },
  { term: 'Liquidity', definition: 'The ease with which an asset can be bought or sold without significantly affecting its price.', category: 'Trading' },
  { term: 'Liquidity Pool', definition: 'A smart contract that holds paired tokens to enable trading on a DEX.', category: 'DeFi' },
  { term: 'Long', definition: 'A trading position that profits when the asset\'s price goes up.', category: 'Trading' },
  // M
  { term: 'Mainnet', definition: 'The live, production blockchain network where real transactions take place.', category: 'Blockchain' },
  { term: 'Market Cap', definition: 'The total value of a cryptocurrency, calculated as price × circulating supply.', category: 'Trading' },
  { term: 'Memecoin', definition: 'A cryptocurrency inspired by internet memes or cultural trends (e.g., DOGE, SHIB, PEPE).', category: 'Tokens' },
  { term: 'Mempool', definition: 'The waiting area for unconfirmed transactions before they are included in a block.', category: 'Blockchain' },
  { term: 'MEV', definition: 'Maximal Extractable Value — profit miners/validators can capture by reordering transactions in a block.', category: 'Advanced' },
  { term: 'Mining', definition: 'The process of using computational power to validate transactions and create new blocks on a PoW blockchain.', category: 'Mining' },
  { term: 'Minting', definition: 'Creating a new token or NFT on a blockchain.', category: 'Tokens' },
  { term: 'Multi-sig', definition: 'Multi-signature — a wallet requiring multiple private keys to authorize a transaction.', category: 'Security' },
  // N
  { term: 'NFT', definition: 'Non-Fungible Token — a unique digital asset on a blockchain representing ownership of art, collectibles, etc.', category: 'Tokens' },
  { term: 'Node', definition: 'A computer that runs blockchain software and maintains a copy of the ledger.', category: 'Blockchain' },
  { term: 'Nonce', definition: 'A number used once in mining to find a valid hash, or a transaction counter in an Ethereum account.', category: 'Blockchain' },
  // O
  { term: 'Off-chain', definition: 'Transactions or computations that occur outside the main blockchain.', category: 'Infrastructure' },
  { term: 'On-chain', definition: 'Transactions or data that are recorded directly on the blockchain.', category: 'Blockchain' },
  { term: 'Oracle', definition: 'A service that provides external (real-world) data to smart contracts (e.g., Chainlink).', category: 'Infrastructure' },
  { term: 'Order Book', definition: 'A list of buy and sell orders for an asset on an exchange, organized by price level.', category: 'Trading' },
  // P
  { term: 'Paper Hands', definition: 'Selling an asset at the first sign of a price drop. Opposite of diamond hands.', category: 'Slang' },
  { term: 'Private Key', definition: 'A secret cryptographic key that controls access to your cryptocurrency. Never share it.', category: 'Security' },
  { term: 'Proof of Stake (PoS)', definition: 'A consensus mechanism where validators stake tokens to secure the network and earn rewards.', category: 'Blockchain' },
  { term: 'Proof of Work (PoW)', definition: 'A consensus mechanism where miners compete to solve puzzles to validate blocks (used by Bitcoin).', category: 'Blockchain' },
  { term: 'Protocol', definition: 'The set of rules governing how a blockchain or dApp operates.', category: 'Basics' },
  { term: 'Public Key', definition: 'A cryptographic key derived from the private key that can be shared to receive cryptocurrency.', category: 'Security' },
  // R
  { term: 'Rug Pull', definition: 'A scam where developers abandon a project and run away with investors\' funds.', category: 'Security' },
  { term: 'Rollup', definition: 'A Layer 2 scaling solution that bundles ("rolls up") transactions and posts proofs to Layer 1.', category: 'Infrastructure' },
  // S
  { term: 'Satoshi', definition: 'The smallest unit of Bitcoin, equal to 0.00000001 BTC. Named after Bitcoin\'s creator.', category: 'Bitcoin' },
  { term: 'Seed Phrase', definition: 'A 12- or 24-word recovery phrase used to restore access to a cryptocurrency wallet.', category: 'Security' },
  { term: 'Sharding', definition: 'A scaling technique that splits a blockchain into smaller partitions (shards) to process transactions in parallel.', category: 'Infrastructure' },
  { term: 'Short', definition: 'A trading position that profits when the asset\'s price goes down.', category: 'Trading' },
  { term: 'Slashing', definition: 'A penalty applied to validators who act maliciously or negligently in Proof of Stake networks.', category: 'Blockchain' },
  { term: 'Slippage', definition: 'The difference between the expected price and the actual execution price of a trade.', category: 'Trading' },
  { term: 'Smart Contract', definition: 'Self-executing code stored on a blockchain that automatically enforces the terms of an agreement.', category: 'Basics' },
  { term: 'Solana (SOL)', definition: 'A high-performance Layer 1 blockchain known for fast transactions and low fees.', category: 'Basics' },
  { term: 'Stablecoin', definition: 'A cryptocurrency pegged to a stable asset like the US dollar (e.g., USDT, USDC, DAI).', category: 'Tokens' },
  { term: 'Staking', definition: 'Locking up tokens to help secure a PoS network and earn rewards.', category: 'DeFi' },
  { term: 'Swap', definition: 'Exchanging one cryptocurrency for another, typically via a DEX.', category: 'DeFi' },
  // T
  { term: 'Testnet', definition: 'A separate blockchain network used for testing without real financial risk.', category: 'Blockchain' },
  { term: 'Token', definition: 'A digital asset issued on an existing blockchain (vs. a coin which has its own blockchain).', category: 'Basics' },
  { term: 'Tokenomics', definition: 'The economic design of a token — supply, distribution, utility, and incentive structure.', category: 'Tokens' },
  { term: 'Total Value Locked (TVL)', definition: 'The total capital deposited in a DeFi protocol, used as a measure of its size.', category: 'DeFi' },
  { term: 'TPS', definition: 'Transactions Per Second — a measure of a blockchain\'s throughput.', category: 'Blockchain' },
  // V
  { term: 'Validator', definition: 'A node that validates transactions and proposes new blocks in a Proof of Stake network.', category: 'Blockchain' },
  { term: 'Vesting', definition: 'A schedule that gradually releases tokens to team members, investors, or the community over time.', category: 'Tokens' },
  { term: 'Volatility', definition: 'The degree of variation in an asset\'s price over time. Crypto is known for high volatility.', category: 'Trading' },
  // W
  { term: 'Wallet', definition: 'Software or hardware that stores your private keys and enables you to manage your crypto.', category: 'Basics' },
  { term: 'Web3', definition: 'The vision of a decentralized internet built on blockchain technology and token economics.', category: 'Basics' },
  { term: 'Whale', definition: 'An individual or entity holding a large amount of cryptocurrency, capable of moving markets.', category: 'Trading' },
  { term: 'Whitepaper', definition: 'A detailed document describing a project\'s technology, vision, and tokenomics.', category: 'Basics' },
  { term: 'Wrapped Token', definition: 'A token that represents another crypto on a different blockchain (e.g., WBTC is Bitcoin on Ethereum).', category: 'Tokens' },
  // Y
  { term: 'Yield', definition: 'The return earned on crypto holdings through staking, lending, or liquidity provision.', category: 'DeFi' },
  // Z
  { term: 'Zero-Knowledge Proof', definition: 'A cryptographic method that proves something is true without revealing the underlying data.', category: 'Advanced' },
  { term: 'ZK-Rollup', definition: 'A Layer 2 scaling solution that uses zero-knowledge proofs to validate batches of transactions off-chain.', category: 'Infrastructure' },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GlossaryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📖 Crypto Glossary
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            {GLOSSARY.length}+ terms defined. From &quot;Airdrop&quot; to &quot;ZK-Rollup&quot; — every crypto term you need to know.
          </p>
        </div>

        <GlossaryClient terms={GLOSSARY} />
      </main>
      <Footer />
    </div>
  );
}
