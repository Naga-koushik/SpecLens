import { useCallback, useState } from 'react';
import { FinderCriteria } from '../types';
interface SavedSearch { name: string; criteria: FinderCriteria; }
const KEY = 'speclens-finder-searches';
function read(): SavedSearch[] { try { const value = localStorage.getItem(KEY); return value ? JSON.parse(value) as SavedSearch[] : []; } catch { return []; } }
export function useSavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>(read);
  const save = useCallback((name: string, criteria: FinderCriteria) => { const next = [...searches.filter((item) => item.name !== name), { name, criteria }]; try { localStorage.setItem(KEY, JSON.stringify(next)); setSearches(next); } catch { /* storage is optional */ } }, [searches]);
  return { searches, save };
}
