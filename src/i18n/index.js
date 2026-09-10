/**
 * i18n module for the CHIP Dashboard.
 * 
 * Provides bilingual support (English + Spanish) with architecture
 * ready for additional languages.
 * 
 * QUICK START:
 * 
 * 1. Wrap your app with LanguageProvider:
 *    import { LanguageProvider } from './i18n';
 *    <LanguageProvider><App /></LanguageProvider>
 * 
 * 2. Use translations in components:
 *    import { useTranslation } from './i18n';
 *    const { t } = useTranslation();
 *    <h1>{t('landing.title')}</h1>
 * 
 * 3. For dynamic data (chip-data.json):
 *    import { useContent } from './i18n';
 *    const { translatePriority } = useContent();
 *    <p>{translatePriority(priority.id, 'goal', priority.goal)}</p>
 * 
 * 4. Access language controls:
 *    import { useLanguage } from './i18n';
 *    const { language, setLanguage, toggleLanguage } = useLanguage();
 */

export { LanguageProvider, useLanguage } from './LanguageContext.jsx';
export { useTranslation, useDateFormat } from './useTranslation.js';
export { useContent } from './useContent.js';

// Re-export content translations for direct access if needed
export { 
  contentTranslations, 
  getContentTranslation, 
  getMilestoneTranslation 
} from './content/priorityAreas.js';
