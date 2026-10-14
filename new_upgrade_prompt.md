# SpecLens: Upgrade Prompt (for the existing repo)

Paste everything below the line into Antigravity with the repo https://github.com/Naga-koushik/SpecLens open.

---

You are a senior full-stack engineer improving an **existing, working** project. Do NOT rewrite or restructure it. Extend it in small, reviewable steps and keep every existing test passing.

## 0. Read first

Read `README.md`, `docs/api-notes.md`, `server/src/**` and `client/src/**` before changing anything. Current state (already audited):

- Monorepo with npm workspaces: `server/` (Express + TypeScript, zod, helmet, lru-cache, rate limiting, error middleware) and `client/` (React 18 + TypeScript + Vite + React Router + TanStack Query v5 + Tailwind, emerald accent).
- Pages exist: Home, Search, Phone detail, Brands, Brand detail, Compare, About, 404. Hooks, `buildComparisonRows`, `ErrorBoundary`, skeletons, lazy routes exist.
- **Mock mode is the default** (`USE_MOCK=true`, 14 phones in `server/src/fixtures/mockData.ts`). Live mode (`mobileApiClient.ts`) has never been run against the real API.
- `npm install`, `npm run build`, `npm test` currently pass (server 16 tests, client 6 tests).

Hard rules that still apply: React (no Next.js), Express proxy, **no database**, the MobileAPI key only in `server/.env`, Conventional Commits, one commit per step. Do not invent MobileAPI.dev behaviour: if a key is not available, mark anything that depends on the real API as UNVERIFIED in `docs/api-notes.md`.

## 1. Fix these known problems first (Tier A)

1. **Timeout mismatch:** `UPSTREAM_TIMEOUT_MS` is 15000 but the error message says "8s". Use one constant (8000 ms) and build the message from it.
2. **Brand slug bug (live mode):** `getPhonesByBrand` rebuilds the brand name with `charAt(0).toUpperCase() + slice(1)`, which breaks names like "OnePlus" and "Sony Ericsson". Resolve the real manufacturer name from the cached `getBrands()` list by slug instead; fall back to the slug only if not found. Add a test.
3. **Brands list is capped:** live `getBrands` requests `page=1&limit=30`. Follow pagination (bounded, for example up to 5 pages, cached for 24 h) or document the cap on the Brands page.
4. **Compare route:** it returns HTTP 200 with an empty `phones` array when every id fails. Return 404 `NOT_FOUND` when no phone is found, keep `missing[]` for partial failures, and make sure `ComparePage` shows a clear state for both cases.
5. **Id validation:** validate `:id` and each compare id (digits only, bounded length) with zod, returning 400 `INVALID_INPUT`.
6. **Test blind spot:** `isMockMode` is forced on when `NODE_ENV === 'test'`, so the live code path is never tested. Add server tests that run the live path against a mocked `fetch` (error mapping 400/404/429/5xx, timeout, malformed body, pagination fields) without using the real network.
7. **Normalizer robustness:** add tests for the real MobileAPI response shapes described in `docs/api-notes.md` (flat list items with `manufacturer_name`, `image_b64`, `hardware`, `screen_resolution`, `battery_capacity`), including missing and odd values. Remove `any` from the normalizer and client types where practical (about 37 usages now).
8. **Large payloads:** live search results can carry base64 images. Keep thumbnails in lists, and strip or downsize images in list responses on the server.
9. **Repo hygiene:** remove `speclens_project.docx` and `SpecLens_Build_Prompt.md` from the repo root (move any needed content into `docs/`), add a `LICENSE` file placeholder for the owner to complete, and make the README's "14 Real Phones" wording accurate (specs plus generated placeholder images).
10. **Fixtures honesty:** the hand-written files in `server/fixtures/` use generated SVG placeholder images, so they are not real API responses. Rename or label them as `ASSUMED` in `docs/api-notes.md`, and make `server/scripts/fetch-fixtures.mjs` write real responses into a separate `server/fixtures/live/` folder when a key is provided.

## 2. Features to add (Tier B). These extend the original MVP.

Build them in this order. Each must work in mock mode, be responsive, accessible, and have tests.

