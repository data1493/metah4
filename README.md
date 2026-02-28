# METAH4

Privacy-first search engine. Queries are SHA-256 hashed on-device before being sent. Built with React + Vite + TypeScript + Tailwind v4.

## Stack

- React 19 + TypeScript
- Vite 7 with `@tailwindcss/vite` (Tailwind v4)
- libsodium-wrappers — client-side SHA-256 hashing
- Axios — HTTP client
- DuckDuckGo Lite — search backend (proxied via Vite dev server)

## Design

Neon/hip-hop aesthetic: deep black background, neon green (`#39ff14`), neon purple (`#d400ff`), neon gold (`#ffd700`). Rubik (display) + JetBrains Mono fonts. Glitch animations. Cassette-card result layout.

## Dev

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server proxies `/api/search` → `https://lite.duckduckgo.com/lite/` to avoid CORS.

## Status

- UI: complete — dark neon layout, glitch title, search input, cassette result cards, hashed-on-device badge, NordVPN banner placeholder
- Search: in progress — proxy and HTML parsing wired up, DDG Lite result parsing under active development
- Hashing: working — SHA-256 via libsodium-wrappers runs fully on-device before any network call
