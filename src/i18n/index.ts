/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

/**
 * i18n Module Exports
 * Re-exports all i18n utilities for convenient imports
 */

// Re-export next-intl hooks for client components
export { useTranslations, useLocale, useMessages, useNow, useTimeZone } from 'next-intl';

// Re-export configuration
export * from './config';

// Re-export navigation utilities
export * from './navigation';
