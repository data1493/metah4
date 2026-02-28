# Metah4 Dev Workflow

## 1. Get Brave Search API Key

Go to https://brave.com/search/api/ and sign up for a free or paid plan.
Free tier: 2,000 queries/month.
Copy your API key from the dashboard.

## 2. Add Key to .env

Open `.env` at the project root and replace the placeholder:

```
VITE_BRAVE_SEARCH_API_KEY=BSA...your_real_key_here
```

The `VITE_` prefix is required — Vite only exposes env vars with this prefix to the browser.

## 3. Run Dev Server

```bash
npm run dev
```

Opens at http://localhost:5173

## 4. Test Search

- Type any query into the search box
- Click GO or press Enter
- The green "hashed on device" badge appears immediately (SHA-256 runs before the network call)
- Results render as cassette cards below

## 5. Git Push After Changes

```bash
git add -p
git commit -m "your message"
git push
```

Never commit `.env` — it is gitignored.

## 6. Future: Move Key to Backend

Currently the Brave API key is exposed in the browser bundle via `import.meta.env`.
For real production privacy:
- Create a small backend (Node/Express, Cloudflare Worker, etc.)
- Store the key server-side
- The frontend calls your backend, which proxies to Brave
- The key never leaves the server
