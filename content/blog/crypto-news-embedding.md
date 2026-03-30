---
title: "Embedding Crypto News for Semantic Search"
description: "Learn how to embed cryptocurrency news articles into vector spaces for semantic search, similarity detection, and AI-powered research tools using Python."
date: "2026-03-30"
author: team
category: tutorial
tags: ["embeddings", "nlp", "semantic-search", "python", "ai", "developer"]
image: "/images/blog/crypto-news-embedding.jpg"
imageAlt: "Vector embedding space visualization showing clusters of related cryptocurrency news articles"
---

Text embeddings convert words and sentences into numerical vectors that capture semantic meaning. Two articles about "Bitcoin ETF approval" will have similar vectors even if they use different words. This mathematical representation of meaning powers semantic search, duplicate detection, topic clustering, and recommendation systems. For crypto news applications, embeddings unlock capabilities that keyword search simply cannot provide.

## Understanding Embeddings

An embedding is a list of floating point numbers (a vector) that represents the meaning of a piece of text. OpenAI's `text-embedding-3-small` produces 1536-dimensional vectors. The critical property: semantically similar texts produce vectors with small distances between them (high cosine similarity).

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def embed(text: str) -> list[float]:
    return client.embeddings.create(
        input=text,
        model="text-embedding-3-small",
    ).data[0].embedding

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Similar headlines have high cosine similarity
e1 = embed("Bitcoin surges to new all-time high")
e2 = embed("BTC reaches record price level")
e3 = embed("Ethereum staking rewards increase")

print(f"BTC headline 1 vs 2: {cosine_similarity(e1, e2):.4f}")  # High (~0.85)
print(f"BTC headline 1 vs ETH: {cosine_similarity(e1, e3):.4f}")  # Lower (~0.65)
```

## Open-Source Embedding Models

For cost-effective embedding, use sentence-transformers:

```bash
pip install sentence-transformers
```

```python
from sentence_transformers import SentenceTransformer

# High-quality open-source embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")  # 384 dimensions, fast
# Or for higher quality:
# model = SentenceTransformer("all-mpnet-base-v2")  # 768 dimensions

def embed_local(texts: list[str]) -> np.ndarray:
    return model.encode(texts, normalize_embeddings=True)

# Batch embedding (much faster than one-by-one)
headlines = [
    "Bitcoin hits $100K for first time",
    "BTC breaks six-figure barrier",
    "Ethereum layer 2 activity hits record",
    "Solana DeFi volume surges",
]

embeddings = embed_local(headlines)
print(f"Shape: {embeddings.shape}")  # (4, 384)
```

## Fetching and Embedding News Pipeline

```python
import httpx
import json
import pickle
from pathlib import Path
from datetime import datetime

def fetch_crypto_news(symbol: str, limit: int = 50) -> list[dict]:
    response = httpx.get(
        "https://free-crypto-news.com/api/news",
        params={"symbols": symbol, "limit": limit},
        timeout=15,
    )
    return response.json().get("articles", [])

class NewsEmbeddingStore:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.articles: list[dict] = []
        self.embeddings: np.ndarray | None = None

    def add_articles(self, articles: list[dict]):
        # Avoid duplicates
        existing_urls = {a["url"] for a in self.articles}
        new_articles = [a for a in articles if a["url"] not in existing_urls]

        if not new_articles:
            return 0

        # Create text for embedding (title + description)
        texts = [
            f"{a['title']}. {a.get('description', '')}"
            for a in new_articles
        ]

        new_embeddings = self.model.encode(texts, normalize_embeddings=True)

        self.articles.extend(new_articles)
        if self.embeddings is None:
            self.embeddings = new_embeddings
        else:
            self.embeddings = np.vstack([self.embeddings, new_embeddings])

        return len(new_articles)

    def search(self, query: str, k: int = 10, threshold: float = 0.3) -> list[dict]:
        if not self.articles or self.embeddings is None:
            return []

        query_embedding = self.model.encode([query], normalize_embeddings=True)[0]
        similarities = self.embeddings @ query_embedding

        # Get top-k results above threshold
        top_indices = np.argsort(similarities)[::-1]
        results = []

        for idx in top_indices[:k * 2]:  # Get more to filter
            if similarities[idx] >= threshold:
                results.append({
                    **self.articles[idx],
                    "similarity": float(similarities[idx]),
                })
            if len(results) >= k:
                break

        return results

    def find_similar(self, url: str, k: int = 5) -> list[dict]:
        """Find articles similar to a given article by URL."""
        try:
            idx = next(i for i, a in enumerate(self.articles) if a["url"] == url)
        except StopIteration:
            return []

        article_embedding = self.embeddings[idx]
        similarities = self.embeddings @ article_embedding
        similarities[idx] = -1  # Exclude the article itself

        top_indices = np.argsort(similarities)[::-1][:k]
        return [
            {**self.articles[i], "similarity": float(similarities[i])}
            for i in top_indices
        ]

    def detect_duplicates(self, threshold: float = 0.92) -> list[tuple]:
        """Find pairs of articles that are likely duplicates."""
        if self.embeddings is None:
            return []

        similarity_matrix = self.embeddings @ self.embeddings.T
        duplicates = []

        for i in range(len(self.articles)):
            for j in range(i + 1, len(self.articles)):
                if similarity_matrix[i, j] >= threshold:
                    duplicates.append((
                        self.articles[i]["url"],
                        self.articles[j]["url"],
                        float(similarity_matrix[i, j]),
                    ))

        return duplicates

    def save(self, path: str):
        with open(path, "wb") as f:
            pickle.dump({"articles": self.articles, "embeddings": self.embeddings}, f)

    @classmethod
    def load(cls, path: str) -> "NewsEmbeddingStore":
        store = cls()
        with open(path, "rb") as f:
            data = pickle.load(f)
        store.articles = data["articles"]
        store.embeddings = data["embeddings"]
        return store
