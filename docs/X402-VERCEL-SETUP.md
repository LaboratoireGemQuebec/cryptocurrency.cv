# x402 Vercel Environment Variables Setup

> Copy-paste these into **Vercel Dashboard → Settings → Environment Variables**.
> Set environment to **Production** (or all environments).
> After adding, **redeploy** from the Deployments tab.

---

## Required

| Name | Value | Description |
|------|-------|-------------|
| `X402_PAYMENT_ADDRESS` | `0x4027FdaC1a5216e264A00a5928b8366aE59cE888` | EVM wallet address for collecting USDC payments |
| `X402_TESTNET` | `false` | Disable testnet mode for production |

## Recommended

| Name | Value | Description |
|------|-------|-------------|
| `X402_RECEIVE_ADDRESS` | `0x4027FdaC1a5216e264A00a5928b8366aE59cE888` | Override payTo address (defaults to `X402_PAYMENT_ADDRESS`) |
| `X402_NETWORK` | `eip155:42161` | Arbitrum mainnet (CAIP-2 format) |
| `X402_FACILITATOR_URL` | `https://x402.sperax.io` | Sperax facilitator for payment verification & settlement |

## Optional

| Name | Value | Description |
|------|-------|-------------|
| `X402_SOLANA_PAYMENT_ADDRESS` | `YOUR_SOLANA_ADDRESS` | Solana wallet for Solana USDC payments |

---

## Quick Reference

```env
# Required
X402_PAYMENT_ADDRESS=0x4027FdaC1a5216e264A00a5928b8366aE59cE888
X402_TESTNET=false

# Recommended
X402_RECEIVE_ADDRESS=0x4027FdaC1a5216e264A00a5928b8366aE59cE888
X402_NETWORK=eip155:42161
X402_FACILITATOR_URL=https://x402.sperax.io

# Optional
X402_SOLANA_PAYMENT_ADDRESS=YOUR_SOLANA_ADDRESS
```

---

## How It Works

1. Agent (or x402 client) requests a paid endpoint (e.g. `/api/v1/coins`)
2. Server returns **HTTP 402** with payment requirements (price, network, USDC address)
3. Client signs a USDC transfer via EIP-3009 (gasless)
4. Client retries the request with payment proof in headers
5. Server forwards proof to the Sperax facilitator for on-chain settlement
6. Facilitator settles USDC on Arbitrum to your wallet
7. Server returns the data

## Pricing

- **Free tier**: `/api/news`, `/api/search`, `/api/bitcoin`, `/api/defi`, `/api/breaking`, `/api/sources`
- **v1 API**: $0.001–$0.01 per request
- **Premium API**: $0.01–$0.20 per request

## Discovery

- `/.well-known/x402` — x402 discovery document (auto-generated, no config needed)
- `/api/openapi.json` — OpenAPI spec with x402 pricing metadata

## Testing with agentcash

```bash
# Install agentcash MCP (for Claude Code / Claude Desktop)
npx agentcash install

# Deposit USDC to your agentcash wallet
# Then ask Claude to fetch a paid endpoint — agentcash handles payment automatically
```
