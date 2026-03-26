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

## 3. Current Known Behavior

- Frontend encrypts query client-side with libsodium secretbox using a shared secret.
- Frontend sends encrypted payload to Cloudflare proxy.
- Proxy decrypts the query server-side and forwards to Brave.
- Brave returns results for the original human query.
- Provides true privacy: plain-text queries never leave the device.

## 4. Git Push After Changes

```bash
git add -p
git commit -m "your message"
git push
```

Never commit `.env` — it is gitignored.

## 5. End-to-End Search: Fully Working ✅

- Frontend encrypts query with libsodium secretbox.
- Vite dev proxy (`/api/chimp/search`) forwards to `https://api.chimpsheet.com/search`, resolving CORS in dev.
- Cloudflare Worker decrypts the payload server-side using the shared secret.
- Brave Search receives the original plain-text query and returns results.
- Frontend maps and renders results correctly.
- Confirmed working: `Decrypted query Brave saw: pizza` — 200 OK with full web/news/video payload.

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