```

## Topic Clustering

Group related articles together automatically:

```python
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_distances

def cluster_news(store: NewsEmbeddingStore, n_clusters: int = 10) -> list[dict]:
    """Cluster articles into topic groups."""
    if store.embeddings is None or len(store.articles) < n_clusters:
        return []

    # K-means on the embeddings
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(store.embeddings)

    # Group articles by cluster
    clusters = {}
    for i, (article, label) in enumerate(zip(store.articles, labels)):
        if label not in clusters:
            clusters[label] = []
        clusters[label].append({
            **article,
            "distance_to_center": float(cosine_distances(
                [store.embeddings[i]],
                [kmeans.cluster_centers_[label]]
            )[0][0]),
        })

    # Sort each cluster by distance to center (most representative first)
    for label in clusters:
        clusters[label].sort(key=lambda x: x["distance_to_center"])

    return [
        {
            "cluster_id": label,
            "articles": articles,
            "representative_title": articles[0]["title"],
            "size": len(articles),
        }
        for label, articles in clusters.items()
    ]

# Usage
store = NewsEmbeddingStore()
for symbol in ["BTC", "ETH", "SOL", "DeFi"]:
    news = fetch_crypto_news(symbol, 30)
    added = store.add_articles(news)
    print(f"Added {added} articles for {symbol}")

# Search
results = store.search("Bitcoin institutional adoption")
print(f"\nSearch: 'Bitcoin institutional adoption'")
for r in results[:5]:
    print(f"  [{r['similarity']:.3f}] {r['title']}")

# Cluster
clusters = cluster_news(store, n_clusters=8)
for c in clusters[:5]:
    print(f"\nCluster {c['cluster_id']} ({c['size']} articles)")
    print(f"  Representative: {c['representative_title']}")
```

## Building a News Recommendation Engine

```python
def recommend_articles(
    store: NewsEmbeddingStore,
    read_history: list[str],  # list of article URLs the user has read
    n_recommendations: int = 10,
) -> list[dict]:
    """Recommend articles based on reading history."""
    if not read_history or store.embeddings is None:
        return []

    # Get embeddings for read articles
    read_indices = [
        i for i, a in enumerate(store.articles)
        if a["url"] in read_history
    ]

    if not read_indices:
        return []

    # User interest vector = average of read article embeddings
    user_vector = store.embeddings[read_indices].mean(axis=0)
    user_vector = user_vector / np.linalg.norm(user_vector)

    # Find similar unread articles
    similarities = store.embeddings @ user_vector
    already_read = set(read_history)

    candidates = [
        {**store.articles[i], "recommendation_score": float(similarities[i])}
        for i in np.argsort(similarities)[::-1]
        if store.articles[i]["url"] not in already_read
    ]

    return candidates[:n_recommendations]
```

## Conclusion

Embeddings transform cryptocurrency news from a linear stream into a rich, queryable knowledge space. With sentence-transformers running locally or OpenAI's embedding API for higher quality, you can power semantic search, duplicate detection, topic clustering, and recommendation systems. The free-crypto-news API provides the content; embeddings make it intelligently navigable.
