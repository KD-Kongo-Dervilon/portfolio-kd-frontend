// src/utils/chatbotConfig.js
// Configuration centrale du chatbot Amara
// Ton, messages types, mode recruteur, funnels, prompts courts

// Nom du bot (présenté partout)
export const CHATBOT_NAME = 'Amara';

// --- Détection du ton de la voix (tu / vous) ---
// ⚠️ On met des parenthèses autour du && pour éviter l'erreur eslint no-mixed-operators
export const detectFormalTone = (text = '') => {
  const lower = text.toLowerCase();
  return (
    lower.includes('vous') ||
    lower.includes('votre') ||
    lower.includes('vouz') ||
    lower.includes('votre entreprise') ||
    lower.includes('votre équipe') ||
    (lower.includes('bonjour') && !lower.includes('salut'))
  );
};

// --- Messages généraux (humanisés) ---
export const BOT_MESSAGES = {
  introduction: `Bonjour 👋 Je suis Amara, l’assistant IA de Dervilon.
Je suis là pour t’aider à comprendre son parcours, ses compétences et ses projets en IA.
Tu veux en savoir plus sur lui, son métier, ou tu réfléchis à un besoin IA ou une automatisation ? 😊`,

  introduction_formal: `Bonjour 👋 Je suis Amara, l’assistant IA de Dervilon.
Je suis ici pour vous aider à comprendre son parcours, ses compétences et ses projets en IA.
Souhaitez-vous en savoir davantage sur son métier, ou avez-vous un besoin IA / automatisation dans votre organisation ? 😊`
};

// Message de bienvenue injecté dans le chatbot (version "tu" par défaut)
export const initialBotMessage = BOT_MESSAGES.introduction;

// --- Mode recruteur ---
export const BOT_RECRUITER = {
  triggerMessage: `Top, merci pour ton intérêt 🙌
Je peux te résumer rapidement :
• le profil de KD (rôle, stack, ce qu’il fait concrètement)
• ses résultats clés (projets IA, POC/MVP et éditeur pédagogique)
• son format de travail (missions IA, accompagnement, mobilité)

Tu préfères quoi pour commencer ?`,

  triggerMessage_formal: `Merci pour votre intérêt 🙌
Je peux vous résumer rapidement :
• le profil de KD (rôle, stack, expertises)
• ses résultats clés (projets IA, POC/MVP et éditeur pédagogique)
• son format de travail (missions IA, accompagnement, mobilité)

Que souhaitez-vous voir en premier ?`,

  options: [
    'Résumé en 30 secondes',
    'Expériences & résultats',
    'Compétences IA & automatisation',
    'Disponibilités & modalités'
  ]
};

// --- Pitch recruteur 30 secondes ---
export const RECRUITER_PITCH_30S = `KD (Kongo Dervilon) est Chef de Projet IA & Product Owner, spécialisé dans l'IA, les agents IA, LLM, RAG et les automatisations n8n/Make.
Chez Ludicius (éditeur de serious games), il a piloté le développement d’un éditeur d’activités pédagogiques et la mise en place d’un POC puis d’un MVP IA utilisés en interne.`;

// --- Cas d’usage à reprendre automatiquement ---
export const BUSINESS_USE_CASES = [
  {
    title: 'Vous perdez du temps sur les tâches répétitives (support, RH, pédagogie)',
    description:
      'KD met en place des agents IA et des workflows n8n/Make pour automatiser et réduire le temps passé sur ces tâches.'
  },
  {
    title: 'Vous ne savez pas par où commencer avec l’IA',
    description:
      'KD propose un Audit & Roadmap IA permettant d’identifier 3 cas d’usage avec ROI estimé.'
  },
  {
    title: 'Vous voulez prouver vite que l’IA peut avoir un impact',
    description:
      'KD conçoit des POC / MVP IA en 21 jours, mesurables et directement testables en interne.'
  }
];

// --- Parcours éducatif (diplômes & certifications) ---
export const EDUCATION = {
  degrees: [
    'Master en Product Management (BAC+5)',
    'Licence en Développement Front-End'
  ],
  certifications: [
    'Certificat Chef de Projet IA',
    'Certification CSPO (Scrum Product Owner) – Scrum League'
  ]
};

// --- Micro interactions à déclencher via analytics ---
export const ANALYTICS_MICRO_TRIGGERS = {
  onCvDownload: `Merci pour le téléchargement du CV !
Si vous le souhaitez, je peux aussi vous résumer en 3 points pourquoi KD est pertinent pour un poste dans votre organisation.`,

  onVisitAutomations: `Souhaitez-vous que je vous explique en quoi ces automatisations peuvent s’appliquer à votre contexte ?`,

  onLongReadLudicius: `Souhaitez-vous que je vous détaille ce que KD a réalisé chez Ludicius (éditeur d’activités pédagogiques, POC et MVP IA) ?`
};

// --- Limites d'utilisation du chatbot ---
export const CHATBOT_DAILY_LIMIT = 20; // nombre max de messages IA par jour (hors admin)
export const CHATBOT_USAGE_KEY = 'kd_chatbot_usage_v1';

// --- Routes utilisées par le chatbot pour les chips de navigation ---
export const ROUTE_AUTOMATIONS = '/services/automatisation-ia-n8n';
export const ROUTE_BLOG = '/blog';
export const ROUTE_CV = '/cv';

// URL de téléchargement du CV
export const CV_DOWNLOAD_URL = '/cv/dervilon-mbissi.pdf';

// Titre affiché dans le header du composant ChatbotIA
export const BOT_HEADER_TITLE = `${CHATBOT_NAME} – assistant IA de Dervilon`;

// Questions suggérées affichées en bas quand il n’y a qu’un seul message
export const suggestedQuestions = [
  'Peux-tu me résumer le profil de Dervilon ?',
  'Quels projets IA a-t-il réalisés chez Ludicius ?',
  'Quels types d’automatisations tu mets en place avec n8n ?',
  'Comment il peut m’aider avec l’IA et les automatisations ?',
  'Comment fonctionne le portfolio IA de Dervilon ?'
];

// Contexte court passé à l’agent /api/chat pour le fallback
export const profileContext = `Dervilon Kongo (KD) est Chef de Projet IA & Product Owner.
Il a un Master en Product Management (BAC+5) et une Licence en Développement Front-End.
Il possède également un Certificat Chef de Projet IA et une certification CSPO (Scrum Product Owner) – Scrum League.
Il a travaillé chez Ludicius (éditeur de serious games) où il a piloté un éditeur d’activités pédagogiques et la mise en place d’un POC puis d’un MVP IA utilisés en interne.
Il accompagne aujourd’hui des équipes produit, pédagogie et opérations sur la mise en place d’agents IA, de POC/MVP et d’automatisations pour améliorer l’efficacité opérationnelle, sans revendiquer de métriques de ROI chiffrées.`;