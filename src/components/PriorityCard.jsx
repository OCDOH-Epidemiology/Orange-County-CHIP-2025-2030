import { Link } from 'react-router-dom';
import { ActivityProgressCompact } from './ActivityProgressBar.jsx';
import { OutcomeWatchCompact } from './OutcomeWatch.jsx';

/**
 * Compact card for the landing page. Skimmable, plain-language.
 * The whole card is a clickable region (a large link).
 *
 * Leads with Activity Progress (milestone-based), not outcome progress.
 * Outcome information shown as secondary compact reference.
 *
 * Accepts optional `style` and `className` props for animation support
 * (e.g., stagger animations from parent).
 */
export default function PriorityCard({ priority, style, className = '' }) {
  return (
    <Link
      to={`/priority/${priority.id}`}
      className={`group bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-blue/40 transition-all overflow-hidden flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 ${className}`}
      aria-label={`See full details for ${priority.priority}`}
      style={style}
    >
      <div className="bg-brand-blueLight px-5 py-3 border-b border-slate-200">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-blueDark">
          {priority.domain}
        </div>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-brand-blue transition-colors">
          {priority.priority}
        </h3>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-700">Goal</div>
          <p className="text-slate-800">{priority.goal}</p>
        </div>

        {/* Primary: Activity Progress (milestone-based) */}
        <ActivityProgressCompact priority={priority} />

        {/* Secondary: Outcome reference */}
        <OutcomeWatchCompact objective={priority.objective} />

        <div className="mt-auto pt-2">
          <span className="inline-flex items-center gap-1 text-brand-blue font-medium group-hover:underline">
            See full details
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
