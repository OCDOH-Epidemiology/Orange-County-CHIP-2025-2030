import { formatValue } from '../lib/format.js';

/**
 * Baseline -> Current -> Target progress bar.
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
  const { baseline, target, currentValue, unit, metric } = objective;
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

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <div>
          <span className="text-slate-500">Baseline</span>{' '}
          <span className="font-semibold text-slate-900">
            {formatValue(bValue, unit)}
          </span>{' '}
          <span className="text-slate-500">({baseline.year})</span>
        </div>
        <div>
          <span className="text-slate-500">Target</span>{' '}
          <span className="font-semibold text-slate-900">
            {formatValue(tValue, unit)}
          </span>{' '}
          <span className="text-slate-500">({target.year})</span>
        </div>
      </div>

      {untracked ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 rounded-md border border-dashed border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
        >
          Baseline established — tracking to begin. Progress will appear here
          once new measurements are reported.
        </div>
      ) : (
        <>
          <div
            className="mt-3 h-3 w-full rounded-full bg-slate-200 overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            aria-label={`${metric}: ${Math.round(pct)}% of the way from ${bValue}${unit === 'percent' ? '%' : ''} to ${tValue}${unit === 'percent' ? '%' : ''}`}
          >
            <div
              className="h-full bg-brand-green transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-slate-700">
            Current: <span className="font-semibold">{formatValue(currentValue, unit)}</span>{' '}
            <span className="text-slate-500">
              ({Math.round(pct)}% of the way to target
              {decreasing ? ', decrease goal' : ''})
            </span>
          </div>
        </>
      )}
    </div>
  );
}
