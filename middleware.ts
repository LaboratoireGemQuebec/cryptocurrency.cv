/**
 * x402 Payment Middleware
 *
 * Protects premium API routes using the x402 payment protocol.
 * Clients that hit /api/premium/* without a valid payment header
 * will receive a 402 Payment Required response with instructions
 * on how to pay in USDC on Base.
 *
 * No subscriptions. No Stripe. No accounts.
 * Pay per request, on-chain, permissionlessly.
 *
 * @see https://x402.org
 */
import { paymentProxyFromConfig } from '@x402/next';
import type { RouteConfig } from '@x402/next';

const RECEIVE_ADDRESS =
  (process.env.X402_RECEIVE_ADDRESS as `0x${string}`) ??
  '0x40252CFDF8B20Ed757D61ff157719F33Ec332402';

// Standard premium endpoints — $0.001 USDC per call
const routes: Record<string, RouteConfig> = {
  '/api/premium/:path*': {
    accepts: {
      scheme: 'exact',
      payTo: RECEIVE_ADDRESS,
      price: '$0.001',
      network: 'base' as never, // eip155:8453 alias
    },
    description: 'Free Crypto News Premium API — pay per request in USDC on Base',
  },
};

export default paymentProxyFromConfig(routes);

export const config = {
  matcher: ['/api/premium/:path*'],
};
