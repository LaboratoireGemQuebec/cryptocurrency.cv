/**
 * API Route: RAG Streaming
 * POST /api/rag/stream
 * 
 * Server-Sent Events endpoint for streaming RAG responses
 * with real-time updates on reasoning steps
 */

import { NextRequest } from 'next/server';
import { ragService, createRAGService } from '@/lib/rag';
import { processQuery } from '@/lib/rag/query-processor';
import { contextualizeQuery, conversationMemory, generateConversationId } from '@/lib/rag/conversation-memory';
import { rerankResults } from '@/lib/rag/reranker';
import { callGroq, streamGroq } from '@/lib/groq';
import type { ScoredDocument } from '@/lib/rag/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SSE Helper
function createSSEStream() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array>;

  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
  });

  const send = (event: string, data: unknown) => {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    controller.enqueue(encoder.encode(message));
  };

  const close = () => {
    controller.close();
  };

  return { stream, send, close };
}

export async function POST(request: NextRequest) {
  const { query, conversationId, options = {} } = await request.json();

  if (!query || typeof query !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Query is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { stream, send, close } = createSSEStream();

  // Process in background
  (async () => {
    try {
      const convId = conversationId || generateConversationId();
      send('start', { conversationId: convId, timestamp: Date.now() });

      // Step 1: Query Processing
      send('step', { type: 'processing', message: 'Understanding your question...' });
      
      const [processedQuery, contextualizedQuery] = await Promise.all([
        processQuery(query, {
          useHyDE: options.useHyDE ?? true,
          useDecomposition: options.useDecomposition ?? true,
          useExpansion: options.useExpansion ?? false,
        }),
        contextualizeQuery(query, convId),
      ]);

      send('query_info', {
        original: query,
        contextualized: contextualizedQuery.isFollowUp ? contextualizedQuery.contextualized : query,
        intent: processedQuery.classification.intent,
        complexity: processedQuery.classification.complexity,
        isFollowUp: contextualizedQuery.isFollowUp,
      });

      // Step 2: Retrieval
      send('step', { type: 'searching', message: 'Searching news archives...' });
      
      const service = ragService || createRAGService();
      const searchQuery = contextualizedQuery.isFollowUp 
        ? contextualizedQuery.contextualized 
        : query;
      
      const searchResults = await service.searchNews(searchQuery, {
        limit: 15,
        currencies: processedQuery.classification.entities,
      });

      send('retrieval', {
        documentsFound: searchResults.length,
        topSources: searchResults.slice(0, 3).map(d => ({
          id: d.id,
          title: d.title,
          source: d.source,
          score: d.score,
        })),
      });

      // Step 3: Reranking
      if (searchResults.length > 0) {
        send('step', { type: 'reranking', message: 'Analyzing relevance...' });
        
        const rerankedResults = await rerankResults(searchResults, searchQuery, {
          useTimeDecay: true,
          useSourceCredibility: true,
          useLLMReranking: searchResults.length <= 10,
          diversifySources: true,
        });

        send('reranking', {
          reranked: rerankedResults.slice(0, 5).map(d => ({
            id: d.id,
            title: d.title,
            score: d.score,
          })),
        });

        // Step 4: Generate Answer (Streaming)
        send('step', { type: 'generating', message: 'Generating response...' });

        const context = buildContext(rerankedResults.slice(0, 5));
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(searchQuery, context);

        // Stream the LLM response
        let fullResponse = '';
        
        try {
          // Try streaming if available
          const streamResponse = await streamGroq([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ], {
            temperature: 0.4,
            maxTokens: 800,
          });

          for await (const chunk of streamResponse) {
            fullResponse += chunk;
            send('token', { content: chunk });
          }
        } catch {
          // Fallback to regular call
          const response = await callGroq([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ], {
            temperature: 0.4,
            maxTokens: 800,
          });
          fullResponse = response.content;
          send('token', { content: fullResponse });
        }

        // Save to conversation memory
        await conversationMemory.addMessage(convId, {
          role: 'user',
          content: query,
        });
        await conversationMemory.addMessage(convId, {
          role: 'assistant',
          content: fullResponse,
          metadata: {
            documentsUsed: rerankedResults.slice(0, 5).map(d => d.id),
            cryptosDiscussed: processedQuery.classification.entities,
          },
        });

        // Final response
        send('complete', {
          answer: fullResponse,
          sources: rerankedResults.slice(0, 5).map(d => ({
            id: d.id,
            title: d.title,
            source: d.source,
            url: d.url,
            publishedAt: d.publishedAt,
            score: d.score,
          })),
          metadata: {
            conversationId: convId,
            queryIntent: processedQuery.classification.intent,
            documentsSearched: searchResults.length,
            processingSteps: 4,
          },
        });
      } else {
        send('complete', {
          answer: "I couldn't find any relevant news articles for your question. Try rephrasing or asking about a different topic.",
          sources: [],
          metadata: {
            conversationId: convId,
            documentsSearched: 0,
          },
        });
      }
    } catch (error) {
      send('error', {
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      close();
    }
  })();

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function buildContext(documents: ScoredDocument[]): string {
  return documents
    .map((d, i) => {
      const date = d.publishedAt ? d.publishedAt.toLocaleDateString() : 'unknown date';
      return `[${i + 1}] "${d.title}" (${d.source}, ${date})
${d.content.substring(0, 600)}${d.content.length > 600 ? '...' : ''}`;
    })
    .join('\n\n---\n\n');
}

function buildSystemPrompt(): string {
  return `You are a knowledgeable cryptocurrency news assistant. Your role is to answer questions about crypto based on recent news articles provided to you.

Guidelines:
- Be concise but thorough
- Cite sources by number [1], [2], etc. when referencing specific articles
- If information is uncertain or conflicting, acknowledge it
- Stay factual and avoid speculation
- If the articles don't contain relevant information, say so honestly`;
}

function buildUserPrompt(query: string, context: string): string {
  return `Based on the following news articles, please answer this question:

Question: ${query}

News Articles:
${context}

Please provide a comprehensive answer based on these articles:`;
}
