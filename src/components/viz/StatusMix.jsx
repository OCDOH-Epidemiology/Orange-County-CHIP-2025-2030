import { useId } from 'react';

/**
 * StatusMix — stacked horizontal bar showing milestone status counts.
 * Three segments: complete (green), in_progress (blue), not_started (gray).
 * 
 * Props:
 * - complete: number of completed milestones
 * - inProgress: number of in-progress milestones
 * - notStarted: number of not-started milestones
 * - height: bar height in pixels (default 24)
 * - showLegend: show legend with counts below bar (default true)
 * - showLabels: show count labels inside segments (default true for wide enough segments)
 * - compact: use compact styling (default false)
 * - className: additional CSS classes
 */
export default function StatusMix({
  complete = 0,
  inProgress = 0,
  notStarted = 0,
  height = 24,
  showLegend = true,
  showLabels = true,
  compact = false,
  className = '',
}) {
  const uniqueId = useId();
  const total = complete + inProgress + notStarted;

  if (total === 0) {
    return (
      <div className={`text-sm text-slate-500 italic ${className}`}>
        No milestones
      </div>
    );
  }

  const completePct = (complete / total) * 100;
  const inProgressPct = (inProgress / total) * 100;
  const notStartedPct = (notStarted / total) * 100;

  const segments = [
    {
      id: 'complete',
      count: complete,
      pct: completePct,
      color: '#22C55E',        // green-500
      bgClass: 'bg-green-500',
      textClass: 'text-green-700',
      label: 'Complete',
      pattern: 'solid',
    },
    {
      id: 'in_progress',
      count: inProgress,
      pct: inProgressPct,
      color: '#1B4B8A',        // brand-blue
      bgClass: 'bg-brand-blue',
      textClass: 'text-brand-blue',
      label: 'In progress',
      pattern: 'stripe',
    },
    {
      id: 'not_started',
      count: notStarted,
      pct: notStartedPct,
      color: '#CBD5E1',        // slate-300
      bgClass: 'bg-slate-300',
      textClass: 'text-slate-600',
      label: 'Not started',
      pattern: 'empty',
    },
  ].filter(s => s.count > 0);

  const barHeight = compact ? 16 : height;
  const minWidthForLabel = 28; // Minimum width in px to show label

  return (
    <div
      className={className}
      role="figure"
      aria-label={`Milestone status: ${complete} complete, ${inProgress} in progress, ${notStarted} not started`}
    >
      {/* Stacked bar */}
      <div
        className="flex w-full rounded-md overflow-hidden"
        style={{ height: barHeight }}
        aria-hidden="true"
      >
        {segments.map((segment, idx) => (
          <div
            key={segment.id}
            className={`relative flex items-center justify-center ${segment.bgClass} transition-all duration-500`}
            style={{
              width: `${segment.pct}%`,
              minWidth: segment.count > 0 ? '4px' : '0',
            }}
            title={`${segment.label}: ${segment.count}`}
          >
            {/* Stripe pattern for in_progress (accessibility) */}
            {segment.pattern === 'stripe' && (
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id={`stripe-${uniqueId}-${idx}`}
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                    patternTransform="rotate(45)"
                  >
                    <rect width="2" height="6" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#stripe-${uniqueId}-${idx})`} />
              </svg>
            )}

            {/* Hash pattern for not_started (accessibility) */}
            {segment.pattern === 'empty' && (
              <svg
                className="absolute inset-0 w-full h-full opacity-30"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id={`hash-${uniqueId}-${idx}`}
                    patternUnits="userSpaceOnUse"
                    width="8"
                    height="8"
                  >
                    <path d="M0 8L8 0M-2 2L2 -2M6 10L10 6" stroke="#64748B" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#hash-${uniqueId}-${idx})`} />
              </svg>
            )}

            {/* Count label inside segment */}
            {showLabels && segment.pct >= (100 / total) * minWidthForLabel && !compact && (
              <span className="relative z-10 text-xs font-semibold text-white drop-shadow-sm">
                {segment.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className={`flex flex-wrap gap-x-4 gap-y-1 ${compact ? 'mt-1.5 text-xs' : 'mt-2 text-sm'}`}>
          <LegendItem
            color="bg-green-500"
            label="Complete"
            count={complete}
            textClass="text-green-700"
          />
          <LegendItem
            color="bg-brand-blue"
            label="In progress"
            count={inProgress}
            textClass="text-brand-blue"
            hasStripe
          />
          <LegendItem
            color="bg-slate-300"
            label="Not started"
            count={notStarted}
            textClass="text-slate-600"
          />
        </div>
      )}

      {/* Screen reader text */}
      <span className="sr-only">
        {complete} milestones complete, {inProgress} in progress, {notStarted} not started out of {total} total.
      </span>
    </div>
  );
}

function LegendItem({ color, label, count, textClass, hasStripe = false }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`relative w-3 h-3 rounded-sm ${color} flex-shrink-0 overflow-hidden`}
        aria-hidden="true"
      >
        {hasStripe && (
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <pattern
              id="legend-stripe"
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
              patternTransform="rotate(45)"
            >
              <rect width="1.5" height="4" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#legend-stripe)" />
          </svg>
        )}
      </span>
      <span className="text-slate-600">{label}:</span>
      <span className={`font-semibold ${textClass}`}>{count}</span>
    </div>
  );
}

/**
 * Compact inline variant — just the bar with minimal legend.
 */
export function StatusMixCompact({ complete = 0, inProgress = 0, notStarted = 0, className = '' }) {
  return (
    <StatusMix
      complete={complete}
      inProgress={inProgress}
      notStarted={notStarted}
      height={12}
      showLegend={true}
      showLabels={false}
      compact={true}
      className={className}
    />
  );
}

/**
 * Mini variant — just the bar, no legend.
 */
export function StatusMixMini({ complete = 0, inProgress = 0, notStarted = 0, className = '' }) {
  return (
    <StatusMix
      complete={complete}
      inProgress={inProgress}
      notStarted={notStarted}
      height={8}
      showLegend={false}
      showLabels={false}
      compact={true}
      className={className}
    />
  );
}
