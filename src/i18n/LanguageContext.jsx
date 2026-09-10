import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'chip-dashboard-language';
const SUPPORTED_LANGUAGES = ['en', 'es'];
const DEFAULT_LANGUAGE = 'en';

const LanguageContext = createContext(null);

/**
 * Detect the user's preferred language from localStorage or browser settings.
 * Falls back to English if no supported language is found.
 */
function getInitialLanguage() {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }

  // Check browser language preferences
  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const primary = lang.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(primary)) {
      return primary;
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Language provider that manages the current language state.
 * Persists preference in localStorage and updates <html lang> attribute.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  // Update <html lang> attribute when language changes (WCAG 3.1.1)
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((newLang) => {
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      localStorage.setItem(STORAGE_KEY, newLang);
      setLanguageState(newLang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  }, [language, setLanguage]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isSpanish: language === 'es',
    isEnglish: language === 'en',
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access the language context.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
