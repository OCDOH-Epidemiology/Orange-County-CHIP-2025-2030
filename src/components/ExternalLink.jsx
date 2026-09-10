import { useTranslation } from '../i18n/index.js';

/**
 * Accessible external link component.
 * 
 * When links open in a new tab/window, screen reader users should be informed.
 * This component adds a visually hidden translated announcement.
 * 
 * WCAG 2.4.4 (Link Purpose) and 3.2.5 (Change on Request) — users should know
 * when a link will open a new window before activating it.
 */
export default function ExternalLink({ href, children, className = '' }) {
  const { t } = useTranslation();
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only"> {t('common.opensInNewTab')}</span>
    </a>
  );
}
