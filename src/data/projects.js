export const PROJECTS = [
  {
    id: 1,
    title: "Système de recommandation IA",
    category: "IA",
    description: "Développement d'un système de recommandation utilisant des LLM pour personnaliser l'expérience utilisateur",
    skills: ["Python", "LLM", "RAG", "API"],
    details: "Conception et déploiement d'une solution IA basée sur des Large Language Models pour analyser les besoins clients et proposer des recommandations personnalisées. Intégration de RAG (Retrieval Augmented Generation) pour améliorer la pertinence des réponses.",
    image: "🤖",
    metrics: { roi: "+45%", time: "3 mois", impact: "Haute" }
  },
  {
    id: 2,
    title: "Gérez un sprint Agile",
    category: "Produit",
    description: "Cadrez un projet selon la méthodologie Scrum",
    skills: ["Scrum", "Jira", "Product Management"],
    details: "Création d'un réseau social interne pour Groupomania. En tant que Product Manager, gestion d'une équipe dédiée avec un délai d'un mois. Après un premier sprint difficile, réussite à obtenir un MVP et préparation d'une rétrospective avec des outils visuels.",
    image: "📊",
    metrics: { roi: "+30%", time: "1 mois", impact: "Moyenne" }
  },
  {
    id: 3,
    title: "Automatisation des workflows",
    category: "IA",
    description: "Implémentation d'agents IA pour automatiser les processus métier",
    skills: ["Agents IA", "Python", "Automatisation"],
    details: "Mise en place d'agents IA intelligents pour automatiser les tâches répétitives de l'organisation. Analyse des besoins, conception du POC et déploiement de la solution avec formation des équipes.",
    image: "⚡",
    metrics: { roi: "+60%", time: "2 mois", impact: "Très haute" }
  },
  {
    id: 4,
    title: "Managez des imprévus",
    category: "Produit",
    description: "Identifier les prestataires externes adéquats à un projet",
    skills: ["Gestion de crise", "Communication", "Scrum"],
    details: "Gestion de défis majeurs lors du sixième jour d'un sprint de dix jours chez Purple Squirrel. Résolution de retards, conflits d'équipe, demandes de dernière minute et absence d'un développeur clé.",
    image: "🚨",
    metrics: { roi: "+25%", time: "10 jours", impact: "Haute" }
  },
  {
    id: 5,
    title: "Chatbot IA conversationnel",
    category: "IA",
    description: "Développement d'un assistant virtuel intelligent pour le service client",
    skills: ["NLP", "LLM", "Integration API"],
    details: "Conception et déploiement d'un chatbot basé sur des LLM pour améliorer l'expérience client. Intégration avec les systèmes existants et formation des équipes support.",
    image: "💬",
    metrics: { roi: "+50%", time: "2.5 mois", impact: "Haute" }
  },
  {
    id: 6,
    title: "Convertissez les visiteurs",
    category: "Marketing",
    description: "Évaluer la performance d'un produit digital",
    skills: ["Analytics", "UX", "A/B Testing"],
    details: "Optimisation de la landing page de Shiawase pour des séjours au Japon. Analyse avec Google Analytics, étude qualitative et heuristiques de Nielsen. Formulation de 3-5 hypothèses avec KPI et valeurs cibles.",
    image: "📈",
    metrics: { roi: "+35%", time: "6 semaines", impact: "Moyenne" }
  },
  {
    id: 7,
    title: "Stratégie de communication",
    category: "Équipe",
    description: "Concevoir des supports de communication internes et externes",
    skills: ["Marketing", "Communication", "Content Strategy"],
    details: "Développement d'une fonctionnalité B2B chez Customizely. Création d'un product brief, newsletter interne, stratégie marketing, calendrier éditorial mensuel et KPI pertinents.",
    image: "📢",
    metrics: { roi: "+40%", time: "1 mois", impact: "Moyenne" }
  },
  {
    id: 8,
    title: "Prototype utilisateur",
    category: "Produit",
    description: "Élaborer un prototype produit fonctionnel",
    skills: ["Prototypage", "Lean UX", "User Research"],
    details: "Exploration de la désirabilité produit, définition de personas, création d'un Lean UX Canvas, benchmark concurrentiel avec SWOT et élaboration d'un prototype sur Adalo pour marchés B2C et B2B.",
    image: "🎨",
    metrics: { roi: "+28%", time: "3 semaines", impact: "Moyenne" }
  }
];

export const CATEGORIES = ['all', 'IA', 'Produit', 'Marketing', 'Équipe'];