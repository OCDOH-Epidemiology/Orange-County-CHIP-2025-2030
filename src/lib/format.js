/**
 * Small formatting helpers used across the app. Kept in one place so number
 * and date formatting stays consistent.
 */

// Both formatters are pinned to UTC because we always parse ISO dates as UTC.
// Without this pin, an ISO string like "2026-07-01" gets shifted a day by
// negative-offset timezones (e.g. America/New_York renders it as June 30).
const LONG_DATE = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const MONTH_YEAR = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

/**
 * ISO string (YYYY-MM-DD) -> "September 10, 2026".
 * Parses in UTC so we don't shift days across timezones.
 */
export function formatLongDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return LONG_DATE.format(new Date(Date.UTC(y, m - 1, d)));
}

export function formatMonthYear(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return MONTH_YEAR.format(new Date(Date.UTC(y, m - 1, d)));
}

export function formatPercent(value) {
  if (value === null || value === undefined) return '—';
  const rounded = Math.round(value * 10) / 10;
  return `${rounded}%`;
}

/** Given a value and unit, return a human-readable string. */
export function formatValue(value, unit) {
  if (value === null || value === undefined) return '—';
  if (unit === 'percent') return formatPercent(value);
  return `${value}${unit && unit !== 'count' ? ` ${unit}` : ''}`;
}

/**
 * Convert a milestone status enum to a human label.
 * Note: this is purely presentational — the enum values themselves are the
 * source of truth (see docs/schema.md).
 */
export function milestoneStatusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'in_progress': return 'In progress';
    case 'not_started': return 'Not started';
    default: return status || 'Unknown';
  }
}
