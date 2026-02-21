/**
 * Unsplash fallback images for articles without thumbnails.
 *
 * Uses a curated pool of crypto / finance / tech photos.
 * Photo IDs are stable — Unsplash guarantees permanent URLs with format:
 *   https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=800&q=70
 *
 * Attribution: photos sourced from Unsplash (https://unsplash.com)
 */

const CRYPTO_PHOTOS = [
  '1518546305927-5a555bb7020d', // Bitcoin coins on a surface
  '1639762681485-074b7f938ba0', // Crypto chart glow
  '1611974789855-9c2a0a7236a3', // Trading monitors
  '1621416894569-0e4bfef8e3c6', // Blockchain / tech abstract
  '1559526324-4b87b5e36e44', // Network data streams
  '1488590528505-98d2b5aba04b', // Laptop / developer
  '1526374965328-7f61d4dc18c5', // Matrix green code
  '1451187580459-43490279c0fa', // Globe with data lines
  '1504711434969-e33886168f5c', // City skyline / finance
  '1543699565-003b8adda5fc', // Abstract circuit board
  '1567427017947-545c5f8d49d6', // Blockchain node network
  '1639322537228-f710d846310a', // Crypto coin stack
  '1640340434855-6a53de7f41fe', // DeFi / Ethereum glow
  '1642790106117-e829e14a795f', // Crypto trading signals
  '1580048915913-4f8f5cb481c4', // Gold / wealth / finance
  '1551288049-bebda4e38f71', // Data dashboard / charts
  '1614028674026-a65e31bfd27c', // Bitcoin close-up
  '1601597111158-2fceff292cdc', // Digital currency concept
  '1622473590773-f588134b6d7e', // NFT / digital art glow
  '1672345332073-3b3c6b15e38a', // Crypto wallet / smartphone
];

/**
 * Returns a deterministic Unsplash fallback URL for a given seed string
 * (typically article source name or title fragment).
 */
export function getUnsplashFallback(seed: string, width = 800, height = 450): string {
  // Simple djb2-style hash for a stable but varied pick
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
    hash = hash >>> 0; // keep unsigned 32-bit
  }
  const id = CRYPTO_PHOTOS[hash % CRYPTO_PHOTOS.length];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=70`;
}
