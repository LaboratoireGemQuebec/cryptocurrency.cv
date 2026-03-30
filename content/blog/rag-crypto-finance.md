---
title: "RAG for Crypto: Retrieval-Augmented Generation in Finance"
description: "Learn how to build a RAG system for cryptocurrency research using vector databases, live news feeds, and LLMs to answer financial questions with grounded, current data."
date: "2026-03-30"
author: team
category: tutorial
tags: ["rag", "llm", "ai", "python", "vector-database", "developer"]
image: "/images/blog/rag-crypto-finance.jpg"
imageAlt: "RAG system architecture diagram showing retrieval from news corpus feeding into LLM response generation"
---

Retrieval-Augmented Generation (RAG) is an AI architecture pattern that addresses a fundamental limitation of language models: their knowledge is frozen at training time. RAG solves this by retrieving relevant documents at query time and injecting them into the model's context. For cryptocurrency research, RAG enables questions like "What are analysts saying about Bitcoin's next move?" to be answered with today's actual news, not stale training data.

## RAG Architecture

A RAG system has two phases:

**Indexing** (offline):
1. Collect documents (news articles, research reports, on-chain data summaries)
2. Chunk documents into retrievable pieces
3. Embed each chunk using an embedding model
4. Store embeddings in a vector database

**Retrieval + Generation** (online, per query):
1. Embed the user's question
2. Find the k most similar chunks in the vector database
3. Inject retrieved chunks into the LLM prompt as context
4. LLM generates an answer grounded in the retrieved context

## Building the Document Store

```python
import httpx
import chromadb
from openai import OpenAI
from typing import Optional
import json

client = OpenAI()
chroma = chromadb.Client()
collection = chroma.create_collection("crypto_knowledge")

def fetch_and_prepare_documents() -> list[dict]:
    """Fetch news articles and prepare them as RAG documents."""
    documents = []

    # Fetch from free-crypto-news API
    symbols = ["BTC", "ETH", "SOL", "BNB"]
    for symbol in symbols:
        response = httpx.get(
            "https://free-crypto-news.com/api/news",
            params={"symbols": symbol, "limit": 30},
            timeout=15,
        )
        articles = response.json().get("articles", [])

        for article in articles:
            # Combine title and description for context
            content = f"Title: {article['title']}\n"
            if article.get("description"):
                content += f"Summary: {article['description']}\n"
            content += f"Source: {article['source']}\n"
            content += f"Date: {article['publishedAt'][:10]}\n"
            content += f"URL: {article['url']}"

            documents.append({
                "id": article["url"][:512],
                "content": content,
                "metadata": {
                    "symbol": symbol,
                    "source": article["source"],
                    "publishedAt": article["publishedAt"],
                    "title": article["title"],
                },
            })

    return documents

def index_documents(documents: list[dict]):
    """Embed and store documents in the vector database."""
    texts = [d["content"] for d in documents]
    ids = [d["id"] for d in documents]
    metadatas = [d["metadata"] for d in documents]

    # Embed in batches
    batch_size = 50
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = client.embeddings.create(
            input=batch,
            model="text-embedding-3-small",
        )
        all_embeddings.extend([item.embedding for item in response.data])

    collection.add(
        embeddings=all_embeddings,
        documents=texts,
        ids=ids,
        metadatas=metadatas,
    )

    print(f"Indexed {len(documents)} documents")
```

## The Retrieval Function

```python
def retrieve_relevant_context(
    query: str,
    n_results: int = 5,
    symbol_filter: Optional[str] = None,
) -> list[dict]:
    """Retrieve the most relevant documents for a query."""
    query_embedding = client.embeddings.create(
        input=[query],
        model="text-embedding-3-small",
    ).data[0].embedding

    where = {"symbol": symbol_filter} if symbol_filter else None

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where=where,
        include=["documents", "metadatas", "distances"],
    )

    context_items = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        context_items.append({
            "content": doc,
            "metadata": meta,
            "relevance_score": 1 - dist,
        })

    return context_items
```

## The RAG Generation Function

