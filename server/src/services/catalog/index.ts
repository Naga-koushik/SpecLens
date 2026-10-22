import { Phone } from '../../types/index.js';
import { FINDER_CATALOG } from '../../fixtures/finderCatalog.js';
import { normalizePhone } from '../../normalizers/phoneNormalizer.js';
import fs from 'node:fs';
import path from 'node:path';

export interface CatalogService { getPhones(): Phone[]; isDemo: boolean; }
export class MockCatalog implements CatalogService {
  public readonly isDemo = true;
  getPhones(): Phone[] { return FINDER_CATALOG; }
}
export class SnapshotCatalog implements CatalogService {
  public readonly isDemo = false;
  private readonly phones: Phone[];
  constructor(filePath: string) {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as { devices?: Phone[] };
    this.phones = Array.isArray(parsed.devices) ? parsed.devices.map((device) => normalizePhone(device)) : [];
  }
  getPhones(): Phone[] { return this.phones; }
}
const snapshotPath = path.resolve(process.cwd(), 'data', 'catalog.json');
export const catalog: CatalogService = fs.existsSync(snapshotPath) ? new SnapshotCatalog(snapshotPath) : new MockCatalog();
