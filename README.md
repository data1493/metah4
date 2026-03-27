# Metah4

Privacy-first meta search engine with a 90s hip-hop aesthetic. Queries route through a server-side proxy — your API keys never touch the client bundle, and no search data is stored or logged.

## Stack

- **React 19** + TypeScript
- **Vite 7** with `@tailwindcss/vite` (Tailwind v4)
- **Axios** — HTTP client
- **@fontsource** — self-hosted fonts (no Google Fonts tracking)
- **Brave Search API** — upstream search provider
- **Pexels API** — image search
- **Express proxy server** — production API gateway (keys stay server-side)

## Design

90s Golden Era hip-hop aesthetic: deep black background, neon accents (green, purple, gold). Inter + JetBrains Mono + Permanent Marker fonts. Glitch animations, vinyl record and boombox SVGs, cassette-style result cards.

## Search Features

- Web, Images, Videos, News tabs (all powered by Brave Search)
- Image results merged from Brave + Pexels with infinite scroll
- City/region-level local search via browser geolocation (Nominatim reverse geocoding — lat/lng never sent to backend)
- Activity logs with nuclear clear animation
- Privacy badge with proof modal

## Setup (Development)

```bash
npm install
```

Create `.env` at the project root:
```
VITE_BRAVE_SEARCH_API_KEY=your_brave_key_here
VITE_PEXELS_API_KEY=your_pexels_key_here
```

```bash
npm run dev
```

Dev server runs at `http://localhost:5173`. The Vite dev proxy forwards `/api/*` requests with your keys injected server-side.

## Deployment (Production)

Build the frontend:
```bash
npm run build
```

Set up the Express proxy server:
```bash
cd server
npm install
```

Create `server/.env`:
```
BRAVE_SEARCH_API_KEY=your_brave_key_here
PEXELS_API_KEY=your_pexels_key_here
PORT=3000
```

Start with PM2 (recommended for droplets):
```bash
pm2 start ecosystem.config.cjs
```

Or directly:
```bash
node server/index.js
```

The server serves the built `dist/` as static files and proxies all `/api/*` routes to Brave/Pexels with keys injected from the server environment.

## Privacy

- No query storage or logging
- Queries proxied anonymously through the server
- Fonts self-hosted (no Google Fonts CDN)
- Favicons via DuckDuckGo (not Google)
- Geolocation uses timezone + Nominatim — raw coordinates never leave the browser
- Premium encrypted tier in development (client-side libsodium + server-side decryption)
