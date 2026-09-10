import { useState, useId } from 'react';

/**
 * Accessible expandable "details" region.
 * Uses button + aria-controls + aria-expanded (not <details>/<summary>) so we
 * can style it consistently and animate the caret.
 */
export default function Disclosure({ label, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left font-medium text-slate-900 hover:bg-slate-50"
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className={`inline-block transition-transform ${open ? 'rotate-90' : ''}`}
        >
          ›
        </span>
      </button>
      {open && (
        <div id={id} className="border-t border-slate-200 px-4 py-4">
          {children}
        </div>
      )}
    </div>
  );
}
