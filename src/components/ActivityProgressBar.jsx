import { 
  calculateActivityProgress, 
  getMilestoneCounts, 
  deriveActivityBadge,
  formatShortMonthYear,
  ACTIVITY_BADGE_STYLES 
} from '../lib/format.js';

/**
 * Activity Progress bar - the PRIMARY progress indicator based on milestones.
 * 
 * Shows:
 * - Activity Progress % (calculated from milestone weights)
 * - Activity badge (on_track, underway, getting_started, stalled)
 * - "X of Y milestones complete or underway"
 * 
 * This tracks whether planned work is happening, NOT health outcome effects.
 */
export default function ActivityProgressBar({ priority, showBadge = true, showDisclaimer = false }) {
  const { milestones } = priority;
  const progressPct = calculateActivityProgress(milestones);
  const counts = getMilestoneCounts(milestones);
  const { badge, label, lastActivityDate } = deriveActivityBadge(priority);
  const badgeStyle = ACTIVITY_BADGE_STYLES[badge];

  return (
    <div className="space-y-2">
      {/* Badge and status */}
      {showBadge && (
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
            <span aria-hidden="true">{badgeStyle.icon}</span>
            {label}
          </span>
          {lastActivityDate && (
            <span className="text-xs text-slate-500">
              Last updated {formatShortMonthYear(lastActivityDate)}
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="relative">
        <div
          className="h-3 w-full rounded-full bg-slate-200 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPct)}
          aria-label={`Activity progress: ${Math.round(progressPct)}%`}
        >
          <div
            className={`h-full transition-[width] duration-500 ease-out ${
              progressPct >= 100 ? 'bg-green-500' : 'bg-brand-blue'
            }`}
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Progress text */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="text-slate-700">
          <span className="font-semibold text-brand-blue">{counts.completeOrUnderway}</span> of{' '}
          <span className="font-medium">{counts.total}</span> milestones complete or underway
        </span>
        <span className="font-semibold text-slate-900">
          {Math.round(progressPct)}%
        </span>
      </div>

      {/* Disclaimer about what this measures */}
      {showDisclaimer && (
        <p className="text-xs text-slate-500 mt-1">
          This tracks whether planned work is happening, not yet its effect on health outcomes.
        </p>
      )}
    </div>
  );
}

/**
 * Compact variant for cards/summaries
 */
export function ActivityProgressCompact({ priority }) {
  const { milestones } = priority;
  const progressPct = calculateActivityProgress(milestones);
  const counts = getMilestoneCounts(milestones);
  const { badge, label } = deriveActivityBadge(priority);
  const badgeStyle = ACTIVITY_BADGE_STYLES[badge];

  return (
    <div className="space-y-2">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
          <span aria-hidden="true">{badgeStyle.icon}</span>
          {label}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 w-full rounded-full bg-slate-200 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPct)}
        aria-label={`Activity progress: ${Math.round(progressPct)}%`}
      >
        <div
          className={`h-full transition-[width] duration-500 ease-out ${
            progressPct >= 100 ? 'bg-green-500' : 'bg-brand-blue'
          }`}
          style={{ width: `${Math.min(progressPct, 100)}%` }}
        />
      </div>

      {/* Progress text */}
      <p className="text-xs text-slate-600">
        Activity progress: {counts.completeOrUnderway} of {counts.total} milestones{' '}
        <span className="font-medium">({Math.round(progressPct)}%)</span>
      </p>
    </div>
  );
}
