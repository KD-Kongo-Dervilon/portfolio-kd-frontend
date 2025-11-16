// src/components/AnalyticsTracker.jsx - FIXED ESLINT
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

const getSectionFromLocation = (location) => {
  if (!location) return 'home';
  const hash = (location.hash || '').replace('#', '').trim();
  if (hash) return hash;
  const path = (location.pathname || '').replace('/', '');
  return path || 'home';
};

/**
 * Composant de tracking automatique pour toutes les interactions
 */
const AnalyticsTracker = ({ analyticsEnabled }) => {
  const location = useLocation();
  const startTime = useRef(Date.now());
  const currentSection = useRef(null);

  // Tracker les changements de page/section
  useEffect(() => {
    if (!analyticsEnabled) return;

    const section = getSectionFromLocation(location);
    
    if (currentSection.current && currentSection.current !== section) {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      if (timeSpent > 0) {
        trackEvent('Section', 'Time Spent', currentSection.current, analyticsEnabled, {
          type: 'section_duration',
          section: currentSection.current,
          duration: timeSpent,
        });
      }
    }

    trackEvent('Section', 'View', section, analyticsEnabled, {
      type: 'section_view',
      section,
      path: location.pathname || '/',
    });
    currentSection.current = section;
    startTime.current = Date.now();

  }, [location, analyticsEnabled]); // ✅ location est maintenant dans les dépendances

  // Tracker les clics sur tout le document
  useEffect(() => {
    if (!analyticsEnabled) return;

    const handleClick = (e) => {
      const target = e.target;
      const section = getSectionFromLocation(location);
      
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.closest('a');
        trackEvent('Click', 'Link', link.href, analyticsEnabled, {
          type: 'click_link',
          href: link.href,
          section,
          text: (link.textContent || '').trim() || link.getAttribute('aria-label') || null,
        });
      }

      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.closest('button');
        const buttonText = button.textContent || button.getAttribute('aria-label') || 'Unknown';
        trackEvent('Click', 'Button', buttonText, analyticsEnabled, {
          type: 'click_button',
          section,
          label: buttonText,
        });
      }

      if (target.closest('[data-project-id]')) {
        const projectId = target.closest('[data-project-id]').getAttribute('data-project-id');
        trackEvent('Project', 'View', projectId, analyticsEnabled, {
          type: 'project_view',
          section,
          projectId,
        });
      }

      if (target.closest('[data-skill]')) {
        const skill = target.closest('[data-skill]').getAttribute('data-skill');
        trackEvent('Skill', 'View', skill, analyticsEnabled, {
          type: 'skill_view',
          section,
          skill,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [analyticsEnabled, location]); // ✅ location ajouté

  // Tracker le scroll
  useEffect(() => {
    if (!analyticsEnabled) return;

    let scrollDepth = 0;
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const currentDepth = Math.floor(((scrollTop + windowHeight) / documentHeight) * 100);

      if (currentDepth >= scrollDepth + 25 && currentDepth <= 100) {
        scrollDepth = Math.floor(currentDepth / 25) * 25;
        const section = getSectionFromLocation(location);
        trackEvent('Scroll', 'Depth', `${scrollDepth}%`, analyticsEnabled, {
          type: 'scroll_depth',
          section,
          depth: scrollDepth,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [analyticsEnabled, location]); // ✅ location ajouté

  // Tracker le temps total sur le site
  useEffect(() => {
    if (!analyticsEnabled) return;

    const sessionStart = Date.now();

    const trackSessionEnd = () => {
      const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
      if (sessionDuration > 0) {
        trackEvent('Session', 'Duration', `${sessionDuration}s`, analyticsEnabled, {
          type: 'session_duration',
          duration: sessionDuration,
        });
      }
    };

    window.addEventListener('beforeunload', trackSessionEnd);
    return () => window.removeEventListener('beforeunload', trackSessionEnd);
  }, [analyticsEnabled]);

  return null;
};

export default AnalyticsTracker;