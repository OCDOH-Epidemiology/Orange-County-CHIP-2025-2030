import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/index.js';
import { useContent } from '../i18n/index.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';

/**
 * Partner directory across all priority areas. One row per partner + priority
 * area assignment (a single organization can appear on multiple priorities).
 * Filterable by priority area, role, and text search.
 */
export default function Partners({ data }) {
  const { t } = useTranslation();
  const { getTranslatedPriority } = useContent();
  
  useDocumentTitle(t('titles.partners'));
  
  const rows = useMemo(() => {
    const out = [];
    for (const p of data.priorityAreas) {
      const translatedPriority = getTranslatedPriority(p);
      for (const partner of p.partners) {
        out.push({
          priorityId: p.id,
          priorityName: translatedPriority.priority,
          domain: translatedPriority.domain,
          ...partner,
        });
      }
    }
    return out;
  }, [data, getTranslatedPriority]);

  const [priorityFilter, setPriorityFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [q, setQ] = useState('');

  const filtered = rows.filter((r) => {
    if (priorityFilter !== 'all' && r.priorityId !== priorityFilter) return false;
    if (roleFilter !== 'all' && r.role !== roleFilter) return false;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      const hay = `${r.name} ${r.shortName ?? ''} ${r.activityStatus} ${r.priorityName}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  const uniqueOrgs = new Set(rows.map((r) => r.name)).size;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: t('breadcrumbs.overview'), to: '/' }, 
        { label: t('breadcrumbs.partners') }
      ]} />
      <h1 className="text-3xl font-bold text-slate-900">{t('partners.title')}</h1>
      <p className="mt-2 text-slate-700 max-w-3xl">
        {t('partners.intro', { count: uniqueOrgs })}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-slate-700">
          <span className="block font-medium">{t('partners.filters.priorityArea')}</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
          >
            <option value="all">{t('partners.filters.allPriorityAreas')}</option>
            {data.priorityAreas.map((p) => {
              const translatedPriority = getTranslatedPriority(p);
              return (
                <option key={p.id} value={p.id}>{translatedPriority.priority}</option>
              );
            })}
          </select>
        </label>
        <label className="text-sm text-slate-700">
          <span className="block font-medium">{t('partners.filters.role')}</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
          >
            <option value="all">{t('partners.filters.leadAndAdvisory')}</option>
            <option value="lead">{t('partners.filters.leadOnly')}</option>
            <option value="advisory">{t('partners.filters.advisoryOnly')}</option>
          </select>
        </label>
        <label className="text-sm text-slate-700">
          <span className="block font-medium">{t('partners.filters.search')}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('partners.filters.searchPlaceholder')}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
          />
        </label>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        {t('partners.showingResults', { filtered: filtered.length, total: rows.length })}
      </div>

      <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <Th>{t('partners.tableHeaders.organization')}</Th>
              <Th>{t('partners.tableHeaders.priorityArea')}</Th>
              <Th>{t('partners.tableHeaders.role')}</Th>
              <Th>{t('partners.tableHeaders.activityStatus')}</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((r, i) => (
              <tr key={`${r.priorityId}-${r.name}-${i}`}>
                <Td>
                  <span className="font-medium text-slate-900">{r.name}</span>
                  {r.shortName && <span className="ml-2 text-slate-500">({r.shortName})</span>}
                  {r.notes && <div className="text-xs text-slate-500">{r.notes}</div>}
                </Td>
                <Td>
                  <Link to={`/priority/${r.priorityId}`} className="text-brand-blue hover:underline">
                    {r.priorityName}
                  </Link>
                </Td>
                <Td>
                  <span className="inline-flex items-center rounded-full bg-brand-blueLight text-brand-blueDark px-2 py-0.5 text-xs font-medium capitalize">
                    {r.role}
                  </span>
                </Td>
                <Td>
                  <span className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 text-slate-700 px-2 py-0.5 text-xs font-medium">
                    {(r.activityStatus || '').replace(/_/g, ' ') || t('partners.statusNotSet')}
                  </span>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500 italic">
                  {t('partners.noMatches')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th scope="col" className="text-left font-semibold px-4 py-3 whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}
