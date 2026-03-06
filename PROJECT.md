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

### Phase 2 — Tab Navigation
- [ ] Create `SearchTabs.tsx` — All · Images · Videos · News
- [ ] Brave-style underlined active tab
- [ ] Only "All" functional; others show "Coming soon"
- [ ] Positioned below header in results mode

### Phase 3 — Local Business Boosting
- [ ] Create `useGeolocation.ts` hook
- [ ] Extend Brave API proxy for location params
- [ ] Detect local results, boost to top
- [ ] Create `LocalBadge.tsx` pill indicator on cards

### Phase 4 — Privacy Badge
- [ ] Create `PrivacyBadge.tsx` — shield icon, idle → active states
- [ ] Integrate into Header (right) and HomePage (below search)
- [ ] Click opens Privacy Proof modal
- [ ] Retire StatusBar (merge into badge + header)

### Phase 5 — 90s Hip-Hop Visual Identity
- [ ] Typography: Permanent Marker + Bebas Neue
- [ ] Background art: brick texture, spray-paint accents, hip-hop silhouettes
- [ ] Result card redesign: Brave clean layout + hip-hop hover effects
- [ ] Micro-animations: record scratch, boombox bounce, smooth transitions
- [ ] Search bar pill redesign with search icon
- [ ] Footer: clean credit line, subtle affiliate link

### Phase 6 — Polish
- [ ] Responsive design audit (320px → 1440px+)
- [ ] Skeleton loading cards
- [ ] Accessibility pass (ARIA, keyboard, focus management)
- [ ] Run all tests, fix failures

---

## Key Decisions

| Decision | Choice |
|----------|--------|
| Colors | Not changing — gold/purple stays (branch-specific) |
| Primary logo | logo2.png everywhere |
| Brave sidebar | Excluded from scope |
| Tab function | UI-only stubs for Images/Videos/News |
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
| `src/components/SearchTabs.tsx` | Tab navigation |
| `src/components/PrivacyBadge.tsx` | Privacy shield badge |
| `src/components/LocalBadge.tsx` | Local business indicator |
| `src/components/SkeletonCard.tsx` | Loading placeholder |
| `src/hooks/useGeolocation.ts` | Browser geolocation hook |

---

## Changelog

| Date | Phase | Summary |
|------|-------|---------|
| 2026-03-06 | Setup | Project plan created |
