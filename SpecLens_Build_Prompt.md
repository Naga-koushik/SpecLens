# SpecLens: Build Prompt for an AI Coding Agent

Paste everything below this line into the agent (Antigravity or similar). Work phase by phase and stop for my confirmation at the end of each phase.

---

## ROLE AND GOAL

You are a senior full-stack engineer. Build **SpecLens — Smartphone Discovery and Comparison Platform**, a college project: a responsive **React** web app to search smartphones, browse by brand, view structured specifications, and compare 2–4 phones side by side. Data comes from the external API **MobileAPI.dev**, accessed only through our own small Express server so the API key never reaches the browser.

Keep the scope realistic for one student. Do not add features outside the MVP list below.

## HARD CONSTRAINTS

- Frontend: **React + TypeScript + Vite**, React Router, TanStack Query (v5), Tailwind CSS. **Do NOT use Next.js.**
- Backend: **Node.js + Express** (TypeScript), REST, JSON only. No database in the MVP.
- Monorepo: `client/`, `server/`, `docs/`, root `README.md`, `.gitignore`.
- The MobileAPI.dev key lives ONLY in `server/.env` as `MOBILEAPI_KEY`. Never put it in client code, in any `VITE_` variable, in logs, or in Git. Commit only `.env.example` files.
- Use npm. Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- Do not invent MobileAPI.dev behaviour. See "External API: verify first".

## EXTERNAL API: VERIFY FIRST (Phase 0)

Base URL (reported): `https://api.mobileapi.dev/`. Auth: API key via `Authorization` header (Token or Bearer format) or a `key` query parameter. Reported, **unverified** endpoints:

- `GET /devices/search/?name=...` (fuzzy search)
- `GET /devices/autocomplete/?q=...&limit=...` (may require a minimum query length)
- `GET /devices/{id}/` (device detail)
- `GET /manufacturers/` (brands)
- `GET /devices/by-manufacturer/?brand=...` (50 per page)

Before writing any normalizer:
1. Read the official docs at https://mobileapi.dev/docs/ if reachable.
2. If I have provided an API key, make a few real calls from a script in `server/scripts/` and save the raw JSON responses to `server/fixtures/`. If no key is available, ask me for it or build against hand-written fixtures and mark them clearly as ASSUMED.
3. Write `docs/api-notes.md` listing the confirmed endpoints, auth format, parameters, pagination, image format and the real response field names.
4. The free tier request quota is small and public sources disagree on it. Make as few real calls as possible, and rely on fixtures and mocks for development and tests.

## MVP FEATURES

1. **Home** `/`: hero search bar with autocomplete, popular phones (a curated list of phone names kept in server config and looked up through the API, because popularity is not assumed to come from the API), recently viewed phones (localStorage), popular brands.
2. **Search Results** `/search?q=`: result cards, pagination, skeleton, empty and error states. Query lives in the URL.
3. **Phone Details** `/phones/:id`: header with image, name, brand and an "Add to compare" button; sections for Overview, General, Display, Performance, Memory, Camera, Battery and Charging, Connectivity, Network, Operating System, Physical. Missing data shows "Not available". Invalid ID shows a "Phone not found" state.
4. **Brand Page** `/brands/:brand` and a brand list: paginated phone grid.
5. **Compare** `/compare?ids=1,2,3`: 2–4 phones, category-grouped table, rows with differing values highlighted (text label plus subtle colour, never colour alone), "show differences only" toggle, missing values shown as "Not available", sticky label column and horizontal scroll on small screens, shareable URL.
6. **About** `/about` (data source and limitations) and **404**.
7. Loading skeletons, consistent `ErrorState` and `EmptyState`, route-level error boundary, lazy-loaded routes.

Out of scope (do NOT build): accounts, favourites, price tracking, filters, recommendations, reviews, dark mode, database.

## SERVER API (our own contract, all GET)

