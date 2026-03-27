# METAH4 — Project Plan

> Brave-Style UI · 90s Hip-Hop Nostalgic Feel · Privacy Badge · Local Business Boosting

---

## Vision

Redesign METAH4 from a single-state linear layout into a **Brave Search-inspired two-state UI** (homepage → results page) with tab navigation, local business ranking, a prominent privacy badge, and a **90s Golden Era hip-hop** visual identity.

**Logo2** is the primary clickable header logo. Colors stay as-is (branch-specific gold/purple).

---

## Architecture

```
App.tsx  ─── viewMode: 'home' | 'results'
 ├─ HomePage.tsx ────── (home mode) centered logo2 + search bar + tagline
 ├─ Header.tsx ─────── (results mode) sticky bar: logo2 | search | privacy badge
 ├─ SearchTabs.tsx ──── All · Images · Videos · News
 ├─ ResultsList.tsx ──── Brave card layout + SkeletonCard loading
 │   ├─ ResultCard.tsx ── favicon + domain + title + description
 │   └─ LocalBadge.tsx ── 📍 Local indicator
 ├─ PrivacyBadge.tsx ── Shield badge (idle → active)
 ├─ BackgroundEffects.tsx ── 90s hip-hop themed layers
 └─ Modals (unchanged) ── PrivacyProof · ActivityLogs
```

---

## Phases

### Phase 1 — Layout Architecture: Two-State UI ✅
- [x] Add `viewMode` state to `App.tsx` ('home' | 'results')
- [x] Create `HomePage.tsx` — centered logo2, prominent search bar, tagline
- [x] Create `Header.tsx` — sticky results bar with logo2, compact search, nav back
- [x] SearchBar accepts `variant: 'home' | 'header'` for two sizes
- [x] Logo2 click returns to home mode and resets search
- [x] Smooth transition between states

### Phase 2 — Tab Navigation ✅
- [x] Create `SearchTabs.tsx` — All · Images · Videos · News
- [x] Brave-style underlined active tab
- [x] Only "All" functional; others show "Coming soon"
- [x] Positioned below header in results mode
- [x] Arrow key navigation between tabs

### Phase 3 — Local Business Boosting ✅
- [x] Create `useGeolocation.ts` hook
- [x] Extend Brave API proxy for location params
- [x] Detect local results, boost to top
- [x] Create `LocalBadge.tsx` pill indicator on cards

### Phase 4 — Privacy Badge ✅
- [x] Create `PrivacyBadge.tsx` — shield icon, idle → active states
- [x] Integrate into Header (right) and HomePage (below search)
- [x] Click opens Privacy Proof modal
- [x] StatusBar replaced with compact Logs button in results view

### Phase 5 — 90s Hip-Hop Visual Identity ✅
- [x] Typography: Permanent Marker + Bebas Neue
- [x] Background art: brick texture, spray-paint accents, hip-hop silhouettes
- [x] Result card redesign: Brave clean layout with favicon + domain + title
- [x] Micro-animations: record scratch, bounce-in, slide-up
- [x] Search bar pill redesign with search icon
- [x] Footer: clean credit line, subtle affiliate link

### Phase 6 — Polish ✅
- [x] Responsive design: overflow-x-auto tabs, mobile-friendly header
- [x] Skeleton loading cards (4 shimmer placeholders)
- [x] Accessibility pass (ARIA, keyboard tab navigation, sr-only labels, focus management)
- [x] All 42 tests pass

---

## Key Decisions

| Decision | Choice |
|----------|--------|
| Colors | Not changing — gold/purple stays (branch-specific) |
| Primary logo | logo2.png everywhere |
| Brave sidebar | Excluded from scope |
| Tab function | Images/Videos/News fully wired to Brave endpoints (Phase 8+) |
| Hip-hop era | 90s Golden Era (boom-bap, graffiti, vinyl) |
| Background approach | CSS/SVG patterns (no heavy image downloads) |
| Favicon source | Google favicon API for result cards |
| Geolocation privacy | Hash/discard after search, one-time consent |

