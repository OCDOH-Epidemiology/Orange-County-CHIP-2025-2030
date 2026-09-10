import { useLanguage } from '../i18n/index.js';
import { useTranslation } from '../i18n/index.js';

/**
 * Language switcher component.
 * 
 * Accessible, keyboard-friendly language toggle that:
 * - Announces the current language to assistive technology
 * - Shows labels in both languages for discoverability
 * - Works on mobile with appropriate touch targets
 * - Persists preference via the LanguageProvider
 * 
 * @param {Object} props
 * @param {'header' | 'footer'} props.variant - Visual style variant
 * @param {string} props.className - Additional CSS classes
 */
export default function LanguageSwitcher({ variant = 'header', className = '' }) {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const isSpanish = language === 'es';
  const targetLanguage = isSpanish ? 'English' : 'Español';
  const currentLanguageLabel = isSpanish ? 'Español' : 'English';

  const baseStyles = 'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  const variantStyles = {
    header: 'bg-white/10 hover:bg-white/20 text-white focus-visible:ring-white focus-visible:ring-offset-brand-blue',
    footer: 'bg-slate-800 hover:bg-slate-700 text-slate-200 focus-visible:ring-slate-400 focus-visible:ring-offset-slate-900',
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label={`${t('languageSwitcher.changeLanguage')}: ${targetLanguage}`}
      lang={isSpanish ? 'en' : 'es'}
    >
      <GlobeIcon className="w-4 h-4" aria-hidden="true" />
      <span className="sr-only">{t('languageSwitcher.currentLanguage')}. </span>
      <span aria-hidden="true">{targetLanguage}</span>
    </button>
  );
}

/**
 * Compact language switcher for mobile header.
 * Shows only the globe icon on small screens.
 */
export function LanguageSwitcherCompact({ className = '' }) {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const isSpanish = language === 'es';
  const targetLanguage = isSpanish ? 'English' : 'Español';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue ${className}`}
      aria-label={`${t('languageSwitcher.changeLanguage')}: ${targetLanguage}`}
      lang={isSpanish ? 'en' : 'es'}
    >
      <GlobeIcon className="w-5 h-5" aria-hidden="true" />
      <span className="ml-1 text-xs font-medium uppercase">
        {isSpanish ? 'EN' : 'ES'}
      </span>
    </button>
  );
}

function GlobeIcon({ className }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
