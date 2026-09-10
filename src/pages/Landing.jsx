import { Link } from 'react-router-dom';
import PriorityCard from '../components/PriorityCard.jsx';

export default function Landing({ data }) {
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
        <div className="mt-6 flex flex-wrap gap-3">
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
            body="See every milestone from 2026 through 2030 on one chronological view."
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
