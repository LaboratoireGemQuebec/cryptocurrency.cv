/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

// UI Utilities - Re-exports for convenient importing
// Usage: import { ToastProvider, useToast, ErrorBoundary } from '@/components/utilities';

export { ToastProvider, useToast, useToastActions, type Toast, type ToastType } from './Toast';
export { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';
export { 
  EmptyState, 
  SearchEmptyState, 
  BookmarksEmptyState, 
  OfflineEmptyState, 
  ErrorEmptyState,
  LoadingState,
} from './EmptyState';
export { BackToTop } from './BackToTop';
export { 
  ScrollRestoration, 
  RouteAnnouncer, 
  NavigationAccessibility,
  useFocusOnRouteChange,
} from './ScrollRestoration';
export { 
  useFocusTrap, 
  useRovingFocus, 
  FocusTrap,
} from './FocusManagement';
