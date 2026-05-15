# Next.js AI Chatbot

> A Next.js chatbot prototype that streams LLM responses through Agnic AI Gateway and supports document, code, sheet, and weather-tool workflows.

**Status:** prototype
**Stack:** TypeScript, Next.js, React, AI SDK, Agnic AI Gateway, Drizzle ORM, Postgres, Redis, Vercel Blob, Tailwind CSS

## What it does

This app lets a signed-in or guest user chat with a selected language model in a browser. It streams responses through the [Agnic AI Gateway](https://docs.agnic.ai/docs/quickstart), saves chat history to Postgres, and opens side-panel artifacts for text, Python-oriented code, and CSV-style sheets. It also includes a user-approved weather tool backed by Open-Meteo.

## Why I built it

This repository is a practical sandbox for adapting a production-style AI chat template to a custom gateway. Agnic provides an OpenAI-compatible endpoint, so the app can route multiple model IDs through one integration and one API token. The portfolio signal is the integration work: authentication, persistence, model selection, streaming responses, and tool calls.

## How it works

- Next.js App Router serves the chat UI, auth routes, and API endpoints.
- `lib/ai/providers.ts` routes selected model IDs through the OpenAI-compatible Agnic gateway.
- `app/(chat)/api/chat/route.ts` validates requests, checks daily message limits, streams model output, and persists messages.
- Tool calls cover artifacts, document suggestions, and weather lookup; weather requests require user approval.
- Drizzle migrations define the Postgres schema for users, chats, messages, documents, and streams.

## Quickstart

```bash
git clone https://github.com/alixocracy/nextjs-ai-chatbot.git
cd nextjs-ai-chatbot

# Install
pnpm install

# Run
pnpm dev
```

Required environment variables for full chat functionality are listed in `.env.example`.

## AI-assisted development

README update completed with Codex.

## Responsible-AI notes

The app sends user chat content and selected tool context to LLM providers through the Agnic gateway; it does not train a local model. It includes authentication, daily message limits, scoped tools, and explicit approval for weather calls, but is not designed for medical, legal, financial, or safety-critical advice.

## Tech notes & learnings

- The project demonstrates LLM application development and deployment plumbing, not custom model training.
- The Agnic gateway abstraction keeps provider selection mostly isolated from the UI and makes model swaps cheaper to test.
- Full local functionality still depends on Postgres, an Agnic API key, Vercel Blob, and Redis.
- The next improvement would be a Docker Compose dev stack so reviewers can run persistence locally with less setup.

## License

Apache-2.0 - see [LICENSE](./LICENSE).
