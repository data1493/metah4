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

`https://api.chimpsheet.com/search`

Current behavior:

1. Frontend encrypts the raw query client-side using libsodium secretbox with a shared secret.
2. Frontend sends the encrypted payload (nonce + ciphertext) to the proxy.
3. Proxy decrypts the query server-side using the same shared secret.
4. Proxy forwards the decrypted query to Brave Search.
5. Brave returns results for the original query.

This provides true privacy: plain-text queries never leave the user's device or reach external servers.

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

### Client-side Encryption Badge

Every search triggers client-side encryption of the query using libsodium secretbox before the network request is made. The badge indicates:

`encrypted on device + proxied anonymously`

This confirms local encryption and anonymous proxy routing, providing meaningful private search semantics.

## Dev

```bash
npm install
npm run dev
```

See `workflow.md` for the full development workflow and the current backend decryption milestone.
