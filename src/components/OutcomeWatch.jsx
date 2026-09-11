import { formatValue, formatShortMonthYear } from '../lib/format.js';

/**
 * Outcome Watch - SECONDARY display for actual health outcome measurements.
 * 
 * Rules:
 * - Always show baseline (with year) and target (with year)
 * - Show currentValue ONLY if real measurement exists (not null), always with asOfDate + source
 * - If no current value: static baseline→target reference + "Next measurement expected: [year]"
 * - Never fabricate currentValue; never derive outcome % from milestones
 * - Never fill outcome bar when awaiting measurement
 * - Optional direction arrow only when measured current value exists
 */
export default function OutcomeWatch({ objective }) {
  const { 
    baseline, 
    target, 
    currentValue, 
    asOfDate,
    source,
    refreshCycleYears,
    direction,
    unit, 
    metric, 
    dataSource,
    reportingFrequency 
  } = objective;

  const bValue = baseline.value;
  const tValue = target.value;
  const hasCurrentValue = currentValue !== null && currentValue !== undefined;
  const decreasing = tValue < bValue;

  // Calculate next expected measurement year
  const lastMeasurementYear = hasCurrentValue && asOfDate 
    ? parseInt(asOfDate.split('-')[0], 10)
    : baseline.year;
  const cycleYears = refreshCycleYears || parseRefreshFrequency(reportingFrequency);
  const nextExpectedYear = lastMeasurementYear + cycleYears;

  // Direction indicator
  const directionLabel = direction === 'lower_is_better' || decreasing ? 'decrease' : 'increase';
  const directionArrow = direction === 'lower_is_better' || decreasing ? '↓' : '↑';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Outcome Watch</h4>
          <p className="text-xs text-slate-500 mt-0.5">{metric}</p>
        </div>
        <span className={`text-lg ${decreasing ? 'text-blue-600' : 'text-green-600'}`} aria-hidden="true">
          {directionArrow}
        </span>
      </div>

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
          {hasCurrentValue ? (
            <>
              <div className="font-semibold text-brand-blue">
                {formatValue(currentValue, unit)}
              </div>
              {asOfDate && (
                <div className="text-xs text-slate-500">{formatShortMonthYear(asOfDate)}</div>
              )}
            </>
          ) : (
            <div className="font-medium text-slate-400 italic">Awaiting</div>
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

      {/* Status message */}
      {hasCurrentValue ? (
        <OutcomeMeasuredState 
          currentValue={currentValue}
          baseline={baseline}
          target={target}
          unit={unit}
          decreasing={decreasing}
          asOfDate={asOfDate}
          source={source || dataSource}
        />
      ) : (
        <OutcomeAwaitingState
          nextExpectedYear={nextExpectedYear}
          reportingFrequency={reportingFrequency}
          refreshCycleYears={refreshCycleYears}
          dataSource={dataSource}
        />
      )}
    </div>
  );
}

/**
 * State when we have a measured current value.
 */
function OutcomeMeasuredState({ currentValue, baseline, target, unit, decreasing, asOfDate, source }) {
  const bValue = baseline.value;
  const tValue = target.value;
  const span = tValue - bValue;
  
  let progressPct = 0;
  if (span !== 0) {
    progressPct = ((currentValue - bValue) / span) * 100;
    progressPct = Math.max(0, Math.min(100, progressPct));
  }

  const change = currentValue - bValue;
  const changeSign = change > 0 ? '+' : '';
  const isImprovement = decreasing ? change < 0 : change > 0;

  return (
    <div className="space-y-2">
      {/* Progress bar - only shown when we have real data */}
      <div className="relative">
        <div
          className="h-2 w-full rounded-full bg-slate-200 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPct)}
          aria-label={`Outcome progress: ${Math.round(progressPct)}% toward target`}
        >
          <div
            className={`h-full transition-[width] duration-500 ease-out ${
              progressPct >= 100 ? 'bg-green-500' : 'bg-brand-green'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={`font-medium ${isImprovement ? 'text-green-600' : 'text-amber-600'}`}>
          {changeSign}{formatValue(Math.abs(change), unit)} from baseline
          {isImprovement && ' ✓'}
        </span>
        <span className="text-slate-500">
          {Math.round(progressPct)}% to target
        </span>
      </div>

      {source && (
        <p className="text-xs text-slate-500">
          Source: {source}
          {asOfDate && ` (as of ${formatShortMonthYear(asOfDate)})`}
        </p>
      )}
    </div>
  );
}

/**
 * State when awaiting measurement.
 */
function OutcomeAwaitingState({ nextExpectedYear, reportingFrequency, refreshCycleYears, dataSource }) {
  const cycleText = refreshCycleYears 
    ? `every ${refreshCycleYears} year${refreshCycleYears > 1 ? 's' : ''}`
    : reportingFrequency?.toLowerCase() || 'periodically';

  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Baseline established — awaiting next survey</span>
        <span className="text-xs text-slate-500">
          Outcome measure updates {cycleText}. Next expected: {nextExpectedYear}.
        </span>
        {dataSource && (
          <span className="text-xs text-slate-500">
            Data from: {dataSource}
          </span>
        )}
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
 * Compact variant for summary views.
 * Shows the 5-year health outcome goal (not to be confused with milestone activity).
 */
export function OutcomeWatchCompact({ objective }) {
  const { baseline, target, currentValue, unit } = objective;
  const hasCurrentValue = currentValue !== null && currentValue !== undefined;

  return (
    <div className="text-xs text-slate-600">
      <span className="font-medium">5-Year Goal:</span>{' '}
      Baseline {formatValue(baseline.value, unit)} ({baseline.year}) → 
      Target {formatValue(target.value, unit)} ({target.year})
      {hasCurrentValue ? (
        <span className="ml-1 text-brand-blue">
          Current: {formatValue(currentValue, unit)}
        </span>
      ) : (
        <span className="ml-1 text-slate-400 italic">
          (awaiting measurement)
        </span>
      )}
    </div>
  );
}
