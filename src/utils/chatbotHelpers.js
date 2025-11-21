// src/utils/chatbotHelpers.js
// Helpers & constantes partagées pour le Chatbot IA du portfolio

import {
  ANALYTICS_MICRO_TRIGGERS,
  BOT_MESSAGES,
  BOT_RECRUITER,
  BUSINESS_USE_CASES,
  CHATBOT_NAME,
  RECRUITER_PITCH_30S
} from './chatbotConfig';

const BOT_DISPLAY_NAME = CHATBOT_NAME || 'Amara';

// --- Routes du portfolio (doivent correspondre à ton router React) ---
export const ROUTE_AUTOMATIONS = '/services/automatisation-ia-n8n';
export const ROUTE_BLOG = '/blog';
export const ROUTE_CV = '/cv';

// URL du CV (fichier statique dans /public ou équivalent)
export const CV_DOWNLOAD_URL = '/cv/dervilon-mbissi.pdf';

// Limite quotidienne & clé de stockage
export const CHATBOT_DAILY_LIMIT = 20;
export const CHATBOT_USAGE_KEY = 'kd_chatbot_usage_v1';

// Titre de l’en-tête du bot (affiché dans ChatbotIA.jsx)
export const BOT_HEADER_TITLE = `${BOT_DISPLAY_NAME} · Assistant IA`;

// Message d’accueil initial
export const initialBotMessage =
  (BOT_MESSAGES &&
    (BOT_MESSAGES.introduction ||
      BOT_MESSAGES.initial ||
      BOT_MESSAGES.welcome)) ||
  "Dervilon est Chef de Projet IA et Product Owner, spécialisé dans l'automatisation et l'optimisation des processus via des agents IA.";

// Questions suggérées affichées en bas du chatbot (utilisées dans ChatbotIA.jsx)
export const suggestedQuestions = [
  "Peux-tu me résumer le profil de Dervilon ?",
  "Quels sont ses projets IA préférés ?",
  'Parle-moi de Dervilon',
  'Comment il peut m’aider avec l’IA et les automatisations ?'
];

// Contexte envoyé à l’API `/api/chat` pour enrichir les réponses
export const profileContext = {
  botName: CHATBOT_NAME,
  recruiterPitch: RECRUITER_PITCH_30S,
  businessUseCases: BUSINESS_USE_CASES,
  recruiterProfile: BOT_RECRUITER,
  analyticsMicroTriggers: ANALYTICS_MICRO_TRIGGERS
};

// --- Helpers d’intents & navigation ---

export const isGeneralProfileQuestion = (text = '') => {
  const t = text.toLowerCase();
  return (
    t.includes('présente') ||
    t.includes('présentation') ||
    t.includes('parle de toi') ||
    t.includes('parle-moi de toi') ||
    t.includes('qui est dervilon') ||
    t.includes('qui es-tu') ||
    t.includes('ton profil') ||
    t.includes('parcours') ||
    t.includes('cv')
  );
};

export const detectAnalyticsIntent = (text = '') => {
  const t = text.toLowerCase();
  return (
    t.includes('stat') ||
    t.includes('analytics') ||
    t.includes('google analytics') ||
    t.includes('ce que les gens regardent') ||
    t.includes('pages les plus vues') ||
    t.includes('comportement des visiteurs')
  );
};

export const detectAutomationTopic = (text = '') => {
  const t = text.toLowerCase();
  return (
    t.includes('automation') ||
    t.includes('automatisation') ||
    t.includes('automatiser') ||
    t.includes('n8n') ||
    t.includes('make') ||
    t.includes('zapier') ||
    t.includes('workflow') ||
    t.includes('process') ||
    t.includes('processus')
  );
};

export const detectPageSuggestions = (text = '') => {
  const t = text.toLowerCase();
  const suggestions = [];

  if (t.includes('cv') || t.includes('curriculum') || t.includes('profil')) {
    suggestions.push('cv');
  }
  if (t.includes('blog') || t.includes('article')) {
    suggestions.push('blog');
  }
  if (detectAutomationTopic(t)) {
    suggestions.push('automations');
  }

  return suggestions;
};

export const buildSuggestionMessage = (suggestions, cvUrl = CV_DOWNLOAD_URL) => {
  const parts = [];

  if (suggestions.includes('cv')) {
    parts.push(
      "Je peux te rediriger vers son CV détaillé si tu veux en savoir plus sur son parcours."
    );
  }
  if (suggestions.includes('automations')) {
    parts.push(
      'Pour les automatisations, tu peux aussi consulter la page « Automatisations & n8n » du portfolio.'
    );
  }
  if (suggestions.includes('blog')) {
    parts.push(
      'Et si tu veux creuser certains sujets, il y a aussi des articles de blog sur l’IA et les agents.'
    );
  }

  if (parts.length === 0) return '';

  return `${parts.join(
    '\n\n'
  )}\n\nDis-moi simplement si tu veux que j’ouvre la page correspondante (CV, automations ou blog).`;
};

// --- Helpers pour changement de thème & date ---

export const detectThemeChangeIntent = (text = '') => {
  const t = text.toLowerCase();

  if (t.includes('noël') || t.includes('noel')) return 'noel';
  if (t.includes('nouvel an') || t.includes('nouveau an')) return 'nouvel-an';
  if (t.includes('halloween')) return 'halloween';
  if (t.includes('rentrée') || t.includes('rentree') || t.includes('back to school'))
    return 'rentree';
  if (t.includes('pâques') || t.includes('paques')) return 'paques';
  if (
    t.includes('thème par défaut') ||
    t.includes('theme par defaut') ||
    t.includes('thème normal') ||
    t.includes('theme normal')
  ) {
    return 'default';
  }

  return null;
};

export const getThemeLabel = (key) => {
  switch (key) {
    case 'noel':
      return 'thème de Noël 🎄';
    case 'nouvel-an':
      return 'thème du Nouvel An 🎆';
    case 'halloween':
      return 'thème Halloween 🎃';
    case 'rentree':
      return 'thème Rentrée scolaire 🧑‍🏫';
    case 'paques':
      return 'thème de Pâques 🐣';
    case 'default':
    default:
      return 'thème par défaut du portfolio';
  }
};

export const getTodayKey = () => {
  try {
    return new Date().toISOString().slice(0, 10);
  } catch {
    return '';
  }
};