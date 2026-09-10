import { formatValue } from '../lib/format.js';

/**
 * @deprecated This component is no longer used in the dashboard.
 * 
 * The Progression Measurement methodology now uses:
 * - ActivityProgressBar.jsx - PRIMARY: milestone-based activity progress
 * - OutcomeWatch.jsx - SECONDARY: actual health outcome measurements
 * 
 * This file is kept for reference. Activity Progress (milestone completion)
 * is now the headline metric, and outcome measurements are shown separately
 * in the Outcome Watch card only when real data exists.
 * 
 * See docs/schema.md for the full methodology documentation.
 * 
 * ---
 * 
 * LEGACY: Baseline -> Current -> Target progress bar with clear labeling.
 *
 * When `currentValue` is null (data isn't collected yet), we render a neutral
 * "tracking to begin" state instead of a misleading bar. This is intentional
 * per the schema — see docs/schema.md.
 *
 * Bar direction:
 *   - If `target > baseline`, bar fills from left as current grows.
 *   - If `target < baseline` (a "decrease" goal like reducing distress),
 *     the direction is reversed so shrinking values appear as progress.
 */
export default function ProgressBar({ objective }) {
  const { baseline, target, currentValue, unit, metric, dataSource } = objective;
  const bValue = baseline.value;
  const tValue = target.value;
  const decreasing = tValue < bValue;
  const untracked = currentValue === null || currentValue === undefined;

  // Compute percent of the way from baseline to target [0..100].
  // Clamped so out-of-range values don't render weirdly.
  let pct = 0;
  if (!untracked) {
    const span = tValue - bValue;
    if (span !== 0) {
      pct = ((currentValue - bValue) / span) * 100;
      pct = Math.max(0, Math.min(100, pct));
    }
  }

  // Calculate the change from baseline
  const change = untracked ? 0 : currentValue - bValue;
  const changeSign = change > 0 ? '+' : '';
  const changeDirection = decreasing 
    ? (change < 0 ? 'improvement' : 'increase') 
    : (change > 0 ? 'improvement' : 'decline');

  // Helper text explaining what success looks like
  const goalDirection = decreasing ? 'decrease' : 'increase';
  const goalText = decreasing
    ? `Goal: Reduce from ${formatValue(bValue, unit)} to ${formatValue(tValue, unit)} by ${target.year}`
    : `Goal: Increase from ${formatValue(bValue, unit)} to ${formatValue(tValue, unit)} by ${target.year}`;

  return (
    <div className="space-y-3">
      {/* Metric label with source */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <span className="text-sm font-semibold text-slate-900">
            Measuring: {metric}
          </span>
        </div>
        {dataSource && (
          <span className="text-xs text-slate-500">
            Source: {dataSource}
          </span>
        )}
      </div>

      {/* Goal explanation */}
      <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-md border border-slate-200">
        <span className={decreasing ? 'text-blue-700' : 'text-green-700'}>
          {decreasing ? '↓' : '↑'}
        </span>{' '}
        {goalText}
      </p>

      {/* Baseline / Current / Target values */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-left">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Baseline</div>
          <div className="font-semibold text-slate-900">
            {formatValue(bValue, unit)}
          </div>
          <div className="text-xs text-slate-500">{baseline.year}</div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Current</div>
          {untracked ? (
            <div className="font-medium text-slate-400">Pending</div>
          ) : (
            <>
              <div className="font-semibold text-brand-blue">
                {formatValue(currentValue, unit)}
              </div>
              <div className={`text-xs font-medium ${changeDirection === 'improvement' ? 'text-green-600' : 'text-amber-600'}`}>
                {changeSign}{formatValue(Math.abs(change), unit)} {changeDirection === 'improvement' ? '✓' : ''}
              </div>
            </>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Target</div>
          <div className="font-semibold text-slate-900">
            {formatValue(tValue, unit)}
          </div>
          <div className="text-xs text-slate-500">{target.year}</div>
        </div>
      </div>

      {untracked ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-dashed border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
        >
          <span className="font-medium">Baseline established</span> — tracking to begin. 
          Progress will appear here once new measurements are reported.
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="relative">
            <div
              className="h-4 w-full rounded-full bg-slate-200 overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
              aria-label={`${metric}: ${Math.round(pct)}% progress toward ${target.year} target`}
            >
              <div
                className={`h-full transition-[width] duration-500 ease-out ${
                  pct >= 100 ? 'bg-green-500' : 'bg-brand-green'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            
            {/* Progress percentage label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${pct > 50 ? 'text-white' : 'text-slate-700'}`}>
                {Math.round(pct)}%
              </span>
            </div>
          </div>

          {/* Progress summary */}
          <div className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-md">
            <span className="font-semibold text-brand-blue">{Math.round(pct)}%</span> of the way to target
            {pct >= 100 && (
              <span className="ml-2 text-green-600 font-medium">Target reached! 🎉</span>
            )}
            {pct < 100 && pct >= 50 && (
              <span className="ml-2 text-green-600 font-medium">— on track</span>
            )}
            {decreasing && pct < 50 && pct > 0 && (
              <span className="ml-2 text-slate-500">({goalDirection} goal)</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
