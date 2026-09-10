import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/index.js';
import { useContent } from '../i18n/index.js';
import PriorityCard from '../components/PriorityCard.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function Landing({ data }) {
  const { t } = useTranslation();
  const { getTranslatedPriority } = useContent();
  
  useDocumentTitle(t('titles.overview'));
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <section aria-labelledby="hero-title" className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
          {t('landing.tagline')}
        </div>
        <h1
          id="hero-title"
          className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
        >
          {t('landing.title')}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          {t('landing.intro')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/methodology"
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {t('landing.howDataWorks')}
          </Link>
          <Link
            to="/get-involved"
            className="inline-flex items-center gap-1 rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blueDark"
          >
            {t('landing.getInvolved')} →
          </Link>
        </div>
      </section>

      <section aria-labelledby="priorities-title">
        <h2 id="priorities-title" className="text-2xl font-semibold text-slate-900 mb-4">
          {t('landing.priorityAreasTitle')}
        </h2>
        <p className="text-slate-700 mb-6 max-w-3xl">
          {t('landing.priorityAreasIntro')}
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.priorityAreas.map((p) => (
            <PriorityCard key={p.id} priority={getTranslatedPriority(p)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="ataglance-title" className="mt-12">
        <h2 id="ataglance-title" className="text-2xl font-semibold text-slate-900 mb-4">
          {t('landing.exploreTitle')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LinkTile
            to="/timeline"
            title={t('landing.tiles.timeline.title')}
            body={t('landing.tiles.timeline.body')}
          />
          <LinkTile
            to="/partners"
            title={t('landing.tiles.partners.title')}
            body={t('landing.tiles.partners.body')}
          />
          <LinkTile
            to="/methodology"
            title={t('landing.tiles.methodology.title')}
            body={t('landing.tiles.methodology.body')}
          />
          <LinkTile
            to="/get-involved"
            title={t('landing.tiles.getInvolved.title')}
            body={t('landing.tiles.getInvolved.body')}
          />
        </div>
      </section>
    </div>
  );
}

function LinkTile({ to, title, body }) {
  return (
    <Link
      to={to}
      className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-base font-semibold text-brand-blue">{title}</div>
      <p className="mt-1 text-sm text-slate-700">{body}</p>
    </Link>
  );
}
