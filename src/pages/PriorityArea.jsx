import { useParams, Link } from 'react-router-dom';
import { useTranslation, useDateFormat } from '../i18n/index.js';
import { useContent } from '../i18n/index.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Section from '../components/Section.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import MilestoneList from '../components/MilestoneList.jsx';
import PartnerList from '../components/PartnerList.jsx';
import Disclosure from '../components/Disclosure.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function PriorityArea({ data }) {
  const { id } = useParams();
  const { t } = useTranslation();
  const { formatLongDate } = useDateFormat();
  const { getTranslatedPriority } = useContent();
  
  const originalPriority = data.priorityAreas.find((p) => p.id === id);
  const priority = originalPriority ? getTranslatedPriority(originalPriority) : null;

  useDocumentTitle(priority?.priority || t('titles.priorityNotFound'));

  if (!priority) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">{t('priorityArea.notFound.title')}</h1>
        <p className="mt-3 text-slate-700">
          {t('priorityArea.notFound.message', { id })}
        </p>
        <Link to="/" className="mt-4 inline-block text-brand-blue underline">
          {t('common.backToOverview')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t('breadcrumbs.overview'), to: '/' },
          { label: priority.priority },
        ]}
      />

      <header className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
          {priority.domain}
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          {priority.priority}
        </h1>
        <p className="mt-2 text-lg text-slate-700">
          <span className="font-semibold">{t('priorityArea.goal')}</span> {priority.goal}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {t('priorityArea.focusedOn')} <span className="font-medium text-slate-800">{priority.disparityAddressed}</span>
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {t('priorityArea.implementationWindow')} {formatLongDate(priority.timeframe.start)} – {formatLongDate(priority.timeframe.end)}
        </p>
      </header>

      <div className="grid gap-6">
        <Section 
          title={t('priorityArea.objective', { number: priority.objective.number })} 
          subtitle={priority.objective.metric}
        >
          <p className="text-slate-800">{priority.objective.description}</p>
          <div className="mt-4">
            <ProgressBar objective={priority.objective} priorityId={priority.id} />
          </div>
          <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="inline font-semibold">{t('priorityArea.dataSource')}</dt>{' '}
              <dd className="inline">{originalPriority.objective.dataSource}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">{t('priorityArea.reportingFrequency')}</dt>{' '}
              <dd className="inline">{originalPriority.objective.reportingFrequency}</dd>
            </div>
            {originalPriority.objective.stateComparison && (
              <div className="sm:col-span-2">
                <dt className="inline font-semibold">{t('priorityArea.stateComparison')}</dt>{' '}
                <dd className="inline">
                  {originalPriority.objective.stateComparison.value}
                  {originalPriority.objective.unit === 'percent' ? '%' : ''}{' '}
                  — {originalPriority.objective.stateComparison.label}
                </dd>
              </div>
            )}
          </dl>
        </Section>

        <Section title={t('priorityArea.strategy')}>
          <p className="text-slate-800">{priority.evidenceBasedStrategy}</p>
          <div className="mt-4 rounded-md bg-brand-blueLight border border-brand-blue/20 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-blueDark">
              {t('priorityArea.intendedOutcome')}
            </div>
            <p className="mt-1 text-slate-800">{priority.outcome}</p>
          </div>
        </Section>

        <Section title={t('priorityArea.annualMilestones')} subtitle={t('priorityArea.milestonesSubtitle')}>
          <MilestoneList milestones={priority.milestones} priorityId={priority.id} />
        </Section>

        <Section title={t('priorityArea.partnersTitle')}>
          <PartnerList partners={priority.partners} />
        </Section>

        <Disclosure label={t('priorityArea.evaluationMeasures')}>
          <ul className="list-disc pl-5 space-y-1 text-slate-800">
            {originalPriority.evaluationMeasures.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </div>
  );
}
