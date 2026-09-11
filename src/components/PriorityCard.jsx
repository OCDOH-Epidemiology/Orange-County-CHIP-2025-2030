import { Link } from 'react-router-dom';
import { ActivityRingCompact, StatusMixCompact } from './viz/index.js';
import { calculateActivityProgress, getMilestoneCounts } from '../lib/format.js';

/**
 * Visual-first Priority Card for the landing page.
 * Leads with ActivityRing and StatusMix graphics.
 * Goal as a short title, not a paragraph.
 */
export default function PriorityCard({ priority, style, className = '' }) {
  const progressPct = calculateActivityProgress(priority.milestones);
  const counts = getMilestoneCounts(priority.milestones);

  return (
    <Link
      to={`/priority/${priority.id}`}
      className={`group bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-blue/40 transition-all overflow-hidden flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 ${className}`}
      aria-label={`See full details for ${priority.priority}`}
      style={style}
    >
      {/* Header */}
      <div className="bg-brand-blueLight px-4 py-3 border-b border-slate-200">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-blueDark">
          {priority.domain}
        </div>
        <h3 className="mt-0.5 text-base font-semibold text-slate-900 group-hover:text-brand-blue transition-colors leading-tight">
          {priority.priority}
        </h3>
      </div>

      {/* Visual Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* ActivityRing + Progress Stats */}
        <div className="flex items-center gap-4 mb-4">
          {/* Ring */}
          <div className="relative flex-shrink-0">
            <ActivityRingCompact
              percent={progressPct}
              size={64}
              strokeWidth={7}
              label={`Activity progress for ${priority.priority}`}
              color="blue"
            />
            {/* Center overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="text-sm font-bold text-brand-blue">
                {Math.round(progressPct)}%
              </span>
            </div>
          </div>

          {/* Stats text */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-700">
              Activity Progress
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {counts.completeOrUnderway} of {counts.total} milestones
            </div>
          </div>
        </div>

        {/* StatusMix bar */}
        <StatusMixCompact
          complete={counts.complete}
          inProgress={counts.inProgress}
          notStarted={counts.notStarted}
          className="mb-4"
        />

        {/* Goal - short title form */}
        <div className="flex-1">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Goal</div>
          <p className="text-sm text-slate-800 mt-0.5 line-clamp-2">{priority.goal}</p>
        </div>

        {/* Link hint */}
        <div className="mt-3 pt-2 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 text-sm text-brand-blue font-medium group-hover:underline">
            View details
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