1. **Spec glossary tooltips:** a small `GlossaryTerm` component (accessible, keyboard-focusable, not hover-only) explaining terms such as AMOLED, LTPO, refresh rate, chipset, UFS, NFC, eSIM, IP rating, PPI. Use it in `SpecSection` and the compare table. Data lives in `client/src/constants/glossary.ts`. This addresses the proposal's "technical terms are hard for ordinary users" problem.
2. **Compare upgrades:** for numeric rows (battery mAh, RAM, weight, screen size, refresh rate), parse values with a tested helper in `utils/` and mark the best value with a "Best" badge (not colour alone). Direction per row: higher is better for battery, RAM, refresh rate; lower is better for weight. Keep the original text visible. Add a "Copy link" confirmation toast and a "Clear all" action.
3. **Sort and filter on result lists (Search and Brand pages):** client-side, URL-persisted (`?sort=`, `?brand=`, `?minRam=`, `?year=`). Sort by relevance, newest, name. Filters apply to the loaded results only, so say so in the UI. Show an empty state when filters remove everything.
4. **Favourites:** a heart button on `PhoneCard` and the detail page, stored in `localStorage` through a `useFavorites` hook, plus a `/favorites` page and a navbar link. Wrap storage access in try/catch.
5. **Similar phones:** on the detail page, show up to 4 similar phones (same brand or similar release year), computed from data already available, with no new API calls in mock mode.
6. **Dark mode:** Tailwind `class` strategy, a toggle in the navbar, respects `prefers-color-scheme` on first visit, persisted in `localStorage`. Check contrast in both themes.
7. **Mobile compare mode:** below 640 px, offer a "swipe between phones" view as an alternative to the wide table, plus the existing sticky-column table.

Not in scope: user accounts, a database, price tracking, reviews, AI search. Do not add them.

## 3. Quality, delivery and polish (Tier C)

1. **Tests:** add React Testing Library tests for `SearchBar` (single debounced request, arrow/Enter/Escape keys, empty and error states), `ComparisonTable`, `useCompare`, `useFavorites`, the glossary, and these flows: search to results, results to details, add two phones to compare. Add `vitest-axe` (or `jest-axe`) checks on the main pages. Add Supertest cases for every new or changed server route. Target: all meaningful behaviour covered, not a coverage percentage.
2. **CI:** `.github/workflows/ci.yml` running install, `npm run lint`, `npm test`, `npm run build` on push and pull request (Node 20).
3. **Deployment config (recommendations only, not hard dependencies):** `client/vercel.json` (or `netlify.toml`) with the SPA rewrite rule; a `server` start script that works after `npm run build`; `render.yaml` or equivalent; document `VITE_API_BASE_URL` (the client currently proxies `/api` only in dev, so production needs the absolute API URL) and `CLIENT_ORIGIN`. Allow several comma-separated origins in `CLIENT_ORIGIN`.
4. **Performance:** run a production build and report bundle sizes; lazy-load images with fixed dimensions; make sure no list endpoint ships full-size images; record Lighthouse (mobile) scores in the README.
5. **Security check:** confirm no API key in `client/dist` (`grep` the build), no key in logs, helmet and CORS configured, rate limiter tested.
6. **README:** add screenshots of Home, Detail, Compare (light and dark), a "Live mode setup" section (how to add a key, set `USE_MOCK=false`, and what has been verified), a features table, a known-limitations section, and the deploy steps.
7. **Docs:** update `docs/api-notes.md` with a clear VERIFIED versus UNVERIFIED table. If a key is available, verify each endpoint with the minimum number of real calls (the free tier is small, about 50 per month) and save real responses to `server/fixtures/live/`.

## 4. Working method

- Work tier by tier: A, then B, then C. Make one commit per numbered item with Conventional Commits (`fix:`, `feat:`, `test:`, `docs:`, `chore:`, `ci:`).
- After each tier run `npm run lint`, `npm test` and `npm run build`. Fix failures before moving on.
- Do not change public route paths, the response shapes in the README, or existing test expectations unless a Tier A item requires it. If you change one, update the tests and the docs in the same commit.
- If a decision is genuinely ambiguous, choose the simplest option, note it in the commit message, and continue. Stop and ask only when blocked (for example you need the API key).

## 5. Final report

Reply with: what changed per tier, test and build results, anything left UNVERIFIED against the real MobileAPI.dev, any item you skipped and why, and the exact commands to run the app and the tests. Keep it under 300 words.