/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

// Mobile-optimized components
// Components are in the parent directory
export { BottomNav } from '../BottomNav';
export { default as SwipeableCard } from '../SwipeableCard';
export { default as PullToRefresh } from '../PullToRefresh';
export { default as FloatingActionButton } from '../FloatingActionButton';

// Re-export mobile hooks for convenience
export {
  useOnlineStatus,
  useIsMobile,
  useTouchDevice,
  useSafeAreaInsets,
  usePullToRefresh,
  useHapticFeedback,
  useScrollDirection,
  useBodyScrollLock,
  useStandaloneMode,
} from '@/hooks/useMobile';
