# GitHub API

> GitHub REST API for reading and writing repository content.

---

## GitHub

| | |
|---|---|
| **Base URL** | `https://api.github.com` |
| **Env Var** | `GITHUB_TOKEN` |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /repos/{owner}/{repo}/contents/{path}` | Read file from repo | `src/app/api/archive/webhook/route.ts` |
| `PUT /repos/{owner}/{repo}/contents/{path}` | Create/update file in repo | `src/app/api/ai/blog-generator/route.ts` |
