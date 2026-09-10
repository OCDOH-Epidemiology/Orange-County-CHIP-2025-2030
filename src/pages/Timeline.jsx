import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { formatLongDate, milestoneStatusLabel } from '../lib/format.js';

/**
 * Cross-cutting timeline: every milestone from all priority areas, grouped by
 * calendar year. Colored dots identify which priority area each item belongs
 * to. Scroll-driven storytelling animations reveal milestones as users scroll.
 */
const PALETTE = {
  0: { dot: 'bg-brand-blue', text: 'text-brand-blue', border: 'border-brand-blue' },
  1: { dot: 'bg-brand-green', text: 'text-brand-green', border: 'border-brand-green' },
  2: { dot: 'bg-amber-600', text: 'text-amber-700', border: 'border-amber-600' },
  3: { dot: 'bg-purple-600', text: 'text-purple-700', border: 'border-purple-600' },
  4: { dot: 'bg-rose-600', text: 'text-rose-700', border: 'border-rose-600' },
};

/**
 * Hook to detect reduced motion preference.
 */
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for scroll-triggered reveal animations.
 */
function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(element);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  return { ref, isVisible };
}

/**
 * Individual milestone item with scroll-reveal animation.
 */
function MilestoneItem({ id, priority, milestone, colorIdx, revealIndex }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const c = PALETTE[colorIdx];

  return (
    <li
      ref={ref}
      className={`pl-8 pr-2 py-3 relative timeline-milestone ${isVisible ? 'is-visible' : ''}`}
      style={{ '--reveal-delay': revealIndex }}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-4 inline-block w-5 h-5 rounded-full ${c.dot} ring-4 ring-slate-50 timeline-dot ${isVisible ? 'is-visible' : ''}`}
        style={{ '--reveal-delay': revealIndex }}
      />
      <div className="flex flex-wrap items-baseline gap-x-3 text-sm">
        <span className="font-semibold text-slate-900">
          {formatLongDate(milestone.targetDate)}
        </span>
        <Link
          to={`/priority/${priority.id}`}
          className={`text-xs font-semibold uppercase tracking-wide ${c.text} hover:underline`}
        >
          {priority.priority}
        </Link>
        <span className="text-xs text-slate-500">
          {milestoneStatusLabel(milestone.status)}
        </span>
      </div>
      <p className="mt-1 text-slate-800">{milestone.description}</p>
    </li>
  );
}

/**
 * Year section with chapter title animation.
 */
function YearSection({ year, items, isActive, sectionRef }) {
  return (
    <section ref={sectionRef} aria-labelledby={`year-${year}`}>
      <h2
        id={`year-${year}`}
        className={`year-chapter text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 sticky top-0 bg-slate-50/95 backdrop-blur z-10 ${isActive ? 'is-active' : ''}`}
      >
        <span className="year-chapter-text inline-block">{year}</span>
      </h2>
      <ol className="mt-4 relative timeline-rail">
        {items.map(({ id, priority, milestone, colorIdx }, itemIndex) => (
          <MilestoneItem
            key={id}
            id={id}
            priority={priority}
            milestone={milestone}
            colorIdx={colorIdx}
            revealIndex={itemIndex}
          />
        ))}
      </ol>
    </section>
  );
}

/**
 * Floating scroll progress indicator with year ticks.
 */
function ScrollProgressIndicator({ years, activeYear, progress, onYearClick }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <nav
      aria-label="Timeline progress"
      className={`scroll-progress-container ${progress > 0.05 ? 'is-visible' : ''}`}
    >
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearClick(year)}
          className={`scroll-progress-year ${activeYear === year ? 'is-active' : ''}`}
          aria-label={`Jump to ${year}`}
          aria-current={activeYear === year ? 'true' : undefined}
        >
          {year}
        </button>
      ))}
      <div className="scroll-progress-track" aria-hidden="true">
        <div
          className="scroll-progress-fill"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </nav>
  );
}

export default function Timeline({ data }) {
  const priorityIndex = new Map(data.priorityAreas.map((p, i) => [p.id, i]));
  const containerRef = useRef(null);
  const yearRefsMap = useRef(new Map());
  const [activeYear, setActiveYear] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const items = data.priorityAreas.flatMap((p) =>
    p.milestones.map((m) => ({
      id: `${p.id}::${m.id}`,
      priority: p,
      milestone: m,
      colorIdx: priorityIndex.get(p.id) % Object.keys(PALETTE).length,
    }))
  );
  items.sort((a, b) => a.milestone.targetDate.localeCompare(b.milestone.targetDate));

  const byYear = new Map();
  for (const item of items) {
    const year = item.milestone.targetDate.slice(0, 4);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(item);
  }

  const years = Array.from(byYear.keys()).sort();

  // Track active year and scroll progress
  useEffect(() => {
    if (prefersReducedMotion) return;

    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '-20% 0px -50% 0px',
    };

    const ratios = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const year = entry.target.dataset.year;
        if (year) ratios.set(year, entry.intersectionRatio);
      });

      let maxRatio = 0;
      let mostVisible = null;
      ratios.forEach((ratio, year) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisible = year;
        }
      });

      if (mostVisible && maxRatio > 0.1) {
        setActiveYear(mostVisible);
      }
    }, observerOptions);

    yearRefsMap.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [years, prefersReducedMotion]);

  // Track scroll progress
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDistance = rect.height + windowHeight;
      const scrolled = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(scrolled / totalDistance, 1));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const getYearRef = useCallback((year) => (el) => {
    if (el) {
      yearRefsMap.current.set(year, el);
      el.dataset.year = year;
    }
  }, []);

  const handleYearClick = useCallback((year) => {
    const el = yearRefsMap.current.get(year);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Overview', to: '/' }, { label: 'Timeline' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Timeline: 2026 – 2030</h1>
      <p className="mt-2 text-slate-700 max-w-3xl">
        Every milestone across the three Community Health Improvement Plan
        priority areas, in the order it is scheduled to be completed. Colored
        dots identify which priority area a milestone belongs to.
      </p>

      <ul aria-label="Priority area legend" className="mt-6 flex flex-wrap gap-4">
        {data.priorityAreas.map((p, i) => {
          const c = PALETTE[i % Object.keys(PALETTE).length];
          return (
            <li key={p.id} className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${c.dot}`} aria-hidden="true" />
              <Link to={`/priority/${p.id}`} className={`text-sm font-medium ${c.text} hover:underline`}>
                {p.priority}
              </Link>
            </li>
          );
        })}
      </ul>

      <div ref={containerRef} className="mt-8 space-y-8">
        {years.map((year) => (
          <YearSection
            key={year}
            year={year}
            items={byYear.get(year)}
            isActive={activeYear === year}
            sectionRef={getYearRef(year)}
          />
        ))}
      </div>

      <ScrollProgressIndicator
        years={years}
        activeYear={activeYear}
        progress={scrollProgress}
        onYearClick={handleYearClick}
      />
    </div>
  );
}
