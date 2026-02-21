# Skills

Agent Skills for the Free Crypto News API, following the [agentskills.io](https://agentskills.io) open standard.

Each skill is a self-contained folder with a `SKILL.md` that teaches AI agents (Claude, Codex, or any compatible runtime) how to use this API effectively for a specific task.

## Available Skills

| Skill | Description | Difficulty |
|-------|-------------|------------|
| [crypto-news-briefing](./crypto-news-briefing/) | Synthesize latest news into a structured market briefing | Beginner |
| [market-sentiment](./market-sentiment/) | Combine Fear & Greed, narratives, and whale data into a sentiment read | Intermediate |
| [coin-research](./coin-research/) | Full research brief on any coin using news + market data | Intermediate |
| [rug-pull-news-check](./rug-pull-news-check/) | Assess project credibility using news-layer signals | Beginner |
| [historical-trend-analysis](./historical-trend-analysis/) | Mine the archive for patterns, cycle positioning, and historical parallels | Advanced |

## Using in Claude Code

```
/plugin marketplace add nirholas/free-crypto-news
```

Or install a specific skill directly:

```
/plugin install crypto-news-briefing@free-crypto-news
```

## Using in Codex

```
$skill-installer install https://github.com/nirholas/free-crypto-news/tree/main/skills/crypto-news-briefing
```

## API

All skills use the Free Crypto News API — **no authentication required**.

Base URL: `https://cryptocurrency.cv`

## License

All skills in this directory are MIT licensed.
