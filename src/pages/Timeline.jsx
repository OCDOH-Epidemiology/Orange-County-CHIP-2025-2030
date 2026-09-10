import { Link } from 'react-router-dom';
import { useTranslation, useDateFormat } from '../i18n/index.js';
import { useContent } from '../i18n/index.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';

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
  const { t } = useTranslation();
  const { formatLongDate } = useDateFormat();
  const { getTranslatedPriority, translateMilestone } = useContent();
  
  useDocumentTitle(t('titles.timeline'));
  
  const priorityIndex = new Map(data.priorityAreas.map((p, i) => [p.id, i]));

  const items = data.priorityAreas.flatMap((p) => {
    const translatedPriority = getTranslatedPriority(p);
    return p.milestones.map((m) => ({
      id: `${p.id}::${m.id}`,
      priority: translatedPriority,
      milestone: {
        ...m,
        description: translateMilestone(p.id, m.id, m.description),
      },
      colorIdx: priorityIndex.get(p.id) % Object.keys(PALETTE).length,
    }));
  });
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
      <Breadcrumbs items={[
        { label: t('breadcrumbs.overview'), to: '/' }, 
        { label: t('breadcrumbs.timeline') }
      ]} />
      <h1 className="text-3xl font-bold text-slate-900">{t('timeline.title')}</h1>
      <p className="mt-2 text-slate-700 max-w-3xl">
        {t('timeline.intro')}
      </p>

      <ul aria-label={t('timeline.legendLabel')} className="mt-6 flex flex-wrap gap-4">
        {data.priorityAreas.map((p, i) => {
          const c = PALETTE[i % Object.keys(PALETTE).length];
          const translatedPriority = getTranslatedPriority(p);
          return (
            <li key={p.id} className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${c.dot}`} aria-hidden="true" />
              <Link to={`/priority/${p.id}`} className={`text-sm font-medium ${c.text} hover:underline`}>
                {translatedPriority.priority}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 space-y-8">
        {years.map((year) => (
          <section key={year} aria-labelledby={`year-${year}`}>
            <h2
              id={`year-${year}`}
              className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 sticky top-0 bg-slate-50/95 backdrop-blur"
            >
              {year}
            </h2>
            <ol className="mt-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {byYear.get(year).map(({ id, priority, milestone, colorIdx }) => {
                const c = PALETTE[colorIdx];
                return (
                  <li key={id} className="pl-8 pr-2 py-3 relative">
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
                        {t(`milestones.status.${milestone.status}`)}
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
