import { SavedCalculation, PropertyInputs } from './types';
import { DEFAULT_INPUTS } from './defaults';

const STORAGE_KEY = 'immo-calculator-savings';

/** Backfill missing fields from defaults so old saves don't produce NaN */
function migrateInputs(inputs: Partial<PropertyInputs>): PropertyInputs {
  return { ...DEFAULT_INPUTS, ...inputs };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadAll(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const calcs = JSON.parse(raw) as SavedCalculation[];
    return calcs.map((c) => ({ ...c, inputs: migrateInputs(c.inputs) }));
  } catch {
    return [];
  }
}

function saveAll(calcs: SavedCalculation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calcs));
}

export function saveCalculation(inputs: PropertyInputs, existingId?: string): SavedCalculation {
  const calcs = loadAll();
  const now = new Date().toISOString();

  if (existingId) {
    const idx = calcs.findIndex((c) => c.id === existingId);
    if (idx >= 0) {
      calcs[idx] = {
        ...calcs[idx],
        name: inputs.name,
        updatedAt: now,
        inputs,
      };
      saveAll(calcs);
      return calcs[idx];
    }
  }

  const calc: SavedCalculation = {
    id: generateId(),
    name: inputs.name,
    createdAt: now,
    updatedAt: now,
    inputs,
  };
  calcs.push(calc);
  saveAll(calcs);
  return calc;
}

export function deleteCalculation(id: string) {
  const calcs = loadAll().filter((c) => c.id !== id);
  saveAll(calcs);
}

export function exportToJson(calcs: SavedCalculation[]): string {
  return JSON.stringify(calcs, null, 2);
}

export function importFromJson(json: string): SavedCalculation[] {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error('Ungültiges Format');
  const calcs = loadAll();
  const existingIds = new Set(calcs.map((c) => c.id));
  for (const item of parsed) {
    if (item.id && item.inputs && !existingIds.has(item.id)) {
      calcs.push({ ...item, inputs: migrateInputs(item.inputs) });
      existingIds.add(item.id);
    }
  }
  saveAll(calcs);
  return calcs;
}
