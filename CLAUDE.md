# free-crypto-news

> Free crypto news API - real-time aggregator for Bitcoin, Ethereum, DeFi, Solana & altcoins. No API key required. RSS/Atom feeds, JSON REST API, historical archive with market context, embeddable widgets, ChatGPT plugin, Claude MCP server, SDKs (Python, TypeScript, Go, React, PHP). AI/LLM ready. Vibe coding friendly. Open source.

## IMPORTANT RULES

- Use `bun` to run scripts (e.g. `bun run build`, `bun run dev`, `bun run test`)
- Use `pnpm` for package management (e.g. `pnpm install`, `pnpm add <pkg>`, `pnpm remove <pkg>`)
- Use `bunx` for executables (e.g. `bunx tsc`, `bunx drizzle-kit`, `bunx playwright`)
- **Always use background terminals** (`isBackground: true`) for every command so a terminal ID is returned
- **Always kill the terminal** after the command completes, whether it succeeds or fails — never leave terminals open
- **Never create or modify GitHub Actions workflows** — this project does not use GitHub Actions for CI/CD, publishing, or automation

### Git Identity & Commits

- **Always commit and push as `nirholas`** — every commit must use this identity
- Before committing, ensure Git is configured:
  ```bash
  git config user.name "nirholas"
  git config user.email "22895867+nirholas@users.noreply.github.com"
  ```
- After making changes, **always commit and push** to the remote — do not leave uncommitted work
- Use clear, descriptive commit messages

### Terminal Management

- **Always use background terminals** (`isBackground: true`) for every command so a terminal ID is returned
- **Always kill the terminal** after the command completes, whether it succeeds or fails — never leave terminals open
- Do not reuse foreground shell sessions — stale sessions block future terminal operations in Codespaces
- In GitHub Codespaces, agent-spawned terminals may be hidden — they still work. Do not assume a terminal is broken if you cannot see it
- If a terminal appears unresponsive, kill it and create a new one rather than retrying in the same terminal

