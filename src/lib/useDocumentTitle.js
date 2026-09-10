import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/index.js';

/**
 * Custom hook to update document title and manage focus on route changes.
 * 
 * WCAG 2.4.2 (Page Titled): Page titles must describe the page topic or purpose.
 * WCAG 2.4.3 (Focus Order): When a page loads, focus should move to a meaningful
 * location — in an SPA, this means managing focus on route transitions.
 *
 * @param {string} title - The page-specific title (will be appended to base title)
 */
export function useDocumentTitle(title) {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const { t, language } = useTranslation();

  useEffect(() => {
    const baseTitle = t('titles.baseTitle');
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    document.title = fullTitle;
  }, [title, t, language]);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      previousPath.current = location.pathname;

      const main = document.getElementById('main');
      if (main) {
        main.focus({ preventScroll: false });
      }
    }
  }, [location.pathname]);
}

/**
 * Hook that returns the translated base title for use in other contexts.
 */
export function useBaseTitle() {
  const { t } = useTranslation();
  return t('titles.baseTitle');
}