---

## New Files

| File | Purpose |
|------|---------|
| `src/components/Header.tsx` | Results-mode top bar |
| `src/components/HomePage.tsx` | Landing page layout |
| `src/components/SearchTabs.tsx` | Tab navigation (All/Images/Videos/News) |
| `src/components/PrivacyBadge.tsx` | Privacy shield badge (idle → active) |
| `src/components/LocalBadge.tsx` | Local business indicator (📍 Local) |
| `src/components/SkeletonCard.tsx` | Loading placeholder shimmer card |
| `src/hooks/useGeolocation.ts` | Browser geolocation hook |

---

## Changelog

| Date | Phase | Summary |
|------|-------|---------|
| 2026-03-06 | Setup | Project plan created || 2026-03-06 | Phase 1 | Two-state layout (home/results), Header, HomePage, SearchBar variants |
| 2026-03-06 | Phase 2 | Tab navigation with arrow key support |
| 2026-03-06 | Phase 3 | Geolocation hook, local business detection + boosting, LocalBadge |
| 2026-03-06 | Phase 4 | PrivacyBadge with shield icon and idle/active states |
| 2026-03-06 | Phase 5 | Permanent Marker + Bebas Neue fonts, brick texture, vinyl/boombox SVGs, Brave-style result cards with favicons, bounceIn animations |
| 2026-03-06 | Phase 6 | Skeleton loading cards, accessibility (keyboard tabs, sr-only), responsive tabs, 42 tests passing |

---

## ~~⚠️ Pre-broken on non-encrypt-main~~ ✅ Resolved (2026-03-27)

- `src/hooks/useSearch.ts` — deleted (was broken after encryption strip; inline logic in App.tsx replaced it)
- `src/test/useSearch.test.ts` — deleted (referenced non-existent `hashQuery`)
- `src/test/ResultsList.test.tsx` — fixed (missing required props added to `baseProps`)

---

### Phase 7 — Pre-work + Location Precision (non-encrypt-main)

- [ ] Fix `useSearch.ts` — restore as valid, properly structured hook
- [ ] Fix `useSearch.test.ts` — remove `hashQuery` import, update tests
- [ ] `App.tsx`: store `userLat`/`userLng` from `getCurrentPosition`
- [ ] `App.tsx`: append `near <city>` to query string when location enabled (Brave ignores unknown params like `city`)
- [ ] Remove unused `params.city` pass-through

### Phase 8 — Full Tab Implementation (Images / Videos / News)

- [ ] `vite.config.ts`: add proxy routes `/api/brave-images`, `/api/brave-videos`, `/api/brave-news`
- [ ] `src/config.ts`: add `BRAVE_IMAGES`, `BRAVE_VIDEOS`, `BRAVE_NEWS` constants
- [ ] `src/types.ts`: add `BraveImageResult`, `BraveVideoResult`, `BraveNewsResult`
- [ ] Create `ImageResultCard.tsx`, `VideoResultCard.tsx`, `NewsResultCard.tsx`
- [ ] `App.tsx`: separate result state per tab; `handleSearch` routes to correct endpoint by `activeTab`; tab change re-runs search when in results view
- [ ] `ResultsList.tsx`: accept `activeTab` prop; render correct card type per tab

### Phase 9 — Pagination

