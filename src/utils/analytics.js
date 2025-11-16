// src/utils/analytics.js
// Système d'analytics pour tracking du comportement utilisateur

const CONSENT_STORAGE_KEY = 'cookie-consent-v2';
const ANALYTICS_STORAGE_KEY = 'analytics_events';

const defaultConsent = {
  necessary: true,
  analytics: true,
  marketing: true,
};

export const getConsentPrefs = () => {
  if (typeof window === 'undefined') return defaultConsent;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return { ...defaultConsent };
    }

    const parsed = JSON.parse(raw) || {};

    return {
      necessary: true,
      analytics:
        typeof parsed.analytics === 'boolean'
          ? parsed.analytics
          : defaultConsent.analytics,
      marketing:
        typeof parsed.marketing === 'boolean'
          ? parsed.marketing
          : defaultConsent.marketing,
    };
  } catch {
    return { ...defaultConsent };
  }
};

export const hasConsent = (type) => {
  const prefs = getConsentPrefs();

  switch (type) {
    case 'necessary':
      return true;
    case 'analytics':
      return !!prefs.analytics;
    case 'marketing':
      return !!prefs.marketing;
    default:
      return false;
  }
};

export const generateSessionId = () => {
  if (typeof window === 'undefined') {
    return 'server_session';
  }

  const existingSession = sessionStorage.getItem('sessionId');
  if (existingSession) return existingSession;

  const sessionId =
    'session_' +
    Date.now() +
    '_' +
    Math.random().toString(36).substr(2, 9);

  sessionStorage.setItem('sessionId', sessionId);
  sessionStorage.setItem('sessionStartTime', new Date().toISOString());
  return sessionId;
};

export const trackEvent = (
  category,
  action,
  label = '',
  analyticsEnabledOrMeta = true,
  maybeMetadata
) => {
  if (typeof window === 'undefined') return;

  let analyticsEnabled = true;
  let metadata = {};

  if (typeof analyticsEnabledOrMeta === 'boolean') {
    analyticsEnabled = analyticsEnabledOrMeta;
    if (maybeMetadata && typeof maybeMetadata === 'object') {
      metadata = maybeMetadata;
    }
  } else if (
    typeof analyticsEnabledOrMeta === 'object' &&
    analyticsEnabledOrMeta !== null
  ) {
    metadata = analyticsEnabledOrMeta;
  }

  if (!analyticsEnabled) return;

  const isAnalyticsEvent =
    ['Section', 'Click', 'Scroll', 'Session', 'Project', 'Skill', 'CTA'].includes(
      category
    ) || Boolean(metadata.type);

  const isMarketingEvent =
    metadata.type === 'marketing' ||
    metadata.type === 'personalization' ||
    metadata.type === 'performance';

  if (isAnalyticsEvent && !hasConsent('analytics')) {
    return;
  }
  if (isMarketingEvent && !hasConsent('marketing')) {
    return;
  }

  const now = new Date();
  const sessionId = generateSessionId();

  const eventData = {
    timestamp: now.toISOString(),
    category,
    action,
    label,
    sessionId,
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language || 'fr-FR',
    ...metadata,
  };

  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY) || '[]';
    let events = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) events = parsed;
    } catch {
      events = [];
    }

    events.push(eventData);
    const recentEvents = events.slice(-500);
    localStorage.setItem(
      ANALYTICS_STORAGE_KEY,
      JSON.stringify(recentEvents)
    );

    // eslint-disable-next-line no-console
    console.log('📊 Event tracked:', eventData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking event:', error);
  }
};

export const getAnalytics = () => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }

    const legacyRaw = localStorage.getItem('portfolioAnalytics');
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (Array.isArray(legacy)) return legacy;
    }

    return [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting analytics:', error);
    return [];
  }
};

const calculateSessionDuration = () => {
  if (typeof window === 'undefined') return 0;

  const startTime = sessionStorage.getItem('sessionStartTime');
  if (!startTime) return 0;

  const start = new Date(startTime);
  const now = new Date();
  const durationMs = now - start;
  return Math.floor(durationMs / 60000);
};

