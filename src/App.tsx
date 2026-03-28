import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { VotesPage } from './pages/VotesPage';

const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[#161b22] focus:px-4 focus:py-2 focus:text-[#58a6ff]"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex flex-1 flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<VotesPage />} />
            <Route path="/about" element={<Suspense fallback={null}><AboutPage /></Suspense>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
