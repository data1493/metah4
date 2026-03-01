# METAH4

Privacy-first search engine. Queries are SHA-256 hashed on-device before being sent. Built with React + Vite + TypeScript + Tailwind v4.

## Stack

- React 19 + TypeScript
- Vite 7 with `@tailwindcss/vite` (Tailwind v4)
- libsodium-wrappers — client-side SHA-256 hashing
- Axios — HTTP client
- Brave Search API — web search backend

## Design

Lakers-themed aesthetic: deep black background (`#0a0a0a`), Lakers purple (`#542583`), Lakers gold (`#FDB927`). Rubik (display) + JetBrains Mono fonts. Glitch animations. Cassette-card result layout.

## Brave Search API Integration

Metah4 uses the [Brave Search API](https://brave.com/search/api/) for real web search results.

### Setup

1. Get a free API key at https://brave.com/search/api/ (2,000 queries/month free)
2. Create `.env` at the project root:

```
VITE_BRAVE_SEARCH_API_KEY=your_key_here
```

3. Run the dev server:

```bash
npm install
npm run dev
```

The `VITE_` prefix is required for Vite to expose the variable to the browser bundle.

### Client-side Hashing Badge

Every search triggers a SHA-256 hash of the query using libsodium-wrappers **before** any network request is made. The green "hashed on device" badge confirms this happened locally. This is a demo of the privacy-first flow — in production the key would live on a backend proxy so it never reaches the client.

## Dev

```bash
npm install
npm run dev
```

See `workflow.md` for the full development workflow and notes on moving the API key to a backend for production.
