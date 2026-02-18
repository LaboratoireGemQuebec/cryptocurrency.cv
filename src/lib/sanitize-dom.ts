import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string to prevent XSS attacks.
 * Allows safe HTML tags and attributes only.
 * Falls back to regex tag stripping on the server side.
 */
export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML tags as a safe fallback
    return dirty.replace(/<[^>]*>/g, '');
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr',
      'td', 'th', 'span', 'div', 'mark',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class', 'id',
      'width', 'height', 'title',
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Lightweight sanitize for search highlighting (only allows <mark> tags)
 */
export function sanitizeHighlight(dirty: string): string {
  if (typeof window === 'undefined') {
    return dirty.replace(/<[^>]*>/g, '');
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['mark', 'strong', 'em', 'b'],
    ALLOWED_ATTR: ['class'],
  });
}
