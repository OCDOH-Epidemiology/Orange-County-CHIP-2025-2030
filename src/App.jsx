import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/index.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SkipLink from './components/SkipLink.jsx';
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
 * 
 * The LanguageProvider manages language state and updates <html lang> for WCAG 3.1.1.
 */
export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <SkipLink />
        <div className="min-h-screen flex flex-col">
          <Header meta={chipData.meta} />
          <main id="main" className="flex-1 focus:outline-none" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Landing data={chipData} />} />
              <Route path="/priority/:id" element={<PriorityArea data={chipData} />} />
              <Route path="/timeline" element={<Timeline data={chipData} />} />
              <Route path="/partners" element={<Partners data={chipData} />} />
              <Route path="/methodology" element={<DataMethodology data={chipData} />} />
              <Route path="/get-involved" element={<GetInvolved data={chipData} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer meta={chipData.meta} />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}