- [x] `App.tsx`: add `currentPage` state; compute `offset = (page-1)*10` for Brave; reset page on new query
- [x] `ResultsList.tsx`: convert static `<span>` buttons to functional `<button>`; highlight current page; scroll to top on change
| 2026-03-08 | Proxy Integration | Frontend now hashes query and sends hash to Cloudflare proxy endpoint; debug logging added for proxy response status/data |
| 2026-03-08 | Current Limitation | Proxy currently forwards hash directly to Brave, so Brave returns hash-literal results; backend decryption/translation flow is in progress |
| 2026-03-26 | Branch: non-encrypt-main | Stripped libsodium encryption — plain `q` param sent directly to `/api/brave`. `useSearch.ts` left syntactically broken (pre-existing issue on this branch, must fix on main before merge). |
| 2026-03-26 | Phase 7 | Pre-work: fix broken useSearch.ts + useSearch.test.ts |
| 2026-03-26 | Phase 7 | Location: append `near <city>` to query string; store lat/lng in state |
| 2026-03-26 | Phase 8 | Images/Videos/News tabs: real Brave endpoints, new proxy routes, typed result cards |
| 2026-03-26 | Phase 9 | Pagination: offset-based, functional page buttons |
| 2026-03-26 | Bug fixes | Proxy route ordering (specific before catch-all); stale closure on empty results; MouseEvent leaking as tab param in onClick handlers; infinite image scroll dedup via ref-based guard |
| 2026-03-26 | Phase 10 | Image dedup via URL Set ref; masonry CSS columns layout; slide-in preview panel |
| 2026-03-27 | Launch Phase 1 | Production Express proxy server; DevTools tree-shaken; self-hosted fonts (@fontsource); DuckDuckGo favicons; Pexels attribution; ErrorBoundary; index.html metadata fixed |
| 2026-03-27 | Launch Phase 2 | Dead code removed (6 files); internal docs gitignored; README rewritten; URL state; 800ms debounce; "no results before search" fix; useBodyScrollLock fix; vestigial prop removed |
| 2026-03-27 | Launch Phase 3 | robots.txt + sitemap.xml; bg1.webp (62% smaller); privacy.html policy page |
| 2026-03-27 | Launch Phase 4 | Encryption as premium feature: libsodium client-side encrypt, tweetnacl server-side decrypt, PremiumBadge toggle, isPremium state |

---

## Launch Readiness Plan (2026-03-26) ✅ COMPLETE

All 4 phases implemented and committed on 2026-03-27.

### Launch Phase 1 — Critical Blockers ✅

| # | Item | Status |
|---|------|--------|
| 1.1 | **Production API proxy** — Express server in `server/` proxying `/api/*` to Brave/Pexels; keys in server env vars, never in client bundle | ✅ `ebbae12` |
| 1.2 | **DevTools tree-shaking** — gate `DevColorPicker`/`DevFontWorkshop` behind `import.meta.env.DEV` | ✅ `ebbae12` |
| 1.3 | **Self-host fonts** — `@fontsource` packages (Inter, Permanent Marker, JetBrains Mono); replaced Google Fonts `@import` | ✅ `ebbae12` |
| 1.4 | **Replace Google favicon API** → DuckDuckGo `icons.duckduckgo.com/ip3/{domain}.ico` with `onError` hide fallback | ✅ `ebbae12` |
| 1.5 | **Pexels legal attribution** — "Photos provided by Pexels" link below image grid; pexels.com link in preview panel header | ✅ `ebbae12` |
| 1.6 | **Error boundary** — `ErrorBoundary.tsx` wrapping `<App />` in `main.tsx` | ✅ `ebbae12` |
| 1.7 | **Fix index.html** — real favicon (`logo2a.png`), title "Metah4 — Private Search", meta description, OG image fixed | ✅ `ebbae12` |

### Launch Phase 2 — Should Fix ✅

