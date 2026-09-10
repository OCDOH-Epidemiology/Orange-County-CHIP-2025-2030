import { formatLongDate, milestoneStatusLabel } from '../lib/format.js';

/**
 * Milestone checklist. Uses BOTH color AND icon+text to distinguish state,
 * so it remains legible for color-blind users and in high-contrast modes.
 */
const STATE = {
  complete: {
    ring: 'border-brand-green bg-brand-greenLight',
    dot: 'bg-brand-green',
    text: 'text-brand-greenDark',
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4 text-white" aria-hidden="true">
        <path fill="currentColor" d="M8 13.586 4.707 10.293 3.293 11.707 8 16.414l9.707-9.707-1.414-1.414z" />
      </svg>
    ),
  },
  in_progress: {
    ring: 'border-amber-500 bg-amber-50',
    dot: 'bg-amber-500',
    text: 'text-amber-800',
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4 text-white" aria-hidden="true">
        <path fill="currentColor" d="M10 2a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6z" />
      </svg>
    ),
  },
  not_started: {
    ring: 'border-slate-300 bg-white',
    dot: 'bg-slate-300',
    text: 'text-slate-700',
    icon: null,
  },
};

export default function MilestoneList({ milestones }) {
  if (!milestones || milestones.length === 0) {
    return <p className="text-slate-500 italic">No milestones defined yet.</p>;
  }
  return (
    <ol className="space-y-3">
      {milestones.map((m) => {
        const s = STATE[m.status] ?? STATE.not_started;
        return (
          <li
            key={m.id}
            className={`flex items-start gap-3 rounded-md border px-4 py-3 ${s.ring}`}
          >
            <span
              className={`mt-1 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full ${s.dot}`}
              aria-hidden="true"
            >
              {s.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <div className={`text-xs font-semibold uppercase tracking-wide ${s.text}`}>
                  {milestoneStatusLabel(m.status)}
                </div>
                <div className="text-sm text-slate-600">
                  Target: {formatLongDate(m.targetDate)}
                </div>
                <div className="text-xs text-slate-500">Reports {m.frequency.toLowerCase()}</div>
              </div>
              <p className="mt-1 text-slate-800">{m.description}</p>
              <dl className="mt-2 grid gap-x-4 gap-y-1 text-xs text-slate-600 sm:grid-cols-2">
                <div>
                  <dt className="inline font-semibold">Baseline:</dt>{' '}
                  <dd className="inline">{m.baseline || '—'}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Source:</dt>{' '}
                  <dd className="inline">{m.dataSource}</dd>
                </div>
              </dl>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
