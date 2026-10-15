# SpecLens — Smartphone Discovery & Comparison Platform

SpecLens is a modern, responsive web application for exploring mobile device specifications, discovering smartphones by manufacturer, and conducting detailed side-by-side comparisons of 2 to 4 devices.

Built as an academic capstone project, SpecLens features a decoupled full-stack architecture using **React + TypeScript + Vite** on the frontend and an **Express (TypeScript)** backend proxy that safely interfaces with **MobileAPI.dev** while enforcing strict secret isolation and in-memory TTL caching.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (React)                        │
│   Vite • React Router (Lazy Routes) • TanStack Query v5    │
│            Tailwind CSS • Accessible Semantic UI            │
└──────────────────────────────┬──────────────────────────────┘
                               │ /api/* (Proxied HTTP Requests)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend Server                   │
│   Rate Limiting • Helmet • Compression • Zod Validation     │
│   In-Memory LRU Cache with Stale-on-Error Fallback          │
└──────────────┬───────────────────────────────┬──────────────┘
               │ (Mock Mode: USE_MOCK=true)    │ (Live Mode)
               ▼                               ▼
     ┌────────────────────────┐      ┌───────────────────┐
     │     Local Fixtures     │      │   MobileAPI.dev   │
     │  14 Curated Phones     │      │  External REST    │
     │ (Specs + Placeholders) │      │  (Protected Key)  │
     │  6 Major Brands        │      │                   │
     └────────────────────────┘      └───────────────────┘
```

---

## Key Features

1. **Home Screen (`/`)**:
   - Hero search bar with debounced autocomplete (ARIA combobox with keyboard arrow/enter navigation).
   - Curated popular smartphones grid.
   - Recently viewed smartphones tracker (persisted in `localStorage`).
   - Quick manufacturer shortcuts.

2. **Search Results (`/search?q=`)**:
   - URL-persisted search state (`/search?q=iPhone&page=1`).
   - Live result counts (`aria-live="polite"`).
   - Loading skeletons, empty states, and error recovery.
   - Paginated grid adapting across mobile (1 col), tablet (2-3 col), and desktop (4 col).

3. **Phone Specifications (`/phones/:id`)**:
   - Clean product showcase with high-resolution image fallback.
   - 11 categorized specification sections: *Overview, General, Display, Performance, Memory, Storage, Camera, Battery and Charging, Connectivity, Network, Physical*.
   - Strict "Not available" fallback for incomplete manufacturer fields.
   - 404 "Phone not found" state for invalid device IDs.
   - "+ Add to compare" quick action.

4. **Brand Directory (`/brands` & `/brands/:brand`)**:
   - Comprehensive manufacturer catalog.
   - Paginated brand lineups.

5. **2–4 Phone Comparison (`/compare?ids=1,2,3`)**:
   - Real semantic HTML `<table>` with `<caption>` and `<th scope>`.
   - Category-grouped specifications.
   - Differing attributes clearly highlighted with a text badge (`DIFFERENT`) and subtle background styling (never color alone).
   - "Show differences only" instant filter toggle.
   - Missing specs explicitly rendered as `Not available`.
   - In-page phone selector modal to add additional phones up to 4.
   - Shareable comparison URL with link copy tool.
   - Horizontal scrolling with sticky specification label column.

---

## Security & Secret Isolation

- **Zero Client Key Exposure**: The upstream API key (`MOBILEAPI_KEY`) exists **strictly in `server/.env`**.
- It is never prefixed with `VITE_`, never bundled into `client/dist`, and never transmitted over browser network requests.
- All `.env` files are excluded by `.gitignore`. Only `.env.example` templates are tracked.
- Server logs automatically redact query keys and sensitive headers.

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended, verified on v24)
- npm (v9.0.0 or higher)

### Installation
Clone the repository and install all dependencies for both client and server via npm workspaces:

```bash
npm install
```

### Environment Setup

1. **Server Environment**:
   Copy `server/.env.example` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
   *By default, `USE_MOCK=true` is enabled, allowing you to run and test the complete application offline without an external API key.*

2. **Client Environment**:
   Copy `client/.env.example` to `client/.env`:
   ```bash
   cp client/.env.example client/.env
   ```

---

## Running the Application

### 1. Development Mode (Starts Client & Server concurrently)
```bash
npm run dev
```
- **Client**: `http://localhost:5173`
- **Server API**: `http://localhost:5000`

### 2. Mock Mode vs. Live Mode

- **Mock Mode (Default & Recommended for Evaluation)**:
  `USE_MOCK=true` in `server/.env`.
  Runs against a curated dataset of 14 phones (comprising real specs plus generated placeholder images) from Apple, Samsung, Google, OnePlus, Xiaomi, and Motorola with intentional null values to test edge cases.
- **Live Mode**:
  Set your MobileAPI.dev key in `server/.env`:
  ```env
  USE_MOCK=false
  MOBILEAPI_KEY=your_actual_api_key_here
  ```

---

## Running Tests

Run unit and integration test suites across both workspaces:

```bash
# Run all tests (Server + Client)
npm test

# Run only Server tests
npm run test:server

# Run only Client tests
npm run test:client
```

---

## Production Build

Build production bundles for both server (TypeScript compilation) and client (Vite optimized chunks):

```bash
npm run build
```

---

## API Contract Reference

All endpoints return JSON and are hosted under `/api/*`:

| Endpoint | Description |
|---|---|
| `GET /api/health` | Health check (`{ status: "ok" }`) |
| `GET /api/phones/search?q=&page=` | Search devices (`{ results, page, hasMore, total }`) |
| `GET /api/phones/autocomplete?q=&limit=` | Prefix search suggestions (`{ suggestions }`) |
| `GET /api/phones/popular` | Curated popular smartphones (`{ phones }`) |
| `GET /api/phones/:id` | Full specification model (`Phone`) |
| `GET /api/brands` | Manufacturers list (`{ brands }`) |
| `GET /api/brands/:brand?page=` | Brand device lineup (`{ brand, results, page, hasMore }`) |
| `GET /api/compare?ids=43,123` | Compare 2 to 4 phones (`{ phones, missing }`) |

All server errors conform to:
```json
{
  "error": {
    "code": "INVALID_INPUT | NOT_FOUND | RATE_LIMITED | UPSTREAM_UNAVAILABLE | UPSTREAM_TIMEOUT | INTERNAL_ERROR",
    "message": "Human-readable description"
  }
}
```

---

## Limitations

- External Free Tier Quota: MobileAPI.dev free tier provides 50 requests/month and 5 requests/minute. Production deployments should maintain caching or upgrade provider plans.
- Out of scope features intentionally excluded: user authentication, favorites, price tracking, user reviews, dark mode, persistent databases.
