import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Section from '../components/Section.jsx';

export default function DataMethodology({ data }) {
  const uniqueSources = Array.from(
    new Set(data.priorityAreas.map((p) => p.objective.dataSource))
  );
  const anyUntracked = data.priorityAreas.some((p) => p.objective.currentValue === null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Overview', to: '/' }, { label: 'Data & Methodology' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Data &amp; Methodology</h1>
      <p className="mt-2 text-slate-700">
        How the numbers on this dashboard are produced and what they mean.
      </p>

      <div className="mt-6 space-y-6">
        <Section title="What is a Community Health Improvement Plan?">
          <p>
            A Community Health Improvement Plan is a five-year public health
            strategy required by New York State. It identifies the most
            pressing health issues in a county, chooses a small number of
            priorities that the local health department and its partners can
            realistically move, and commits to measurable objectives with
            annual milestones.
          </p>
          <p className="mt-3">
            Orange County's 2025–2030 Community Health Improvement Plan was
            developed using the Mobilizing for Action through Planning and
            Partnerships framework. Priorities were chosen through community
            surveys, partner voting at the Orange County Health Summit, and a
            health-and-human-services provider survey, alongside quantitative
            data from the Community Health Assessment.
          </p>
        </Section>

        <Section title="Where the numbers come from">
          <p>
            Each priority area's objective has a specific data source and
            reporting frequency:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            {data.priorityAreas.map((p) => (
              <li key={p.id}>
                <span className="font-semibold">{p.priority}:</span>{' '}
                <span>{p.objective.dataSource}</span>{' '}
                <span className="text-slate-500">
                  (reported {p.objective.reportingFrequency.toLowerCase()})
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm text-slate-600">
            Unique data sources across the plan:
          </p>
          <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
            {uniqueSources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        <Section title="How to read the progress bars">
          <p>
            Each objective has three numbers: a <strong>baseline</strong> (the
            starting measurement), a <strong>target</strong> (where the Orange
            County Department of Health aims to be by 2030), and a{' '}
            <strong>current value</strong> (the most recent measurement).
          </p>
          <p className="mt-3">
            Some objectives use <strong>increase goals</strong> (e.g. more
            adults screened for colorectal cancer) and some use{' '}
            <strong>decrease goals</strong> (e.g. fewer adults reporting mental
            distress). The progress bar always fills toward the target, so a
            fuller bar always means better performance regardless of direction.
          </p>
          {anyUntracked && (
            <p className="mt-3">
              Where you see "baseline established, tracking to begin," a new
              measurement has not yet been collected. This is expected in the
              first years of a five-year plan and is not a data gap; the
              dashboard will start showing progress once the next survey or
              administrative dataset arrives.
            </p>
          )}
        </Section>

        <Section title="Milestone status">
          <p>Each annual milestone has one of three statuses:</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-slate-300 mr-2 align-middle" aria-hidden="true" />
              <strong>Not started</strong> — the milestone is scheduled but work has not yet begun.
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2 align-middle" aria-hidden="true" />
              <strong>In progress</strong> — work is underway and being tracked in the Community Health Improvement Plan evaluation database.
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-brand-green mr-2 align-middle" aria-hidden="true" />
              <strong>Complete</strong> — the milestone target has been reached.
            </li>
          </ul>
        </Section>

        <Section title="A note on partner activity">
          <p>
            Every partner shown in the dashboard has a small "activity status"
            label next to their name. These labels are set by Orange County
            Department of Health staff and describe the partner's current
            involvement in the workgroup for that priority area. The exact
            criteria for what counts as "active" versus "engaged" are being
            defined by the Orange County Department of Health — the dashboard
            displays whatever the label says without inferring meaning.
          </p>
        </Section>

        {data.meta.notes && (
          <Section title="Data notes">
            <p className="text-slate-700 whitespace-pre-line">{data.meta.notes}</p>
          </Section>
        )}

        <Section title="Limitations">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Long-term objectives are refreshed by survey; the Orange County
              Community Health Survey is conducted roughly every three years,
              and the New York State Behavioral Risk Factor Surveillance
              Survey is refreshed on a state cycle. Between surveys, only the
              short-term process indicators change.
            </li>
            <li>
              Milestone status reflects the Orange County Department of
              Health's most recent workgroup review. Data is updated quarterly
              during Steering Committee meetings.
            </li>
            <li>
              The Community Health Improvement Plan addresses only three
              priority areas by design; other important issues in Orange
              County are addressed by separate coalitions, plans, and county
              departments referenced in the plan narrative.
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
