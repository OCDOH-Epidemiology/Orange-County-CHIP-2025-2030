/**
 * Simple content section wrapper with a heading and consistent spacing.
 */
export default function Section({ title, subtitle, children, className = '', as: Tag = 'section' }) {
  return (
    <Tag className={`bg-white rounded-lg border border-slate-200 p-5 sm:p-6 ${className}`}>
      {title && (
        <header className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
        </header>
      )}
      {children}
    </Tag>
  );
}
