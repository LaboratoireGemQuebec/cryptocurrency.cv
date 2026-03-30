---
title: "Building on the Lightning Network: API and SDK Guide"
description: "A developer's guide to building on the Bitcoin Lightning Network. Covers Lightning node APIs, LND and CLN, invoice creation, payments, and channel management."
date: "2026-03-30"
author: team
category: tutorial
tags: ["lightning", "bitcoin", "api", "payments", "lnd", "developer"]
image: "/images/blog/bitcoin-lightning-api.jpg"
imageAlt: "Lightning Network payment channel diagram showing instant Bitcoin micropayments"
---

The Lightning Network is Bitcoin's Layer 2 scaling solution, enabling near-instant, low-fee payments by routing transactions through payment channels off-chain. For developers, Lightning opens up use cases impossible on the base layer: micropayments, real-time streaming payments, paywall APIs, and machine-to-machine transactions. This guide covers the key APIs and SDKs for building Lightning-enabled applications.

## Lightning Network Fundamentals

Lightning operates through a network of payment channels. Two parties lock funds in a multi-signature Bitcoin transaction, then transact off-chain by updating the channel balance. When done, they settle the final balance on-chain. Payments route through multiple channels to reach any destination in the network.

Key concepts for developers:

- **Invoices**: Payment requests encoded as BOLT11 strings (`lnbc...`)
- **Channels**: Bi-directional payment pipes between nodes
- **Routing**: Multi-hop payment path through the network
- **HTLCs**: Hash Time Lock Contracts — the atomic swap mechanism
- **LND / CLN**: The two major Lightning node implementations

## LND gRPC API

Lightning Labs' LND is the most popular node implementation. It exposes a gRPC API accessible from any language:

```bash
# Install lncli (LND command line)
# Assuming LND is running locally with TLS

# Create invoice
lncli addinvoice --amt 1000 --memo "API payment"

# Pay invoice
lncli payinvoice --pay_req lnbc1000n1...

# Check balance
lncli walletbalance
lncli channelbalance
```

### Node.js with @lightningnetwork/lntools

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

```javascript
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import path from 'path';

// Load LND proto files
const LND_HOST = process.env.LND_HOST || 'localhost:10009';
const TLS_CERT_PATH = process.env.LND_TLS_CERT || '/path/to/tls.cert';
const MACAROON_PATH = process.env.LND_MACAROON || '/path/to/admin.macaroon';

const packageDef = protoLoader.loadSync('./rpc.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const lnrpc = grpc.loadPackageDefinition(packageDef).lnrpc;
const tlsCert = fs.readFileSync(TLS_CERT_PATH);
const sslCreds = grpc.credentials.createSsl(tlsCert);

const macaroonHex = fs.readFileSync(MACAROON_PATH).toString('hex');
const macaroonCreds = grpc.credentials.createFromMetadataGenerator(
  (_, callback) => {
    const metadata = new grpc.Metadata();
    metadata.add('macaroon', macaroonHex);
    callback(null, metadata);
  }
);

const lnd = new lnrpc.Lightning(
  LND_HOST,
  grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds)
);

// Create invoice
function createInvoice(amountSats, memo, expirySeconds = 3600) {
  return new Promise((resolve, reject) => {
    lnd.addInvoice({
      value: amountSats,
      memo,
      expiry: expirySeconds,
    }, (err, response) => {
      if (err) reject(err);
      else resolve({
        paymentRequest: response.payment_request,
        rHash: Buffer.from(response.r_hash).toString('hex'),
        addIndex: response.add_index,
      });
    });
  });
}

// Check invoice status
function lookupInvoice(rHash) {
  return new Promise((resolve, reject) => {
    lnd.lookupInvoice({ r_hash_str: rHash }, (err, invoice) => {
      if (err) reject(err);
      else resolve({
        settled: invoice.settled,
        settleDate: invoice.settle_date,
        amtPaid: invoice.amt_paid_sat,
      });
    });
  });
}
```

## CLN REST API

Core Lightning (CLN) by Blockstream provides a REST interface via the c-lightning-REST plugin:

```bash
# Install c-lightning-REST plugin
# Then access via HTTP

curl -k -X GET \
  --header "macaroon: YOUR_MACAROON" \
  https://localhost:3001/v1/getinfo
```

```javascript
const CLN_BASE = 'https://localhost:3001/v1';
const MACAROON = process.env.CLN_MACAROON;

async function clnRequest(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'macaroon': MACAROON,
    },
  };
  if (body) options.body = JSON.stringify(body);

  // Note: CLN uses self-signed cert in development
  const response = await fetch(`${CLN_BASE}${path}`, options);
  return response.json();
}

// Create invoice
async function createCLNInvoice(amountMsats, label, description) {
  return clnRequest('/invoice', 'POST', {
    msatoshi: amountMsats,
    label,
    description,
  });
}

// Pay invoice
async function payInvoice(bolt11) {
  return clnRequest('/pay', 'POST', { invoice: bolt11 });
}
```

## Strike API: Managed Lightning for Developers

Strike provides a developer-friendly Lightning API that abstracts node management:

```javascript
const STRIKE_API = 'https://api.strike.me/v1';
const STRIKE_KEY = process.env.STRIKE_API_KEY;

async function strikeRequest(path, method = 'GET', body = null) {
  const response = await fetch(`${STRIKE_API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRIKE_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
}