| # | Item | Status |
|---|------|--------|
| 2.1 | **Dead code removal** — deleted `useSearch.ts`, `useGeolocation.ts`, `StatusBar.tsx`, `Logo.tsx`, `App.css`, `StatusBar.test.tsx`; removed `imageOffsetRef` | ✅ `f9c50a5` |
| 2.2 | **Gitignore internal docs** — `PROJECT.md`, `workflow.md`, `location-feature-plan.md` added to `.gitignore` | ✅ `f9c50a5` |
| 2.3 | **Rewrite README** — accurate stack + deployment instructions for droplets | ✅ `f9c50a5` |
| 2.4 | **URL state** — `?q=&tab=&page=` via `window.history.pushState`; restored from URL on mount | ✅ `f9c50a5` |
| 2.5 | **Search debounce** — 800ms cooldown via `lastSearchTimeRef` | ✅ `f9c50a5` |
| 2.6 | **Geolocation auto-fire** — resolved by deleting the unused `useGeolocation.ts` hook; App.tsx only fires on explicit user tap | ✅ `f9c50a5` |
| 2.7 | **"No results" before search** — tabs show "Search to explore…" until `hasSearched` is true | ✅ `f9c50a5` |
| 2.8 | **useBodyScrollLock fix** — `'unset'` → `''` | ✅ `f9c50a5` |
| 2.9 | **Remove vestigial prop** — stripped unused `firstResult` from `PrivacyProofModalContent` | ✅ `f9c50a5` |

### Launch Phase 3 — Polish ✅

| # | Item | Status |
|---|------|--------|
| 3.1 | **robots.txt + sitemap.xml** | ✅ `a4352d7` |
| 3.2 | **WebP background** — `bg1.JPG` → `bg1.webp` (335KB → 128KB, 62% smaller) | ✅ `a4352d7` |
| 3.3 | **Privacy policy page** — `public/privacy.html`; linked from footer | ✅ `a4352d7` |

### Launch Phase 4 — Encryption as Premium Feature ✅

| File | Purpose | Status |
|------|---------|--------|
| `src/utils/crypto.ts` | `encryptQuery()` via libsodium secretbox (XSalsa20-Poly1305) | ✅ `1462bc9` |
| `server/routes/premium.js` | POST `/api/chimp/search` — tweetnacl decrypt + Brave/Pexels forward | ✅ `1462bc9` |
| `src/components/PremiumBadge.tsx` | Gold lock icon toggle (idle/encrypted states) | ✅ `1462bc9` |
| `src/App.tsx` | `isPremium` state; encrypted search path when enabled; `VITE_PREMIUM_ENABLED` env flag | ✅ `1462bc9` |

Free tier: plain-text proxy. Premium tier: client-side libsodium encrypt → `/api/chimp/search` → server-side decrypt → Brave. `isPremium` driveable by JWT from any payment provider in future.

---

### Phase 10 — Image Search: Dedup + Masonry + Preview Panel

#### Phase 10a — Deduplication
- [ ] `App.tsx`: add `imageSeenUrlsRef = useRef<Set<string>>(new Set())`
- [ ] `handleSearch` (images branch): clear set on new search; populate with initial batch URLs
- [ ] `handleLoadMoreImages`: filter each batch through set before appending; add new URLs to set
- [ ] `resetSearch`: clear the set

#### Phase 10b — Masonry grid + type fix
- [ ] `types.ts`: extend `BraveImageResult.thumbnail` and `properties` with optional `width`/`height`
- [ ] `ImageResultCard.tsx`: rewrite — root is `<button>` calling `onSelect()`; drop `aspect-video`; use `style={{ aspectRatio: w/h }}` when dimensions present; add `isSelected` ring highlight
- [ ] `ResultsList.tsx` (`ImageResultsSection`): switch to `columns-2 sm:columns-3 lg:columns-4`, cards get `break-inside-avoid mb-3`; add `selectedIndex` state; outer container `flex gap-4` when panel open

#### Phase 10c — Side preview panel
- [ ] Create `ImagePreviewPanel.tsx`: sticky `w-[360px]` on desktop, `fixed inset-0 z-50` on mobile; full-res image, title, source, Visit/View buttons, Prev/Next arrows, keyboard nav (Escape/←/→)
- [ ] Wire into `ImageResultsSection`: render panel when `selectedIndex !== null`; `onNext` near end pre-triggers `onLoadMoreImages()`