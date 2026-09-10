import { useTranslation, useDateFormat } from '../i18n/index.js';

/**
 * Displays partners grouped by role (Lead / Advisory).
 *
 * NOTE ON activityStatus:
 * The `activityStatus` field is a free-form string. This component displays it
 * verbatim as a small badge. **Do not add code here that interprets specific
 * values** (e.g. treating "active" as different from "engaged"). The Orange
 * County Department of Health will define what counts as an "active partner"
 * later; when they do, that logic belongs in the data layer, not in this
 * display component. See `docs/schema.md` and `meta.notes` in
 * `chip-data.json`.
 */
export default function PartnerList({ partners, groupByRole = true }) {
  const { t } = useTranslation();

  if (!partners || partners.length === 0) {
    return <p className="text-slate-500 italic">{t('partnerList.noPartners')}</p>;
  }
  if (!groupByRole) {
    return (
      <ul className="divide-y divide-slate-200 border border-slate-200 rounded-md bg-white">
        {partners.map((p, i) => (
          <PartnerRow key={`${p.name}-${i}`} partner={p} showRole />
        ))}
      </ul>
    );
  }
  const lead = partners.filter((p) => p.role === 'lead');
  const advisory = partners.filter((p) => p.role === 'advisory');
  return (
    <div className="space-y-6">
      <PartnerGroup 
        title={t('partnerList.leadPartners')} 
        description={t('partnerList.leadDescription')} 
        partners={lead} 
      />
      <PartnerGroup 
        title={t('partnerList.advisoryPartners')} 
        description={t('partnerList.advisoryDescription')} 
        partners={advisory} 
      />
    </div>
  );
}

function PartnerGroup({ title, description, partners }) {
  const { t } = useTranslation();
  
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
      {partners.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500 italic">{t('partnerList.noneListed')}</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-200 border border-slate-200 rounded-md bg-white">
          {partners.map((p, i) => (
            <PartnerRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </ul>
      )}
    </section>
  );
}

function PartnerRow({ partner, showRole = false }) {
  const { t } = useTranslation();
  const { formatLongDate } = useDateFormat();
  
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="font-medium text-slate-900">
          {partner.name}
          {partner.shortName ? (
            <span className="ml-2 text-slate-500 text-sm">({partner.shortName})</span>
          ) : null}
        </div>
        {partner.notes && (
          <div className="text-xs text-slate-500 mt-0.5">{partner.notes}</div>
        )}
        {partner.lastActivityDate && (
          <div className="text-xs text-slate-500 mt-0.5">
            {t('partnerList.lastActivity')} {formatLongDate(partner.lastActivityDate)}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {showRole && (
          <span className="inline-flex items-center rounded-full bg-brand-blueLight text-brand-blueDark px-2 py-0.5 text-xs font-medium capitalize">
            {partner.role}
          </span>
        )}
        <ActivityBadge status={partner.activityStatus} />
      </div>
    </li>
  );
}

function ActivityBadge({ status }) {
  const { t } = useTranslation();
  const label = (status || '').replace(/_/g, ' ');
  
  return (
    <span
      className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 text-slate-700 px-2 py-0.5 text-xs font-medium"
      title={t('partnerList.activityStatusTitle')}
    >
      {label || t('partnerList.statusNotSet')}
    </span>
  );
}
