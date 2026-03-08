# METAH4

Privacy-focused search prototype with a hip-hop nostalgic UI. Queries are SHA-256 hashed on-device, then sent through a Cloudflare proxy. Built with React + Vite + TypeScript + Tailwind v4.

## Stack

- React 19 + TypeScript
- Vite 7 with `@tailwindcss/vite` (Tailwind v4)
- libsodium-wrappers — client-side SHA-256 hashing
- Axios — HTTP client
- Cloudflare Worker proxy — frontend -> proxy search transport
- Brave Search API — upstream search provider behind the proxy

## Design

Lakers-themed aesthetic: deep black background (`#0a0a0a`), Lakers purple (`#542583`), Lakers gold (`#FDB927`). Rubik (display) + JetBrains Mono fonts. Glitch animations. Cassette-card result layout.

## Current Search Flow

Metah4 currently uses a Cloudflare Worker proxy endpoint:

`https://metah4-backend.metah4-backend.workers.dev/search`

Current behavior:

1. Frontend hashes the raw query with SHA-256 on-device.
2. Frontend sends the hash to the proxy.
3. Proxy forwards the hash to Brave Search.
4. Brave returns results for the hash string itself.

This means search relevance is limited right now. Backend decryption/translation logic is in progress so the proxy can recover usable search terms server-side before calling Brave.

### Setup

1. Ensure the Cloudflare proxy is deployed and reachable.
2. Optional for local backend testing: create `.env` at the project root:

```
VITE_BRAVE_SEARCH_API_KEY=your_key_here
```

3. Run the dev server:

```bash
npm install
npm run dev
```

The `VITE_` prefix is required for Vite to expose variables to the browser bundle.

### Client-side Hashing Badge

Every search triggers a SHA-256 hash of the query before the network request is made. The badge currently indicates:

`hashed on device + proxied anonymously`

Status note: this confirms local hashing and proxy routing, but does not yet provide meaningful private search semantics until backend decryption logic is completed.

## Dev

```bash
npm install
npm run dev
```

See `workflow.md` for the full development workflow and the current backend decryption milestone.