| Endpoint | Returns |
|---|---|
| `/api/health` | `{ status: "ok" }` |
| `/api/phones/search?q=&page=` | `{ results: PhoneSummary[], page, hasMore }` |
| `/api/phones/autocomplete?q=&limit=` | `{ suggestions: {id,name,brand,thumbnail}[] }` |
| `/api/phones/popular` | `{ phones: PhoneSummary[] }` |
| `/api/phones/:id` | `Phone` |
| `/api/brands` | `{ brands: {name,slug}[] }` |
| `/api/brands/:brand?page=` | `{ brand, results: PhoneSummary[], page, hasMore }` |
| `/api/compare?ids=` | `{ phones: Phone[], missing: string[] }` (2–4 ids, fetched in parallel, cache first) |

Error format everywhere: `{ "error": { "code": "...", "message": "..." } }` with codes `INVALID_INPUT` (400), `NOT_FOUND` (404), `RATE_LIMITED` (429), `UPSTREAM_UNAVAILABLE` (502), `UPSTREAM_TIMEOUT` (504), `INTERNAL_ERROR` (500). Never leak stack traces, upstream bodies or the key.

Server requirements: env validation at start-up (fail fast if `MOBILEAPI_KEY` is missing), `zod` input validation, `helmet`, `cors` limited to `CLIENT_ORIGIN`, `express-rate-limit`, `compression`, upstream timeout (about 8–10 s), in-memory TTL cache (for example `lru-cache`: minutes for search, hours for details, a day for brands) with stale-on-error fallback, and a `mobileApiClient` module as the only code that talks to MobileAPI.dev.

## DATA MODEL AND NORMALIZATION

Define in `client/src/types` and mirror on the server. Every field optional (`null` when absent):

`Phone`: id, name, brand, image, releaseDate, dimensions, weight, display {size, resolution, type, refreshRate, protection}, processor {chipset, cpu, gpu}, memory {ramOptions, cardSlot}, storage {storageOptions}, rearCamera {modules, features, video}, frontCamera {modules, features, video}, battery {capacity, type}, charging, operatingSystem, network {technologies, simType}, connectivity {wifi, bluetooth, nfc, usb, positioning}.

`PhoneSummary`: id, name, brand, thumbnail, highlights.

Put all mapping in `server/src/normalizers/` as pure functions. External values are often free text; parse only where reliable and otherwise keep the original string. React components must never see the provider's raw field names. Images may arrive as base64: use thumbnails in lists and load full images only on the detail page.

## CLIENT ARCHITECTURE

```
client/src/
  components/{common,phone,search,compare}/
  pages/  layouts/  hooks/  services/  api/  types/  utils/  constants/  routes/  styles/
```

- `api/` holds one HTTP client (base URL from `VITE_API_BASE_URL`, timeout, error to typed `ApiError`). `services/` holds plain fetch functions. `hooks/` wraps them with TanStack Query (`usePhoneSearch`, `useAutocomplete`, `usePhone`, `useBrands`, `useCompare`, `useDebounce`, `useRecentlyViewed`).
- Presentational components take props only; pages and hooks fetch.
- Reusable: `SearchBar`, `SearchSuggestions`, `PhoneCard`, `PhoneGrid`, `SpecSection`, `Pagination`, `Skeleton`, `ErrorState`, `EmptyState`, `ComparisonTable`, `ComparisonRow`.
- State rules: server data in TanStack Query; search text, page and compare ids in the URL; UI toggles in local state; no Redux or other global store.
- `buildComparisonRows(phones)` is a pure, unit-tested function: group by category, mark `isDifferent` when non-missing values differ, mark missing values.
- Search: debounce about 350 ms, no request below 2 characters, cancel stale requests, ARIA combobox keyboard support (arrows, Enter, Escape), `staleTime` of several minutes.
- Retries: limited with back-off, never on 4xx.

## UI/UX AND ACCESSIBILITY

Modern, minimal, professional, easy to scan. Neutral palette plus one accent colour, one sans-serif font (Inter or system stack), 16 px base, rounded cards, WCAG AA contrast, visible focus rings, touch targets of at least 44 px, mobile-first. Semantic landmarks, skip link, `alt` text, `aria-live` for result counts, real `<table>` with `<caption>` and `<th scope>` for comparison, respect `prefers-reduced-motion`. Layouts: 1 column mobile, 2–3 tablet, 3–4 desktop.

