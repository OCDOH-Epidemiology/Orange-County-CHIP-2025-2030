import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-600">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {last || !item.to ? (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-slate-900 font-medium' : ''}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="hover:underline text-brand-blue">
                  {item.label}
                </Link>
              )}
              {!last && <span aria-hidden="true" className="text-slate-400">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
