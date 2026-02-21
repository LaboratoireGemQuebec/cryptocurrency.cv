"""
Free Crypto News Python SDK

100% FREE - no API keys required!

Usage:
    from crypto_news import CryptoNews
    
    news = CryptoNews()
    articles = news.get_latest(limit=10)
    
    for article in articles:
        print(f"{article['title']} - {article['source']}")
"""

import urllib.request
import urllib.parse
import json
from typing import Optional, List, Dict, Any

# Trading-terminal key → search keyword mapping.
# Left side: exchange pair symbol; right side: keyword used for news search.
# Inspired by CyberPunkMetalHead/cryptocurrency-news-analysis.
# No external API needed — this project provides news for free.
COIN_PAIRS: Dict[str, str] = {
    "BTCUSD":  "Bitcoin",
    "ETHUSD":  "Ethereum",
    "LTCUSD":  "Litecoin",
    "XRPUSD":  "Ripple",
    "SOLUSD":  "Solana",
    "BNBUSD":  "Binance",
    "ADAUSD":  "Cardano",
    "AVAXUSD": "Avalanche",
    "DOTUSD":  "Polkadot",
    "MATICUSD":"Polygon",
    "DOGEUSD": "Dogecoin",
    "TRXUSD":  "Tron",
    "XLMUSD":  "Stellar Lumens",
    "XMRUSD":  "Monero",
    "ZECUSD":  "Zcash",
    "BATUSD":  "Basic Attention Token",
    "EOSUSD":  "EOS",
    "NEOUSD":  "NEO",
    "ETCUSD":  "Ethereum Classic",
}

class CryptoNews:
    """Free Crypto News API client."""
    
    BASE_URL = "https://cryptocurrency.cv"
    
    def __init__(self, base_url: Optional[str] = None):
        """
        Initialize the client.
        
        Args:
            base_url: Optional custom API URL (for self-hosted instances)
        """
        self.base_url = base_url or self.BASE_URL
    
    def _request(self, endpoint: str) -> Dict[str, Any]:
        """Make API request."""
        url = f"{self.base_url}{endpoint}"
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode())
    
    def get_latest(self, limit: int = 10, source: Optional[str] = None) -> List[Dict]:
        """
        Get latest crypto news.
        
        Args:
            limit: Max articles (1-50)
            source: Filter by source (coindesk, theblock, decrypt, etc.)
        
        Returns:
            List of news articles
        """
        endpoint = f"/api/news?limit={limit}"
        if source:
            endpoint += f"&source={source}"
        return self._request(endpoint)["articles"]
    
    def search(self, keywords: str, limit: int = 10) -> List[Dict]:
        """
        Search news by keywords.
        
        Args:
            keywords: Comma-separated search terms
            limit: Max results (1-30)
        
        Returns:
            List of matching articles
        """
        encoded = urllib.parse.quote(keywords)
        return self._request(f"/api/search?q={encoded}&limit={limit}")["articles"]
    
    def get_defi(self, limit: int = 10) -> List[Dict]:
        """Get DeFi-specific news."""
        return self._request(f"/api/defi?limit={limit}")["articles"]
    
    def get_bitcoin(self, limit: int = 10) -> List[Dict]:
        """Get Bitcoin-specific news."""
        return self._request(f"/api/bitcoin?limit={limit}")["articles"]
    
    def get_breaking(self, limit: int = 5) -> List[Dict]:
        """Get breaking news (last 2 hours)."""
        return self._request(f"/api/breaking?limit={limit}")["articles"]
    
    def get_sources(self) -> List[Dict]:
        """Get list of all news sources."""
        return self._request("/api/sources")["sources"]
    
    def get_trending(self, limit: int = 10, hours: int = 24) -> Dict:
        """Get trending topics with sentiment."""
        return self._request(f"/api/trending?limit={limit}&hours={hours}")
    
    def get_stats(self) -> Dict:
        """Get API statistics and analytics."""
        return self._request("/api/stats")
    
    def get_health(self) -> Dict:
        """Check API health status."""
        return self._request("/api/health")
    
    def analyze(self, limit: int = 20, topic: Optional[str] = None, sentiment: Optional[str] = None) -> Dict:
        """Get news with topic classification and sentiment analysis."""
        endpoint = f"/api/analyze?limit={limit}"
        if topic:
            endpoint += f"&topic={urllib.parse.quote(topic)}"
        if sentiment:
            endpoint += f"&sentiment={sentiment}"
        return self._request(endpoint)
    
    def get_archive(self, date: Optional[str] = None, query: Optional[str] = None, limit: int = 50) -> Dict:
        """Get archived historical news."""
        params = [f"limit={limit}"]
        if date:
            params.append(f"date={date}")
        if query:
            params.append(f"q={urllib.parse.quote(query)}")
        return self._request(f"/api/archive?{'&'.join(params)}")
    
    def get_origins(self, query: Optional[str] = None, category: Optional[str] = None, limit: int = 20) -> Dict:
        """Find original sources of news."""
        params = [f"limit={limit}"]
        if query:
            params.append(f"q={urllib.parse.quote(query)}")
        if category:
            params.append(f"category={category}")
        return self._request(f"/api/origins?{'&'.join(params)}")
    
    def get_portfolio(self, coins: list, limit: int = 10, include_prices: bool = True) -> Dict:
        """Get portfolio news with optional prices from CoinGecko."""
        coins_param = ','.join(coins) if isinstance(coins, list) else coins
        return self._request(f"/api/portfolio?coins={urllib.parse.quote(coins_param)}&limit={limit}&prices={str(include_prices).lower()}")

    def get_coin_sentiment(
        self,
        coins: Optional[Dict[str, str]] = None,
        limit: int = 30,
    ) -> Dict[str, Dict]:
        """
        Calculate per-coin sentiment percentages from recent news headlines.

        Uses this project's free API instead of an external web search service.
        Inspired by CyberPunkMetalHead/cryptocurrency-news-analysis.

        Args:
            coins: Dict mapping trading pair → search keyword,
                   e.g. {"BTCUSD": "Bitcoin", "ETHUSD": "Ethereum"}.
                   Defaults to the module-level COIN_PAIRS.
            limit: Max articles to fetch per coin (default 30).

        Returns:
            Dict keyed by trading pair symbol::

                {
                  "BTCUSD": {
                    "keyword":   "Bitcoin",
                    "articles":  25,
                    "pos":  64.0,   # % bullish
                    "mid":  20.0,   # % neutral
                    "neg":  16.0,   # % bearish
                    "signal": "bullish"   # dominant label
                  },
                  ...
                }

        Example::

            news = CryptoNews()
            report = news.get_coin_sentiment({"BTCUSD": "Bitcoin", "ETHUSD": "Ethereum"})
            for pair, data in report.items():
                print(pair, data["signal"], f"pos={data['pos']:.0f}%")
        """
        if coins is None:
            coins = COIN_PAIRS

        results: Dict[str, Dict] = {}

        # Sentiment label buckets (matches /api/analyze response)
        _BULLISH = {"very_bullish", "bullish"}
        _BEARISH = {"very_bearish", "bearish"}

        for pair, keyword in coins.items():
            try:
                data = self.analyze(limit=limit, topic=keyword)
                articles = data.get("articles", [])
                total = len(articles)

                if total == 0:
                    results[pair] = {
                        "keyword": keyword,
                        "articles": 0,
                        "pos": 0.0,
                        "mid": 0.0,
                        "neg": 0.0,
                        "signal": "neutral",
                    }
                    continue

                pos = sum(1 for a in articles if a.get("sentiment") in _BULLISH)
                neg = sum(1 for a in articles if a.get("sentiment") in _BEARISH)
                mid = total - pos - neg

                pos_pct = pos * 100 / total
                mid_pct = mid * 100 / total
                neg_pct = neg * 100 / total

                if pos_pct >= neg_pct and pos_pct >= mid_pct:
                    signal = "bullish"
                elif neg_pct > pos_pct and neg_pct > mid_pct:
                    signal = "bearish"
                else:
                    signal = "neutral"

                results[pair] = {
                    "keyword":  keyword,
                    "articles": total,
                    "pos":      round(pos_pct, 1),
                    "mid":      round(mid_pct, 1),
                    "neg":      round(neg_pct, 1),
                    "signal":   signal,
                }

            except Exception as e:
                results[pair] = {
                    "keyword":  keyword,
                    "articles": 0,
                    "pos": 0.0, "mid": 0.0, "neg": 0.0,
                    "signal":   "error",
                    "error":    str(e),
                }

        return results


