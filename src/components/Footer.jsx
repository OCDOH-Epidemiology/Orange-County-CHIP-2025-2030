import { formatLongDate } from '../lib/format.js';
import ExternalLink from './ExternalLink.jsx';

export default function Footer({ meta }) {
  const lastUpdated = meta.lastUpdated ? formatLongDate(meta.lastUpdated) : '—';

  return (
    <footer className="bg-slate-900 text-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="font-semibold text-white">{meta.publishedBy}</div>
          <div className="text-sm text-slate-300 mt-1">{meta.plan}</div>
        </div>

        <div>
          <div className="text-sm font-semibold text-white uppercase tracking-wide">Contact</div>
          <ul className="mt-2 text-sm space-y-1">
            {meta.contact?.email && (
              <li>
                <a className="underline decoration-slate-500 hover:decoration-white" href={`mailto:${meta.contact.email}`}>
                  {meta.contact.email}
                </a>
              </li>
            )}
            {meta.contact?.phone && <li>{meta.contact.phone}</li>}
            {meta.contact?.url && (
              <li>
                <ExternalLink
                  href={meta.contact.url}
                  className="underline decoration-slate-500 hover:decoration-white break-all"
                >
                  Reports &amp; Assessments
                </ExternalLink>
              </li>
            )}
            {!meta.contact?.email && !meta.contact?.phone && !meta.contact?.url && (
              <li className="text-slate-400 italic">Contact info to be added</li>
            )}
          </ul>
        </div>

        <div className="sm:text-right">
          <div className="text-sm font-semibold text-white uppercase tracking-wide">Data</div>
          <div className="text-sm mt-2">Last updated: {lastUpdated}</div>
          <div className="text-sm mt-1">Version {meta.version}</div>
        </div>
      </div>
      <div className="bg-slate-950 text-slate-400 text-xs text-center py-3 px-4">
        This dashboard is provided for public transparency. Percentages and
        milestones reflect the Community Health Improvement Plan as submitted
        to the New York State Department of Health.
      </div>
    </footer>
  );
}
