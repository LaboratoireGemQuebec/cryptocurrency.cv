---
title: "Using LangChain to Build Crypto-Aware AI Tools"
description: "Learn how to build cryptocurrency-aware AI tools using LangChain with live price data, news feeds, and on-chain data as tool integrations."
date: "2026-03-30"
author: team
category: tutorial
tags: ["langchain", "ai", "llm", "python", "developer", "crypto"]
image: "/images/blog/langchain-crypto-tools.jpg"
imageAlt: "LangChain workflow diagram connecting AI models to cryptocurrency data tools"
---

LangChain is the most widely used framework for building LLM applications in Python. Its tool system makes it straightforward to give language models access to live cryptocurrency data — prices, news, on-chain metrics — and build agents that reason about the information they retrieve. This guide shows you how to build production-ready crypto tools with LangChain.

## Setup

```bash
pip install langchain langchain-openai langchain-community httpx python-dotenv
```

```python
from dotenv import load_dotenv
load_dotenv()  # Load OPENAI_API_KEY, etc.
```

## Defining Crypto Data Tools

LangChain tools are Python functions decorated with `@tool`:

```python
from langchain_core.tools import tool
import httpx
from typing import Optional

SYMBOL_TO_ID = {
    "BTC": "bitcoin", "ETH": "ethereum", "SOL": "solana",
    "BNB": "binancecoin", "ADA": "cardano", "DOT": "polkadot",
    "LINK": "chainlink", "AVAX": "avalanche-2", "MATIC": "matic-network",
    "UNI": "uniswap", "ATOM": "cosmos",
}

@tool
def get_crypto_price(symbol: str) -> str:
    """
    Get the current USD price of a cryptocurrency.
    Input: cryptocurrency symbol like BTC, ETH, SOL
    Returns: current price, 24h change, and market cap
    """
    coin_id = SYMBOL_TO_ID.get(symbol.upper(), symbol.lower())

    response = httpx.get(
        "https://api.coingecko.com/api/v3/simple/price",
        params={
            "ids": coin_id,
            "vs_currencies": "usd",
            "include_24hr_change": "true",
            "include_market_cap": "true",
        },
        timeout=10,
    )

    data = response.json().get(coin_id)
    if not data:
        return f"Could not find price data for {symbol}"

    return (
        f"{symbol.upper()} Price: ${data['usd']:,.2f}\n"
        f"24h Change: {data.get('usd_24h_change', 0):+.2f}%\n"
        f"Market Cap: ${data.get('usd_market_cap', 0):,.0f}"
    )

@tool
def get_crypto_news(symbol: str, limit: int = 5) -> str:
    """
    Get the latest news articles about a cryptocurrency.
    Input: cryptocurrency symbol (e.g. BTC, ETH) and optional limit
    Returns: formatted list of recent news headlines
    """
    response = httpx.get(
        "https://free-crypto-news.com/api/news",
        params={"symbols": symbol, "limit": min(limit, 10)},
        timeout=10,
    )

    articles = response.json().get("articles", [])
    if not articles:
        return f"No recent news found for {symbol}"

    lines = [f"Latest {symbol.upper()} news:"]
    for i, article in enumerate(articles, 1):
        lines.append(f"{i}. {article['title']}")
        lines.append(f"   Source: {article['source']} | {article['publishedAt'][:10]}")
        lines.append(f"   URL: {article['url']}")

    return "\n".join(lines)

@tool
def compare_crypto_prices(symbols: list[str]) -> str:
    """
    Compare the current prices and 24h performance of multiple cryptocurrencies.
    Input: list of cryptocurrency symbols
    Returns: comparison table
    """
    ids = [SYMBOL_TO_ID.get(s.upper(), s.lower()) for s in symbols]

    response = httpx.get(
        "https://api.coingecko.com/api/v3/simple/price",
        params={
            "ids": ",".join(ids),
            "vs_currencies": "usd",
            "include_24hr_change": "true",
            "include_market_cap": "true",
        },
        timeout=10,
    )
    data = response.json()

    lines = [f"{'Symbol':<8} {'Price':>12} {'24h Change':>12} {'Market Cap':>18}"]
    lines.append("-" * 55)

    for symbol, coin_id in zip(symbols, ids):
        coin = data.get(coin_id, {})
        price = coin.get("usd", 0)
        change = coin.get("usd_24h_change", 0)
        mcap = coin.get("usd_market_cap", 0)

        lines.append(
            f"{symbol.upper():<8} ${price:>11,.2f} {change:>+11.2f}% ${mcap:>16,.0f}"
        )

    return "\n".join(lines)

@tool
def get_eth_gas_price() -> str:
    """
    Get current Ethereum gas prices for different transaction speeds.
    Returns: slow, standard, and fast gas prices in gwei
    """
    response = httpx.get("https://api.etherscan.io/api", params={
        "module": "gastracker",
        "action": "gasoracle",
    }, timeout=10)

    result = response.json().get("result", {})

    return (
        f"Ethereum Gas Prices:\n"
        f"Safe (slow):    {result.get('SafeGasPrice', '?')} gwei\n"
        f"Standard:       {result.get('ProposeGasPrice', '?')} gwei\n"
        f"Fast:           {result.get('FastGasPrice', '?')} gwei\n"
        f"Base Fee:       {result.get('suggestBaseFee', '?')} gwei"
    )

@tool
def get_defi_rates(protocol: str = "aave") -> str:
    """
    Get current DeFi lending and borrowing rates from major protocols.
    Input: protocol name (aave, compound)
    Returns: supply and borrow APY for major assets
    """
    query = """
    {
      reserves(where: { isActive: true }, first: 5,
               orderBy: totalLiquidity, orderDirection: desc) {
        symbol
        liquidityRate
        variableBorrowRate
      }
    }
    """
    response = httpx.post(
        "https://api.thegraph.com/subgraphs/name/aave/protocol-v3",
        json={"query": query},
        timeout=15,
    )

    reserves = response.json().get("data", {}).get("reserves", [])

    lines = [f"Aave V3 Rates (Top 5 by liquidity):"]
    lines.append(f"{'Asset':<8} {'Supply APY':>12} {'Borrow APY':>12}")
    lines.append("-" * 35)

    for r in reserves:
        supply = float(r["liquidityRate"]) / 1e27 * 100
        borrow = float(r["variableBorrowRate"]) / 1e27 * 100
        lines.append(f"{r['symbol']:<8} {supply:>11.2f}% {borrow:>11.2f}%")

    return "\n".join(lines)
```

