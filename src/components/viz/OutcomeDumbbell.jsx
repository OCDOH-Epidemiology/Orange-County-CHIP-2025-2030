import { useId } from 'react';
import { formatValue } from '../../lib/format.js';

/**
 * OutcomeDumbbell — visual showing baseline → current (optional) → target on a horizontal track.
 * For yearly health outcome goals (NOT milestone activity).
 * 
 * Rules:
 * - Always show baseline and target
 * - If currentValue exists, show it between baseline and target
 * - If currentValue is null, show "awaiting" indicator (hash/dotted) in middle
 * - Direction arrow (↑/↓) as a small glyph
 * - Never fabricate currentValue
 * 
 * Props:
 * - baseline: { value, year }
 * - target: { value, year }
 * - currentValue: number | null
 * - asOfDate: string (ISO date) | null
 * - unit: 'percent' | 'count' | string
 * - direction: 'higher_is_better' | 'lower_is_better'
 * - metric: string (description of what's being measured)
 * - compact: boolean (use smaller sizing)
 * - className: string
 */
export default function OutcomeDumbbell({
  baseline,
  target,
  currentValue = null,
  asOfDate = null,
  unit = 'percent',
  direction = 'higher_is_better',
  metric = '',
  compact = false,
  className = '',
}) {
  const uniqueId = useId();
  const hasCurrentValue = currentValue !== null && currentValue !== undefined;
  const decreasing = target.value < baseline.value;
  const isLowerBetter = direction === 'lower_is_better' || decreasing;

  // Calculate position percentages for plotting on track
  const minVal = Math.min(baseline.value, target.value);
  const maxVal = Math.max(baseline.value, target.value);
  const range = maxVal - minVal || 1;

  // Positions as percentages (0-100)
  const baselinePos = decreasing ? 100 : 0;
  const targetPos = decreasing ? 0 : 100;
  
  let currentPos = 50; // default to middle when awaiting
  if (hasCurrentValue) {
    currentPos = ((currentValue - minVal) / range) * 100;
    currentPos = Math.max(0, Math.min(100, currentPos));
    if (decreasing) currentPos = 100 - currentPos;
  }

  // Progress calculation (only when we have current value)
  let progressPct = 0;
  if (hasCurrentValue) {
    const span = target.value - baseline.value;
    if (span !== 0) {
      progressPct = ((currentValue - baseline.value) / span) * 100;
      progressPct = Math.max(0, Math.min(100, progressPct));
    }
  }

  const directionArrow = isLowerBetter ? '↓' : '↑';
  const directionColor = isLowerBetter ? 'text-blue-600' : 'text-green-600';

  // Track and dot sizing
  const trackHeight = compact ? 6 : 8;
  const dotSize = compact ? 16 : 20;
  const awaitingSize = compact ? 24 : 32;

  return (
    <div
      className={`${className}`}
      role="figure"
      aria-label={`Outcome goal: ${metric}. Baseline ${formatValue(baseline.value, unit)} (${baseline.year}), Target ${formatValue(target.value, unit)} (${target.year})${hasCurrentValue ? `, Current ${formatValue(currentValue, unit)}` : ', awaiting measurement'}`}
    >
      {/* Direction and metric header */}
      {!compact && metric && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 truncate">{metric}</span>
          <span className={`text-sm font-semibold ${directionColor}`} aria-label={`Goal direction: ${isLowerBetter ? 'decrease' : 'increase'}`}>
            {directionArrow}
          </span>
        </div>
      )}

      {/* Track visualization */}
      <div className="relative" style={{ paddingTop: dotSize / 2, paddingBottom: dotSize / 2 + (compact ? 4 : 8) }}>
        {/* The track line */}
        <div
          className="absolute left-0 right-0 bg-slate-200 rounded-full"
          style={{ height: trackHeight, top: '50%', marginTop: -trackHeight / 2 }}
          aria-hidden="true"
        >
          {/* Progress fill (only if we have current value) */}
          {hasCurrentValue && (
            <div
              className="absolute h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-green transition-all duration-500"
              style={{
                left: decreasing ? `${100 - currentPos}%` : '0',
                width: `${currentPos}%`,
              }}
            />
          )}

          {/* Awaiting pattern (when no current value) */}
          {!hasCurrentValue && (
            <svg
              className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id={`awaiting-${uniqueId}`}
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="4" height="8" fill="#E2E8F0" />
                  <rect x="4" width="4" height="8" fill="#CBD5E1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#awaiting-${uniqueId})`} rx={trackHeight / 2} />
            </svg>
          )}
        </div>

        {/* Baseline dot (left) */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: 0, top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div
            className="rounded-full bg-slate-700 border-2 border-white shadow-sm"
            style={{ width: dotSize, height: dotSize }}
            aria-hidden="true"
          />
        </div>

        {/* Target dot (right) */}
        <div
          className="absolute flex flex-col items-center"
          style={{ right: 0, top: '50%', transform: 'translate(50%, -50%)' }}
        >
          <div
            className={`rounded-full border-2 border-white shadow-sm ${
              hasCurrentValue && progressPct >= 100 ? 'bg-green-500' : 'bg-brand-blue'
            }`}
            style={{ width: dotSize, height: dotSize }}
            aria-hidden="true"
          />
        </div>

        {/* Current value dot OR awaiting marker (middle) */}
        {hasCurrentValue ? (
          <div
            className="absolute flex flex-col items-center transition-all duration-500"
            style={{
              left: `${currentPos}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="rounded-full bg-brand-green border-2 border-white shadow-md ring-2 ring-brand-green/20"
              style={{ width: dotSize + 4, height: dotSize + 4 }}
              aria-hidden="true"
            />
          </div>
        ) : (
          <div
            className="absolute flex flex-col items-center"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {/* Awaiting marker - dotted circle */}
            <svg width={awaitingSize} height={awaitingSize} aria-hidden="true">
              <circle
                cx={awaitingSize / 2}
                cy={awaitingSize / 2}
                r={awaitingSize / 2 - 2}
                fill="white"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <text
                x={awaitingSize / 2}
                y={awaitingSize / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-slate-400"
              >
                ?
              </text>
            </svg>
          </div>
        )}

        {/* Labels below track */}
        <div className="absolute left-0 right-0" style={{ top: '100%', marginTop: compact ? 2 : 4 }}>
          <div className="flex justify-between items-start">
            {/* Baseline label */}
            <div className="flex flex-col items-start" style={{ maxWidth: '30%' }}>
              <span className={`font-semibold text-slate-700 ${compact ? 'text-xs' : 'text-sm'}`}>
                {formatValue(baseline.value, unit)}
              </span>
              <span className="text-[10px] text-slate-500">
                {baseline.year}
              </span>
            </div>

            {/* Current label (center) */}
            <div className="flex flex-col items-center" style={{ maxWidth: '40%' }}>
              {hasCurrentValue ? (
                <>
                  <span className={`font-semibold text-brand-green ${compact ? 'text-xs' : 'text-sm'}`}>
                    {formatValue(currentValue, unit)}
                  </span>
                  {asOfDate && (
                    <span className="text-[10px] text-slate-500">
                      {asOfDate.split('-')[0]}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-slate-400 italic">
                  awaiting
                </span>
              )}
            </div>

            {/* Target label */}
            <div className="flex flex-col items-end" style={{ maxWidth: '30%' }}>
              <span className={`font-semibold text-brand-blue ${compact ? 'text-xs' : 'text-sm'}`}>
                {formatValue(target.value, unit)}
              </span>
              <span className="text-[10px] text-slate-500">
                {target.year}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader description */}
      <span className="sr-only">
        {hasCurrentValue
          ? `Current value is ${formatValue(currentValue, unit)}, which is ${Math.round(progressPct)}% of the way from baseline to target.`
          : 'Awaiting measurement data.'}
      </span>
    </div>
  );
}

/**
 * Compact card variant with title.
 */
export function OutcomeDumbbellCard({
  title,
  baseline,
  target,
  currentValue,
  asOfDate,
  unit,
  direction,
  metric,
  nextExpectedYear,
  className = '',
}) {
  const hasCurrentValue = currentValue !== null && currentValue !== undefined;
  const isLowerBetter = direction === 'lower_is_better' || target.value < baseline.value;
  const directionArrow = isLowerBetter ? '↓' : '↑';
  const directionColor = isLowerBetter ? 'text-blue-600' : 'text-green-600';

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-slate-900 truncate">{title}</h4>
          )}
          {metric && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{metric}</p>
          )}
        </div>
        <span className={`text-lg ${directionColor} flex-shrink-0 ml-2`} aria-hidden="true">
          {directionArrow}
        </span>
      </div>

      {/* Dumbbell graphic */}
      <div className="mb-3">
        <OutcomeDumbbell
          baseline={baseline}
          target={target}
          currentValue={currentValue}
          asOfDate={asOfDate}
          unit={unit}
          direction={direction}
          compact
        />
      </div>

      {/* Status footer */}
      {!hasCurrentValue && nextExpectedYear && (
        <div className="text-xs text-slate-500 text-center border-t border-slate-100 pt-2 mt-2">
          Next measurement expected: <span className="font-medium text-slate-700">{nextExpectedYear}</span>
        </div>
      )}
    </div>
  );
}
