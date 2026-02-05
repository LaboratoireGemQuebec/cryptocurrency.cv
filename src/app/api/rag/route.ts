/**
 * RAG API - Ask questions about crypto news
 * 
 * POST /api/rag
 * Query the news archive using natural language with RAG.
 * 
 * Request body:
 * {
 *   "query": "What happened to Bitcoin last week?",
 *   "options": {
 *     "topK": 10,
 *     "maxDocumentsForContext": 5,
 *     "includeSources": true
 *   }
 * }
 * 
 * Response:
 * {
 *   "answer": "Last week, Bitcoin experienced...",
 *   "sources": [...],
 *   "extractedFilters": { "dateRange": {...}, "currencies": [...] },
 *   "processingTime": 1234
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { askRAG, vectorStore } from '@/lib/rag';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, options = {} } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (query.length > 1000) {
      return NextResponse.json(
        { error: 'Query too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Check if vector store has documents
    const isEmpty = await vectorStore.isEmpty();
    if (isEmpty) {
      return NextResponse.json(
        { 
          error: 'Vector store is empty. Run the ingestion script first.',
          hint: 'npm run rag:ingest'
        },
        { status: 503 }
      );
    }

    const response = await askRAG(query, options);

    return NextResponse.json(response);
  } catch (error) {
    console.error('RAG error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await vectorStore.getStats();
    
    return NextResponse.json({
      status: 'ok',
      message: 'RAG service is running',
      stats,
      endpoints: {
        ask: 'POST /api/rag - Ask questions about crypto news',
        search: 'POST /api/rag/search - Search without generating response',
        similar: 'GET /api/rag/similar/:id - Find similar articles',
        summary: 'GET /api/rag/summary/:crypto - Summarize crypto news',
        stats: 'GET /api/rag/stats - Get vector store statistics',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
