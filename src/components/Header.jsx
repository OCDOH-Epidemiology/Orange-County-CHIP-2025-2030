import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';

/**
 * Site header: county seal placeholder + department name + primary navigation.
 * Fully keyboard-navigable with a mobile disclosure menu.
 */
const NAV = [
  { to: '/', label: 'Overview', end: true },
  { to: '/timeline', label: 'Timeline' },
  { to: '/partners', label: 'Partners' },
  { to: '/methodology', label: 'Data & Methodology' },
  { to: '/get-involved', label: 'Get Involved' },
];

export default function Header({ meta }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-blue text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 flex-1 min-w-0"
          onClick={() => setOpen(false)}
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
            aria-hidden="true"
            className="h-12 w-12 bg-white rounded-full ring-2 ring-white/40 object-contain shrink-0"
            onError={(e) => {
              // Fallback: hide broken image (placeholder logo).
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-semibold leading-tight">
              {meta.publishedBy}
            </div>
            <div className="text-xs sm:text-sm text-white/80 truncate">
              {meta.plan}
            </div>
          </div>
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden inline-flex items-center justify-center rounded p-2 hover:bg-white/10"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={`${open ? 'block' : 'hidden'} md:block absolute md:static top-full left-0 right-0 md:top-auto bg-brand-blueDark md:bg-transparent border-t md:border-0 border-white/10 z-40`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:gap-1 py-2 md:py-0">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'block md:inline-block px-4 py-2 md:py-2 rounded text-sm font-medium',
                      isActive
                        ? 'bg-white text-brand-blue md:bg-white/15 md:text-white'
                        : 'text-white/90 hover:bg-white/10',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
