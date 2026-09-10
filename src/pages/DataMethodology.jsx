import { useTranslation } from '../i18n/index.js';
import { useContent } from '../i18n/index.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Section from '../components/Section.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function DataMethodology({ data }) {
  const { t, tArray } = useTranslation();
  const { getTranslatedPriority } = useContent();
  
  useDocumentTitle(t('titles.dataMethodology'));
  
  const uniqueSources = Array.from(
    new Set(data.priorityAreas.map((p) => p.objective.dataSource))
  );
  const anyUntracked = data.priorityAreas.some((p) => p.objective.currentValue === null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: t('breadcrumbs.overview'), to: '/' }, 
        { label: t('breadcrumbs.dataMethodology') }
      ]} />
      <h1 className="text-3xl font-bold text-slate-900">{t('methodology.title')}</h1>
      <p className="mt-2 text-slate-700">
        {t('methodology.intro')}
      </p>

      <div className="mt-6 space-y-6">
        <Section title={t('methodology.sections.whatIsCHIP.title')}>
          {tArray('methodology.sections.whatIsCHIP.content').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </Section>

        <Section title={t('methodology.sections.dataSources.title')}>
          <p>
            {t('methodology.sections.dataSources.intro')}
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            {data.priorityAreas.map((p) => {
              const translatedPriority = getTranslatedPriority(p);
              return (
                <li key={p.id}>
                  <span className="font-semibold">{translatedPriority.priority}:</span>{' '}
                  <span>{p.objective.dataSource}</span>{' '}
                  <span className="text-slate-500">
                    ({t('methodology.sections.dataSources.reported', { 
                      frequency: p.objective.reportingFrequency.toLowerCase() 
                    })})
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-sm text-slate-600">
            {t('methodology.sections.dataSources.uniqueSources')}
          </p>
          <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
            {uniqueSources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('methodology.sections.progressBars.title')}>
          <p>
            <MarkdownText text={tArray('methodology.sections.progressBars.content')[0] || ''} />
          </p>
          <p className="mt-3">
            <MarkdownText text={tArray('methodology.sections.progressBars.content')[1] || ''} />
          </p>
          {anyUntracked && (
            <p className="mt-3">
              {tArray('methodology.sections.progressBars.content')[2] || ''}
            </p>
          )}
        </Section>

        <Section title={t('methodology.sections.milestoneStatus.title')}>
          <p>{t('methodology.sections.milestoneStatus.intro')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-slate-300 mr-2 align-middle" aria-hidden="true" />
              <MarkdownText text={t('methodology.sections.milestoneStatus.statuses.notStarted')} />
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2 align-middle" aria-hidden="true" />
              <MarkdownText text={t('methodology.sections.milestoneStatus.statuses.inProgress')} />
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-brand-green mr-2 align-middle" aria-hidden="true" />
              <MarkdownText text={t('methodology.sections.milestoneStatus.statuses.complete')} />
            </li>
          </ul>
        </Section>

        <Section title={t('methodology.sections.partnerActivity.title')}>
          <p>
            {t('methodology.sections.partnerActivity.content')}
          </p>
        </Section>

        {data.meta.notes && (
          <Section title={t('methodology.sections.dataNotes.title')}>
            <p className="text-slate-700 whitespace-pre-line">{data.meta.notes}</p>
          </Section>
        )}

        <Section title={t('methodology.sections.limitations.title')}>
          <ul className="list-disc pl-5 space-y-2">
            {tArray('methodology.sections.limitations.items').map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
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
