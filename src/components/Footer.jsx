import { useTranslation, useDateFormat } from '../i18n/index.js';
import ExternalLink from './ExternalLink.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function Footer({ meta }) {
  const { t } = useTranslation();
  const { formatLongDate } = useDateFormat();
  const lastUpdated = meta.lastUpdated ? formatLongDate(meta.lastUpdated) : '—';

  return (
    <footer className="bg-slate-900 text-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-semibold text-white">{meta.publishedBy}</div>
          <div className="text-sm text-slate-300 mt-1">{meta.plan}</div>
        </div>

        <div>
          <div className="text-sm font-semibold text-white uppercase tracking-wide">
            {t('footer.contact')}
          </div>
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
                  {t('footer.reportsAssessments')}
                </ExternalLink>
              </li>
            )}
            {!meta.contact?.email && !meta.contact?.phone && !meta.contact?.url && (
              <li className="text-slate-400 italic">{t('footer.contactToBeAdded')}</li>
            )}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-white uppercase tracking-wide">
            {t('footer.data')}
          </div>
          <div className="text-sm mt-2">{t('footer.lastUpdated')} {lastUpdated}</div>
          <div className="text-sm mt-1">{t('footer.version')} {meta.version}</div>
        </div>

        <div className="sm:text-right lg:text-left">
          <div className="text-sm font-semibold text-white uppercase tracking-wide mb-2">
            {t('languageSwitcher.label')}
          </div>
          <LanguageSwitcher variant="footer" />
        </div>
      </div>
      <div className="bg-slate-950 text-slate-400 text-xs text-center py-3 px-4">
        {t('footer.disclaimer')}
      </div>
    </footer>
  );
}
