import { useTranslation } from '../i18n/index.js';

/**
 * Skip to main content link for keyboard navigation.
 * Translated to match the current language setting.
 */
export default function SkipLink() {
  const { t } = useTranslation();
  
  return (
    <a href="#main" className="skip-link">
      {t('nav.skipToMain')}
    </a>
  );
}
