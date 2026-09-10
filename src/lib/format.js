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

const SHORT_MONTH_YEAR = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
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

/**
 * Format an ISO date as "Aug 2026" short form.
 */
export function formatShortMonthYear(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return SHORT_MONTH_YEAR.format(new Date(Date.UTC(y, m - 1, d)));
}

/**
 * Parse ISO date string to UTC Date object.
 */
export function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * Calculate days since an ISO date string.
 */
export function daysSince(iso) {
  const date = parseISODate(iso);
  if (!date) return Infinity;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// Milestone status weights for activity progress calculation
const MILESTONE_WEIGHTS = {
  not_started: 0,
  in_progress: 0.5,
  complete: 1.0,
};

/**
 * Calculate Activity Progress percentage for a priority area.
 * Activity Progress % = (Σ milestone weights / milestone count) × 100
 * Weights: not_started=0, in_progress=0.5, complete=1.0
 */
export function calculateActivityProgress(milestones) {
  if (!milestones || milestones.length === 0) return 0;
  const totalWeight = milestones.reduce((sum, m) => {
    return sum + (MILESTONE_WEIGHTS[m.status] ?? 0);
  }, 0);
  return (totalWeight / milestones.length) * 100;
}

/**
 * Calculate plan-level Activity Progress (mean of area percents).
 * Equal weight per area, NOT weighted by milestone count.
 */
export function calculatePlanActivityProgress(priorityAreas) {
  if (!priorityAreas || priorityAreas.length === 0) return 0;
  const areaPercents = priorityAreas.map(p => calculateActivityProgress(p.milestones));
  return areaPercents.reduce((sum, pct) => sum + pct, 0) / areaPercents.length;
}

/**
 * Get milestone counts for display.
 */
export function getMilestoneCounts(milestones) {
  if (!milestones) return { total: 0, complete: 0, inProgress: 0, notStarted: 0, completeOrUnderway: 0 };
  const complete = milestones.filter(m => m.status === 'complete').length;
  const inProgress = milestones.filter(m => m.status === 'in_progress').length;
  const notStarted = milestones.filter(m => m.status === 'not_started').length;
  return {
    total: milestones.length,
    complete,
    inProgress,
    notStarted,
    completeOrUnderway: complete + inProgress,
  };
}

/**
 * Find the most recent lastUpdated date across milestones.
 */
export function getLastMilestoneUpdate(milestones) {
  if (!milestones || milestones.length === 0) return null;
  const dates = milestones
    .map(m => m.lastUpdated)
    .filter(Boolean)
    .sort()
    .reverse();
  return dates[0] || null;
}

/**
 * Find the most recent activity date across partners.
 */
export function getLastPartnerActivity(partners) {
  if (!partners || partners.length === 0) return null;
  const dates = partners
    .map(p => p.lastActivityDate)
    .filter(Boolean)
    .sort()
    .reverse();
  return dates[0] || null;
}

/**
 * Calculate the area start date (from timeframe).
 */
export function getAreaAge(timeframe) {
  if (!timeframe || !timeframe.start) return Infinity;
  return daysSince(timeframe.start);
}

/**
 * Derive activity badge for a priority area.
 * Badge logic:
 *   - on_track: ≥50% milestones complete AND activity within last 90 days
 *   - underway: ≥1 milestone in_progress or complete, activity within 180 days
 *   - getting_started: work exists but <1 milestone complete, area age <180 days
 *   - stalled: no milestone status change or partner activity in >180 days
 */
export function deriveActivityBadge(priority) {
  const { milestones, partners, timeframe } = priority;
  const counts = getMilestoneCounts(milestones);
  const lastMilestoneUpdate = getLastMilestoneUpdate(milestones);
  const lastPartnerActivity = getLastPartnerActivity(partners);
  
  // Find most recent activity date (milestone update or partner activity)
  const activityDates = [lastMilestoneUpdate, lastPartnerActivity].filter(Boolean);
  const lastActivityDate = activityDates.sort().reverse()[0] || null;
  const daysSinceActivity = lastActivityDate ? daysSince(lastActivityDate) : Infinity;
  const areaAge = getAreaAge(timeframe);

  // Calculate complete percentage
  const completePct = counts.total > 0 ? (counts.complete / counts.total) * 100 : 0;

  // on_track: ≥50% milestones complete AND activity within last 90 days
  if (completePct >= 50 && daysSinceActivity <= 90) {
    return { badge: 'on_track', label: 'On Track', lastActivityDate };
  }

  // underway: ≥1 milestone in_progress or complete, activity within 180 days
  if (counts.completeOrUnderway >= 1 && daysSinceActivity <= 180) {
    return { badge: 'underway', label: 'Underway', lastActivityDate };
  }

  // getting_started: work exists but <1 milestone complete, area age <180 days
  if (counts.completeOrUnderway > 0 && counts.complete < 1 && areaAge < 180) {
    return { badge: 'getting_started', label: 'Getting Started', lastActivityDate };
  }
  
  // getting_started fallback: any work exists but area is young
  if (areaAge < 180 && (counts.inProgress > 0 || counts.complete > 0)) {
    return { badge: 'getting_started', label: 'Getting Started', lastActivityDate };
  }

  // stalled: no activity in >180 days
  if (daysSinceActivity > 180 || (counts.completeOrUnderway === 0 && areaAge >= 180)) {
    return { badge: 'stalled', label: 'Stalled', lastActivityDate };
  }

  // Default to getting_started for new areas with no activity yet
  return { badge: 'getting_started', label: 'Getting Started', lastActivityDate };
}

/**
 * Activity badge styling
 */
export const ACTIVITY_BADGE_STYLES = {
  on_track: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: '✓',
  },
  underway: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: '→',
  },
  getting_started: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: '○',
  },
  stalled: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: '⏸',
  },
};
