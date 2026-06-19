export interface DateParts {
  day: number;
  month: number;
  year: number;
}

export function parseDateInput(value: string): DateParts | null {
  const trimmed = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    return {
      year: Number(isoMatch[1]),
      month: Number(isoMatch[2]),
      day: Number(isoMatch[3]),
    };
  }

  const germanMatch = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(trimmed);
  if (!germanMatch) {
    return null;
  }

  const day = Number(germanMatch[1]);
  const month = Number(germanMatch[2]);
  const year = Number(germanMatch[3]);
  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }

  return { day, month, year };
}

export function formatDateDeParts(parts: DateParts): string {
  const day = String(parts.day).padStart(2, '0');
  const month = String(parts.month).padStart(2, '0');
  return `${day}.${month}.${String(parts.year)}`;
}

export function formatDateDe(value: string): string {
  const parsed = parseDateInput(value);
  if (!parsed) {
    return value.trim();
  }
  return formatDateDeParts(parsed);
}

export function formatTodayDe(): string {
  const now = new Date();
  return formatDateDeParts({
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
}

export function formatOrtDateLine(ort: string, dateDe: string): string {
  const trimmedOrt = ort.trim();
  if (trimmedOrt && dateDe) {
    return `${trimmedOrt}, den ${dateDe}`;
  }
  return dateDe;
}

export function toDatumDatetimeTypst(value: string): string {
  const parsed = parseDateInput(value);
  if (!parsed) {
    return '';
  }
  return `datetime(day: ${String(parsed.day)}, month: ${String(parsed.month)}, year: ${String(parsed.year)})`;
}
