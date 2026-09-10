import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Section from '../components/Section.jsx';

export default function GetInvolved({ data }) {
  const contact = data.meta.contact || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Overview', to: '/' }, { label: 'Get Involved' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Get involved</h1>
      <p className="mt-2 text-lg text-slate-700 max-w-3xl">
        Orange County's health improves when residents, workers, and
        organizations partner with the health department. Here are three ways
        you can help move the Community Health Improvement Plan forward.
      </p>

      <div className="mt-6 space-y-6">
        <Section title="Join a priority-area workgroup">
          <p>
            Each priority area has a workgroup led by the Orange County
            Department of Health that meets monthly or quarterly. Workgroups
            plan events, review data, and coordinate partner activity. Anyone
            with lived experience, professional expertise, or community reach
            in these topics is welcome to participate.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {data.priorityAreas.map((p, index) => (
              <li
                key={p.id}
                className="animate-stagger"
                style={{ '--stagger-index': index }}
              >
                <Link
                  to={`/priority/${p.id}`}
                  className="block h-full rounded-md border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
                    {p.domain}
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">{p.priority}</div>
                  <div className="mt-1 text-sm text-slate-700">{p.goal}</div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Share your experience">
          <p>
            The Community Health Improvement Plan was built on more than 2,200
            resident voices through the Orange County Community Health Survey,
            focus groups with underrepresented community members, and key
            informant interviews. The Orange County Department of Health
            continues to collect community input year-round.
          </p>
          <p className="mt-3">
            If you'd like to share your experience with food security, mental
            health, or preventive care access in Orange County, reach out
            through the contact information below.
          </p>
        </Section>

        <Section title="Attend a public update">
          <p>
            Progress on the Community Health Improvement Plan is shared
            publicly at:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>
              <strong>Annual Mini-Summits</strong> — priority-specific updates,
              one per priority area each year.
            </li>
            <li>
              <strong>Orange County Health Summit</strong> — a biennial
              gathering starting in 2027 with all three workgroups and the
              Steering Committee.
            </li>
            <li>
              <strong>Steering Committee meetings</strong> — quarterly
              starting fall 2026.
            </li>
          </ul>
        </Section>

        <Section title="Contact the Community Health Improvement Plan team">
          <div className="text-slate-800 space-y-1">
            <div className="font-semibold">{data.meta.publishedBy}</div>
            {contact.email ? (
              <div>
                Email:{' '}
                <a className="text-brand-blue underline" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </div>
            ) : (
              <div className="text-slate-500 italic">Email to be added</div>
            )}
            {contact.phone ? <div>Phone: {contact.phone}</div> : null}
            {contact.url && (
              <div>
                Web:{' '}
                <a className="text-brand-blue underline break-all" href={contact.url} target="_blank" rel="noreferrer">
                  {contact.url}
                </a>
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
