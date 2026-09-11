import { Link } from 'react-router-dom';
import PriorityCard from '../components/PriorityCard.jsx';
import OutcomeWatchCard from '../components/OutcomeWatchCard.jsx';
import { calculatePlanActivityProgress, getMilestoneCounts } from '../lib/format.js';

export default function Landing({ data }) {
  // Calculate plan-level activity progress
  const planProgressPct = calculatePlanActivityProgress(data.priorityAreas);
  const totalMilestones = data.priorityAreas.reduce(
    (sum, p) => sum + p.milestones.length, 0
  );
  const totalCounts = data.priorityAreas.reduce(
    (acc, p) => {
      const counts = getMilestoneCounts(p.milestones);
      return {
        complete: acc.complete + counts.complete,
        inProgress: acc.inProgress + counts.inProgress,
        completeOrUnderway: acc.completeOrUnderway + counts.completeOrUnderway,
      };
    },
    { complete: 0, inProgress: 0, completeOrUnderway: 0 }
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <section aria-labelledby="hero-title" className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
          Community Health Improvement Plan • 2025–2030
        </div>
        <h1
          id="hero-title"
          className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
        >
          Tracking Orange County's public health priorities.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          A Community Health Improvement Plan is a five-year, public roadmap
          for improving the health of a community. It identifies the most
          pressing health needs, sets measurable goals, and names the partners
          doing the work. This dashboard shows what Orange County is working on
          and how it is going.
        </p>
        
        {/* Plan-level Activity Progress */}
        <div className="mt-6 p-4 rounded-lg bg-slate-100 border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Plan Activity Progress</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {totalCounts.completeOrUnderway} of {totalMilestones} milestones complete or underway across all priority areas
              </p>
            </div>
            <div className="text-2xl font-bold text-brand-blue">
              {Math.round(planProgressPct)}%
            </div>
          </div>
          <div className="mt-3">
            <div
              className="h-3 w-full rounded-full bg-slate-200 overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(planProgressPct)}
              aria-label={`Plan activity progress: ${Math.round(planProgressPct)}%`}
            >
              <div
                className="h-full transition-[width] duration-500 ease-out bg-brand-blue"
                style={{ width: `${Math.min(planProgressPct, 100)}%` }}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            This tracks whether planned work is happening, not yet its effect on health outcomes.
          </p>
        </div>

        {/* Overall Goals / Outcome Watch Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Overall Goals</h2>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            These are the 5-year health outcomes we're working toward. Outcome data updates
            about once a year (or per each metric's reporting cycle). The Activity Progress
            above tracks whether the planned work is happening.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.priorityAreas.map((p, index) => (
              <OutcomeWatchCard
                key={p.id}
                priority={p}
                style={{ '--stagger-index': index }}
                className="animate-stagger"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/methodology"
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            How the data works
          </Link>
          <Link
            to="/get-involved"
            className="inline-flex items-center gap-1 rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blueDark"
          >
            Get involved →
          </Link>
        </div>
      </section>

      <section aria-labelledby="priorities-title">
        <h2 id="priorities-title" className="text-2xl font-semibold text-slate-900 mb-4">
          The three priority areas
        </h2>
        <p className="text-slate-700 mb-6 max-w-3xl">
          Each priority area addresses a specific health disparity in Orange
          County. Click any card for milestones, partners, and the strategy
          being used.
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

      <section aria-labelledby="ataglance-title" className="mt-12">
        <h2 id="ataglance-title" className="text-2xl font-semibold text-slate-900 mb-4">
          Explore the plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LinkTile
            to="/timeline"
            title="Timeline"
            body="See every milestone across all priority areas with progress tracking."
            staggerIndex={0}
          />
          <LinkTile
            to="/partners"
            title="Partner directory"
            body="All lead and advisory partners across the three priority areas."
            staggerIndex={1}
          />
          <LinkTile
            to="/methodology"
            title="Data & methodology"
            body="Data sources, survey years, and what the numbers actually mean."
            staggerIndex={2}
          />
          <LinkTile
            to="/get-involved"
            title="Get involved"
            body="How residents and organizations can join a workgroup or share feedback."
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
      className="animate-stagger block rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
      style={{ '--stagger-index': staggerIndex }}
    >
      <div className="text-base font-semibold text-brand-blue">{title}</div>
      <p className="mt-1 text-sm text-slate-700">{body}</p>
    </Link>
  );
}
