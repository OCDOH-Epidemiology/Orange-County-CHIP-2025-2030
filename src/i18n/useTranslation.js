import { useCallback } from 'react';
import { useLanguage } from './LanguageContext.jsx';
import en from './locales/en.js';
import es from './locales/es.js';

const locales = { en, es };

/**
 * Get a nested value from an object using a dot-notation path.
 * Returns undefined if any part of the path doesn't exist.
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined;
  }, obj);
}

/**
 * Interpolate template strings with values.
 * Supports {key} syntax: "Hello, {name}!" with {name: "World"} => "Hello, World!"
 */
function interpolate(template, values = {}) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? values[key] : match;
  });
}

/**
 * Custom hook for accessing translations.
 * 
 * Usage:
 *   const { t, locale, language } = useTranslation();
 *   t('nav.overview') // => "Overview" or "Resumen"
 *   t('partners.intro', { count: 42 }) // => "42 organizations are named..."
 */
export function useTranslation() {
  const { language } = useLanguage();
  const locale = locales[language] || locales.en;
  const fallbackLocale = locales.en;

  /**
   * Get a translated string by key path.
   * Falls back to English if the key doesn't exist in the current locale.
   * Falls back to the key itself if it doesn't exist in any locale.
   */
  const t = useCallback((key, values) => {
    let value = getNestedValue(locale, key);
    
    // Fall back to English if not found
    if (value === undefined) {
      value = getNestedValue(fallbackLocale, key);
    }
    
    // If still not found, return the key
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    // Interpolate values if provided
    return interpolate(value, values);
  }, [locale, fallbackLocale]);

  /**
   * Get an array of translated strings.
   */
  const tArray = useCallback((key) => {
    let value = getNestedValue(locale, key);
    if (!Array.isArray(value)) {
      value = getNestedValue(fallbackLocale, key);
    }
    return Array.isArray(value) ? value : [];
  }, [locale, fallbackLocale]);

  /**
   * Check if a key exists in the current locale or fallback.
   */
  const hasKey = useCallback((key) => {
    return getNestedValue(locale, key) !== undefined || 
           getNestedValue(fallbackLocale, key) !== undefined;
  }, [locale, fallbackLocale]);

  return {
    t,
    tArray,
    hasKey,
    locale,
    language,
    isSpanish: language === 'es',
    isEnglish: language === 'en',
  };
}

/**
 * Format a date according to the current locale.
 */
export function useDateFormat() {
  const { t, language } = useTranslation();
  const localeCode = t('dates.locale');

  const formatLongDate = useCallback((iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    
    const formatter = new Intl.DateTimeFormat(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    
    return formatter.format(new Date(Date.UTC(y, m - 1, d)));
  }, [localeCode]);

  const formatMonthYear = useCallback((iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    
    const formatter = new Intl.DateTimeFormat(localeCode, {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    });
    
    return formatter.format(new Date(Date.UTC(y, m - 1, d)));
  }, [localeCode]);

  return { formatLongDate, formatMonthYear };
}
