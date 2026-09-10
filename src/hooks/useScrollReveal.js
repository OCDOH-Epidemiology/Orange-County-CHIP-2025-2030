import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for scroll-triggered reveal animations using IntersectionObserver.
 * 
 * @param {Object} options
 * @param {number} [options.threshold=0.15] - Visibility threshold (0-1) before triggering
 * @param {string} [options.rootMargin='0px 0px -50px 0px'] - Margin around root
 * @param {boolean} [options.once=true] - Only trigger once (default), or re-trigger on scroll
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // If reduced motion, show content immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * Hook for tracking which year section is currently active (in view).
 * Uses IntersectionObserver with multiple thresholds for smooth transitions.
 * 
 * @param {string[]} years - Array of year strings to track
 * @returns {{ activeYear: string|null, yearRefs: Map<string, React.RefCallback> }}
 */
export function useActiveYearTracker(years) {
  const [activeYear, setActiveYear] = useState(null);
  const elementsRef = useRef(new Map());
  const observerRef = useRef(null);

  // Track visibility ratios for each year
  const ratiosRef = useRef(new Map());

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Create observer for year sections
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const year = entry.target.dataset.year;
          if (year) {
            ratiosRef.current.set(year, entry.intersectionRatio);
          }
        });

        // Find the year with highest visibility ratio
        let maxRatio = 0;
        let mostVisible = null;
        ratiosRef.current.forEach((ratio, year) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisible = year;
          }
        });

        if (mostVisible && maxRatio > 0.1) {
          setActiveYear(mostVisible);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '-10% 0px -40% 0px',
      }
    );

    // Observe all registered elements
    elementsRef.current.forEach((el) => {
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [years]);

  // Create ref callback for each year
  const getYearRef = useCallback((year) => {
    return (el) => {
      if (el) {
        elementsRef.current.set(year, el);
        el.dataset.year = year;
        if (observerRef.current) {
          observerRef.current.observe(el);
        }
      }
    };
  }, []);

  return { activeYear, getYearRef };
}

/**
 * Hook for tracking scroll progress through the timeline.
 * Returns a value from 0 to 1 representing progress through the container.
 * 
 * @param {React.RefObject} containerRef - Ref to the scrollable container
 * @returns {number} Progress value from 0 to 1
 */
export function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef?.current;

    const handleScroll = () => {
      if (!container) {
        // Fall back to document scroll
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
        return;
      }

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far through the container we've scrolled
      const containerTop = rect.top;
      const containerHeight = rect.height;
      
      // Progress is 0 when container top is at window bottom, 1 when container bottom is at window top
      const totalScrollDistance = containerHeight + windowHeight;
      const scrolled = windowHeight - containerTop;
      const prog = Math.max(0, Math.min(scrolled / totalScrollDistance, 1));
      
      setProgress(prog);
    };

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial calculation
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  return progress;
}