## TESTING

Vitest + React Testing Library + MSW (client), Vitest + Supertest (server, upstream mocked with fixtures). Must cover: normalizers, `buildComparisonRows`, `useDebounce`, `useCompare` (max 4), search component (single debounced request, keyboard nav, empty/error), `PhoneCard`, `SpecSection` ("Not available"), `ComparisonTable`, server validation, cache hit on second call, upstream error mapping, and flows search to results, phone to details, add phones to compare.

## PHASED IMPLEMENTATION PLAN

Complete one phase at a time, commit with Conventional Commits, summarize what changed and how to run it, then wait for my go-ahead.

- **Phase 0 — API verification:** scripts, fixtures, `docs/api-notes.md`.
- **Phase 1 — Setup:** monorepo, Vite + React + TS, Tailwind, Router with placeholder pages and layout, Express skeleton with `/api/health`, env handling, `.env.example`, lint/format, README.
- **Phase 2 — Server API:** `mobileApiClient`, normalizers with unit tests, cache, validation, error middleware, all endpoints.
- **Phase 3 — Search:** `SearchBar`, debounce, autocomplete, results page, states.
- **Phase 4 — Phone details:** page, `SpecSection`, skeleton, not-found, recently viewed.
- **Phase 5 — Brands:** brand list and pages, pagination, popular phones and brands on Home.
- **Phase 6 — Compare:** `useCompare`, add/remove, endpoint wiring, table, highlighting, responsive behaviour.
- **Phase 7 — Hardening:** error boundary, retries, lazy routes, image handling, accessibility pass, Lighthouse check.
- **Phase 8 — Tests and docs:** fill test gaps, README with screenshots, setup, env variables, architecture diagram, limitations.
- **Phase 9 — Deployment config:** SPA rewrite rule, production env notes. Recommended hosts only: frontend Vercel or Netlify, backend Render or Railway. Do not hard-depend on any provider.

## DEFINITION OF DONE

- Search, details, brand browsing and 2–4 phone comparison all work on 360, 768 and 1280 px widths.
- The API key is absent from the repo, the client bundle (`grep` the `dist/` folder) and browser network requests.
- Simulated timeout, 429 and 5xx responses show the defined UI states without crashing.
- `npm run dev` starts both apps; `npm test` passes in both; the README lets a new developer run the project.
- `PhoneCard`, `SearchBar`, `SpecSection` and `ComparisonRow` are each reused in more than one place.

## HOW TO REPORT

After each phase give: files changed, how to run and test it, anything assumed or unverified, and questions for me. Flag every place you relied on an unverified API assumption.







# SpecLens: One-Shot Prompt to Build the Whole Website

Paste everything below the line into the coding agent (Antigravity or similar).

---

Build the complete **SpecLens — Smartphone Discovery and Comparison Platform** from scratch, end to end, in one run. Work through the steps in order without waiting for my approval between them. Stop and ask me only if you are blocked (for example you need the API key). When finished, give a short report.

## 1. What to build

A responsive **React** web app where users search smartphones, browse by brand, read structured specification pages and compare 2–4 phones side by side. Phone data comes from the external service **MobileAPI.dev**, accessed only through our own small **Express** server so the API key is never exposed in the browser. This is a college project, so keep the scope realistic and do not add features beyond the list below.

## 2. Hard rules

- Frontend: **React + TypeScript + Vite**, React Router, TanStack Query v5, Tailwind CSS. **No Next.js.**
- Backend: **Node.js + Express (TypeScript)**, REST, JSON. **No database.**
- Monorepo: `client/`, `server/`, `docs/`, root `README.md` and `.gitignore`. Use npm.
- The MobileAPI.dev key exists ONLY in `server/.env` as `MOBILEAPI_KEY`. Never put it in client code, any `VITE_` variable, logs or Git. Commit only `.env.example` files.
- **Do not invent MobileAPI.dev behaviour.** The endpoints below are reported but unverified (see section 3).
- **Mock mode:** the app must run fully without an API key using local fixture data (`USE_MOCK=true`), so I can see and test everything. Real mode is used when `MOBILEAPI_KEY` is set and `USE_MOCK` is not `true`. The free API quota is small, so use mock mode for all development and tests.

