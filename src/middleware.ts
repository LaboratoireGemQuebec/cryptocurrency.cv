/**
 * Internationalization Middleware
 * 
 * Handles locale detection and routing for next-intl.
 * Automatically detects user's preferred language from Accept-Language header
 * and redirects to the appropriate locale-prefixed route.
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - API routes (/api/*)
  // - Next.js internals (_next/*)
  // - Vercel internals (_vercel/*)
  // - Static files (*.ico, *.png, *.svg, *.xml, *.json, *.txt, *.js, *.css, *.woff, *.woff2)
  // - Feed routes (/feed.xml)
  matcher: [
    '/',
    '/((?!api|_next|_vercel|feed\\.xml|.*\\.(?:ico|png|jpg|jpeg|gif|svg|xml|json|txt|js|css|woff|woff2|webp|avif)).*)',
  ],
};
