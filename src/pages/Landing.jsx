import { Link } from 'react-router-dom';
import PriorityCard from '../components/PriorityCard.jsx';
import { ActivityRing, StatusMix, OutcomeDumbbellCard } from '../components/viz/index.js';
import { calculatePlanActivityProgress, getMilestoneCounts } from '../lib/format.js';

export default function Landing({ data }) {
  // Calculate plan-level activity progress
  const planProgressPct = calculatePlanActivityProgress(data.priorityAreas);
  
  // Aggregate milestone counts across all areas
  const totalCounts = data.priorityAreas.reduce(
    (acc, p) => {
      const counts = getMilestoneCounts(p.milestones);
      return {
        complete: acc.complete + counts.complete,
        inProgress: acc.inProgress + counts.inProgress,
        notStarted: acc.notStarted + counts.notStarted,
        total: acc.total + counts.total,
      };
    },
    { complete: 0, inProgress: 0, notStarted: 0, total: 0 }
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section - Visual First */}
      <section aria-labelledby="hero-title" className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
          Community Health Improvement Plan • 2025–2030
        </div>
        <h1
          id="hero-title"
          className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
        >
          Orange County's public health roadmap
        </h1>
        <p className="mt-2 text-slate-600 max-w-xl">
          Tracking progress on our community's five-year health priorities.
        </p>

        {/* Visual Hero: ActivityRing + StatusMix */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-8 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-brand-blueLight border border-slate-200">
          {/* Main Activity Ring */}
          <div className="relative flex-shrink-0">
            <ActivityRing
              percent={planProgressPct}
              size={160}
              strokeWidth={16}
              label="Plan Activity Progress"
              color="blue"
            />
            {/* Center label overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="text-3xl font-bold text-brand-blue">
                {Math.round(planProgressPct)}%
              </span>
              <span className="text-xs text-slate-500 mt-0.5">activity</span>
            </div>
          </div>

          {/* Status and context */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Plan Activity Progress
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              {totalCounts.complete + totalCounts.inProgress} of {totalCounts.total} milestones complete or underway
            </p>

            {/* StatusMix bar */}
            <StatusMix
              complete={totalCounts.complete}
              inProgress={totalCounts.inProgress}
              notStarted={totalCounts.notStarted}
              height={20}
              showLegend={true}
            />

            <p className="mt-3 text-xs text-slate-500">
              Activity tracks planned work; health outcomes update annually.
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/timeline"
            className="inline-flex items-center gap-1 rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blueDark transition-colors"
          >
            View timeline →
          </Link>
          <Link
            to="/methodology"
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            How data works
          </Link>
          <Link
            to="/get-involved"
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Get involved
          </Link>
        </div>
      </section>

      {/* Overall Goals Section - Outcome Dumbbells */}
      <section aria-labelledby="goals-title" className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 id="goals-title" className="text-xl font-semibold text-slate-900">
            5-Year Health Goals
          </h2>
          <span className="text-xs text-slate-500">Outcome measures update yearly</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.priorityAreas.map((p, index) => {
            const { objective } = p;
            // Calculate next expected measurement year
            const lastMeasurementYear = objective.currentValue !== null && objective.asOfDate
              ? parseInt(objective.asOfDate.split('-')[0], 10)
              : objective.baseline.year;
            const cycleYears = objective.refreshCycleYears || 1;
            const nextExpectedYear = lastMeasurementYear + cycleYears;

            return (
              <Link
                key={p.id}
                to={`/priority/${p.id}`}
                className="block hover:scale-[1.02] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-lg"
                style={{ '--stagger-index': index }}
              >
                <OutcomeDumbbellCard
                  title={p.priority}
                  baseline={objective.baseline}
                  target={objective.target}
                  currentValue={objective.currentValue}
                  asOfDate={objective.asOfDate}
                  unit={objective.unit}
                  direction={objective.direction}
                  metric={objective.metric}
                  nextExpectedYear={nextExpectedYear}
                  className="h-full hover:shadow-md hover:border-brand-blue/30 transition-shadow animate-stagger"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Priority Areas Section */}
      <section aria-labelledby="priorities-title" className="mb-12">
        <h2 id="priorities-title" className="text-xl font-semibold text-slate-900 mb-1">
          Priority Areas
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Each area addresses a specific health disparity.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.priorityAreas.map((p, index) => (
            <PriorityCard
              key={p.id}
              priority={p}
              style={{ '--stagger-index': index }}
              className="animate-stagger"
            />
          ))}
        </div>
      </section>

      {/* Explore Section */}
      <section aria-labelledby="explore-title">
        <h2 id="explore-title" className="text-xl font-semibold text-slate-900 mb-4">
          Explore
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LinkTile
            to="/timeline"
            title="Timeline"
            body="Milestones across all areas"
            staggerIndex={0}
          />
          <LinkTile
            to="/partners"
            title="Partners"
            body="Lead and advisory organizations"
            staggerIndex={1}
          />
          <LinkTile
            to="/methodology"
            title="Methodology"
            body="Data sources and definitions"
            staggerIndex={2}
          />
          <LinkTile
            to="/get-involved"
            title="Get Involved"
            body="Join a workgroup"
            staggerIndex={3}
          />
        </div>
      </section>
    </div>
  );
}

function LinkTile({ to, title, body, staggerIndex = 0 }) {
  return (
    <Link
      to={to}
      className="animate-stagger block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all"
      style={{ '--stagger-index': staggerIndex }}
    >
      <div className="text-sm font-semibold text-brand-blue">{title}</div>
      <p className="mt-0.5 text-xs text-slate-600">{body}</p>
    </Link>
  );
}
