import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Función pura de ejemplo que construye una fecha local en formato AAAA-MM-DD
 * respetando la skill domain-guardrails (sin usar toISOString ni UTC).
 */
function formatLocalDate(year, month, day) {
  const y = String(year);
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

describe('Sanity Check - Plantilla Base SDD', () => {
  test('formatea correctamente una fecha local en AAAA-MM-DD sin desplazamiento UTC', () => {
    const result = formatLocalDate(2026, 10, 14);
    assert.equal(result, '2026-10-14');
  });
});
