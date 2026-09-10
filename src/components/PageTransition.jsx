import { useLocation } from 'react-router-dom';

/**
 * Wrapper that applies a fade+slide entrance animation when the route changes.
 *
 * How it works:
 * - The `key` prop is set to the current pathname, so React unmounts and
 *   remounts the wrapper on every navigation.
 * - On mount, the CSS `animate-page-enter` class plays a short animation
 *   (fade + upward settle, ~300ms).
 * - For users who prefer reduced motion, the CSS media query in index.css
 *   collapses all animation durations to near-zero.
 *
 * Usage in App.jsx:
 *   <PageTransition>
 *     <Routes>...</Routes>
 *   </PageTransition>
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-page-enter">
      {children}
    </div>
  );
}
