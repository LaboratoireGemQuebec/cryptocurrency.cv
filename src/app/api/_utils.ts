/**
 * Shared API Route Utilities
 * Common helpers used across multiple route handlers.
 */

import { NextResponse } from 'next/server';

/**
 * Returns the standard 503 response when the Groq AI service is not configured.
 * Use this to replace the repeated if (!isGroqConfigured()) ... block in route handlers.
 */
export function groqNotConfiguredResponse(): NextResponse {
  return NextResponse.json(
    {
      error: 'AI features not configured',
      message:
        'Set GROQ_API_KEY environment variable. Get a free key at https://console.groq.com/keys',
    },
    { status: 503 }
  );
}

/**
 * Returns the standard 503 response when no AI provider is configured.
 * Broader replacement for groqNotConfiguredResponse — checks all providers.
 */
export function aiNotConfiguredResponse(): NextResponse {
  return NextResponse.json(
    {
      error: 'AI features not configured',
      message:
        'Set GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, or OPENROUTER_API_KEY environment variable.',
    },
    { status: 503 }
  );
}

/**
 * Returns the standard 503 response when all AI providers fail authentication.
 */
export function aiAuthErrorResponse(details?: string): NextResponse {
  return NextResponse.json(
    {
      error: 'AI service temporarily unavailable',
      message: 'All configured AI providers failed authentication. Please check API keys.',
      ...(details && { details }),
    },
    { status: 503 }
  );
}
