# Plan: City/Region-Level Local Search Results

## Ownership

| Layer | Owner | Repo |
|---|---|---|
| Frontend (React/Vite) | Frontend agent | `metah4` (this repo) |
| Backend (Cloudflare Worker / chimpsheet) | Backend agent | separate repo |

---

## Context
The current location feature only resolves country-level precision (e.g., `country=US`) derived from the browser timezone — GPS coordinates are requested but discarded. Brave's web search API has no native city/coordinates param, so city-level bias requires the backend to append location context directly to the decrypted query before it reaches Brave (e.g., `pizza` → `pizza near Seattle, WA`).

---

## Approach

1. **Capture actual GPS coordinates** in the geolocation success callback (currently discarded)
2. **Reverse geocode to city** using the Nominatim API (OpenStreetMap, free, no key) — privacy note: coordinates are sent to `nominatim.openstreetmap.org`; this is disclosed to the user via the toggle
3. **Store `userCity`** state (e.g., `"Seattle, WA"`) alongside existing `userCountry`
4. **Send `city` param** to the proxy (plain text, alongside `country`) — e.g., `city=Seattle%2C+WA`
5. **Display city in toggle** — e.g., `Local · Seattle, WA` instead of `Local · US`

---

## Frontend Changes

### `src/App.tsx`

1. **Add state:**
   ```ts
   const [userCity, setUserCity] = useState<string | null>(null)
   ```

2. **Update `handleToggleLocation`** — use actual coords from geolocation success callback to reverse geocode via Nominatim:
   ```ts
   navigator.geolocation.getCurrentPosition(
     async (position) => {
       const { latitude, longitude } = position.coords
       // reverse geocode
       const res = await fetch(
         `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`,
         { headers: { 'Accept-Language': 'en' } }
       )
       const data = await res.json()
       const city = data.address?.city || data.address?.town || data.address?.county || null
       const state = data.address?.state_code || data.address?.state || null
       const cityLabel = [city, state].filter(Boolean).join(', ')
       // existing timezone→country logic stays
       const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
       const country = timezoneToCountry(tz)
       setUserCountry(country)
       setUserCity(cityLabel || null)
       setLocationEnabled(true)
     },
     ...
   )
   ```

3. **Update Axios params:**
   ```ts
   const params: Record<string, string> = { q: encryptedBase64 }
   if (locationEnabled && userCountry) params.country = userCountry
   if (locationEnabled && userCity) params.city = userCity
   const res = await axios.get(PROXY_URL, { params })
   ```

4. **Clear `userCity` on toggle off** (in existing disable branch):
   ```ts
   setUserCity(null)
   ```

5. **Pass `userCity` to `LocationToggle`** via `HomePage` and `Header` props.

### `src/components/LocationToggle.tsx`

- Replace `country` prop with a single `label` prop (e.g., `"Seattle, WA"` when city known, `"US"` fallback)
- Display: `Local · Seattle, WA`

### `src/components/HomePage.tsx` / `src/components/Header.tsx`

- Pass `userCity ?? userCountry` as the label to `LocationToggle`

---

## Backend Change Required — chimpsheet Cloudflare Worker (Backend agent)

> **This section is for the backend agent. Frontend agent does not touch this.**

**Required change:** Read the `city` query param from the incoming request and append it to the decrypted plain-text query before calling Brave:

```
incoming: ?q=<encrypted>&country=US&city=Seattle%2C+WA

decrypted query: "pizza"
brave call:      GET .../web/search?q=pizza+near+Seattle%2C+WA&country=US
```

If `city` is absent, behavior is unchanged. `country` without `city` stays as-is.

**Updated contract between repos:**
- Frontend sends: `GET /search?q=<encrypted_base64>[&country=<ISO>][&city=<city, state>]`
- Worker: appends `near <city>` to decrypted query if `city` present; passes `country` unchanged

---

## Critical Files
- `src/App.tsx` — `handleToggleLocation`, Axios params, `userCity` state
- `src/components/LocationToggle.tsx` — label prop update
- `src/components/HomePage.tsx` — pass city label
- `src/components/Header.tsx` — pass city label

---

## Privacy Note
Nominatim (OpenStreetMap) receives the user's GPS coordinates for reverse geocoding. This is a trade-off disclosed by the act of enabling the location toggle. Coordinates are not stored or logged by the frontend.

---

## Verification
1. Enable location toggle → browser permission prompt fires
2. Toggle shows `Local · Seattle, WA` (or local city)
3. Network tab: `city=Seattle%2C+WA&country=US` in outbound request
4. Once backend is deployed: search "coffee shops" → results biased to local city
5. Toggle off → `userCity` clears, next search sends no city/country params
6. Run `npm test` — all tests pass