## 3. External API (verify, don't assume)

Base URL (reported): `https://api.mobileapi.dev/`. Auth: API key in an `Authorization` header (Token or Bearer) or a `key` query parameter. Reported endpoints:

- `GET /devices/search/?name=`: fuzzy search
- `GET /devices/autocomplete/?q=&limit=`: suggestions (may need a minimum query length)
- `GET /devices/{id}/`: device detail
- `GET /manufacturers/`: brands
- `GET /devices/by-manufacturer/?brand=`: 50 devices per page

If a key is available, check these with a few real calls and record real field names in `docs/api-notes.md`. Otherwise build the client against clearly labelled ASSUMED fixtures in `server/fixtures/` (at least 12 realistic phones from 5+ brands, with some missing fields on purpose to test "Not available") and list in `docs/api-notes.md` what must be verified. Isolate all provider-specific code in `server/src/services/mobileApiClient.ts` and `server/src/normalizers/`, so correcting it later touches only those files.

## 4. Pages (all MVP)

| Route | Content |
|---|---|
| `/` | Hero with large search bar and autocomplete; popular phones (curated name list in server config); recently viewed (localStorage); popular brands |
| `/search?q=` | Result grid, pagination, skeleton, empty and error states; query stored in the URL |
| `/phones/:id` | Header (image, name, brand, Add to compare) and sections: Overview, General, Display, Performance, Memory, Camera, Battery and Charging, Connectivity, Network, Operating System, Physical. Missing data shows "Not available". Unknown ID shows a "Phone not found" state |
| `/brands` and `/brands/:brand` | Brand list; paginated phone grid per brand |
| `/compare?ids=1,2,3` | 2–4 phones, rows grouped by category, differing rows highlighted (label plus subtle colour, never colour alone), "show differences only" toggle, missing values as "Not available", sticky label column with horizontal scroll on small screens, shareable URL, in-page phone selector |
| `/about`, `*` | Data source and limitations; 404 page |

Navbar with logo, compact search, Brands, Compare (count badge), About. Footer with data-source attribution.

## 5. Server API (our contract, all GET)

`/api/health`, `/api/phones/search?q=&page=`, `/api/phones/autocomplete?q=&limit=`, `/api/phones/popular`, `/api/phones/:id`, `/api/brands`, `/api/brands/:brand?page=`, `/api/compare?ids=` (2–4 ids, fetched in parallel, cache first).

Responses: `{ results: PhoneSummary[], page, hasMore }` for lists, `Phone` for detail, `{ phones: Phone[], missing: string[] }` for compare. Errors always `{ "error": { "code", "message" } }` with `INVALID_INPUT` 400, `NOT_FOUND` 404, `RATE_LIMITED` 429, `UPSTREAM_UNAVAILABLE` 502, `UPSTREAM_TIMEOUT` 504, `INTERNAL_ERROR` 500. Never leak stack traces, upstream bodies or the key.

Server must include: env validation at start-up, `zod` input validation, `helmet`, CORS limited to `CLIENT_ORIGIN`, `express-rate-limit`, `compression`, an upstream timeout of about 8–10 s, an in-memory TTL cache (minutes for search, hours for details, a day for brands) with stale-on-error fallback, and a request logger that never prints secrets.

## 6. Data model

All fields optional (`null` when absent). **Phone:** id, name, brand, image, releaseDate, dimensions, weight, display {size, resolution, type, refreshRate, protection}, processor {chipset, cpu, gpu}, memory {ramOptions, cardSlot}, storage {storageOptions}, rearCamera and frontCamera {modules, features, video}, battery {capacity, type}, charging, operatingSystem, network {technologies, simType}, connectivity {wifi, bluetooth, nfc, usb, positioning}. **PhoneSummary:** id, name, brand, thumbnail, highlights.

