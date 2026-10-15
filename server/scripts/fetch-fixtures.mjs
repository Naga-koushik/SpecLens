/**
 * Script to fetch live fixtures from MobileAPI.dev when a key is provided.
 * Run with: node server/scripts/fetch-fixtures.mjs
 * 
 * NOTE: The free tier has a strictly limited quota (50 requests/month).
 * This script only makes 4 selective calls to conserve credits.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../fixtures/live');

const apiKey = process.env.MOBILEAPI_KEY;

if (!apiKey) {
  console.error('\x1b[31mError: MOBILEAPI_KEY environment variable is not set.\x1b[0m');
  console.log('To run this script, set your key in server/.env or export it:');
  console.log('  export MOBILEAPI_KEY="your-api-key"');
  console.log('  node server/scripts/fetch-fixtures.mjs');
  process.exit(1);
}

const BASE_URL = 'https://api.mobileapi.dev';

async function fetchAndSave(endpoint, filename) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`Fetching: ${url}...`);

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Failed ${endpoint}: HTTP ${res.status} - ${errText}`);
      return;
    }

    const data = await res.json();
    const dest = path.join(FIXTURES_DIR, filename);
    fs.mkdirSync(FIXTURES_DIR, { recursive: true });
    fs.writeFileSync(dest, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved fixture -> ${filename}`);
  } catch (err) {
    console.error(`Network error on ${endpoint}:`, err.message);
  }
}

async function main() {
  console.log('Starting live fixture download from MobileAPI.dev...');
  console.log('Conserving quota (making only 4 targeted requests)...');

  // 1. Search
  await fetchAndSave('/devices/search/?name=iPhone&page=1', 'devices_search_iphone.json');
  // 2. Autocomplete
  await fetchAndSave('/devices/autocomplete/?q=iPhone&limit=5', 'devices_autocomplete_iphone.json');
  // 3. Manufacturers
  await fetchAndSave('/devices/by-manufacturer/?manufacturer=Apple&page=1', 'devices_by_manufacturer_apple.json');
  // 4. Manufacturers list
  await fetchAndSave('/manufacturers/?page=1', 'manufacturers_list.json');

  console.log('Finished downloading fixtures!');
}

main();
