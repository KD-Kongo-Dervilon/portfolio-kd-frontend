// src/utils/chatbotIntents.js

// 👉 Détection d'intention "prendre rendez-vous"
export const detectRdvIntent = (text = '') => {
  const lower = text.toLowerCase();
  const patterns = [
    'rendez-vous',
    'rdv',
    'prendre rendez vous',
    'prendre rendez-vous',
    'prendre un rendez',
    'prendre un créneau',
    'fixer un créneau',
    'prendre un appel',
    'appel téléphonique',
    'call',
    'visio',
    'discuter de vive voix',
    'parler de vive voix'
  ];
  return patterns.some((p) => lower.includes(p));
};

// 👉 Questions sur le profil / parcours / agents IA / portfolio
export const detectProfileIntent = (text = '') => {
  const lower = text.toLowerCase();
  const patterns = [
    'qui es-tu',
    'qui es tu',
    'qui est dervilon',
    'parle-moi de dervilon',
    'parle moi de dervilon',
    'parle-moi de kd',
    'parle moi de kd',
    'parcours de dervilon',
    'parcours de kd',
    'ton parcours',
    'parcours',
    'que fais-tu',
    'que fais tu',
    'ce que tu fais',
    'tes compétences',
    'tes competences',
    'compétences ia',
    'competences ia',
    'tes expériences',
    'tes experiences',
    'tes offres',
    'tes services',
    'avec quelles boîtes tu as travaillé',
    'avec quelles boites tu as travaillé',
    'avec quelles boites tu as travaille',
    'pour qui tu as travaillé',
    'pour qui tu as travaille',
    'agents ia',
    'quels sont tes agents ia',
    'schéma du portfolio',
    'schema du portfolio',
    'montre-moi le schéma du portfolio',
    'montre moi le schéma du portfolio',
    'architecture du portfolio',
    'comment fonctionne ton portfolio',
    'comment fonctionnent tes agents',
    'comment fonctionnent les agents ia'
  ];
  return patterns.some((p) => lower.includes(p));
};

// 👉 Intent "je suis recruteur / RH"
export const detectRecruiterIntent = (text = '') => {
  const lower = text.toLowerCase();
  const patterns = [
    'je suis recruteur',
    'je recrute',
    'nous recrutons',
    'je cherche un chef de projet ia',
    'je cherche un product owner',
    'profil pour un cdi',
    'profil pour une alternance',
    'profil freelance',
    'recruteur',
    'rh',
    'talent acquisition'
  ];
  return patterns.some((p) => lower.includes(p));
};

// 👉 Questions assez générales sur le profil (pour la réponse courte préformatée)
export const isGeneralProfileQuestion = (text = '') => {
  const lower = text.toLowerCase();
  const patterns = [
    'présente-toi',
    'presente toi',
    'présentation',
    'presentation',
    'résumé de ton profil',
    'resume de ton profil',
    'résumé de ton parcours',
    'resume de ton parcours',
    'parle-moi de ton parcours',
    'parle moi de ton parcours',
    'parle-moi de ton profil',
    'parle moi de ton profil',
    'qui es-tu',
    'qui es tu',
    'parcours professionnel',
    'ton profil',
    'ton cv',
    'cv',
    'profil linkedin'
  ];
  return patterns.some((p) => lower.includes(p));
};

// 👉 Intent "analytics" (ce que les gens ont regardé / cliqué)
export const detectAnalyticsIntent = (text = '') => {
  const lower = text.toLowerCase();
  const patterns = [
    'statistiques',
    'stats',
    'analytics',
    'google analytics',
    'combien de visites',
    'combien de visiteurs',
    'ce que les gens regardent',
    'pages les plus vues',
    'pages les plus consultées',
    'ce qui est le plus consulté',
    'comportement des visiteurs'
  ];
  return patterns.some((p) => lower.includes(p));
};

// 👉 Intent "thème du portfolio" (Noël, Halloween, etc.)
export const detectThemeChangeIntent = (text = '') => {
  const lower = text.toLowerCase();

  if (lower.includes('noël') || lower.includes('noel')) return 'noel';
  if (lower.includes('halloween')) return 'halloween';
  if (lower.includes('pâques') || lower.includes('paques')) return 'paques';
  if (lower.includes('rentrée') || lower.includes('rentree')) return 'rentree';
  if (lower.includes('nouvel an') || lower.includes('new year')) return 'nouvel-an';

  if (
    lower.includes('thème par défaut') ||
    lower.includes('theme par defaut') ||
    (lower.includes('remets') && lower.includes('normal'))
  ) {
    return 'default';
  }

  return null;
};

// 👉 Sujet "automatisation / n8n / Make" pour déclencher le mini-funnel
export const detectAutomationTopic = (text = '') => {
  const lower = text.toLowerCase();
  const patterns = [
    'automatisation',
    'automatisations',
    'automatiser',
    'workflow',
    'workflows',
    'n8n',
    'make.com',
    'make ',
    'zapier',
    'tâches répétitives',
    'taches repetitives',
    'gagner du temps',
    'agent ia',
    'agents ia'
  ];
  return patterns.some((p) => lower.includes(p));
};

// 👉 Suggestions de pages du portfolio à ouvrir (automations, blog, cv)
export const detectPageSuggestions = (text = '') => {
  const lower = text.toLowerCase();
  const suggestions = [];

  if (
    lower.includes('automation') ||
    lower.includes('automatisation') ||
    lower.includes('automatisations') ||
    lower.includes('n8n') ||
    lower.includes('make')
  ) {
    suggestions.push('automations');
  }

  if (lower.includes('blog') || lower.includes('article') || lower.includes('articles')) {
    suggestions.push('blog');
  }

  if (
    lower.includes('cv') ||
    lower.includes('curriculum') ||
    lower.includes('curriculum vitae') ||
    lower.includes('télécharger ton cv') ||
    lower.includes('telecharger ton cv')
  ) {
    suggestions.push('cv');
  }

  return suggestions;
};

// 👉 Message humanisé pour accompagner les chips de navigation
export const buildSuggestionMessage = (suggestions = [], cvDownloadUrl) => {
  if (!suggestions || suggestions.length === 0) return '';

  const parts = [];

  if (suggestions.includes('automations')) {
    parts.push(
      'Je peux t’ouvrir la page « Automatisations & n8n » pour voir des exemples concrets mises en place par KD.'
    );
  }

  if (suggestions.includes('blog')) {
    parts.push("Je peux aussi t’afficher les derniers articles du blog pour creuser certains sujets.");
  }

  if (suggestions.includes('cv')) {
    const suffix = cvDownloadUrl ? ' ou télécharger directement son CV.' : '.';
    parts.push(`Tu peux consulter la page CV${suffix}`);
  }

  return parts.join('\n\n');
};