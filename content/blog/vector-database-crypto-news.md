---
title: "Using Vector Databases to Search Crypto News"
description: "Learn how to build a semantic search system for cryptocurrency news using vector embeddings, Pinecone or Weaviate, and OpenAI or open-source embedding models."
date: "2026-03-30"
author: team
category: tutorial
tags: ["vector-database", "embeddings", "semantic-search", "ai", "developer", "news"]
image: "/images/blog/vector-database-crypto-news.jpg"
imageAlt: "Vector database semantic search interface finding related cryptocurrency news articles"
---

Traditional keyword search fails for cryptocurrency news. A query for "Bitcoin price crash" won't find an article titled "BTC drops 15% amid macro uncertainty." Vector databases solve this by converting text to numerical embeddings that capture semantic meaning, enabling searches that find conceptually related content regardless of exact word matches.

## How Vector Search Works

1. **Embedding**: Each text chunk is converted to a high-dimensional vector (e.g., 1536 dimensions for OpenAI's ada-002 model)
2. **Storage**: Vectors are stored in a specialized database optimized for similarity search
3. **Query**: Your search query is also embedded, and the database finds the nearest vectors (most similar content)

Two articles about the same concept have vectors that are "close" in high-dimensional space, even if they use completely different words.

## Choosing a Vector Database

| Database | Type | Free Tier | Notes |
|----------|------|-----------|-------|
| Pinecone | Managed cloud | 1M vectors | Easy to start, no infra |
| Weaviate | Self-hosted / cloud | Open source | Rich features, GraphQL |
| Chroma | Local | Open source | Great for development |
| Qdrant | Self-hosted / cloud | Open source | High performance |
| pgvector | PostgreSQL extension | Open source | Stay in Postgres |

## Setting Up Chroma for Development

Chroma runs locally, perfect for prototyping:

```bash
pip install chromadb openai httpx
```

```python
import chromadb
from openai import OpenAI
import httpx

# Initialize clients
chroma_client = chromadb.Client()  # In-memory; use PersistentClient for disk
openai_client = OpenAI()

collection = chroma_client.create_collection(name="crypto_news")
```

## Fetching and Embedding News

```python
def fetch_crypto_news(symbol: str = "BTC", limit: int = 50) -> list[dict]:
    """Fetch news from free-crypto-news API."""
    response = httpx.get(
        "https://free-crypto-news.com/api/news",
        params={"symbols": symbol, "limit": limit},
        timeout=15,
    )
    response.raise_for_status()
    return response.json().get("articles", [])

def embed_texts(texts: list[str], model: str = "text-embedding-3-small") -> list[list[float]]:
    """Create embeddings for a list of texts."""
    # Batch to avoid token limits
    batch_size = 100
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = openai_client.embeddings.create(input=batch, model=model)
        all_embeddings.extend([item.embedding for item in response.data])

    return all_embeddings

def index_news_articles(articles: list[dict]):
    """Embed and store articles in the vector database."""
    texts = []
    ids = []
    metadatas = []

    for article in articles:
        # Combine title and description for richer embeddings
        text = f"{article['title']}. {article.get('description', '')}"
        texts.append(text)
        ids.append(article["url"])  # URL as unique ID
        metadatas.append({
            "title": article["title"],
            "source": article.get("source", ""),
            "publishedAt": article.get("publishedAt", ""),
            "url": article["url"],
            "symbols": ",".join(article.get("symbols", [])),
        })

    embeddings = embed_texts(texts)

    # Store in ChromaDB
    collection.add(
        embeddings=embeddings,
        documents=texts,
        ids=ids,
        metadatas=metadatas,
    )

    print(f"Indexed {len(articles)} articles")
```

## Semantic Search

```python
def semantic_search(query: str, n_results: int = 5, filter_symbol: str = None) -> list[dict]:
    """Search for semantically similar news articles."""
    # Embed the query
    query_embedding = embed_texts([query])[0]

    # Build filter
    where = None
    if filter_symbol:
        where = {"symbols": {"$contains": filter_symbol}}

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where=where,
        include=["metadatas", "distances", "documents"],
    )

    articles = []
    for i, (metadata, distance, document) in enumerate(zip(
        results["metadatas"][0],
        results["distances"][0],
        results["documents"][0],
    )):
        articles.append({
            **metadata,
            "similarity_score": 1 - distance,  # Convert distance to similarity
            "text": document,
        })

    return articles

# Index some news
btc_news = fetch_crypto_news("BTC", 50)
eth_news = fetch_crypto_news("ETH", 50)
index_news_articles(btc_news + eth_news)

# Search semantically
results = semantic_search("Bitcoin adoption by institutions")
for r in results:
    print(f"[{r['similarity_score']:.3f}] {r['title']}")
    print(f"  {r['source']} | {r['publishedAt'][:10]}\n")
```

## Using Pinecone for Production

```bash
pip install pinecone-client
```

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

# Create index (if it doesn't exist)
index_name = "crypto-news"
if index_name not in [i.name for i in pc.list_indexes()]:
    pc.create_index(
        name=index_name,
        dimension=1536,  # OpenAI text-embedding-3-small
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )

index = pc.Index(index_name)

def upsert_to_pinecone(articles: list[dict]):
    """Upsert articles into Pinecone."""
    vectors = []
    texts = [f"{a['title']}. {a.get('description', '')}" for a in articles]
    embeddings = embed_texts(texts)

    for article, embedding in zip(articles, embeddings):
        vectors.append({
            "id": article["url"][:512],  # Pinecone ID limit
            "values": embedding,
            "metadata": {
                "title": article["title"][:1000],
                "source": article.get("source", ""),
                "publishedAt": article.get("publishedAt", ""),
                "url": article["url"][:1000],
            },
        })

    # Upsert in batches of 100
    for i in range(0, len(vectors), 100):
        index.upsert(vectors=vectors[i:i+100])

def search_pinecone(query: str, top_k: int = 5) -> list[dict]:
    query_embedding = embed_texts([query])[0]

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
    )

    return [
        {
            **match.metadata,
            "similarity_score": match.score,
        }
        for match in results.matches
    ]
