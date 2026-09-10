import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { formatLongDate, milestoneStatusLabel } from '../lib/format.js';

/**
 * Cross-cutting timeline: every milestone from all priority areas, grouped by
 * calendar year. Colored dots identify which priority area each item belongs
 * to. Uses a CSS grid — no chart library needed.
 */
const PALETTE = {
  0: { dot: 'bg-brand-blue', text: 'text-brand-blue', border: 'border-brand-blue' },
  1: { dot: 'bg-brand-green', text: 'text-brand-green', border: 'border-brand-green' },
  2: { dot: 'bg-amber-600', text: 'text-amber-700', border: 'border-amber-600' },
  3: { dot: 'bg-purple-600', text: 'text-purple-700', border: 'border-purple-600' },
  4: { dot: 'bg-rose-600', text: 'text-rose-700', border: 'border-rose-600' },
};

export default function Timeline({ data }) {
  const priorityIndex = new Map(data.priorityAreas.map((p, i) => [p.id, i]));

  const items = data.priorityAreas.flatMap((p) =>
    p.milestones.map((m) => ({
      id: `${p.id}::${m.id}`,
      priority: p,
      milestone: m,
      colorIdx: priorityIndex.get(p.id) % Object.keys(PALETTE).length,
    }))
  );
  items.sort((a, b) => a.milestone.targetDate.localeCompare(b.milestone.targetDate));

  const byYear = new Map();
  for (const item of items) {
    const year = item.milestone.targetDate.slice(0, 4);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(item);
  }

  const years = Array.from(byYear.keys()).sort();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Overview', to: '/' }, { label: 'Timeline' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Timeline: 2026 – 2030</h1>
      <p className="mt-2 text-slate-700 max-w-3xl">
        Every milestone across the three Community Health Improvement Plan
        priority areas, in the order it is scheduled to be completed. Colored
        dots identify which priority area a milestone belongs to.
      </p>

      <ul aria-label="Priority area legend" className="mt-6 flex flex-wrap gap-4">
        {data.priorityAreas.map((p, i) => {
          const c = PALETTE[i % Object.keys(PALETTE).length];
          return (
            <li key={p.id} className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${c.dot}`} aria-hidden="true" />
              <Link to={`/priority/${p.id}`} className={`text-sm font-medium ${c.text} hover:underline`}>
                {p.priority}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 space-y-8">
        {years.map((year, yearIndex) => (
          <section
            key={year}
            aria-labelledby={`year-${year}`}
            className="animate-stagger"
            style={{ '--stagger-index': yearIndex }}
          >
            <h2
              id={`year-${year}`}
              className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 sticky top-0 bg-slate-50/95 backdrop-blur"
            >
              {year}
            </h2>
            <ol className="mt-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {byYear.get(year).map(({ id, priority, milestone, colorIdx }, itemIndex) => {
                const c = PALETTE[colorIdx];
                return (
                  <li
                    key={id}
                    className="pl-8 pr-2 py-3 relative animate-stagger"
                    style={{ '--stagger-index': yearIndex + itemIndex + 1 }}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-4 inline-block w-5 h-5 rounded-full ${c.dot} ring-4 ring-slate-50`}
                    />
                    <div className="flex flex-wrap items-baseline gap-x-3 text-sm">
                      <span className="font-semibold text-slate-900">
                        {formatLongDate(milestone.targetDate)}
                      </span>
                      <Link to={`/priority/${priority.id}`} className={`text-xs font-semibold uppercase tracking-wide ${c.text} hover:underline`}>
                        {priority.priority}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {milestoneStatusLabel(milestone.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-800">{milestone.description}</p>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