// Create Lightning invoice
async function createStrikeInvoice(amountUsd, description) {
  return strikeRequest('/invoices', 'POST', {
    correlationId: crypto.randomUUID(),
    description,
    amount: {
      currency: 'USD',
      amount: amountUsd.toString(),
    },
  });
}

// Get invoice quote (Lightning payment request)
async function getInvoiceQuote(invoiceId) {
  return strikeRequest(`/invoices/${invoiceId}/quote`, 'PATCH');
}
```

## Building a Lightning Paywall API

A practical use case: charge per API request using Lightning micropayments (L402 protocol):

```javascript
import express from 'express';
import crypto from 'crypto';

const app = express();
const pendingPayments = new Map();

function generatePreimage() {
  return crypto.randomBytes(32).toString('hex');
}

function hashPreimage(preimage) {
  return crypto.createHash('sha256').update(Buffer.from(preimage, 'hex')).digest('hex');
}

// Middleware: Check for valid Lightning payment token
async function lightningAuth(req, res, next) {
  const token = req.headers['l402-authorization'];

  if (!token) {
    // Issue a new challenge
    const preimage = generatePreimage();
    const paymentHash = hashPreimage(preimage);
    const amountSats = 100; // 100 satoshis per request (~$0.10)

    const invoice = await createInvoice(amountSats, `API access: ${paymentHash}`);
    pendingPayments.set(paymentHash, { preimage, invoice, used: false });

    return res.status(402).json({
      error: 'Payment Required',
      paymentRequest: invoice.paymentRequest,
      paymentHash,
      amount: amountSats,
      message: `Pay ${amountSats} sats to access this endpoint`,
    });
  }

  // Verify payment token
  const [, preimage] = token.split(':');
  const paymentHash = hashPreimage(preimage);
  const record = pendingPayments.get(paymentHash);

  if (!record || record.used) {
    return res.status(401).json({ error: 'Invalid or expired payment token' });
  }

  // Verify invoice was paid
  const invoiceStatus = await lookupInvoice(record.invoice.rHash);
  if (!invoiceStatus.settled) {
    return res.status(402).json({ error: 'Payment not yet confirmed' });
  }

  record.used = true;
  next();
}

// Protected endpoint
app.get('/api/premium-data', lightningAuth, async (req, res) => {
  res.json({
    data: 'Premium cryptocurrency analysis data',
    timestamp: new Date().toISOString(),
  });
});

app.listen(3000);
```

## LNURL: User-Friendly Lightning

LNURL is a protocol that makes Lightning payments more user-friendly by replacing cryptic invoice strings with URLs:

```javascript
import express from 'express';

const app = express();

// LNURL-pay endpoint
app.get('/.well-known/lnurlp/:username', async (req, res) => {
  const { username } = req.params;
  const callbackUrl = `https://yourdomain.com/lnurl/pay/${username}`;

  res.json({
    tag: 'payRequest',
    callback: callbackUrl,
    minSendable: 1000,   // 1 sat minimum (in millisats)
    maxSendable: 1000000000, // 1000 sat maximum
    metadata: JSON.stringify([
      ['text/plain', `Payment to ${username}`],
      ['text/identifier', `${username}@yourdomain.com`],
    ]),
  });
});

// LNURL-pay callback (returns invoice)
app.get('/lnurl/pay/:username', async (req, res) => {
  const { username } = req.params;
  const { amount } = req.query; // amount in millisats

  const amountSats = Math.floor(parseInt(amount) / 1000);
  const invoice = await createInvoice(amountSats, `LNURL payment to ${username}`);

  res.json({
    pr: invoice.paymentRequest,
    routes: [],
  });
});

app.listen(3000);
```

## Monitoring Lightning Node Health

```javascript
async function getNodeStats() {
  const [info, balances, channels] = await Promise.all([
    new Promise((resolve, reject) =>
      lnd.getInfo({}, (err, resp) => err ? reject(err) : resolve(resp))
    ),
    new Promise((resolve, reject) =>
      lnd.channelBalance({}, (err, resp) => err ? reject(err) : resolve(resp))
    ),
    new Promise((resolve, reject) =>
      lnd.listChannels({}, (err, resp) => err ? reject(err) : resolve(resp))
    ),
  ]);

  return {
    alias: info.alias,
    numPeers: info.num_peers,
    numActiveChannels: info.num_active_channels,
    blockHeight: info.block_height,
    syncedToChain: info.synced_to_chain,
    localBalance: parseInt(balances.local_balance.sat),
    remoteBalance: parseInt(balances.remote_balance.sat),
    channels: channels.channels.map(ch => ({
      channelPoint: ch.channel_point,
      active: ch.active,
      capacity: ch.capacity,
      localBalance: ch.local_balance,
      remotePubkey: ch.remote_pubkey.slice(0, 20) + '...',
    })),
  };
}
```

## Conclusion

The Lightning Network brings programmable micropayments to Bitcoin. LND and CLN provide gRPC and REST APIs for node operators who want full control. Managed services like Strike lower the barrier for developers who don't want to run nodes. The L402 protocol and LNURL standards provide the user experience layer on top. Whether you are building a paywall, a streaming payment app, or a machine-to-machine payment system, the Lightning ecosystem has mature tooling to support your use case.
