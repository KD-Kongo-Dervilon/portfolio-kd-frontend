// src/App.jsx - VERSION OPTIMISÉE avec gestion du scroll + HomePage mémoïsée + Analytics
import React, { lazy, Suspense, useEffect, memo, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { HelmetProvider } from 'react-helmet-async';
import theme from './theme';

// Core components (non-lazy)
import Loader from './components/Loader';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import SEO from './components/SEO';
import AnalyticsTracker from './components/AnalyticsTracker';

// Lazy-loaded components
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const CaseStudies = lazy(() => import('./components/CaseStudies'));
const ROICalculator = lazy(() => import('./components/ROICalculator'));
const ExpertiseQuiz = lazy(() => import('./components/ExpertiseQuiz'));
const Contact = lazy(() => import('./components/Contact'));
const ChatbotIA = lazy(() => import('./components/ChatbotIA'));
const SmartCTA = lazy(() => import('./components/SmartCTA'));
const Achievements = lazy(() => import('./components/Achievements'));
const VideoIntro = lazy(() => import('./components/VideoIntro'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const Blog = lazy(() => import('./components/Blog'));
const BlogArticle = lazy(() => import('./components/BlogArticle'));
const Privacy = lazy(() => import('./pages/Privacy'));

// 🆕 Page service automatisation IA & n8n
const ServicesAutomationN8n = lazy(() =>
  import('./components/ServicesAutomationN8n')
);

// 🔐 Clé de stockage partagée avec CookieConsent.jsx et Privacy.jsx
const STORAGE_KEY = 'kd-cookie-consent-v1';

const getInitialConsent = () => {
  if (typeof window === 'undefined') {
    return {
      necessary: true,
      analytics: false,
      marketing: true, // ✅ performance / marketing activé par défaut
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          necessary: true,
          analytics: false,
          marketing: true, // ✅ par défaut si rien en storage
        };
  } catch {
    return {
      necessary: true,
      analytics: false,
      marketing: true,
    };
  }
};

// Page Home (mémoïsée pour éviter les recréations inutiles)
const HomePage = memo(function HomePage() {
  return (
    <>
      <Hero />
      <VideoIntro />
      <About />
      <Achievements />
      <Skills />
      <CaseStudies />
      <Portfolio />
      <ExpertiseQuiz />
      <ROICalculator />
      <Contact />
      <CookieConsent />
      <ChatbotIA />
      <SmartCTA />
    </>
  );
});

function App() {
  const location = useLocation();

  // 🔐 Consentement cookies global (partagé avec AnalyticsTracker)
  const [cookieConsent, setCookieConsent] = useState(() => getInitialConsent());

  // 🎧 Écouter les mises à jour du consentement (depuis Privacy / CookieConsent)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleConsentUpdate = () => {
      setCookieConsent(getInitialConsent());
    };

    window.addEventListener('kd-cookie-consent-updated', handleConsentUpdate);
    window.addEventListener('storage', handleConsentUpdate);

    return () => {
      window.removeEventListener('kd-cookie-consent-updated', handleConsentUpdate);
      window.removeEventListener('storage', handleConsentUpdate);
    };
  }, []);

  // ✅ Gestion intelligente du scroll
  useEffect(() => {
    // Si changement de pathname (pas juste le hash)
    if (location.pathname !== '/') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    // Si on est sur home avec un hash (#section)
    else if (location.hash) {
      const timeoutId = setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;
          element.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    // Page home sans hash: rester en haut SANS forcer si déjà en haut
    else if (window.scrollY > 100) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location]);

  // 🔍 Analytics activés si cookies de performance / marketing = true
  const analyticsEnabled = cookieConsent?.marketing === true;

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SEO />

        {/* 🧠 Tracking global des interactions (respecte le consentement) */}
        <AnalyticsTracker analyticsEnabled={analyticsEnabled} />

        <Navigation />

        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />

            {/* 🆕 Service : automatisation IA & n8n */}
            <Route
              path="/services/automatisation-ia-n8n"
              element={<ServicesAutomationN8n />}
            />

            {/* Privacy */}
            <Route path="/privacy" element={<Privacy />} />

            {/* Admin */}
            <Route path="/admin" element={<AnalyticsDashboard />} />

            {/* 404 - Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>

        <Footer />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;