```python
def rag_query(
    question: str,
    n_context_docs: int = 5,
    symbol_filter: Optional[str] = None,
) -> dict:
    """Answer a crypto question using RAG."""

    # Step 1: Retrieve relevant context
    context_docs = retrieve_relevant_context(
        question, n_results=n_context_docs, symbol_filter=symbol_filter
    )

    if not context_docs:
        return {
            "answer": "No relevant context found. Please ensure the knowledge base is populated.",
            "sources": [],
        }

    # Step 2: Format context for the prompt
    context_text = "\n\n---\n\n".join([
        f"[Document {i+1} | Score: {doc['relevance_score']:.3f}]\n{doc['content']}"
        for i, doc in enumerate(context_docs)
    ])

    # Step 3: Generate answer with grounded context
    prompt = f"""You are a cryptocurrency research analyst. Answer the question below using ONLY the provided context documents.

If the context doesn't contain sufficient information to answer the question, say so explicitly.
Always cite which documents you used (Document 1, Document 2, etc.).
Include the date of information when relevant.

Context Documents:
{context_text}

Question: {question}

Answer:"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,  # Low temperature for factual responses
        max_tokens=800,
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "sources": [
            {
                "title": doc["metadata"].get("title"),
                "source": doc["metadata"].get("source"),
                "publishedAt": doc["metadata"].get("publishedAt"),
                "relevance": doc["relevance_score"],
            }
            for doc in context_docs
        ],
        "context_docs_used": len(context_docs),
    }
```

## Testing the RAG System

```python
# Initialize and index
documents = fetch_and_prepare_documents()
index_documents(documents)

# Test queries
queries = [
    "What is the current sentiment around Bitcoin ETFs?",
    "What risks are analysts warning about for Ethereum?",
    "Are there any regulatory concerns affecting crypto markets?",
    "What is the latest news about Solana DeFi?",
]

for query in queries:
    print(f"\nQ: {query}")
    result = rag_query(query)
    print(f"A: {result['answer'][:500]}...")
    print(f"Sources: {len(result['sources'])} documents used")
    for src in result['sources'][:3]:
        print(f"  - {src['title']} ({src['source']}, {src.get('publishedAt', '')[:10]})")
```

## Adding Streaming Responses

```python
def rag_query_stream(question: str, n_context_docs: int = 5):
    """Stream a RAG response token by token."""
    context_docs = retrieve_relevant_context(question, n_results=n_context_docs)
    context_text = "\n\n---\n\n".join([
        f"[Doc {i+1}]\n{doc['content']}"
        for i, doc in enumerate(context_docs)
    ])

    prompt = f"""Answer based on context only.

Context:
{context_text}

Question: {question}
Answer:"""

    for chunk in client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        stream=True,
    ):
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content

# Usage
for token in rag_query_stream("What happened with Bitcoin today?"):
    print(token, end="", flush=True)
print()
```

## Hybrid Search: Dense + Sparse

Combining vector search with keyword search improves retrieval accuracy:

```python
from rank_bm25 import BM25Okapi
import numpy as np

class HybridRetriever:
    def __init__(self, documents: list[dict]):
        self.documents = documents
        self.texts = [d["content"] for d in documents]

        # BM25 index for keyword search
        tokenized = [t.lower().split() for t in self.texts]
        self.bm25 = BM25Okapi(tokenized)

    def search(self, query: str, k: int = 5, alpha: float = 0.5) -> list[dict]:
        """
        Hybrid search combining BM25 and vector similarity.
        alpha: weight for dense search (0=all BM25, 1=all vector)
        """
        # BM25 scores
        bm25_scores = self.bm25.get_scores(query.lower().split())
        bm25_normalized = (bm25_scores - bm25_scores.min()) / (bm25_scores.max() - bm25_scores.min() + 1e-10)

        # Vector scores (from ChromaDB)
        context = retrieve_relevant_context(query, n_results=len(self.documents))
        vector_scores = np.zeros(len(self.documents))
        for item in context:
            for i, doc in enumerate(self.documents):
                if doc["id"] == item["metadata"].get("url", ""):
                    vector_scores[i] = item["relevance_score"]

        # Combine scores
        combined = alpha * vector_scores + (1 - alpha) * bm25_normalized
        top_indices = np.argsort(combined)[::-1][:k]

        return [self.documents[i] for i in top_indices]
```

## RAG vs Fine-Tuning

For cryptocurrency applications, RAG is almost always preferable to fine-tuning:

| Factor | RAG | Fine-tuning |
|--------|-----|-------------|
| Data freshness | Always current | Frozen at training |
| Cost | Low (inference only) | High (training cost) |
| Explainability | High (cite sources) | Low |
| Latency | Higher (retrieval step) | Lower |
| Update frequency | Real-time possible | Requires retraining |

## Conclusion

RAG is the right architecture for cryptocurrency research applications where data freshness matters. By combining the free-crypto-news API as the content source, vector databases for retrieval, and GPT-4 or Claude for generation, you can build a research assistant that always answers based on today's actual market news — not frozen training data. The pattern scales from a personal research tool to an enterprise financial intelligence platform.
