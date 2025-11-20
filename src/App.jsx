// src/App.jsx - VERSION OPTIMISÉE avec gestion du scroll + HomePage mémoïsée + Analytics + thèmes persistants
import React, {
  lazy,
  Suspense,
  useEffect,
  memo,
  useState,
  useMemo
} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Link as MuiLink } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import baseTheme, { getThemeByKey } from './theme';

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

// 🆕 Clé de stockage pour le thème choisi
const THEME_STORAGE_KEY = 'kd-theme-key-v1';

const getInitialConsent = () => {
  if (typeof window === 'undefined') {
    return {
      necessary: true,
      analytics: false,
      marketing: true
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          necessary: true,
          analytics: false,
          marketing: true
        };
  } catch {
    return {
      necessary: true,
      analytics: false,
      marketing: true
    };
  }
};

// 🆕 Lecture du thème initial depuis localStorage
const getInitialThemeKey = () => {
  if (typeof window === 'undefined') return 'default';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored || 'default';
  } catch {
    return 'default';
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

  // 🆕 Thème global choisi (persisté)
  const [themeKey, setThemeKey] = useState(() => getInitialThemeKey());

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

  // 🆕 Écouter les changements de thème (Navigation, agent IA, etc.)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleThemeChange = (event) => {
      const next = event.detail?.theme;
      if (typeof next === 'string') {
        setThemeKey((current) => (current === next ? current : next));
      }
    };

    window.addEventListener('kd-theme-change', handleThemeChange);
    return () => {
      window.removeEventListener('kd-theme-change', handleThemeChange);
    };
  }, []);

  // 🆕 Persister le thème et notifier le reste de l’app
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeKey);
    } catch {
      // ignore
    }

    // On rebroadcaste l’info pour les composants qui écoutent kd-theme-change
    window.dispatchEvent(
      new CustomEvent('kd-theme-change', {
        detail: { theme: themeKey }
      })
    );
  }, [themeKey]);

  // 🆕 Thème MUI actif dérivé de la clé (default, noel, nouvel-an, halloween, rentree, paques…)
  const activeTheme = useMemo(
    () => getThemeByKey(themeKey) || baseTheme,
    [themeKey]
  );

  // ✅ Gestion intelligente du scroll
  useEffect(() => {
    if (location.pathname !== '/') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else if (location.hash) {
      const timeoutId = setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;
          element.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (window.scrollY > 100) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location]);

  // 🔍 Analytics activés si cookies de performance / marketing = true
  const analyticsEnabled = cookieConsent?.marketing === true;

  return (
    <>
      {/* 🔗 Skip link global le plus haut possible dans le DOM */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 2000
        }}
      >
        <MuiLink
          href="#main-content"
          underline="none"
          sx={{
            position: 'absolute',
            left: '-999px',
            top: 8,
            px: 2,
            py: 1,
            bgcolor: 'background.paper',
            color: 'primary.main',
            borderRadius: 1,
            border: '2px solid',
            borderColor: 'primary.main',
            fontWeight: 600,
            textDecoration: 'none',
            transform: 'translateY(-150%)',
            transition: 'transform 0.2s ease, left 0.2s ease',
            '&:focus-visible': {
              left: 8,
              transform: 'translateY(0)'
            }
          }}
        >
          Aller directement au contenu principal
        </MuiLink>
      </Box>

      <HelmetProvider>
        {/* 🆕 ThemeProvider utilise maintenant le thème actif (persistant) */}
        <ThemeProvider theme={activeTheme}>
          <CssBaseline />
          <SEO />

          {/* 🧠 Tracking global des interactions (respecte le consentement) */}
          <AnalyticsTracker analyticsEnabled={analyticsEnabled} />

          <Navigation />

          {/* 🧱 Main unique pour toute l’app */}
          <Box component="main" id="main-content">
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
          </Box>

          <Footer />
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}

export default App;