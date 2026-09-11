import { Link } from 'react-router-dom';
import { formatValue } from '../lib/format.js';

/**
 * Compact Outcome Watch card for the landing page Overall Goals section.
 * 
 * Shows:
 * - Priority name (linked to /priority/:id)
 * - Metric description
 * - Baseline value and year
 * - Target value and year
 * - Current value or "Awaiting measurement"
 * - Next measurement expected
 * 
 * Rules:
 * - Never fabricate currentValue
 * - No progress bar fill when awaiting measurement
 * - Clear link to priority detail page
 */
export default function OutcomeWatchCard({ priority, style, className = '' }) {
  const { objective } = priority;
  const {
    baseline,
    target,
    currentValue,
    asOfDate,
    unit,
    metric,
    refreshCycleYears,
    reportingFrequency,
    direction,
  } = objective;

  const hasCurrentValue = currentValue !== null && currentValue !== undefined;
  const decreasing = target.value < baseline.value;

  // Calculate next expected measurement year
  const lastMeasurementYear = hasCurrentValue && asOfDate
    ? parseInt(asOfDate.split('-')[0], 10)
    : baseline.year;
  const cycleYears = refreshCycleYears || parseRefreshFrequency(reportingFrequency);
  const nextExpectedYear = lastMeasurementYear + cycleYears;

  // Direction indicator
  const directionArrow = direction === 'lower_is_better' || decreasing ? '↓' : '↑';
  const directionColor = direction === 'lower_is_better' || decreasing 
    ? 'text-blue-600' 
    : 'text-green-600';

  return (
    <Link
      to={`/priority/${priority.id}`}
      className={`group block bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-blue/40 transition-all overflow-hidden ${className}`}
      style={style}
      aria-label={`View ${priority.priority} goal details`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {priority.domain}
            </span>
            <h3 className="mt-0.5 text-base font-semibold text-slate-900 group-hover:text-brand-blue transition-colors truncate">
              {priority.priority}
            </h3>
          </div>
          <span className={`text-lg ${directionColor} flex-shrink-0`} aria-hidden="true">
            {directionArrow}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Metric */}
        <p className="text-xs text-slate-600 line-clamp-2">{metric}</p>

        {/* Values grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">Baseline</div>
            <div className="text-sm font-semibold text-slate-900">
              {formatValue(baseline.value, unit)}
            </div>
            <div className="text-[10px] text-slate-500">{baseline.year}</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">Current</div>
            {hasCurrentValue ? (
              <>
                <div className="text-sm font-semibold text-brand-blue">
                  {formatValue(currentValue, unit)}
                </div>
                {asOfDate && (
                  <div className="text-[10px] text-slate-500">
                    {asOfDate.split('-')[0]}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm font-medium text-slate-400 italic">Awaiting</div>
            )}
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">Target</div>
            <div className="text-sm font-semibold text-slate-900">
              {formatValue(target.value, unit)}
            </div>
            <div className="text-[10px] text-slate-500">{target.year}</div>
          </div>
        </div>

        {/* Status line */}
        {hasCurrentValue ? (
          <CurrentValueStatus 
            currentValue={currentValue}
            baseline={baseline}
            target={target}
            unit={unit}
            decreasing={decreasing}
          />
        ) : (
          <div className="rounded border border-dashed border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600">
            <span className="font-medium">Next measurement:</span>{' '}
            <span className="text-slate-700">{nextExpectedYear}</span>
            <span className="text-slate-400"> · Updates {formatFrequency(refreshCycleYears, reportingFrequency)}</span>
          </div>
        )}
      </div>

      {/* Footer link hint */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-brand-blue font-medium group-hover:underline">
          View full details →
        </span>
      </div>
    </Link>
  );
}

/**
 * Status display when we have a measured current value.
 */
function CurrentValueStatus({ currentValue, baseline, target, unit, decreasing }) {
  const bValue = baseline.value;
  const tValue = target.value;
  const span = tValue - bValue;

  let progressPct = 0;
  if (span !== 0) {
    progressPct = ((currentValue - bValue) / span) * 100;
    progressPct = Math.max(0, Math.min(100, progressPct));
  }

  const change = currentValue - bValue;
  const isImprovement = decreasing ? change < 0 : change > 0;

  return (
    <div className="space-y-1.5">
      {/* Mini progress bar */}
      <div
        className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPct)}
        aria-label={`Goal progress: ${Math.round(progressPct)}%`}
      >
        <div
          className={`h-full transition-[width] duration-500 ease-out ${
            progressPct >= 100 ? 'bg-green-500' : 'bg-brand-green'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className={isImprovement ? 'text-green-600' : 'text-amber-600'}>
          {Math.round(progressPct)}% to target
          {isImprovement && ' ✓'}
        </span>
      </div>
    </div>
  );
}

/**
 * Parse reporting frequency string to get cycle years.
 */
function parseRefreshFrequency(freq) {
  if (!freq) return 1;
  const lower = freq.toLowerCase();
  if (lower.includes('yearly') || lower.includes('annual') || lower.includes('every year')) return 1;
  if (lower.includes('every 2 years') || lower.includes('biennial')) return 2;
  if (lower.includes('every 3 years')) return 3;
  if (lower.includes('every 4 years')) return 4;
  if (lower.includes('every 5 years')) return 5;
  const match = lower.match(/every\s+(\d+)\s+years?/);
  if (match) return parseInt(match[1], 10);
  return 1;
}

/**
 * Format the refresh frequency for display.
 */
function formatFrequency(refreshCycleYears, reportingFrequency) {
  if (refreshCycleYears === 1) return 'yearly';
  if (refreshCycleYears) return `every ${refreshCycleYears} years`;
  if (reportingFrequency) return reportingFrequency.toLowerCase();
  return 'periodically';
}
