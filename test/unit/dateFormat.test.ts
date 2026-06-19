import { describe, expect, it } from 'vitest';
import {
  formatDateDe,
  formatOrtDateLine,
  formatTodayDe,
  parseDateInput,
  toDatumDatetimeTypst,
} from '@/domain/letter/dateFormat';

describe('dateFormat', () => {
  it('parses ISO and German date inputs', () => {
    expect(parseDateInput('2026-01-02')).toEqual({ day: 2, month: 1, year: 2026 });
    expect(parseDateInput('19.06.2026')).toEqual({ day: 19, month: 6, year: 2026 });
  });

  it('formats dates in German notation', () => {
    expect(formatDateDe('2026-01-02')).toBe('02.01.2026');
    expect(formatDateDe('19.06.2026')).toBe('19.06.2026');
    expect(formatTodayDe()).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });

  it('builds Ort + date lines', () => {
    expect(formatOrtDateLine('Hürth', '19.06.2026')).toBe('Hürth, den 19.06.2026');
    expect(formatOrtDateLine('', '19.06.2026')).toBe('19.06.2026');
  });

  it('builds Typst datetime from ISO input', () => {
    expect(toDatumDatetimeTypst('2026-06-19')).toBe('datetime(day: 19, month: 6, year: 2026)');
  });
});
