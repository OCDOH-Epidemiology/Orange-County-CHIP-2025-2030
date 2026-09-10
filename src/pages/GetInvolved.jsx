import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/index.js';
import { useContent } from '../i18n/index.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Section from '../components/Section.jsx';
import ExternalLink from '../components/ExternalLink.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function GetInvolved({ data }) {
  const { t, tArray } = useTranslation();
  const { getTranslatedPriority } = useContent();
  
  useDocumentTitle(t('titles.getInvolved'));
  
  const contact = data.meta.contact || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: t('breadcrumbs.overview'), to: '/' }, 
        { label: t('breadcrumbs.getInvolved') }
      ]} />
      <h1 className="text-3xl font-bold text-slate-900">{t('getInvolved.title')}</h1>
      <p className="mt-2 text-lg text-slate-700 max-w-3xl">
        {t('getInvolved.intro')}
      </p>

      <div className="mt-6 space-y-6">
        <Section title={t('getInvolved.sections.joinWorkgroup.title')}>
          <p>
            {t('getInvolved.sections.joinWorkgroup.content')}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {data.priorityAreas.map((p) => {
              const translatedPriority = getTranslatedPriority(p);
              return (
                <li key={p.id}>
                  <Link
                    to={`/priority/${p.id}`}
                    className="block h-full rounded-md border border-slate-200 bg-white p-4 hover:shadow-sm"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
                      {translatedPriority.domain}
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">{translatedPriority.priority}</div>
                    <div className="mt-1 text-sm text-slate-700">{translatedPriority.goal}</div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title={t('getInvolved.sections.shareExperience.title')}>
          {tArray('getInvolved.sections.shareExperience.content').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </Section>

        <Section title={t('getInvolved.sections.attendUpdate.title')}>
          <p>
            {t('getInvolved.sections.attendUpdate.intro')}
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>
              <MarkdownText text={t('getInvolved.sections.attendUpdate.events.miniSummits')} />
            </li>
            <li>
              <MarkdownText text={t('getInvolved.sections.attendUpdate.events.healthSummit')} />
            </li>
            <li>
              <MarkdownText text={t('getInvolved.sections.attendUpdate.events.steeringCommittee')} />
            </li>
          </ul>
        </Section>

        <Section title={t('getInvolved.sections.contact.title')}>
          <div className="text-slate-800 space-y-1">
            <div className="font-semibold">{data.meta.publishedBy}</div>
            {contact.email ? (
              <div>
                {t('getInvolved.sections.contact.email')}{' '}
                <a className="text-brand-blue underline" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </div>
            ) : (
              <div className="text-slate-500 italic">{t('getInvolved.sections.contact.emailToBeAdded')}</div>
            )}
            {contact.phone ? <div>{t('getInvolved.sections.contact.phone')} {contact.phone}</div> : null}
            {contact.url && (
              <div>
                {t('getInvolved.sections.contact.web')}{' '}
                <ExternalLink href={contact.url} className="text-brand-blue underline break-all">
                  {contact.url}
                </ExternalLink>
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

/**
 * Simple component to render **bold** markdown syntax.
 */
function MarkdownText({ text }) {
  if (!text) return null;
  
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
}
