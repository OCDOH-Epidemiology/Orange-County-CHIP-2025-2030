import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Section from '../components/Section.jsx';
import MilestoneList from '../components/MilestoneList.jsx';
import PartnerList from '../components/PartnerList.jsx';
import Disclosure from '../components/Disclosure.jsx';
import { ActivityRing, StatusMix, OutcomeDumbbell } from '../components/viz/index.js';
import { 
  formatLongDate, 
  calculateActivityProgress, 
  getMilestoneCounts,
  deriveActivityBadge,
  ACTIVITY_BADGE_STYLES,
  formatShortMonthYear 
} from '../lib/format.js';

export default function PriorityArea({ data }) {
  const { id } = useParams();
  const priority = data.priorityAreas.find((p) => p.id === id);

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

  const progressPct = calculateActivityProgress(priority.milestones);
  const counts = getMilestoneCounts(priority.milestones);
  const { badge, label, lastActivityDate } = deriveActivityBadge(priority);
  const badgeStyle = ACTIVITY_BADGE_STYLES[badge];

  // Outcome calculation
  const { objective } = priority;
  const lastMeasurementYear = objective.currentValue !== null && objective.asOfDate
    ? parseInt(objective.asOfDate.split('-')[0], 10)
    : objective.baseline.year;
  const cycleYears = objective.refreshCycleYears || 1;
  const nextExpectedYear = lastMeasurementYear + cycleYears;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Overview', to: '/' },
          { label: priority.priority },
        ]}
      />

      {/* Header */}
      <header className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
          {priority.domain}
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          {priority.priority}
        </h1>
        <p className="mt-2 text-slate-700">
          <span className="font-medium">Goal:</span> {priority.goal}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <span>
            <span className="font-medium">Focus:</span> {priority.disparityAddressed}
          </span>
          <span>
            <span className="font-medium">Timeline:</span> {formatLongDate(priority.timeframe.start)} – {formatLongDate(priority.timeframe.end)}
          </span>
        </div>
      </header>

      {/* Visual Progress Section - Activity Ring + StatusMix */}
      <section className="mb-8 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-brand-blueLight border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Activity Ring */}
          <div className="relative flex-shrink-0">
            <ActivityRing
              percent={progressPct}
              size={140}
              strokeWidth={14}
              label={`Activity progress for ${priority.priority}`}
              color="blue"
            />
            {/* Center overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="text-2xl font-bold text-brand-blue">
                {Math.round(progressPct)}%
              </span>
              <span className="text-[10px] text-slate-500">activity</span>
            </div>
          </div>

          {/* Status details */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <h2 className="text-lg font-semibold text-slate-900">Activity Progress</h2>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                <span aria-hidden="true">{badgeStyle.icon}</span>
                {label}
              </span>
            </div>

            {lastActivityDate && (
              <p className="text-xs text-slate-500 mb-3">
                Last updated {formatShortMonthYear(lastActivityDate)}
              </p>
            )}

            {/* StatusMix bar */}
            <StatusMix
              complete={counts.complete}
              inProgress={counts.inProgress}
              notStarted={counts.notStarted}
              height={20}
              showLegend={true}
            />

            <p className="mt-3 text-xs text-slate-500">
              Activity tracks whether planned work is happening, not yet its effect on health outcomes.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6">
        {/* Outcome Watch Section - OutcomeDumbbell */}
        <Section title="Outcome Watch" subtitle={`Objective ${objective.number}`}>
          <div className="space-y-4">
            {/* Main dumbbell graphic */}
            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <p className="text-sm text-slate-700 mb-4">{objective.description}</p>
              
              <OutcomeDumbbell
                baseline={objective.baseline}
                target={objective.target}
                currentValue={objective.currentValue}
                asOfDate={objective.asOfDate}
                unit={objective.unit}
                direction={objective.direction}
                metric={objective.metric}
              />

              {/* Additional context */}
              {objective.currentValue === null && (
                <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2">
                  <div className="flex flex-col gap-1 text-sm text-slate-700">
                    <span className="font-medium">Baseline established — awaiting next measurement</span>
                    <span className="text-xs text-slate-500">
                      Next expected: {nextExpectedYear} · Updates {objective.reportingFrequency?.toLowerCase() || 'periodically'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Data source details */}
            <dl className="grid gap-x-6 gap-y-2 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <dt className="inline font-semibold">Data source:</dt>{' '}
                <dd className="inline">{objective.dataSource}</dd>
              </div>
              <div>
                <dt className="inline font-semibold">Reporting frequency:</dt>{' '}
                <dd className="inline">{objective.reportingFrequency}</dd>
              </div>
              {objective.stateComparison && (
                <div className="sm:col-span-2">
                  <dt className="inline font-semibold">State comparison:</dt>{' '}
                  <dd className="inline">
                    {objective.stateComparison.value}
                    {objective.unit === 'percent' ? '%' : ''}{' '}
                    — {objective.stateComparison.label}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Section>

        {/* Strategy */}
        <Section title="Strategy">
          <p className="text-slate-800">{priority.evidenceBasedStrategy}</p>
          <div className="mt-4 rounded-md bg-brand-greenLight border border-brand-green/20 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-greenDark">
              Intended outcome
            </div>
            <p className="mt-1 text-slate-800">{priority.outcome}</p>
          </div>
        </Section>

        {/* Milestones */}
        <Section title="Annual Milestones" subtitle="Short-term process indicators tracked each year">
          <MilestoneList milestones={priority.milestones} />
        </Section>

        {/* Partners */}
        <Section title="Partners">
          <PartnerList partners={priority.partners} />
        </Section>

        {/* Evaluation measures */}
        <Disclosure label="Evaluation measures">
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
