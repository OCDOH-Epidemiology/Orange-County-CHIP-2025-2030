import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { ActivityRingMini, StatusMixMini, ActivityRing, StatusMix } from '../components/viz/index.js';
import { 
  formatLongDate, 
  milestoneStatusLabel,
  calculateActivityProgress,
  calculatePlanActivityProgress,
  getMilestoneCounts,
  deriveActivityBadge,
  ACTIVITY_BADGE_STYLES 
} from '../lib/format.js';

/**
 * Cross-cutting timeline: every milestone from all priority areas, grouped by
 * priority area (not calendar year). Within each priority, milestones are
 * ordered chronologically. Scroll-driven storytelling animations reveal
 * milestones as users scroll through the narrative of each priority's journey.
 * 
 * Visual-first: Each priority chapter shows ActivityRingMini + StatusMixMini.
 */

const PALETTE = {
  0: { 
    dot: 'bg-brand-blue', 
    text: 'text-brand-blue', 
    border: 'border-brand-blue',
    bg: 'bg-brand-blue/5',
    gradient: 'from-brand-blue/10'
  },
  1: { 
    dot: 'bg-brand-green', 
    text: 'text-brand-green', 
    border: 'border-brand-green',
    bg: 'bg-brand-green/5',
    gradient: 'from-brand-green/10'
  },
  2: { 
    dot: 'bg-amber-600', 
    text: 'text-amber-700', 
    border: 'border-amber-600',
    bg: 'bg-amber-50',
    gradient: 'from-amber-100/50'
  },
  3: { 
    dot: 'bg-purple-600', 
    text: 'text-purple-700', 
    border: 'border-purple-600',
    bg: 'bg-purple-50',
    gradient: 'from-purple-100/50'
  },
  4: { 
    dot: 'bg-rose-600', 
    text: 'text-rose-700', 
    border: 'border-rose-600',
    bg: 'bg-rose-50',
    gradient: 'from-rose-100/50'
  },
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
 * Status badge for milestone items.
 */
function StatusBadge({ status }) {
  const styles = {
    complete: 'bg-green-100 text-green-800 border-green-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    not_started: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.not_started}`}>
      {milestoneStatusLabel(status)}
    </span>
  );
}

/**
 * Individual milestone item with scroll-reveal animation.
 */
function MilestoneItem({ milestone, colorIdx, revealIndex }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const c = PALETTE[colorIdx];

  return (
    <li
      ref={ref}
      className={`timeline-row pl-8 pr-2 py-4 relative timeline-milestone ${isVisible ? 'is-visible' : ''}`}
      style={{ '--reveal-delay': revealIndex }}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-5 inline-block w-5 h-5 rounded-full ${c.dot} ring-4 ring-slate-50 timeline-dot ${isVisible ? 'is-visible' : ''}`}
        style={{ '--reveal-delay': revealIndex }}
      />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold text-slate-900 text-sm">
          {formatLongDate(milestone.targetDate)}
        </span>
        <StatusBadge status={milestone.status} />
      </div>
      <p className="mt-2 text-slate-800">{milestone.description}</p>
      <p className="mt-1 text-xs text-slate-500">
        Data source: {milestone.dataSource} · Reporting: {milestone.frequency}
      </p>
    </li>
  );
}

/**
 * Priority section with chapter title and visual graphics.
 * Each priority area is a "chapter" in the scroll story.
 * NOW with ActivityRingMini and StatusMixMini for visual-first design.
 */
function PrioritySection({ priority, colorIdx, isActive, sectionRef }) {
  const c = PALETTE[colorIdx];
  const milestones = priority.milestones;
  const activityPct = calculateActivityProgress(milestones);
  const counts = getMilestoneCounts(milestones);
  const { badge, label } = deriveActivityBadge(priority);
  const badgeStyle = ACTIVITY_BADGE_STYLES[badge];
  
  return (
    <section 
      ref={sectionRef} 
      aria-labelledby={`priority-${priority.id}`}
      className="mb-12"
    >
      <div className={`priority-chapter rounded-lg p-4 -mx-4 transition-all duration-300 ${isActive ? c.bg : ''}`}>
        <div className="flex items-start gap-3">
          {/* Visual indicator: ActivityRingMini */}
          <div className="relative flex-shrink-0">
            <ActivityRingMini
              percent={activityPct}
              size={40}
              strokeWidth={5}
              label={`Activity progress for ${priority.priority}`}
              color={colorIdx === 0 ? 'blue' : colorIdx === 1 ? 'green' : 'slate'}
            />
            {/* Overlay with percentage */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span className={`text-[10px] font-bold ${c.text}`}>
                {Math.round(activityPct)}%
              </span>
            </div>
          </div>

          <div className="flex-1">
            {/* Title row */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Link 
                to={`/priority/${priority.id}`}
                id={`priority-${priority.id}`}
                className={`priority-chapter-title block text-lg font-bold hover:underline transition-colors ${isActive ? c.text : 'text-slate-900'}`}
              >
                {priority.priority}
              </Link>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                <span aria-hidden="true">{badgeStyle.icon}</span>
                {label}
              </span>
            </div>
            
            <p className="text-sm text-slate-600">{priority.domain}</p>
            
            {/* StatusMixMini */}
            <div className="mt-2 max-w-xs">
              <StatusMixMini
                complete={counts.complete}
                inProgress={counts.inProgress}
                notStarted={counts.notStarted}
              />
            </div>
          </div>
        </div>
      </div>
      
      <ol className="mt-4 ml-4 relative timeline-rail">
        {milestones.map((milestone, itemIndex) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            colorIdx={colorIdx}
            revealIndex={itemIndex}
          />
        ))}
      </ol>
      
      <div className="mt-4 ml-4 pl-8">
        <Link 
          to={`/priority/${priority.id}`}
          className={`text-sm font-medium ${c.text} hover:underline`}
        >
          View full {priority.priority} details →
        </Link>
      </div>
    </section>
  );
}

/**
 * Floating scroll progress indicator with priority ticks.
 */
function ScrollProgressIndicator({ priorities, activePriority, progress, onPriorityClick }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <nav
      aria-label="Timeline progress"
      className={`scroll-progress-container ${progress > 0.05 ? 'is-visible' : ''}`}
    >
      {priorities.map((p, idx) => {
        const c = PALETTE[idx % Object.keys(PALETTE).length];
        return (
          <button
            key={p.id}
            onClick={() => onPriorityClick(p.id)}
            className={`scroll-progress-priority group flex items-center gap-1.5 ${activePriority === p.id ? 'is-active' : ''}`}
            aria-label={`Jump to ${p.priority}`}
            aria-current={activePriority === p.id ? 'true' : undefined}
          >
            <span 
              className={`w-2 h-2 rounded-full ${c.dot} transition-transform group-hover:scale-125`}
              aria-hidden="true"
            />
            <span className="scroll-progress-label">{p.priority.split(' ')[0]}</span>
          </button>
        );
      })}
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
  const containerRef = useRef(null);
  const priorityRefsMap = useRef(new Map());
  const [activePriority, setActivePriority] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const priorities = data.priorityAreas;

  // Track active priority and scroll progress
  useEffect(() => {
    if (prefersReducedMotion) return;

    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '-20% 0px -50% 0px',
    };

    const ratios = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const priorityId = entry.target.dataset.priorityId;
        if (priorityId) ratios.set(priorityId, entry.intersectionRatio);
      });

      let maxRatio = 0;
      let mostVisible = null;
      ratios.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisible = id;
        }
      });

      if (mostVisible && maxRatio > 0.1) {
        setActivePriority(mostVisible);
      }
    }, observerOptions);

    priorityRefsMap.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [priorities, prefersReducedMotion]);

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

  const getPriorityRef = useCallback((priorityId) => (el) => {
    if (el) {
      priorityRefsMap.current.set(priorityId, el);
      el.dataset.priorityId = priorityId;
    }
  }, []);

  const handlePriorityClick = useCallback((priorityId) => {
    const el = priorityRefsMap.current.get(priorityId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Calculate milestone stats and activity progress
  const totalCounts = priorities.reduce(
    (acc, p) => {
      const counts = getMilestoneCounts(p.milestones);
      return {
        complete: acc.complete + counts.complete,
        inProgress: acc.inProgress + counts.inProgress,
        notStarted: acc.notStarted + counts.notStarted,
        total: acc.total + counts.total,
      };
    },
    { complete: 0, inProgress: 0, notStarted: 0, total: 0 }
  );
  
  // Plan-level activity progress (mean of area percents)
  const planActivityPct = calculatePlanActivityProgress(priorities);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Overview', to: '/' }, { label: 'Timeline' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Implementation Timeline</h1>
      <p className="mt-2 text-slate-700 max-w-2xl">
        Track progress across all {priorities.length} priority areas toward 2030 goals.
      </p>

      {/* Visual Progress Summary */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-brand-blueLight border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Activity Ring */}
          <div className="relative flex-shrink-0">
            <ActivityRing
              percent={planActivityPct}
              size={100}
              strokeWidth={10}
              label="Plan Activity Progress"
              color="blue"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="text-xl font-bold text-brand-blue">
                {Math.round(planActivityPct)}%
              </span>
            </div>
          </div>

          {/* Status details */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Plan Activity Progress
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              {totalCounts.complete + totalCounts.inProgress} of {totalCounts.total} milestones complete or underway
            </p>

            <StatusMix
              complete={totalCounts.complete}
              inProgress={totalCounts.inProgress}
              notStarted={totalCounts.notStarted}
              height={16}
              showLegend={true}
              compact={true}
            />
          </div>
        </div>
      </div>

      {/* Priority legend */}
      <ul aria-label="Priority area legend" className="mt-6 flex flex-wrap gap-4">
        {priorities.map((p, i) => {
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

      <div ref={containerRef} className="mt-8 space-y-4">
        {priorities.map((priority, idx) => (
          <PrioritySection
            key={priority.id}
            priority={priority}
            colorIdx={idx % Object.keys(PALETTE).length}
            isActive={activePriority === priority.id}
            sectionRef={getPriorityRef(priority.id)}
          />
        ))}
      </div>

      <ScrollProgressIndicator
        priorities={priorities}
        activePriority={activePriority}
        progress={scrollProgress}
        onPriorityClick={handlePriorityClick}
      />
    </div>
  );
}
