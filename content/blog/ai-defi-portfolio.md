---
title: "AI-Powered DeFi Portfolio Management: A Developer's Overview"
description: "An overview of AI-powered DeFi portfolio management systems for developers. Covers yield optimization, risk scoring, rebalancing strategies, and on-chain execution."
date: "2026-03-30"
author: team
category: research
tags: ["defi", "ai", "portfolio", "yield", "developer", "automation"]
image: "/images/blog/ai-defi-portfolio.jpg"
imageAlt: "AI-powered DeFi portfolio dashboard showing yield optimization across multiple protocols"
---

DeFi offers yields that traditional finance cannot match — but managing a DeFi portfolio manually is a full-time job. Rates change hourly, gas costs affect profitability, protocols get exploited, and optimal strategies shift with market conditions. AI-powered portfolio management aims to automate the analytical work while keeping humans in control of execution decisions.

## The DeFi Portfolio Management Problem

A sophisticated DeFi user might have assets across:

- Aave and Compound (lending)
- Uniswap and Curve (liquidity provision)
- Lido and Rocket Pool (liquid staking)
- Yearn Finance (yield aggregation)
- Various chains (Ethereum, Arbitrum, Polygon)

Manually monitoring and rebalancing across all of these is impractical. AI systems can process the data at machine speed and surface optimal actions.

## Components of an AI DeFi Portfolio Manager

```python
from dataclasses import dataclass
from typing import Any
import httpx
from openai import OpenAI

client = OpenAI()

@dataclass
class ProtocolPosition:
    protocol: str
    chain: str
    asset: str
    amount_usd: float
    apy: float
    risk_score: float  # 1-10, higher = riskier
    lock_period_days: int = 0

@dataclass
class PortfolioState:
    positions: list[ProtocolPosition]
    stablecoin_reserve_usd: float
    total_value_usd: float

    def get_weighted_apy(self) -> float:
        if self.total_value_usd == 0:
            return 0.0
        return sum(p.amount_usd * p.apy for p in self.positions) / self.total_value_usd

    def get_risk_score(self) -> float:
        if not self.positions:
            return 0.0
        return sum(p.amount_usd * p.risk_score for p in self.positions) / sum(p.amount_usd for p in self.positions)
```

## Fetching DeFi Yields

```python
async def get_defi_opportunities(min_tvl_usd: float = 10_000_000) -> list[dict]:
    """Fetch current DeFi yield opportunities from DeFiLlama."""
    async with httpx.AsyncClient() as http:
        response = await http.get(
            "https://yields.llama.fi/pools",
            timeout=30,
        )
        data = response.json()

    opportunities = [
        {
            "pool_id": p["pool"],
            "protocol": p["project"],
            "chain": p["chain"],
            "asset": p["symbol"],
            "tvl_usd": p.get("tvlUsd", 0),
            "apy": p.get("apy", 0),
            "apy_base": p.get("apyBase", 0),
            "apy_reward": p.get("apyReward", 0),
            "il_risk": p.get("ilRisk", "no"),
            "audited": p.get("audits", "0") != "0",
        }
        for p in data.get("data", [])
        if p.get("tvlUsd", 0) >= min_tvl_usd
        and p.get("apy", 0) > 0
        and p.get("apy", 0) < 200  # Filter out suspiciously high yields
    ]

    return sorted(opportunities, key=lambda x: x["apy"], reverse=True)[:50]
```

## Risk Scoring with LLMs

```python
def score_protocol_risk(protocol: dict, news_context: str = "") -> dict:
    """Use LLM to assess risk of a DeFi protocol position."""

    prompt = f"""You are a DeFi risk analyst. Score the risk of this yield opportunity.

Protocol: {protocol['protocol']}
Chain: {protocol['chain']}
Asset: {protocol['asset']}
APY: {protocol['apy']:.2f}%
TVL: ${protocol['tvl_usd']:,.0f}
Audited: {protocol['audited']}
IL Risk: {protocol['il_risk']}
{f'Recent news: {news_context}' if news_context else ''}

Provide a risk assessment:
{{
  "risk_score": 1-10,
  "risk_level": "low|medium|high|extreme",
  "key_risks": ["list", "of", "risks"],
  "trust_score": 1-10,
  "reasoning": "brief explanation",
  "recommended_allocation_pct": 0-25
}}

Risk scoring guide:
1-3: Blue chip, battle-tested protocols (Aave, Compound, Curve)
4-6: Established but less proven protocols
7-8: Newer protocols, higher risk factors
9-10: Experimental, unaudited, or recently launched

Be conservative."""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.1,
    )

    import json
    return json.loads(response.choices[0].message.content)
```

## Yield Optimization Algorithm

