---
title: "How to Fetch Bitcoin Price Data in Python"
description: "Learn how to fetch live and historical Bitcoin price data in Python using free APIs. Covers requests, httpx, async fetching, and data analysis with pandas."
date: "2026-03-30"
author: team
category: tutorial
tags: ["python", "bitcoin", "api", "price", "pandas", "developer"]
image: "/images/blog/bitcoin-price-api-python.jpg"
imageAlt: "Python code terminal showing Bitcoin price data fetching and analysis"
---

Python is the language of choice for data analysis, algorithmic trading, and automation scripts in the crypto space. Its vast ecosystem of libraries — requests, httpx, pandas, matplotlib — makes it uniquely well-suited for working with cryptocurrency price data. This guide walks through everything from a simple price fetch to historical data analysis.

## Prerequisites

You need Python 3.8 or later. Install the required packages:

```bash
pip install httpx pandas python-dotenv
```

## Fetching the Current Bitcoin Price

The simplest approach uses the CoinGecko free API — no API key required:

```python
import httpx

def get_bitcoin_price() -> dict:
    """Fetch current Bitcoin price from CoinGecko."""
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": "bitcoin",
        "vs_currencies": "usd,eur,gbp",
        "include_24hr_change": "true",
        "include_market_cap": "true",
    }

    response = httpx.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()

data = get_bitcoin_price()
btc = data["bitcoin"]

print(f"Bitcoin Price: ${btc['usd']:,.2f}")
print(f"24h Change:    {btc['usd_24h_change']:+.2f}%")
print(f"Market Cap:    ${btc['usd_market_cap']:,.0f}")
```

## Fetching Multiple Cryptocurrencies at Once

```python
def get_crypto_prices(coin_ids: list[str], currency: str = "usd") -> dict:
    """Fetch prices for multiple coins in a single request."""
    url = "https://api.coingecko.com/api/v3/simple/price"
    response = httpx.get(url, params={
        "ids": ",".join(coin_ids),
        "vs_currencies": currency,
        "include_24hr_change": "true",
    }, timeout=10)
    response.raise_for_status()
    return response.json()

coins = ["bitcoin", "ethereum", "solana", "cardano", "avalanche-2"]
prices = get_crypto_prices(coins)

print(f"{'Coin':<15} {'Price':>12} {'24h Change':>12}")
print("-" * 42)
for coin_id, data in prices.items():
    name = coin_id.replace("-", " ").title()
    price = data.get("usd", 0)
    change = data.get("usd_24h_change", 0)
    print(f"{name:<15} ${price:>11,.2f} {change:>+11.2f}%")
```

## Fetching Historical Bitcoin Price Data

For backtesting, analysis, and charting, you need historical data:

```python
import httpx
import pandas as pd
from datetime import datetime

def get_historical_prices(coin_id: str, days: int = 365) -> pd.DataFrame:
    """Fetch daily closing prices for the past N days."""
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    params = {
        "vs_currency": "usd",
        "days": days,
        "interval": "daily",
    }

    response = httpx.get(url, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()

    df = pd.DataFrame(data["prices"], columns=["timestamp", "price"])
    df["date"] = pd.to_datetime(df["timestamp"], unit="ms")
    df = df.drop("timestamp", axis=1)
    df = df.set_index("date")

    # Add volume and market cap if needed
    volume_df = pd.DataFrame(data["total_volumes"], columns=["timestamp", "volume"])
    volume_df["date"] = pd.to_datetime(volume_df["timestamp"], unit="ms")
    df["volume"] = volume_df.set_index("date")["volume"]

    return df

# Fetch 1 year of Bitcoin price history
btc_history = get_historical_prices("bitcoin", days=365)
print(btc_history.tail(10))
print(f"\nAll-time high in period: ${btc_history['price'].max():,.2f}")
print(f"All-time low in period:  ${btc_history['price'].min():,.2f}")
```

## Basic Price Analysis with Pandas

