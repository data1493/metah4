# Plan: Location-Based Search Results (Option 1 — Browser Geolocation)

## Ownership

| Layer | Owner | Repo |
|---|---|---|
| Frontend (React/Vite) | Frontend agent | `metah4` (this repo) |
| Backend (Cloudflare Worker / chimpsheet) | Backend agent | separate repo |

**Frontend agent scope:** Everything in `src/` and `vite.config.ts`. Does NOT touch backend Worker code.
**Backend agent scope:** The Cloudflare Worker at `api.chimpsheet.com` that receives requests, decrypts `q`, and calls Brave Search. Must be updated to read and forward the `country` param to Brave.

---

## Context
Currently, the Brave Search API is called with only a `q` param (encrypted query). Brave supports a `country` query param that biases results to a geographic region. This plan adds an explicit opt-in geolocation feature that resolves the user's country code locally (no third-party reverse-geocode API) and appends it to the search request.

---

## Approach

### Country Resolution Strategy
Use `navigator.geolocation.getCurrentPosition()` to confirm user consent + get coordinates, then derive country from the browser's timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone` mapped against a bundled timezone→country lookup. This keeps location resolution **fully in-browser** — no reverse-geocode API call, no leaking coordinates to any server.

---

## Frontend Changes — `src/App.tsx`

1. **Add state** (alongside existing `useState` hooks, lines 25–35):
   ```ts
   const [locationEnabled, setLocationEnabled] = useState(false)
   const [userCountry, setUserCountry] = useState<string | null>(null)
   ```

2. **Add `enableLocation` handler** (new `useCallback`):
   - Call `navigator.geolocation.getCurrentPosition()`
   - On success: derive country from `Intl.DateTimeFormat().resolvedOptions().timeZone` using a small inline timezone→ISO-3166-1-alpha-2 map
   - `setUserCountry(code)`, `setLocationEnabled(true)`
   - On error/denied: show a brief inline error, leave `locationEnabled` false

3. **Append `country` param to Axios call** (line 80):
   ```ts
   const params: Record<string, string> = { q: encodeURIComponent(encryptedBase64) }
   if (locationEnabled && userCountry) params.country = userCountry
   const res = await axios.get(PROXY_URL, { params })
   ```

4. **Add opt-in toggle UI** — a small pill button near the search bar (home + results views), styled with existing design tokens:
   - Off state: zinc-gray neutral (like un-hashed PrivacyBadge)
   - On state: neon-purple glow (distinct from the neon-green privacy badge)
   - Label: "Local results OFF / ON · [Country]"
   - Clicking while ON: clears state, sets `locationEnabled` false

---

## Proxy — `vite.config.ts` (Frontend)

No structural change needed. The `/api/chimp` proxy (`lines 90–94`) is a plain path-rewrite; extra query params pass through to `api.chimpsheet.com` automatically — the `country` param will arrive at the Worker.

---

## Backend Change Required — chimpsheet Cloudflare Worker (Backend agent)

> **This section is for the backend agent. Frontend agent does not touch this.**

The Worker currently:
1. Receives `?q=<encrypted>` from the frontend
2. Decrypts `q` → plain-text query
3. Calls Brave Search API with only `q`

**Required change:** Read the `country` query param from the incoming request and forward it to Brave Search:
```
GET https://api.search.brave.com/res/v1/web/search?q=<plaintext>&country=US
```
If `country` is absent (toggle is off), omit it — Brave defaults to global results.

**Contract between repos:**
- Frontend sends: `GET /search?q=<encrypted_base64>&country=<ISO-3166-1-alpha-2>` (country optional)
- Worker must: pass `country` value through to Brave unchanged if present

---

## New Utility — `src/utils/timezoneToCountry.ts`

A small inline map (~40 most common IANA timezone prefixes → ISO country code). Example:
```ts
export function timezoneToCountry(tz: string): string | null {
  const map: Record<string, string> = {
    'America/New_York': 'US', 'America/Los_Angeles': 'US',
    'Europe/London': 'GB', 'Europe/Paris': 'FR',
    'Asia/Tokyo': 'JP', 'Asia/Kolkata': 'IN',
    // ... ~40 entries
  }
  return map[tz] ?? null
}
```
No external dependency. Falls back to `null` (location feature silently disabled) for unrecognized timezones.

---

## Critical Files
- `src/App.tsx` — state, handler, Axios call (lines 25–35, 80)
- `vite.config.ts` — proxy config (lines 90–94); possible fallback route
- `src/utils/timezoneToCountry.ts` — new file (small utility)

---

## Verification
1. Run dev server (`npm run dev`)
2. Click the location toggle → browser permission prompt appears
3. Grant permission → button shows "ON · US" (or local country)
4. Run a search → confirm results are region-biased (e.g., search "news" and compare with toggle off)
5. Deny permission → toggle stays off, no console errors
6. Toggle off after enabling → country clears, next search sends no `country` param
7. Check Network tab: `country=US` present in the proxied request when enabled
