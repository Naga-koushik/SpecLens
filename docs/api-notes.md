# MobileAPI.dev API Notes & Specification

Generated: Phase 0 Verification  
Source: Official MobileAPI.dev Documentation (`https://mobileapi.dev/docs/`)

---

## 1. Overview & Authentication

- **Base URL:** `https://api.mobileapi.dev/`
- **Supported Auth Formats:**
  - Header (Recommended):
    - `Authorization: Bearer <API_KEY>`
    - `Authorization: Token <API_KEY>`
  - Query Parameter:
    - `?key=<API_KEY>`
- **Security Rule:** The API key MUST live strictly in `server/.env` as `MOBILEAPI_KEY`. It is NEVER exposed to the frontend, browser network requests, or Git.
- **Quota & Limits (Free Tier):**
  - Quota: 50 requests/month (confirmed in docs).
  - Rate limit: 5 requests/minute.
  - Credit consumption: 1 credit per request for all device, manufacturer, search, and spec endpoints.
  - Rate limit headers returned:
    - `X-RateLimit-Limit`
    - `X-RateLimit-Remaining`
    - `X-RateLimit-Reset`

---

## 2. Verified Endpoints & Parameter Contracts

### 2.1 Device Search: `GET /devices/search/`
- **Parameters:**
  - `name` (string, required*): Device name fuzzy search (e.g., `iPhone 15`). Mutually exclusive with `model_number`.
  - `model_number` (string, required*): Model number search (e.g., `A3520`). Mutually exclusive with `name`.
  - `manufacturer` (string, optional): Brand filter (e.g., `Apple`, `Samsung`).
  - `page` (integer, optional, default `1`): Page number.
  - `limit` (integer, optional, default `10`, max `30`): Items per page.
  - `exact` (boolean, optional, default `false`): Exact match only (100% certainty).
- **Pagination Shape:**
  ```json
  {
    "total": 15,
    "page": 1,
    "page_size": 10,
    "total_pages": 2,
    "has_next": true,
    "has_previous": false,
    "devices": [...]
  }
  ```
- **Device Search Item Shape:**
  - `id`: integer
  - `match_certainty`: string percentage (e.g., `"100.00%"`, `"99.50%"`)
  - `match_type`: string (`"name"`, `"exact_model"`, `"partial_model"`)
  - `name`: string (e.g., `"iPhone 17 Pro"`)
  - `image_b64`: base64-encoded string (or URL in some records)
  - `manufacturer_name`: string (e.g., `"Apple"`)
  - `device_type`: string (e.g., `"phone"`, `"tablet"`)
  - `description`: string
  - `colors`: string
  - `storage`: string
  - `screen_resolution`: string (e.g., `"6.3\", 1206x2622 pixels"`)
  - `weight`: string
  - `thickness`: string
  - `release_date`: string
  - `camera`: string
  - `battery_capacity`: string
  - `hardware`: string
  - `model_numbers`: string

---

### 2.2 Device Autocomplete: `GET /devices/autocomplete/`
- **Parameters:**
  - `q` (string, required): Prefix query string (min 2-3 characters recommended).
  - `limit` (integer, optional, default `5`): Max suggestions.
- **Response Shape (Raw array, not wrapped in an object):**
  ```json
  [
    {
      "id": 12345,
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "full_name": "Apple iPhone 17 Pro"
    }
  ]
  ```
- **Note on thumbnail:** The autocomplete endpoint does not return image fields. Our server contract maps `thumbnail: null` or generates/resolves a placeholder.

---

### 2.3 Device Detail: `GET /devices/{id}/`
- **Parameters:**
  - `{id}` (integer/string, path parameter): Device ID.
- **Device Detail Response Shape:**
  ```json
  {
    "id": 12345,
    "name": "iPhone 17 Pro",
    "brand": {
      "id": 6,
      "name": "Apple",
      "logo_b64": "..."
    },
    "main_image_b64": "...",
    "screen_resolution": "2556 x 1179",
    "camera": "48 MP + 12 MP + 12 MP",
    "hardware": "A17 Pro",
    "battery_capacity": "3274 mAh",
    "storage": "128GB, 256GB, 512GB, 1TB",
    "weight": "187 g",
    "release_date": "2023-09-22",
    "colors": "Natural Titanium, Blue Titanium..."
  }
  ```

---

### 2.4 Device Granular Specification Sub-Endpoints: `GET /devices/{id}/{specification}/`
MobileAPI.dev supports modular specification endpoints:
- `network`: `{ technology, bands_2g, bands_3g, bands_4g, bands_5g, speed }`
- `body`: `{ dimensions, weight, build, sim, other }`
- `display`: `{ type, size, resolution, protection, other }`
- `platform`: `{ os, chipset, cpu, gpu }`
- `memory`: `{ card_slot, internal, other }`
- `main-camera`: `{ modules, features, video }`
- `selfie-camera`: `{ modules, features, video }`
- `sound`: `{ loudspeaker, audio_jack }`
- `comms`: `{ wlan, bluetooth, positioning, nfc, radio, usb }`
- `features`: `{ sensors, other }`
- `battery`: `{ type, charging }`
- `misc`: `{ model_numbers, sar_us, sar_eu, price }`