# Convenience functions
def get_crypto_news(limit: int = 10) -> List[Dict]:
    """Quick function to get latest news."""
    return CryptoNews().get_latest(limit)

def search_crypto_news(keywords: str, limit: int = 10) -> List[Dict]:
    """Quick function to search news."""
    return CryptoNews().search(keywords, limit)

def get_trending_topics(limit: int = 10) -> List[Dict]:
    """Quick function to get trending topics."""
    return CryptoNews().get_trending(limit)["trending"]


def get_coin_sentiment(
    coins: Optional[Dict[str, str]] = None,
    limit: int = 30,
) -> Dict[str, Dict]:
    """
    Calculate per-coin sentiment percentages from recent news.
    No external API key required.

    Args:
        coins: Dict of {trading_pair: keyword}. Defaults to COIN_PAIRS.
        limit: Articles per coin (default 30).

    Returns:
        {"BTCUSD": {"pos": 64.0, "mid": 20.0, "neg": 16.0, "signal": "bullish", ...}}
    """
    return CryptoNews().get_coin_sentiment(coins=coins, limit=limit)


if __name__ == "__main__":
    # Demo
    print("📰 Latest Crypto News\n" + "=" * 50)
    news = CryptoNews()
    for article in news.get_latest(5):
        print(f"\n📌 {article['title']}")
        print(f"   🔗 {article['link']}")
        print(f"   📰 {article['source']} • {article['timeAgo']}")
    
    print("\n\n📊 Trending Topics\n" + "=" * 50)
    trending = news.get_trending(5)
    for topic in trending["trending"]:
        emoji = "🟢" if topic["sentiment"] == "bullish" else "🔴" if topic["sentiment"] == "bearish" else "⚪"
        print(f"{emoji} {topic['topic']}: {topic['count']} mentions")

    print("\n\n🎯 Coin Sentiment (top 5 pairs)\n" + "=" * 50)
    sentiment = news.get_coin_sentiment(
        coins=dict(list(COIN_PAIRS.items())[:5]),
        limit=15,
    )
    for pair, data in sentiment.items():
        if data.get("articles", 0) == 0:
            continue
        arrow = "🟢" if data["signal"] == "bullish" else "🔴" if data["signal"] == "bearish" else "⚪"
        print(
            f"{arrow} {pair:10s} {data['keyword']:20s}"
            f"  pos={data['pos']:5.1f}%  mid={data['mid']:5.1f}%  neg={data['neg']:5.1f}%"
            f"  ({data['articles']} articles)"
        )