```

## Building a News Search API

```python
from fastapi import FastAPI, Query
from typing import Optional

app = FastAPI(title="Crypto News Semantic Search")

@app.on_event("startup")
async def load_index():
    """Index recent news on startup."""
    news = fetch_crypto_news("BTC", 100) + fetch_crypto_news("ETH", 100)
    index_news_articles(news)

@app.get("/search")
async def search_news(
    q: str = Query(..., description="Search query"),
    symbol: Optional[str] = Query(None, description="Filter by coin symbol"),
    limit: int = Query(10, ge=1, le=50),
):
    results = semantic_search(q, n_results=limit, filter_symbol=symbol)
    return {
        "query": q,
        "results": [
            {
                "title": r["title"],
                "source": r["source"],
                "url": r["url"],
                "publishedAt": r["publishedAt"],
                "score": round(r["similarity_score"], 4),
            }
            for r in results
        ],
    }

@app.get("/similar/{article_id}")
async def find_similar(article_id: str, limit: int = 5):
    """Find articles similar to a given article URL."""
    # Get the article's existing embedding from the collection
    result = collection.get(ids=[article_id], include=["embeddings"])
    if not result["embeddings"]:
        return {"error": "Article not found"}

    embedding = result["embeddings"][0]
    results = collection.query(query_embeddings=[embedding], n_results=limit + 1)

    # Exclude the article itself
    similar = [
        r for r in zip(results["metadatas"][0], results["distances"][0])
        if r[0].get("url") != article_id
    ][:limit]

    return {
        "similar": [
            {"title": m["title"], "url": m["url"], "score": round(1 - d, 4)}
            for m, d in similar
        ]
    }
```

## Keeping the Index Fresh

```python
import asyncio
from datetime import datetime, timedelta

async def refresh_news_index():
    """Periodically fetch new articles and index them."""
    seen_urls = set(collection.get()["ids"])

    while True:
        news = fetch_crypto_news("BTC", 20) + fetch_crypto_news("ETH", 20)
        new_articles = [a for a in news if a["url"] not in seen_urls]

        if new_articles:
            index_news_articles(new_articles)
            seen_urls.update(a["url"] for a in new_articles)
            print(f"[{datetime.now():%H:%M}] Indexed {len(new_articles)} new articles")

        await asyncio.sleep(300)  # Refresh every 5 minutes

asyncio.run(refresh_news_index())
```

## Conclusion

Vector databases transform cryptocurrency news from a keyword-searchable archive into a semantically rich knowledge base. Users can search with natural language ("what are analysts saying about the Bitcoin ETF?") and find conceptually relevant articles even without exact keyword matches. The combination of the free-crypto-news API for content ingestion and a vector database for retrieval creates a powerful foundation for AI-powered research tools.