**Design Decision for SpecLens Server:**
Because Free Tier allows only 50 requests/month, fetching 12 individual spec sub-endpoints per phone detail view would exhaust the monthly quota after ~4 phone views!
Therefore:
1. `GET /devices/{id}/` provides core overview fields.
2. The server normalizer gracefully extracts and structures all available specifications from the device detail and search fields.
3. If sub-endpoints are optionally requested or mocked in fixtures, the normalizer seamlessly merges them into our rich unified `Phone` model.

---

### 2.5 Device Images: `GET /devices/{id}/images/`
- **Parameters:**
  - `{id}` (path parameter): Device ID.
  - `limit` (integer, optional, default `10`, max `30`).
- **Response Shape:**
  ```json
  [
    {
      "id": "main_101",
      "image_url": "main_image",
      "image_b64": "...",
      "caption": "Apple iPhone 17 Pro - Main Image",
      "is_official": true,
      "order": 0
    }
  ]
  ```

---

### 2.6 Manufacturers List: `GET /manufacturers/`
- **Parameters:**
  - `page` (integer, optional, default `1`).
  - `limit` (integer, optional, default `10`, max `30` or `50`).
- **Response Shape:**
  ```json
  {
    "total": 124,
    "page": 1,
    "page_size": 10,
    "total_pages": 13,
    "has_next": true,
    "has_previous": false,
    "manufacturers": [
      {
        "id": 6,
        "name": "Apple",
        "website_url": "https://www.apple.com/"
      },
      {
        "id": 93,
        "name": "Samsung",
        "website_url": "https://www.samsung.com"
      }
    ]
  }
  ```

---

### 2.7 Devices by Manufacturer: `GET /devices/by-manufacturer/`
- **Parameters:**
  - `manufacturer` (string, required): Brand name (e.g., `Apple`, `Samsung`). **Note:** Parameter is `manufacturer`, NOT `brand`.
  - `page` (integer, optional, default `1`).
  - `limit` (integer, optional, default `10`, max `30`).
- **Response Shape:**
  ```json
  {
    "manufacturer": "Apple",
    "total": 125,
    "page": 1,
    "page_size": 10,
    "total_pages": 13,
    "has_next": true,
    "has_previous": false,
    "devices": [...]
  }
  ```

---

## 3. Error Codes & Upstream Format

MobileAPI.dev upstream errors return:
```json
{
  "error": "Invalid API key",
  "code": 401,
  "message": "The provided API key is invalid or has been revoked.",
  "details": { "key_provided": true, "timestamp": "..." }
}
```
Or for rate limits:
```json
{
  "detail": "Rate limit exceeded. Please wait 5.23 seconds.",
  "limit": 50,
  "used": 50,
  "retry_after": 5.23
}
```
Or for missing specs / 404:
```json
{
  "detail": "Network specifications not found for this device"
}
```

### SpecLens Error Mapping Contract:
Our Express server maps all upstream errors to our standard internal error contract without exposing API keys or upstream internals:
- 400 -> `{ "error": { "code": "INVALID_INPUT", "message": "..." } }`
- 404 -> `{ "error": { "code": "NOT_FOUND", "message": "..." } }`
- 429 -> `{ "error": { "code": "RATE_LIMITED", "message": "..." } }`
- 502 -> `{ "error": { "code": "UPSTREAM_UNAVAILABLE", "message": "..." } }`
- 504 -> `{ "error": { "code": "UPSTREAM_TIMEOUT", "message": "..." } }`
- 500 -> `{ "error": { "code": "INTERNAL_ERROR", "message": "..." } }`

---

## 4. Confirmed vs. Assumed Status

| Feature / Endpoint | Status | Notes |
|---|---|---|
| Base URL `https://api.mobileapi.dev/` | Confirmed | Documented on official site |
| Auth via `Authorization: Bearer` / `Token` | Confirmed | Documented on official site |
| Auth via `?key=` query param | Confirmed | Documented on official site |
| `GET /devices/search/` (`name`, `page`) | Confirmed | Response has `total`, `devices` array |
| `GET /devices/autocomplete/` (`q`, `limit`) | Confirmed | Response is a direct JSON array of suggestions |
| `GET /devices/{id}/` | Confirmed | Core device details and specs |
| `GET /manufacturers/` | Confirmed | Response has `manufacturers` array |
| `GET /devices/by-manufacturer/` | Confirmed | Parameter is `manufacturer`, not `brand` |
| Image format (base64 vs URL) | Confirmed | Both base64 (`image_b64`, `main_image_b64`) and URLs can be present |
| Exact field availability per phone | ASSUMED variable | External phones have varying degrees of missing specs; normalizers must handle null/missing safely |
| Hand-written `server/fixtures/*.json` | ASSUMED (Synthetic) | Contains hand-written fixtures and generated SVG placeholder images; not real upstream API responses |
| Real API Fixtures `server/fixtures/live/` | Target (Live) | Real responses downloaded by `server/scripts/fetch-fixtures.mjs` when an API key is provided |