Normalizers are pure functions in `server/src/normalizers/`. External values are often free text: parse only when reliable, otherwise keep the original string. React components must never see the provider's raw field names. Use thumbnails in lists and full images only on detail pages.

## 7. Client architecture

```
client/src/
  components/{common,phone,search,compare}/   pages/   layouts/   hooks/
  services/   api/   types/   utils/   constants/   routes/   styles/
```

- One HTTP client in `api/` (base URL from `VITE_API_BASE_URL`, timeout, errors mapped to a typed `ApiError`); plain fetch functions in `services/`; TanStack Query hooks in `hooks/` (`usePhoneSearch`, `useAutocomplete`, `usePhone`, `useBrands`, `useCompare`, `useDebounce`, `useRecentlyViewed`).
- Presentational components take props only; pages and hooks fetch data.
- Reusable components: `SearchBar`, `SearchSuggestions`, `PhoneCard`, `PhoneGrid`, `SpecSection`, `Pagination`, `Skeleton`, `ErrorState`, `EmptyState`, `ComparisonTable`, `ComparisonRow`.
- State: server data in TanStack Query; search text, page and compare ids in the URL; UI toggles local; no global store.
- `buildComparisonRows(phones)`: pure function that groups by category, flags rows where non-missing values differ, and marks missing values.
- Search: debounce about 350 ms, no request under 2 characters, cancel stale requests, ARIA combobox keyboard support (arrows, Enter, Escape).
- Retries limited with back-off and never on 4xx. Lazy-loaded routes, lazy images with fixed dimensions, route-level error boundary.

## 8. Design and accessibility

Modern, minimal, professional and easy to scan; not flashy. Neutral palette with one accent colour, one sans-serif font (Inter or system stack), 16 px base, rounded cards, subtle shadows. Mobile-first: 1 column on mobile, 2–3 on tablet, 3–4 on desktop; touch targets at least 44 px. WCAG AA contrast, visible focus rings, skip link, semantic landmarks, `alt` text, `aria-live` for result counts, a real `<table>` with `<caption>` and `<th scope>` for comparison, and respect for `prefers-reduced-motion`.

## 9. Tests

Vitest + React Testing Library + MSW on the client; Vitest + Supertest on the server (upstream mocked). Cover: normalizers, `buildComparisonRows`, `useDebounce`, `useCompare` (max 4), the search component (one debounced request, keyboard navigation, empty and error states), `PhoneCard`, `SpecSection`, `ComparisonTable`, server validation, cache hit on a second call, upstream error mapping, and the flows search to results, result to details, and adding phones to compare.

## 10. Order of work

1. Scaffold the monorepo, tooling, env files, README skeleton.
2. Server: config, mock data source with fixtures, `mobileApiClient`, normalizers, cache, validation, middleware, all endpoints, server tests.
3. Client foundation: layout, routing, API layer, shared components, skeletons and states.
4. Search and autocomplete, then the results page.
5. Phone details, then brands, then Home.
6. Compare.
7. Accessibility and performance pass, error boundary, lazy loading.
8. Remaining tests, README (setup, env variables, scripts, architecture, limitations), `docs/api-notes.md`.
9. Make one commit per step using Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

## 11. Definition of done (verify yourself before reporting)

- `npm install` then one command (for example `npm run dev` at the root) starts client and server; the app works in mock mode with no key.
- Search, details, brand browsing and 2–4 phone comparison work at 360, 768 and 1280 px widths.
- `grep` of the built `client/dist` and the repo finds no API key; `.env` is git-ignored.
- Simulated timeout, 429 and 5xx responses show the defined UI states without crashing.
- `npm test` passes for client and server.
- `PhoneCard`, `SearchBar`, `SpecSection` and `ComparisonRow` are each used in more than one place.

## 12. Final report

Reply with: how to run it, what was built, which parts rely on unverified MobileAPI.dev assumptions, and what I must do next (add my real API key, verify endpoints, deploy). Keep it short.

## Out of scope (do not build)

Accounts, favourites, price tracking, filters, recommendations, reviews, ratings, notifications, dark mode, database, admin dashboard.