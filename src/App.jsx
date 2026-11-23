import { useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { track } from './lib/analytics.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';
import Landing from './pages/Landing.jsx';
import PriorityArea from './pages/PriorityArea.jsx';
import Timeline from './pages/Timeline.jsx';
import Partners from './pages/Partners.jsx';
import DataMethodology from './pages/DataMethodology.jsx';
import GetInvolved from './pages/GetInvolved.jsx';
import chipData from './data/chip-data.json';

/**
 * Top-level app.
 *
 * We use HashRouter (not BrowserRouter) so refreshes and deep links work on
 * GitHub Pages without server-side rewrite rules. URLs look like
 *   https://<user>.github.io/<repo>/#/priority/nutrition-security
 */

function RouteAnalytics() {
  const location = useLocation();
  const isFirst = useRef(true);
  useEffect(() => {
    // The head snippet already captures the first pageview.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    track("$pageview", { $pathname: location.pathname || "/" });
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <RouteAnalytics />
      <a href="#main" className="skip-link">Skip to main content</a>
      <div className="min-h-screen flex flex-col">
        <Header meta={chipData.meta} />
        <main id="main" className="flex-1 focus:outline-none" tabIndex={-1}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Landing data={chipData} />} />
              <Route path="/priority/:id" element={<PriorityArea data={chipData} />} />
              <Route path="/timeline" element={<Timeline data={chipData} />} />
              <Route path="/partners" element={<Partners data={chipData} />} />
              <Route path="/methodology" element={<DataMethodology data={chipData} />} />
              <Route path="/get-involved" element={<GetInvolved data={chipData} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer meta={chipData.meta} />
      </div>
    </HashRouter>
  );
}
