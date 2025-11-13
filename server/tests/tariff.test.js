import { calcAmount } from '../src/utils/tariff.js';

describe('calcAmount', () => {
  test('first 15 minutes are free', () => {
    const entry = new Date();
    const later = new Date(entry.getTime() + 14 * 60000);
    expect(calcAmount(entry, later)).toBe(0);
  });

  test('exactly 15 minutes still free', () => {
    const entry = new Date();
    const later = new Date(entry.getTime() + 15 * 60000);
    expect(calcAmount(entry, later)).toBe(0);
  });

  test('16 minutes charges first block', () => {
    const entry = new Date();
    const later = new Date(entry.getTime() + 16 * 60000);
    expect(calcAmount(entry, later)).toBe(0.5);
  });

  test('31 minutes charges two blocks (after free 15)', () => {
    const entry = new Date();
    const later = new Date(entry.getTime() + 31 * 60000);
    expect(calcAmount(entry, later)).toBe(1.0);
  });
});