## Building a LangChain Agent

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

# Define the LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0.3)

# Bundle all tools
tools = [
    get_crypto_price,
    get_crypto_news,
    compare_crypto_prices,
    get_eth_gas_price,
    get_defi_rates,
]

# System prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful cryptocurrency market analyst with access to live data tools.

Always use your tools to get current data rather than relying on your training knowledge.
When discussing prices or market conditions, fetch fresh data first.
Be concise and analytical. Cite specific numbers from the data you retrieve.
If asked to compare coins, use the comparison tool for efficiency."""),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

# Create agent
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=5,  # Prevent infinite loops
    handle_parsing_errors=True,
)

# Run queries
response = agent_executor.invoke({
    "input": "What's the current Bitcoin price and what are the top 3 news stories?",
    "chat_history": [],
})
print(response["output"])
```

## Adding Memory (Conversation History)

```python
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# Session-based memory store
store = {}

def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# Wrap agent with history
agent_with_history = RunnableWithMessageHistory(
    agent_executor,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
)

# Multi-turn conversation
session = "user_123"
config = {"configurable": {"session_id": session}}

r1 = agent_with_history.invoke({"input": "What's the ETH price?"}, config=config)
print(r1["output"])

r2 = agent_with_history.invoke({"input": "How does that compare to a week ago?", }, config=config)
print(r2["output"])  # Agent remembers ETH was the topic
```

## Custom Crypto Research Chain

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

def fetch_market_data(symbol: str) -> dict:
    """Fetch all relevant data for a coin."""
    with httpx.Client() as http:
        prices = http.get(
            f"https://api.coingecko.com/api/v3/simple/price?ids={SYMBOL_TO_ID.get(symbol.upper(), symbol.lower())}&vs_currencies=usd&include_24hr_change=true"
        ).json()

        news = http.get(
            f"https://free-crypto-news.com/api/news?symbols={symbol}&limit=5"
        ).json()

    return {
        "symbol": symbol.upper(),
        "price_data": prices,
        "news": news.get("articles", [])[:5],
    }

analysis_prompt = ChatPromptTemplate.from_template("""
Analyze the following market data for {symbol} and provide a brief market summary.

Price data: {price_data}

Recent news:
{news_text}

Write a 2-3 paragraph market analysis covering:
1. Current price action and 24h trend
2. What the news says about sentiment
3. Key factors to watch

Keep it professional and data-driven.
""")

def format_news(data: dict) -> dict:
    news_lines = "\n".join(
        f"- {a['title']} ({a['source']})"
        for a in data["news"]
    )
    return {**data, "news_text": news_lines}

analysis_chain = (
    RunnableLambda(fetch_market_data)
    | RunnableLambda(format_news)
    | analysis_prompt
    | llm
    | StrOutputParser()
)

report = analysis_chain.invoke("ETH")
print(report)
```

## Streaming Responses

```python
async def stream_crypto_analysis(symbol: str):
    """Stream a real-time analysis with live data."""
    data = fetch_market_data(symbol)
    news_text = "\n".join(f"- {a['title']}" for a in data["news"])

    prompt_text = f"""Analyze the current market for {symbol}.
Price data: {data['price_data']}
Recent news: {news_text}
Provide a concise market analysis."""

    async for chunk in llm.astream(prompt_text):
        print(chunk.content, end="", flush=True)
    print()  # newline at end

import asyncio
asyncio.run(stream_crypto_analysis("BTC"))
```

## Conclusion

LangChain's tool system provides a clean, composable way to give LLMs access to live cryptocurrency data. By wrapping price APIs, the free-crypto-news API, and on-chain data sources as decorated tools, you can build research assistants, chatbots, and automated analysis pipelines in relatively few lines of code. The agent framework handles tool selection, execution, and response synthesis automatically.
