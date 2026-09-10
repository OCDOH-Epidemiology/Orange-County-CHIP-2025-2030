import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Section from '../components/Section.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import MilestoneList from '../components/MilestoneList.jsx';
import PartnerList from '../components/PartnerList.jsx';
import Disclosure from '../components/Disclosure.jsx';
import { formatLongDate } from '../lib/format.js';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function PriorityArea({ data }) {
  const { id } = useParams();
  const priority = data.priorityAreas.find((p) => p.id === id);

  useDocumentTitle(priority?.priority || 'Priority Area Not Found');

  if (!priority) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Priority area not found</h1>
        <p className="mt-3 text-slate-700">
          We couldn't find a priority area matching "{id}".
        </p>
        <Link to="/" className="mt-4 inline-block text-brand-blue underline">
          Back to overview
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Overview', to: '/' },
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
        <p className="mt-2 text-lg text-slate-700"><span className="font-semibold">Goal:</span> {priority.goal}</p>
        <p className="mt-1 text-sm text-slate-600">
          Focused on: <span className="font-medium text-slate-800">{priority.disparityAddressed}</span>
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Implementation window: {formatLongDate(priority.timeframe.start)} – {formatLongDate(priority.timeframe.end)}
        </p>
      </header>

      <div className="grid gap-6">
        <Section title={`Objective ${priority.objective.number}`} subtitle={priority.objective.metric}>
          <p className="text-slate-800">{priority.objective.description}</p>
          <div className="mt-4">
            <ProgressBar objective={priority.objective} />
          </div>
          <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="inline font-semibold">Data source:</dt>{' '}
              <dd className="inline">{priority.objective.dataSource}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Reporting frequency:</dt>{' '}
              <dd className="inline">{priority.objective.reportingFrequency}</dd>
            </div>
            {priority.objective.stateComparison && (
              <div className="sm:col-span-2">
                <dt className="inline font-semibold">State comparison:</dt>{' '}
                <dd className="inline">
                  {priority.objective.stateComparison.value}
                  {priority.objective.unit === 'percent' ? '%' : ''}{' '}
                  — {priority.objective.stateComparison.label}
                </dd>
              </div>
            )}
          </dl>
        </Section>

        <Section title="Strategy">
          <p className="text-slate-800">{priority.evidenceBasedStrategy}</p>
          <div className="mt-4 rounded-md bg-brand-blueLight border border-brand-blue/20 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-blueDark">
              Intended outcome
            </div>
            <p className="mt-1 text-slate-800">{priority.outcome}</p>
          </div>
        </Section>

        <Section title="Annual milestones" subtitle="Short-term process indicators tracked each year.">
          <MilestoneList milestones={priority.milestones} />
        </Section>

        <Section title="Partners">
          <PartnerList partners={priority.partners} />
        </Section>

        <Disclosure label="More detail: evaluation measures">
          <ul className="list-disc pl-5 space-y-1 text-slate-800">
            {priority.evaluationMeasures.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </div>
  );
}
