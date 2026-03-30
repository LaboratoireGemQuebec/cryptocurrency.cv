---
title: "Crypto Tax APIs: What Developers Need to Know"
description: "An overview of cryptocurrency tax APIs including Koinly, TaxBit, and CoinTracker for developers building tax reporting features into crypto wallets and exchanges."
date: "2026-03-30"
author: team
category: guide
tags: ["tax", "api", "compliance", "developer", "defi", "reporting"]
image: "/images/blog/crypto-tax-api-overview.jpg"
imageAlt: "Cryptocurrency tax reporting dashboard showing gains, losses, and tax form generation"
---

Cryptocurrency taxation has become a significant compliance concern for both individual users and the platforms that serve them. If you are building a wallet, exchange, portfolio tracker, or DeFi dashboard, your users will eventually ask about their tax obligations. Integrating a crypto tax API can turn that pain point into a feature.

## The Crypto Tax Problem

Tax authorities in most jurisdictions treat cryptocurrency as property, meaning every taxable event — sale, swap, receipt of income — must be reported. For active DeFi users, this can mean thousands of taxable events per year spanning multiple chains.

The core challenges:

- **Cost basis tracking**: First-in-first-out (FIFO), last-in-first-out (LIFO), or average cost methods
- **Multi-chain activity**: Ethereum, Solana, BSC, Polygon, Arbitrum, Base
- **DeFi complexity**: Liquidity provision, yield farming, staking rewards
- **NFT transactions**: Sales, royalties, airdrop income
- **Cross-chain bridges**: How to treat bridged assets

## Major Crypto Tax APIs

### Koinly

Koinly is a consumer-facing tax tool that exposes an API for partners:

```javascript
const KOINLY_BASE = 'https://api.koinly.io/api';

async function importTransactions(portfolioId, transactions, apiKey) {
  const response = await fetch(`${KOINLY_BASE}/portfolios/${portfolioId}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transactions }),
  });
  return response.json();
}

// Transaction format Koinly expects
const transactions = [
  {
    date: '2026-01-15T10:00:00Z',
    type: 'buy',
    from_currency: 'USD',
    from_amount: 50000,
    to_currency: 'BTC',
    to_amount: 0.5,
    fee_currency: 'USD',
    fee_amount: 25,
    description: 'BTC purchase',
  },
];
```

### TaxBit

TaxBit serves enterprise customers and exchanges with a comprehensive API:

```javascript
const TAXBIT_BASE = 'https://api.taxbit.com/v1';

async function createAccount(userId, apiKey) {
  const response = await fetch(`${TAXBIT_BASE}/accounts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });
  return response.json();
}

async function addTransaction(accountId, transaction, apiKey) {
  return fetch(`${TAXBIT_BASE}/accounts/${accountId}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  }).then(r => r.json());
}
```

### CoinTracker

CoinTracker offers CSV import and a partner API:

```javascript
// CoinTracker CSV format for manual imports
function generateCoinTrackerCSV(transactions) {
  const header = 'Date,Received Quantity,Received Currency,Sent Quantity,Sent Currency,Fee Amount,Fee Currency,Tag\n';

  const rows = transactions.map(tx => {
    const date = new Date(tx.timestamp).toISOString().replace('T', ' ').slice(0, 19);
    return [
      date,
      tx.receivedAmount || '',
      tx.receivedCurrency || '',
      tx.sentAmount || '',
      tx.sentCurrency || '',
      tx.feeAmount || '',
      tx.feeCurrency || '',
      tx.tag || '',
    ].join(',');
  });

  return header + rows.join('\n');
}
```

## Building Your Own Tax Transaction Exporter

Rather than a full tax API integration, many developers build a transaction export feature that users can import into tax tools:

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);

async function getTransactionHistory(walletAddress, apiKey) {
  // Fetch from Etherscan
  const [normalTxs, erc20Txs, internalTxs] = await Promise.all([
    fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&sort=asc&apikey=${apiKey}`).then(r => r.json()),
    fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${walletAddress}&sort=asc&apikey=${apiKey}`).then(r => r.json()),
    fetch(`https://api.etherscan.io/api?module=account&action=txlistinternal&address=${walletAddress}&sort=asc&apikey=${apiKey}`).then(r => r.json()),
  ]);

  return {
    normal: normalTxs.result || [],
    erc20: erc20Txs.result || [],
    internal: internalTxs.result || [],
  };
}

function classifyTransaction(tx, walletAddress) {
  const isSender = tx.from.toLowerCase() === walletAddress.toLowerCase();

  if (tx.isError === '1') return 'FAILED';
  if (tx.to === '' || tx.to === null) return 'CONTRACT_DEPLOY';
  if (isSender && parseFloat(tx.value) > 0) return 'SEND';
  if (!isSender && parseFloat(tx.value) > 0) return 'RECEIVE';
  if (isSender) return 'CONTRACT_INTERACTION';
  return 'UNKNOWN';
}