export const generateAnalyticsSummary = (events) => {
  const summary = {
    totalEvents: events.length,
    categories: {},
    mostViewedSections: {},
    ctaClicks: {},
    downloads: [],
    questionsAsked: [],
    hourlyDistribution: {},
    deviceInfo: {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    },
  };

  events.forEach((event) => {
    const {
      category,
      action,
      label,
      metadata = {},
      userAgent = '',
      timestamp,
    } = event;

    const catKey = category || 'Autre';
    summary.categories[catKey] =
      (summary.categories[catKey] || 0) + 1;

    if (category === 'Section' && action === 'View') {
      const sectionLabel =
        metadata.section ||
        label ||
        metadata.zone ||
        metadata.area ||
        'inconnue';
      summary.mostViewedSections[sectionLabel] =
        (summary.mostViewedSections[sectionLabel] || 0) + 1;
    }

    if (category === 'CTA' && action === 'Click') {
      summary.ctaClicks[label] =
        (summary.ctaClicks[label] || 0) + 1;
    }

    if (action === 'Download') {
      summary.downloads.push({
        item: label,
        timestamp: event.timestamp,
      });
    }

    if (category === 'Chatbot' && action === 'Question Asked') {
      summary.questionsAsked.push({
        question: label,
        timestamp: event.timestamp,
      });
    }

    if (timestamp) {
      const hour = new Date(timestamp).getHours();
      if (!Number.isNaN(hour)) {
        summary.hourlyDistribution[hour] =
          (summary.hourlyDistribution[hour] || 0) + 1;
      }
    }

    const ua = String(userAgent).toLowerCase();
    if (ua.includes('mobile')) {
      summary.deviceInfo.mobile++;
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      summary.deviceInfo.tablet++;
    } else {
      summary.deviceInfo.desktop++;
    }
  });

  return summary;
};

export const exportAnalytics = () => {
  if (typeof window === 'undefined') return null;

  const analytics = getAnalytics();

  const report = {
    exportDate: new Date().toISOString(),
    sessionId: sessionStorage.getItem('sessionId'),
    sessionDuration: calculateSessionDuration(),
    totalEvents: analytics.length,
    summary: generateAnalyticsSummary(analytics),
    events: analytics,
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `portfolio-analytics-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // eslint-disable-next-line no-console
  console.log('📥 Analytics exported:', report);
  return report;
};

export const clearAnalytics = () => {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    localStorage.removeItem('portfolioAnalytics');
    sessionStorage.removeItem('sessionId');
    sessionStorage.removeItem('sessionStartTime');
    // eslint-disable-next-line no-console
    console.log('🗑️ Analytics cleared');
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error clearing analytics:', error);
    return false;
  }
};

export const trackScroll = (sectionName) => {
  trackEvent('Section', 'View', sectionName, {
    type: 'section_view',
    section: sectionName,
  });
};

export const trackCTAClick = (ctaName) => {
  trackEvent('CTA', 'Click', ctaName, {
    type: 'click_cta',
    label: ctaName,
  });
};

export const trackDownload = (fileName) => {
  trackEvent('Download', 'File', fileName, {
    type: 'download',
    fileName,
  });
};

let sectionStartTime = null;
let currentSection = null;

export const startSectionTimer = (sectionName) => {
  if (currentSection) {
    endSectionTimer();
  }
  currentSection = sectionName;
  sectionStartTime = Date.now();
};

export const endSectionTimer = () => {
  if (currentSection && sectionStartTime) {
    const duration = Math.floor(
      (Date.now() - sectionStartTime) / 1000
    );
    trackEvent('Section', 'Time Spent', currentSection, {
      type: 'section_duration',
      section: currentSection,
      duration,
    });
    currentSection = null;
    sectionStartTime = null;
  }
};

export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  generateSessionId();

  if (!hasConsent('analytics')) {
    // eslint-disable-next-line no-console
    console.log('📊 Analytics désactivés par les préférences cookies.');
    return;
  }

  trackEvent('Session', 'Start', 'Page Load');

  window.addEventListener('beforeunload', () => {
    const duration = calculateSessionDuration();
    trackEvent('Session', 'End', 'Page Unload', {
      type: 'session_end',
      duration,
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackEvent('Session', 'Hidden', 'Tab Changed', {
        type: 'visibility_hidden',
      });
    } else {
      trackEvent('Session', 'Visible', 'Tab Focused', {
        type: 'visibility_visible',
      });
    }
  });

  // eslint-disable-next-line no-console
  console.log(
    '📊 Analytics initialized - Session:',
    sessionStorage.getItem('sessionId')
  );
};

export const getLiveStats = () => {
  const analytics = getAnalytics();
  const summary = generateAnalyticsSummary(analytics);

  return {
    currentSession:
      typeof window !== 'undefined'
        ? sessionStorage.getItem('sessionId')
        : null,
    sessionDuration: calculateSessionDuration(),
    eventsCount: analytics.length,
    topSections: Object.entries(summary.mostViewedSections)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    topCTAs: Object.entries(summary.ctaClicks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    questionsCount: summary.questionsAsked.length,
    deviceType: summary.deviceInfo,
  };
};

const analyticsApi = {
  initAnalytics,
  trackEvent,
  trackScroll,
  trackCTAClick,
  trackDownload,
  getAnalytics,
  exportAnalytics,
  clearAnalytics,
  getLiveStats,
  generateAnalyticsSummary,
  startSectionTimer,
  endSectionTimer,
  getConsentPrefs,
  hasConsent,
};

export default analyticsApi;