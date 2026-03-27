# AI / LLM Provider APIs

> AI model providers used for content generation, summarization, and market analysis.

---

| # | Service | Base URL | Endpoint | Env Var |
|---|---------|----------|----------|---------|
| 1 | **Groq** | `https://api.groq.com/openai/v1` | `POST /chat/completions` | `GROQ_API_KEY` |
| 2 | **OpenAI** | `https://api.openai.com/v1` | `POST /chat/completions` | `OPENAI_API_KEY` |
| 3 | **OpenRouter** | `https://openrouter.ai/api/v1` | `POST /chat/completions` | `OPENROUTER_API_KEY` |
| 4 | **Anthropic** | `https://api.anthropic.com/v1` | `POST /messages` | `ANTHROPIC_API_KEY` |
| 5 | **HuggingFace** | `https://api-inference.huggingface.co` | Inference API | `HUGGINGFACE_API_KEY` |
| 6 | **Google AI** | Google API | Gemini models | `GOOGLE_GENERATIVE_AI_API_KEY` |