function formatForTaxExport(transactions, walletAddress) {
  return transactions.normal.map(tx => {
    const type = classifyTransaction(tx, walletAddress);
    const ethValue = parseFloat(tx.value) / 1e18;
    const gasEth = (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / 1e18;

    return {
      date: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
      type,
      asset: 'ETH',
      amount: ethValue,
      gasFeesEth: gasEth,
      txHash: tx.hash,
      from: tx.from,
      to: tx.to,
      blockNumber: parseInt(tx.blockNumber),
    };
  });
}
```

## Calculating Cost Basis (FIFO)

```python
from dataclasses import dataclass
from typing import Optional
from collections import deque
import decimal

Decimal = decimal.Decimal

@dataclass
class Purchase:
    date: str
    amount: Decimal
    cost_per_unit: Decimal
    total_cost: Decimal

@dataclass
class TaxEvent:
    date: str
    asset: str
    units_sold: Decimal
    cost_basis: Decimal
    proceeds: Decimal
    gain_loss: Decimal
    term: str  # 'short' or 'long'

class FIFOCostBasis:
    def __init__(self):
        self._purchases: dict[str, deque[Purchase]] = {}
        self._tax_events: list[TaxEvent] = []

    def add_purchase(self, asset: str, date: str, amount: Decimal, price: Decimal):
        if asset not in self._purchases:
            self._purchases[asset] = deque()

        self._purchases[asset].append(Purchase(
            date=date,
            amount=amount,
            cost_per_unit=price,
            total_cost=amount * price,
        ))

    def add_sale(self, asset: str, date: str, amount: Decimal, sale_price: Decimal) -> Decimal:
        """Process a sale and return the realized gain/loss."""
        if asset not in self._purchases or not self._purchases[asset]:
            raise ValueError(f"No purchase history for {asset}")

        remaining = amount
        total_cost_basis = Decimal('0')

        while remaining > 0 and self._purchases[asset]:
            purchase = self._purchases[asset][0]

            if purchase.amount <= remaining:
                # Use entire lot
                total_cost_basis += purchase.amount * purchase.cost_per_unit
                remaining -= purchase.amount
                self._purchases[asset].popleft()
            else:
                # Partial lot
                total_cost_basis += remaining * purchase.cost_per_unit
                purchase.amount -= remaining
                purchase.total_cost = purchase.amount * purchase.cost_per_unit
                remaining = Decimal('0')

        proceeds = amount * sale_price
        gain_loss = proceeds - total_cost_basis

        self._tax_events.append(TaxEvent(
            date=date,
            asset=asset,
            units_sold=amount,
            cost_basis=total_cost_basis,
            proceeds=proceeds,
            gain_loss=gain_loss,
            term='short',  # simplified; real implementation checks holding period
        ))

        return gain_loss

    def get_tax_summary(self) -> dict:
        short_term = sum(e.gain_loss for e in self._tax_events if e.term == 'short')
        long_term = sum(e.gain_loss for e in self._tax_events if e.term == 'long')
        return {
            'short_term_gain_loss': float(short_term),
            'long_term_gain_loss': float(long_term),
            'total_events': len(self._tax_events),
        }

# Example
tracker = FIFOCostBasis()
tracker.add_purchase('BTC', '2025-01-01', Decimal('0.5'), Decimal('45000'))
tracker.add_purchase('BTC', '2025-06-01', Decimal('0.5'), Decimal('65000'))

gain = tracker.add_sale('BTC', '2026-01-01', Decimal('0.3'), Decimal('90000'))
print(f"Realized gain on sale: ${float(gain):,.2f}")
print(tracker.get_tax_summary())
```

## Form 1099 / Tax Form Generation

For US-based platforms processing significant volume, generating tax forms is a legal requirement:

```javascript
function generate1099CSV(transactions, taxYear) {
  const taxable = transactions.filter(tx =>
    new Date(tx.date).getFullYear() === taxYear &&
    ['SELL', 'SWAP', 'INCOME'].includes(tx.type)
  );

  const header = [
    'Description',
    'Date Acquired',
    'Date Sold',
    'Proceeds',
    'Cost Basis',
    'Adjustment Code',
    'Adjustment Amount',
    'Gain or Loss',
  ].join(',');

  const rows = taxable.map(tx => [
    `${tx.amount} ${tx.asset}`,
    tx.acquiredDate || 'VARIOUS',
    tx.date.split('T')[0],
    tx.proceeds.toFixed(2),
    tx.costBasis.toFixed(2),
    '',
    '',
    (tx.proceeds - tx.costBasis).toFixed(2),
  ].join(','));

  return `${header}\n${rows.join('\n')}`;
}
```

## Conclusion

Crypto tax APIs and tools have matured significantly. Platforms like Koinly and TaxBit provide APIs that can handle the complexity of multi-chain, multi-protocol tax calculation. For developers, the key decision is whether to integrate a third-party tax API, build a transaction export feature for users to import into tax tools themselves, or implement FIFO/LIFO cost basis calculation in-house. For most applications, a clean transaction export is the right starting point, with deeper API integration reserved for exchanges and platforms with significant user tax obligations.
