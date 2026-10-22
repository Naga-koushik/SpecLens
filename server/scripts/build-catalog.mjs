#!/usr/bin/env node
/**
 * Builds a bounded live snapshot. This script is deliberately opt-in:
 * MOBILEAPI_KEY must be present and --max-requests defaults to 40.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

if (!process.env.MOBILEAPI_KEY) {
  console.error('MOBILEAPI_KEY is required; no requests were made.');
  process.exit(1);
}
const args = process.argv.slice(2);
const maxIndex = args.indexOf('--max-requests');
const maxRequests = maxIndex >= 0 ? Math.min(40, Math.max(1, Number(args[maxIndex + 1]) || 40)) : 40;
const output = path.resolve('server/data/catalog.json');
const liveDir = path.resolve('server/fixtures/live');
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.mkdir(liveDir, { recursive: true });
let snapshot = { generatedAt: new Date().toISOString(), devices: [] };
try { snapshot = JSON.parse(await fs.readFile(output, 'utf8')); } catch { /* start a new snapshot */ }
const existing = Array.isArray(snapshot.devices) ? snapshot.devices : [];
const limit = Math.min(maxRequests, 30);
for (let page = 1; page <= limit; page += 1) {
  const file = path.join(liveDir, `devices-${page}.json`);
  try {
    const response = await fetch(`https://api.mobileapi.dev/devices/?page=${page}&limit=30`, { headers: { Authorization: `Token ${process.env.MOBILEAPI_KEY}`, Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    await fs.writeFile(file, JSON.stringify(data, null, 2));
    if (Array.isArray(data.devices)) existing.push(...data.devices);
    if (data.has_next === false || !Array.isArray(data.devices) || data.devices.length === 0) break;
    await new Promise((resolve) => setTimeout(resolve, 12000));
  } catch (error) {
    console.error(`Stopped at page ${page}: ${error instanceof Error ? error.message : 'request failed'}`);
    break;
  }
}
await fs.writeFile(output, JSON.stringify({ generatedAt: new Date().toISOString(), devices: existing }, null, 2));
console.log(`Wrote ${existing.length} devices to ${output}.`);
