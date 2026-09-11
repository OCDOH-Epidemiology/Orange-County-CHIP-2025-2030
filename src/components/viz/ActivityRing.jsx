import { useEffect, useState, useId } from 'react';

/**
 * ActivityRing — donut/ring chart with percentage in the center.
 * Visual indicator of activity progress (milestone-based).
 * 
 * Props:
 * - percent: 0–100 number
 * - size: diameter in pixels (default 120)
 * - strokeWidth: ring thickness (default 12)
 * - label: accessible label for the chart
 * - color: "blue" | "green" | "slate" (default "blue")
 * - animate: enable entrance animation (default true, respects prefers-reduced-motion)
 * - showPercent: show % value in center (default true)
 * - className: additional CSS classes
 */
export default function ActivityRing({
  percent = 0,
  size = 120,
  strokeWidth = 12,
  label = 'Activity progress',
  color = 'blue',
  animate = true,
  showPercent = true,
  className = '',
}) {
  const uniqueId = useId();
  const titleId = `ring-title-${uniqueId}`;
  const descId = `ring-desc-${uniqueId}`;

  // Clamp percent to 0–100
  const pct = Math.max(0, Math.min(100, percent));
  const roundedPct = Math.round(pct);

  // SVG circle math
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  // Animation state
  const [displayOffset, setDisplayOffset] = useState(animate ? circumference : offset);

  useEffect(() => {
    if (!animate) {
      setDisplayOffset(offset);
      return;
    }
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayOffset(offset);
      return;
    }
    // Trigger animation after mount
    const timer = setTimeout(() => setDisplayOffset(offset), 50);
    return () => clearTimeout(timer);
  }, [offset, animate]);

  // Color mapping to brand colors
  const colors = {
    blue: {
      track: '#E2E8F0',      // slate-200
      fill: '#1B4B8A',        // brand-blue
      text: 'text-brand-blue',
    },
    green: {
      track: '#E2E8F0',
      fill: '#2F855A',        // brand-green
      text: 'text-brand-green',
    },
    slate: {
      track: '#E2E8F0',
      fill: '#64748B',        // slate-500
      text: 'text-slate-600',
    },
  };

  const c = colors[color] || colors.blue;

  // Pattern ID for accessibility (stripe pattern for colorblind users)
  const patternId = `ring-pattern-${uniqueId}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      role="figure"
      aria-labelledby={titleId}
      aria-describedby={descId}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="activity-ring-svg transform -rotate-90"
        aria-hidden="true"
      >
        <title id={titleId}>{label}</title>
        <desc id={descId}>{`${roundedPct}% complete`}</desc>

        {/* Stripe pattern for accessibility */}
        <defs>
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
          >
            <rect width="2" height="4" fill={c.fill} />
          </pattern>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={c.track}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={c.fill}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={displayOffset}
          className="activity-ring-progress transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>

      {/* Screen reader text */}
      <span className="sr-only">
        {label}: {roundedPct}% complete
      </span>
    </div>
  );
}

/**
 * Compact variant for smaller spaces (cards, inline).
 */
export function ActivityRingCompact({
  percent = 0,
  size = 56,
  strokeWidth = 6,
  label = 'Activity progress',
  color = 'blue',
  className = '',
}) {
  return (
    <ActivityRing
      percent={percent}
      size={size}
      strokeWidth={strokeWidth}
      label={label}
      color={color}
      className={className}
    />
  );
}

/**
 * Mini variant for inline use (very small).
 */
export function ActivityRingMini({
  percent = 0,
  size = 32,
  strokeWidth = 4,
  label = 'Activity progress',
  color = 'blue',
  className = '',
}) {
  return (
    <ActivityRing
      percent={percent}
      size={size}
      strokeWidth={strokeWidth}
      label={label}
      color={color}
      className={className}
    />
  );
}