```python
from scipy.optimize import minimize
import numpy as np

def optimize_portfolio_allocation(
    opportunities: list[dict],
    scored_risks: list[dict],
    total_usd: float,
    constraints: dict,
) -> list[dict]:
    """
    Optimize allocation across DeFi opportunities using mean-variance optimization.
    Maximize: weighted APY - risk penalty
    """
    n = len(opportunities)

    apys = np.array([o["apy"] / 100 for o in opportunities])
    risks = np.array([r["risk_score"] / 10 for r in scored_risks])

    max_per_protocol = constraints.get("max_per_protocol_pct", 25) / 100
    min_stable_reserve = constraints.get("min_stable_reserve_pct", 20) / 100
    max_risk_score = constraints.get("max_portfolio_risk", 6) / 10

    # Objective: maximize APY - risk penalty
    def objective(weights):
        portfolio_apy = -np.dot(weights, apys)  # negative for minimization
        risk_penalty = 0.5 * np.dot(weights, risks)  # penalize risk
        return portfolio_apy + risk_penalty

    # Constraints
    constraints_scipy = [
        # Total allocation sums to 1 - stable reserve
        {"type": "eq", "fun": lambda w: np.sum(w) - (1 - min_stable_reserve)},
        # Portfolio risk constraint
        {"type": "ineq", "fun": lambda w: max_risk_score - np.dot(w, risks) / np.sum(w)},
    ]

    # Bounds: 0 to max_per_protocol for each asset
    bounds = [(0, max_per_protocol)] * n

    result = minimize(
        objective,
        x0=np.ones(n) / n * (1 - min_stable_reserve),
        method="SLSQP",
        bounds=bounds,
        constraints=constraints_scipy,
    )

    if not result.success:
        # Fallback: equal weight top 5 by APY
        weights = np.zeros(n)
        top_5 = np.argsort(apys)[::-1][:5]
        weights[top_5] = (1 - min_stable_reserve) / 5
        return build_allocation_result(opportunities, weights, total_usd)

    return build_allocation_result(opportunities, result.x, total_usd)

def build_allocation_result(opportunities, weights, total_usd):
    return [
        {
            **opportunities[i],
            "allocation_pct": float(weights[i] * 100),
            "allocation_usd": float(weights[i] * total_usd),
        }
        for i in range(len(opportunities))
        if weights[i] > 0.001  # Filter dust positions
    ]
```

## LLM-Assisted Rebalancing Decisions

```python
async def generate_rebalancing_recommendation(
    current_portfolio: PortfolioState,
    new_opportunities: list[dict],
    news_summary: str,
) -> dict:
    """Use LLM to recommend portfolio rebalancing actions."""

    current_positions_text = "\n".join([
        f"- {p.protocol} ({p.chain}): ${p.amount_usd:,.0f} in {p.asset} at {p.apy:.1f}% APY, risk {p.risk_score}/10"
        for p in current_portfolio.positions
    ])

    top_opportunities_text = "\n".join([
        f"- {o['protocol']} ({o['chain']}): {o['asset']} at {o['apy']:.1f}% APY, TVL ${o['tvl_usd']/1e6:.1f}M"
        for o in new_opportunities[:10]
    ])

    prompt = f"""You are a conservative DeFi portfolio manager.

Current Portfolio (${current_portfolio.total_value_usd:,.0f} total):
{current_positions_text}
Stablecoin reserve: ${current_portfolio.stablecoin_reserve_usd:,.0f}
Weighted APY: {current_portfolio.get_weighted_apy():.2f}%
Portfolio risk score: {current_portfolio.get_risk_score():.1f}/10

Top new opportunities:
{top_opportunities_text}

Recent market context:
{news_summary}

Recommend rebalancing actions (be specific):
1. Which positions to reduce or exit and why
2. Which new positions to enter
3. Optimal allocation percentages
4. Risk considerations
5. Gas cost considerations (only suggest moves if APY improvement > gas cost amortized over 30 days)

Be conservative. Prioritize capital preservation over maximum yield."""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    return {"recommendation": response.choices[0].message.content}
```

## Monitoring Protocol Health

```python
async def check_protocol_health(protocol_name: str) -> dict:
    """Monitor a DeFi protocol for health indicators."""
    async with httpx.AsyncClient() as http:
        # DeFiLlama TVL data
        try:
            tvl_response = await http.get(
                f"https://api.llama.fi/protocol/{protocol_name.lower()}",
                timeout=10,
            )
            tvl_data = tvl_response.json()
            current_tvl = tvl_data.get("currentChainTvls", {})
        except Exception:
            current_tvl = {}

        # Check for recent security news
        news_response = await http.get(
            "https://free-crypto-news.com/api/news",
            params={"symbols": protocol_name, "category": "security", "limit": 5},
            timeout=10,
        )
        security_news = news_response.json().get("articles", [])

    return {
        "protocol": protocol_name,
        "tvl_by_chain": current_tvl,
        "recent_security_news": [
            {"title": a["title"], "url": a["url"], "publishedAt": a["publishedAt"]}
            for a in security_news
        ],
        "health_status": "alert" if security_news else "normal",
    }
```

## Conclusion

AI-powered DeFi portfolio management represents a genuine opportunity to bring quantitative rigor to the complexity of multi-protocol yield optimization. The key components — yield data from DeFiLlama, risk scoring via LLM reasoning, news monitoring from the [free-crypto-news API](https://free-crypto-news.com), and mathematical portfolio optimization — can be assembled by any developer with Python skills. The critical constraint remains: always keep humans in control of actual on-chain execution decisions.