```python
def analyze_bitcoin_performance(df: pd.DataFrame) -> dict:
    """Calculate key performance metrics from price history."""
    df = df.copy()
    df["daily_return"] = df["price"].pct_change()
    df["cumulative_return"] = (1 + df["daily_return"]).cumprod() - 1

    # Rolling averages
    df["ma_7"] = df["price"].rolling(7).mean()
    df["ma_30"] = df["price"].rolling(30).mean()
    df["ma_200"] = df["price"].rolling(200).mean()

    # Volatility (annualized)
    daily_vol = df["daily_return"].std()
    annual_vol = daily_vol * (365 ** 0.5)

    # Sharpe ratio (simplified, no risk-free rate)
    avg_daily_return = df["daily_return"].mean()
    sharpe = (avg_daily_return / daily_vol) * (365 ** 0.5) if daily_vol > 0 else 0

    return {
        "start_price": df["price"].iloc[0],
        "end_price": df["price"].iloc[-1],
        "total_return": df["cumulative_return"].iloc[-1] * 100,
        "max_price": df["price"].max(),
        "min_price": df["price"].min(),
        "annual_volatility": annual_vol * 100,
        "sharpe_ratio": sharpe,
        "positive_days": (df["daily_return"] > 0).sum(),
        "negative_days": (df["daily_return"] < 0).sum(),
    }

btc_df = get_historical_prices("bitcoin", days=365)
metrics = analyze_bitcoin_performance(btc_df)

for key, value in metrics.items():
    if isinstance(value, float):
        print(f"{key:25}: {value:.2f}")
    else:
        print(f"{key:25}: {value}")
```

## Async Price Fetching for Multiple Coins

When you need to fetch many coins quickly, async HTTP is dramatically faster:

```python
import asyncio
import httpx

async def fetch_price_async(client: httpx.AsyncClient, coin_id: str) -> dict:
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {"ids": coin_id, "vs_currencies": "usd", "include_24hr_change": "true"}
    response = await client.get(url, params=params)
    response.raise_for_status()
    return {coin_id: response.json().get(coin_id, {})}

async def fetch_all_prices(coin_ids: list[str]) -> dict:
    async with httpx.AsyncClient(timeout=15) as client:
        tasks = [fetch_price_async(client, coin) for coin in coin_ids]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    combined = {}
    for result in results:
        if isinstance(result, dict):
            combined.update(result)
    return combined

coins = ["bitcoin", "ethereum", "solana", "polkadot", "chainlink", "uniswap"]
prices = asyncio.run(fetch_all_prices(coins))
```

## Fetching Crypto News Alongside Prices

The [free-crypto-news API](https://free-crypto-news.com) provides no-key news data that pairs well with price data:

```python
def get_bitcoin_news(limit: int = 10) -> list[dict]:
    """Fetch latest Bitcoin news from free-crypto-news."""
    url = "https://free-crypto-news.com/api/news"
    params = {"symbols": "BTC", "limit": limit}
    response = httpx.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json().get("articles", [])

news = get_bitcoin_news()
for article in news:
    print(f"[{article['source']}] {article['title']}")
    print(f"  Published: {article['publishedAt']}\n")
```

## Saving Data to CSV

```python
def save_prices_to_csv(coin_id: str, days: int, filename: str = None) -> str:
    """Fetch and save historical prices to a CSV file."""
    df = get_historical_prices(coin_id, days=days)
    if filename is None:
        filename = f"{coin_id}_prices_{days}d.csv"
    df.to_csv(filename)
    print(f"Saved {len(df)} rows to {filename}")
    return filename

save_prices_to_csv("bitcoin", days=90)
```

## Scheduling Regular Price Fetches

For monitoring and alerting, you can use Python's `schedule` library:

```bash
pip install schedule
```

```python
import schedule
import time
import httpx
from datetime import datetime

def price_check():
    data = get_bitcoin_price()
    price = data["bitcoin"]["usd"]
    change = data["bitcoin"]["usd_24h_change"]
    print(f"[{datetime.now():%H:%M:%S}] BTC: ${price:,.2f} ({change:+.2f}%)")

    if change < -5:
        print("ALERT: Bitcoin down more than 5% in 24 hours!")

# Check every 5 minutes
schedule.every(5).minutes.do(price_check)

print("Price monitoring started...")
while True:
    schedule.run_pending()
    time.sleep(30)
```

## Rate Limiting and Caching

Free APIs have rate limits. Implement simple caching to avoid hitting them:

```python
import time
from functools import wraps

_cache: dict = {}
CACHE_TTL = 30  # seconds

def cached(ttl: int = CACHE_TTL):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = str(args) + str(sorted(kwargs.items()))
            if cache_key in _cache:
                result, timestamp = _cache[cache_key]
                if time.time() - timestamp < ttl:
                    return result
            result = func(*args, **kwargs)
            _cache[cache_key] = (result, time.time())
            return result
        return wrapper
    return decorator

@cached(ttl=30)
def get_bitcoin_price():
    # ... same implementation as before
    pass
```

## Conclusion

Python makes it remarkably easy to work with Bitcoin and cryptocurrency price data. From a simple `httpx.get()` call to full historical analysis with pandas, the tools are mature and the free APIs are generous. Whether you are building a price alerting script, backtesting a trading strategy, or feeding data into a machine learning pipeline, this foundation will serve you well.
