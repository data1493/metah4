# Metah4 Dev Workflow

## 1. Run Dev Server

```bash
npm run dev
```

Opens at http://localhost:5173

## 2. Test Search

- Type any query into the search box
- Click GO or press Enter
- Check browser console for proxy debug logs:
	- `Sending encrypted q:`
	- `Proxy status:`
	- `Decrypted query Brave saw:`
- Badge indicates `encrypted on device + proxied anonymously`

## 3. Current Known Behavior (non-encrypt-main branch)

- Frontend sends plain `q` param directly to `/api/brave` (Vite proxy → Brave Search API).
- No encryption — queries are sent in plaintext to Brave via the proxy.
- Location: city name appended to query string (`near <city>`) when user enables location.
- Images, Videos, News tabs call separate Brave endpoints (`/res/v1/images/search`, etc.).
- Pagination uses Brave `offset` param.

> **Encrypt version preserved on `encrypt-version` branch.** Merge strategy: `git checkout encrypt-version && git merge non-encrypt-main`.

## 4. Git Push After Changes

```bash
git add -p
git commit -m "your message"
git push
```

Never commit `.env` — it is gitignored.

## 5. End-to-End Search: Fully Working ✅

- Frontend sends `q=<query>` to `/api/brave` (Vite proxy).
- Vite rewrites to `https://api.search.brave.com/res/v1/web/search` with `X-Subscription-Token` header.
- Images/Videos/News use `/api/brave-images`, `/api/brave-videos`, `/api/brave-news` (separate proxy routes).
- Brave returns results; frontend maps and renders.

## 6. Vite Config Notes

- HMR explicitly configured (`ws://localhost:5173`) to prevent WebSocket connection failures in dev.
- Proxy entries: `/api/brave` → Brave Search API (direct key usage), `/api/chimp` → Cloudflare Worker proxy.

## 7. Location-Based Results

Feature branch: `feature/location-search`

- User opts in via a pill toggle near the search bar (neon-purple when active).
- Clicking triggers the browser geolocation permission dialog.
- On grant: country code is derived from `Intl.DateTimeFormat().resolvedOptions().timeZone` via `src/utils/timezoneToCountry.ts` — no coordinates leave the device.
- `country=XX` is appended to the proxied Axios request when enabled.
- Brave Search uses the `country` param to bias results regionally.
- Toggle off clears country state; next search sends no `country` param.
- `/api/chimp` proxy passes query params through automatically (plain path rewrite).
