// src/components/ServicesAutomationN8n.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Bolt as BoltIcon,
  Timeline as TimelineIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp,
  Speed,
  Security,
  CloudSync,
  LinkedIn as LinkedInIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import SEO from './SEO';

// Base URL API : en dev => backend sur 3001, en prod => même domaine
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? (process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001')
    : (process.env.REACT_APP_API_BASE_URL || '');

// FAQs statiques en accordéons (même contenu que dans le backend)
const STATIC_FAQS = [
  {
    id: 'faq-1',
    question: 'Combien de temps pour mettre en place une automatisation ?',
    answer:
      "En moyenne 2 à 4 semaines pour un MVP fonctionnel, selon la complexité. On commence toujours par un POC rapide (1 semaine) pour valider la faisabilité.",
  },
  {
    id: 'faq-2',
    question: 'Quels outils peuvent être connectés avec n8n ?',
    answer:
      "n8n supporte 400+ intégrations natives (Google Workspace, Slack, HubSpot, Notion, Airtable, etc.) et toutes les APIs REST/GraphQL. Si un outil a une API, on peut l’intégrer.",
  },
  {
    id: 'faq-3',
    question: 'Faut-il être technique pour utiliser les automatisations ?',
    answer:
      "Non ! Une fois le workflow mis en place, il tourne de manière autonome. Je forme ton équipe à l’utilisation et fournis une documentation complète.",
  },
  {
    id: 'faq-4',
    question: "Quel est le coût d'une automatisation ?",
    answer:
      "Variable selon la complexité (3000€ - 15000€). Mais le ROI est rapide : si tu économises 10h/semaine à 50€/h, c’est 2000€/mois de valeur créée.",
  },
  {
    id: 'faq-5',
    question: 'Comment mesure-t-on le succès d’une automatisation ?',
    answer:
      "On définit des KPIs dès le cadrage : temps économisé, taux d’erreur, volume traité, satisfaction utilisateur. Monitoring en temps réel via dashboards.",
  },
];

// Style helper pour éviter le « double outline » sur les TextField
const textFieldNoDoubleOutlineSx = {
  '& .MuiOutlinedInput-root.Mui-focused': {
    outline: 'none',
  },
};

// Composant SVG Illustration d'automatisation
const AutomationIllustration = ({ type = 'workflow' }) => {
  if (type === 'workflow') {
    return (
      <svg
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4F47E5', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#6D28D9', stopOpacity: 0.1 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#4F47E5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#6D28D9', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <rect width="400" height="200" fill="url(#grad1)" rx="8" />

        {/* Nodes */}
        <circle cx="60" cy="100" r="20" fill="#ffffff" stroke="#4F47E5" strokeWidth="3" />
        <circle cx="160" cy="60" r="20" fill="#ffffff" stroke="#4F47E5" strokeWidth="3" />
        <circle cx="160" cy="140" r="20" fill="#ffffff" stroke="#4F47E5" strokeWidth="3" />
        <circle cx="260" cy="100" r="20" fill="#ffffff" stroke="#4F47E5" strokeWidth="3" />
        <circle cx="340" cy="100" r="20" fill="#4F47E5" stroke="#4F47E5" strokeWidth="3" />

        {/* Connections */}
        <path
          d="M 80 100 L 140 60"
          stroke="url(#grad2)"
          strokeWidth="3"
          strokeDasharray="5,5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="10"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 80 100 L 140 140"
          stroke="url(#grad2)"
          strokeWidth="3"
          strokeDasharray="5,5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="10"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 180 60 L 240 100"
          stroke="url(#grad2)"
          strokeWidth="3"
          strokeDasharray="5,5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="10"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 180 140 L 240 100"
          stroke="url(#grad2)"
          strokeWidth="3"
          strokeDasharray="5,5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="10"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 280 100 L 320 100"
          stroke="url(#grad2)"
          strokeWidth="3"
          strokeDasharray="5,5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="10"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>

        {/* Icons in nodes */}
        <text
          x="60"
          y="107"
          textAnchor="middle"
          fontSize="16"
          fill="#4F47E5"
          fontWeight="bold"
        >
          ▶
        </text>
        <text
          x="160"
          y="67"
          textAnchor="middle"
          fontSize="16"
          fill="#4F47E5"
          fontWeight="bold"
        >
          AI
        </text>
        <text
          x="160"
          y="147"
          textAnchor="middle"
          fontSize="16"
          fill="#4F47E5"
          fontWeight="bold"
        >
          ⚙
        </text>
        <text
          x="260"
          y="107"
          textAnchor="middle"
          fontSize="16"
          fill="#4F47E5"
          fontWeight="bold"
        >
          ✓
        </text>
        <text
          x="340"
          y="107"
          textAnchor="middle"
          fontSize="16"
          fill="#ffffff"
          fontWeight="bold"
        >
          ✉
        </text>
      </svg>
    );
  }

  if (type === 'integration') {
    return (
      <svg
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>

        <rect width="400" height="200" fill="url(#grad3)" rx="8" />

        {/* Central hub */}
        <circle cx="200" cy="100" r="30" fill="#10b981" opacity="0.2" />
        <circle cx="200" cy="100" r="20" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
        <text
          x="200"
          y="107"
          textAnchor="middle"
          fontSize="16"
          fill="#ffffff"
          fontWeight="bold"
        >
          n8n
        </text>

        {/* Connected apps */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const x = 200 + 80 * Math.cos((angle * Math.PI) / 180);
          const y = 100 + 80 * Math.sin((angle * Math.PI) / 180);
          return (
            <g key={i}>
              <line
                x1="200"
                y1="100"
                x2={x}
                y2={y}
                stroke="#10b981"
                strokeWidth="2"
                opacity="0.5"
              />
              <circle cx={x} cy={y} r="15" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize="12"
                fill="#10b981"
                fontWeight="bold"
              >
                {['📊', '📧', '💬', '📁', '🔔', '⚡'][i]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // type === 'process'
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#grad4)" rx="8" />

      {/* Process steps */}
      {[50, 150, 250, 350].map((x, i) => (
        <g key={i}>
          <rect
            x={x - 30}
            y="70"
            width="60"
            height="60"
            rx="8"
            fill="#ffffff"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <text x={x} y="105" textAnchor="middle" fontSize="24" fill="#f59e0b">
            {['📥', '🤖', '✨', '📤'][i]}
          </text>
          {i < 3 && (
            <path
              d={`M ${x + 35} 100 L ${x + 65} 100`}
              stroke="#f59e0b"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          )}
        </g>
      ))}

      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
        </marker>
      </defs>
    </svg>
  );
};

const ServicesAutomationN8n = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const pageTitle = 'Automatisation IA & n8n | KD Dervilon - Chef de Projet IA';
  const pageDescription =
    "Expert en automatisation de workflows avec n8n et IA générative. Réduction de 70% du temps sur les tâches répétitives, intégration LLM et APIs, passage du POC au MVP en quelques semaines. Spécialiste Product Management IA et automatisation intelligente.";
  const pageKeywords =
    'automatisation n8n, workflows automatisés, IA générative, LLM, agents IA, intégration API, chef de projet IA, product owner IA, ROI automatisation, MVP automation';

  const benefits = [
    { icon: Speed, text: "Réduction de 70% du temps sur les tâches répétitives" },
    { icon: Security, text: "Moins d'erreurs humaines, traçabilité complète" },
    { icon: CloudSync, text: 'Connexion rapide entre vos outils existants' },
    { icon: TrendingUp, text: 'MVP automatisé en 2-4 semaines, pas 6 mois' },
  ];

  const useCases = [
    { icon: '🎯', text: 'Onboarding clients et relances automatisées' },
    { icon: '🔄', text: 'Synchronisation CRM / outils pédagogiques / back-office' },
    { icon: '📊', text: 'Génération de rapports et dashboards en temps réel' },
    { icon: '🤖', text: 'Agents IA : résumés, scoring, routage tickets, FAQ' },
  ];

  const techStack = [
    { icon: '⚡', label: 'n8n', color: '#4F47E5' },
    { icon: '🧠', label: 'LLM (GPT, Claude)', color: '#6D28D9' },
    { icon: '🔌', label: 'APIs REST', color: '#10b981' },
    { icon: '📱', label: 'Intégrations', color: '#f59e0b' },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Cadrage express',
      description:
        'Atelier 1–2h pour cartographier vos processus métier et identifier les gains rapides',
      icon: '🎯',
      color: '#4F47E5',
    },
    {
      number: '02',
      title: 'Design du workflow',
      description:
        'Schéma des flux de données, règles métier et interactions IA (LLM, scoring, routage)',
      icon: '🎨',
      color: '#6D28D9',
    },
    {
      number: '03',
      title: 'Build dans n8n',
      description: 'Développement du workflow, connexion aux APIs, tests sur données réelles',
      icon: '⚙️',
      color: '#10b981',
    },
    {
      number: '04',
      title: 'Go live & suivi',
      description:
        'Déploiement progressif, monitoring des KPIs, ajustements et formation équipe',
      icon: '🚀',
      color: '#f59e0b',
    },
  ];

  // --- State pour la section Questions / Réponses (connectée au backend) ---
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [qaError, setQaError] = useState('');
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [savingReplyId, setSavingReplyId] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleString('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return '';
    }
  };

  // --- Auth anonyme pour Q/R ---
  const ensureUser = useCallback(
    async (displayNameFromInput) => {
      if (user && userToken) return { user, token: userToken };

      // Vérifie le localStorage
      const storedToken = window.localStorage.getItem('qa_token');
      const storedUser = window.localStorage.getItem('qa_user');
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setUserToken(storedToken);
          return { user: parsedUser, token: storedToken };
        } catch {
          // on continue vers l'API
        }
      }

      // Création d'un token anonyme côté backend
      const displayName = (displayNameFromInput || authorName || '').trim().slice(0, 40);

      const res = await fetch(`${API_BASE_URL}/api/auth/anon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName }),
      });

      if (!res.ok) {
        // Lecture robuste (HTML ou JSON)
        let message = "Impossible d'initialiser le profil Q/R.";
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          if (data.message) message = data.message;
        } catch {
          // on garde le message par défaut
        }
        throw new Error(message);
      }

      const data = await res.json();
      const newUser = data.user;
      const token = data.token;

      setUser(newUser);
      setUserToken(token);
      window.localStorage.setItem('qa_token', token);
      window.localStorage.setItem('qa_user', JSON.stringify(newUser));

      return { user: newUser, token };
    },
    // API_BASE_URL est un constant de module, pas besoin dans les deps
    [authorName, user, userToken]
  );

  // --- Chargement des posts depuis le backend ---
  const loadPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      setQaError('');
      const res = await fetch(`${API_BASE_URL}/api/qa/posts`);
      if (!res.ok) {
        let message = 'Erreur lors du chargement des questions.';
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          if (data.message) message = data.message;
        } catch {
          // ignore, on garde le message par défaut
        }
        throw new Error(message);
      }
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      setQuestions(items);
    } catch (err) {
      setQaError(err.message || 'Erreur inattendue.');
    } finally {
      setLoadingPosts(false);
    }
  }, []); // API_BASE_URL est constant au niveau du module

  useEffect(() => {
    loadPosts().catch(() => {});
  }, [loadPosts]);

  // Détecter si l'admin est connecté (token stocké par le /admin)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const token = window.sessionStorage.getItem('adminToken');
      if (token) {
        setIsAdmin(true);
        setAdminToken(token);
      } else {
        setIsAdmin(false);
        setAdminToken(null);
      }
    } catch {
      setIsAdmin(false);
      setAdminToken(null);
    }
  }, []);

  // --- Handlers Q/R (connectés au backend) ---

  const getModerationToken = useCallback(
    async () => {
      // Si l'admin est connecté, on utilise son token pour pouvoir éditer/supprimer n'importe quel post
      if (isAdmin && adminToken) {
        return adminToken;
      }
      // Sinon, on retombe sur le comportement normal : l'auteur connecté via ensureUser
      const { token } = await ensureUser();
      return token;
    },
    [isAdmin, adminToken, ensureUser]
  );

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;
    try {
      setSavingQuestion(true);
      setQaError('');
      const { token } = await ensureUser(authorName);

      const res = await fetch(`${API_BASE_URL}/api/qa/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newQuestion.trim(),
        }),
      });

      if (!res.ok) {
        let message = 'Erreur lors de la création de la question.';
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          if (data.message) message = data.message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const data = await res.json();
      const created = data.item;
      if (created) {
        setQuestions((prev) => [created, ...prev]);
      }
      setNewQuestion('');
    } catch (err) {
      setQaError(err.message || 'Erreur inattendue lors de la création de la question.');
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleStartEdit = (id, currentContent) => {
    setEditingId(id);
    setEditingText(currentContent);
  };

  const handleSaveEdit = async () => {
    if (!editingText.trim() || !editingId) return;
    try {
      setQaError('');
      setSavingQuestion(true);
      const token = await getModerationToken();

      const res = await fetch(`${API_BASE_URL}/api/qa/posts/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editingText.trim() }),
      });

      if (!res.ok) {
        let message = 'Erreur lors de la mise à jour de la question.';
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          if (data.message) message = data.message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const data = await res.json();
      const updated = data.item;
      if (updated) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === updated.id ? updated : q))
        );
      }

      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setQaError(err.message || 'Erreur inattendue lors de la mise à jour.');
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleDeleteQuestion = async (id) => {
    try {
      setQaError('');
      setDeletingPostId(id);
      const token = await getModerationToken();

      const res = await fetch(`${API_BASE_URL}/api/qa/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let message = 'Erreur lors de la suppression de la question.';
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          if (data.message) message = data.message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setQaError(err.message || 'Erreur inattendue lors de la suppression.');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleReplyChange = (questionId, value) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleAddReply = async (questionId) => {
    const text = (replyDrafts[questionId] || '').trim();
    if (!text) return;

    try {
      setQaError('');
      setSavingReplyId(questionId);
      const { token } = await ensureUser();

      const res = await fetch(`${API_BASE_URL}/api/qa/posts/${questionId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) {
        let message = 'Erreur lors de la publication de la réponse.';
        try {
          const textBody = await res.text();
          const data = JSON.parse(textBody);
          if (data.message) message = data.message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const data = await res.json();
      const updated = data.item;
      if (updated) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === updated.id ? updated : q))
        );
      }

      setReplyDrafts((prev) => ({
        ...prev,
        [questionId]: '',
      }));
    } catch (err) {
      setQaError(err.message || 'Erreur inattendue lors de la réponse.');
    } finally {
      setSavingReplyId(null);
    }
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonicalUrl="https://kddervilon.com/services/automatisation-ia-n8n"
      />

      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          bgcolor: '#ffffff',
          color: '#000000',
        }}
      >
        {/* Hero Section avec illustration */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            borderBottom: '2px solid #e5e7eb',
            pt: { xs: 10, md: 12 },
            pb: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Chip
                  label="Service IA & Automatisation"
                  sx={{
                    bgcolor: '#4F47E5',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    mb: 3,
                    height: 32,
                    '& .MuiChip-label': { px: 2 },
                  }}
                />

                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    color: '#000000',
                    mb: 3,
                  }}
                >
                  Automatisation IA & n8n
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: 'linear-gradient(135deg, #4F47E5 0%, #6D28D9 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mt: 1,
                    }}
                  >
                    Moins de clics, plus de valeur
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.125rem',
                    lineHeight: 1.7,
                    color: '#1f2937',
                    mb: 4,
                    maxWidth: 560,
                  }}
                >
                  Je conçois et pilote des workflows automatisés avec{' '}
                  <strong>n8n et l&apos;IA générative</strong> pour supprimer les tâches
                  répétitives, fiabiliser les process et accélérer la mise en production.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
                  {techStack.map((tech, i) => (
                    <Chip
                      key={i}
                      icon={<span style={{ fontSize: '1.2rem' }}>{tech.icon}</span>}
                      label={tech.label}
                      sx={{
                        bgcolor: alpha(tech.color, 0.1),
                        color: tech.color,
                        fontWeight: 700,
                        border: `2px solid ${tech.color}`,
                        fontSize: '0.875rem',
                        height: 36,
                      }}
                    />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  href="/#contact"
                  sx={{
                    bgcolor: '#4F47E5',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                    '&:hover': {
                      bgcolor: '#3730a3',
                      boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Automatiser un workflow 🚀
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120%',
                      height: '120%',
                      background:
                        'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                    },
                  }}
                >
                  <AutomationIllustration type="workflow" />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Section Bénéfices, Use Cases, Stack */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4}>
            {/* Bénéfices */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                onMouseEnter={() => setHoveredCard('benefits')}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  height: '100%',
                  border: '2px solid',
                  borderColor: hoveredCard === 'benefits' ? '#4F47E5' : '#e5e7eb',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'benefits' ? 'translateY(-8px)' : 'none',
                  boxShadow:
                    hoveredCard === 'benefits'
                      ? '0 12px 24px rgba(79,70,229,0.2)'
                      : 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <BoltIcon sx={{ fontSize: 32, color: '#4F47E5' }} />
                    <Typography variant="h6" fontWeight={800} color="#000000">
                      Bénéfices concrets
                    </Typography>
                  </Box>
                  <List dense disablePadding>
                    {benefits.map((benefit, i) => {
                      const Icon = benefit.icon;
                      return (
                        <ListItem key={i} disableGutters sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Icon sx={{ fontSize: 20, color: '#10b981' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={benefit.text}
                            primaryTypographyProps={{
                              fontSize: '0.9375rem',
                              lineHeight: 1.5,
                              color: '#1f2937',
                              fontWeight: 500,
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Ce que j'automatise */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                onMouseEnter={() => setHoveredCard('usecases')}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  height: '100%',
                  border: '2px solid',
                  borderColor: hoveredCard === 'usecases' ? '#6D28D9' : '#e5e7eb',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'usecases' ? 'translateY(-8px)' : 'none',
                  boxShadow:
                    hoveredCard === 'usecases'
                      ? '0 12px 24px rgba(109,40,217,0.2)'
                      : 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <TimelineIcon sx={{ fontSize: 32, color: '#6D28D9' }} />
                    <Typography variant="h6" fontWeight={800} color="#000000">
                      Ce que j&apos;automatise
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <AutomationIllustration type="integration" />
                  </Box>

                  <List dense disablePadding>
                    {useCases.map((useCase, i) => (
                      <ListItem key={i} disableGutters sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Box sx={{ fontSize: 20 }}>{useCase.icon}</Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={useCase.text}
                          primaryTypographyProps={{
                            fontSize: '0.9375rem',
                            lineHeight: 1.5,
                            color: '#1f2937',
                            fontWeight: 500,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Stack & approche */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                onMouseEnter={() => setHoveredCard('stack')}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  height: '100%',
                  border: '2px solid',
                  borderColor: hoveredCard === 'stack' ? '#10b981' : '#e5e7eb',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'stack' ? 'translateY(-8px)' : 'none',
                  boxShadow:
                    hoveredCard === 'stack'
                      ? '0 12px 24px rgba(16,185,129,0.2)'
                      : 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 32, color: '#10b981' }} />
                    <Typography variant="h6" fontWeight={800} color="#000000">
                      Stack & approche
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: '#1f2937', lineHeight: 1.6 }}
                  >
                    Stack combinant <strong>n8n, APIs REST, LLM (GPT, Claude)</strong> et
                    vos outils existants (CRM, Notion, back-office).
                  </Typography>
                  <List dense disablePadding>
                    {[
                      '📋 Cartographie des flux métier',
                      '🎨 Design du workflow dans n8n',
                      '🤖 Connexion LLM et services IA',
                      '✅ Tests, monitoring & documentation',
                    ].map((item, i) => (
                      <ListItem key={i} disableGutters sx={{ py: 0.75 }}>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            fontSize: '0.9375rem',
                            lineHeight: 1.5,
                            color: '#1f2937',
                            fontWeight: 500,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Section Processus avec illustration */}
        <Box
          sx={{
            bgcolor: '#f9fafb',
            borderTop: '2px solid #e5e7eb',
            borderBottom: '2px solid #e5e7eb',
            py: { xs: 6, md: 10 },
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 800,
                mb: 2,
                color: '#000000',
                textAlign: 'center',
              }}
            >
              Comment je t&apos;accompagne sur l&apos;automatisation
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 720,
                mx: 'auto',
                mb: 5,
                textAlign: 'center',
                color: '#1f2937',
                fontSize: '1.0625rem',
                lineHeight: 1.7,
              }}
            >
              En tant que <strong>Chef de Projet IA &amp; Product Owner</strong>, je
              pilote l&apos;automatisation comme un projet produit : cadrage, MVP,
              itérations courtes, mesure du ROI.
            </Typography>

            <Box sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
              <AutomationIllustration type="process" />
            </Box>

            <Grid container spacing={3}>
              {processSteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: '2px solid #e5e7eb',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'visible',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: step.color,
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${alpha(step.color, 0.2)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: 16,
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: step.color,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        boxShadow: `0 4px 12px ${alpha(step.color, 0.4)}`,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <CardContent sx={{ pt: 5, px: 3, pb: 3 }}>
                      <Typography
                        variant="overline"
                        sx={{
                          color: step.color,
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          letterSpacing: 1,
                        }}
                      >
                        Étape {step.number}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        gutterBottom
                        sx={{ color: '#000000', mt: 0.5, mb: 1.5 }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#4b5563', lineHeight: 1.6 }}
                      >
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Section CTA Final */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #4F47E5 0%, #6D28D9 100%)',
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(79,70,229,0.3)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                background:
                  'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%)',
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontWeight: 800,
                  mb: 2,
                  color: '#ffffff',
                }}
              >
                Prêt à automatiser un workflow ?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.95)',
                }}
              >
                Tu as un process en tête (onboarding, relances, reporting, support) et tu
                veux voir s&apos;il est automatisable avec n8n et l&apos;IA ? On peut faire
                un premier échange pour cartographier rapidement le flux et estimer le
                gain de temps.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  href="/#contact"
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#4F47E5',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: '#f9fafb',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Discuter de mon projet 💬
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  href="https://www.linkedin.com/in/kongo-dervilon"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LinkedInIcon />}
                  sx={{
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#ffffff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Me contacter sur LinkedIn
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Section Métriques / Chiffres clés */}
        <Box
          sx={{
            bgcolor: '#000000',
            color: '#ffffff',
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 800,
                mb: 5,
                textAlign: 'center',
                color: '#ffffff',
              }}
            >
              Impact mesurable de l&apos;automatisation IA
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  value: '70%',
                  label: 'Réduction du temps sur tâches répétitives',
                  icon: '⏱️',
                  color: '#4F47E5',
                },
                {
                  value: '2-4',
                  label: 'Semaines pour un MVP fonctionnel',
                  icon: '🚀',
                  color: '#10b981',
                },
                {
                  value: '95%',
                  label: 'Taux de fiabilité des workflows',
                  icon: '✅',
                  color: '#6D28D9',
                },
                {
                  value: '24/7',
                  label: 'Disponibilité des automatisations',
                  icon: '🌐',
                  color: '#f59e0b',
                },
              ].map((metric, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      border: '2px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: metric.color,
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${alpha(metric.color, 0.3)}`,
                      },
                    }}
                  >
                    <Box sx={{ fontSize: '3rem', mb: 1 }}>{metric.icon}</Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 800,
                        color: metric.color,
                        mb: 1,
                        lineHeight: 1,
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.9375rem',
                        lineHeight: 1.4,
                        fontWeight: 500,
                      }}
                    >
                      {metric.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Section Questions / espace Q&R */}
        <Box
          sx={{
            bgcolor: '#f9fafb',
            borderTop: '2px solid #e5e7eb',
            py: { xs: 6, md: 10 },
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 800,
                mb: 2,
                textAlign: 'center',
                color: '#000000',
              }}
            >
              Questions fréquentes & espace Q/R
            </Typography>

            <Typography
              variant="body1"
              sx={{
                maxWidth: 720,
                mx: 'auto',
                mb: 4,
                textAlign: 'center',
                color: '#4b5563',
                fontSize: '1.0625rem',
              }}
            >
              Consulte les réponses aux questions fréquentes sur l&apos;automatisation, puis
              pose la tienne comme un post. Tu peux modifier ou supprimer <strong>tes</strong>{' '}
              questions, et n&apos;importe quel utilisateur peut y répondre.
            </Typography>

            {/* FAQs en accordéons */}
            <Card
              elevation={0}
              sx={{
                border: '2px solid #e5e7eb',
                borderRadius: 3,
                mb: 4,
                backgroundColor: '#ffffff',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {STATIC_FAQS.map((faq, index) => (
                  <Accordion
                    key={faq.id}
                    defaultExpanded={index === 0}
                    disableGutters
                    elevation={0}
                    sx={{
                      '&:before': { display: 'none' },
                      borderBottom:
                        index === STATIC_FAQS.length - 1
                          ? 'none'
                          : '1px solid #e5e7eb',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        px: 3,
                        py: 1.5,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: '#111827' }}
                      >
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#4b5563', lineHeight: 1.6 }}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>

            <Divider sx={{ mb: 4 }} />

            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 800,
                mb: 2,
                color: '#000000',
              }}
            >
              Poser une question à la communauté
            </Typography>

            {/* Affichage d'erreur éventuelle */}
            {qaError && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.4)',
                }}
              >
                <Typography variant="body2" sx={{ color: '#b91c1c' }}>
                  {qaError}
                </Typography>
              </Box>
            )}

            {/* Formulaire nouvelle question */}
            <Card
              elevation={0}
              sx={{
                border: '2px solid #e5e7eb',
                borderRadius: 3,
                mb: 4,
                backgroundColor: '#ffffff',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <TextField
                    label="Ton prénom (optionnel)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    fullWidth
                    size="small"
                    sx={textFieldNoDoubleOutlineSx}
                  />
                  <TextField
                    label="Ta question sur l'automatisation IA & n8n"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                    sx={textFieldNoDoubleOutlineSx}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      onClick={handleAddQuestion}
                      disabled={!newQuestion.trim() || savingQuestion}
                      sx={{
                        bgcolor: '#4F47E5',
                        '&:hover': { bgcolor: '#3730a3' },
                      }}
                    >
                      {savingQuestion ? 'Publication...' : 'Poster la question'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Liste des questions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {loadingPosts ? (
                <Typography
                  variant="body2"
                  sx={{ color: '#6b7280', textAlign: 'center', mt: 2 }}
                >
                  Chargement des questions...
                </Typography>
              ) : questions.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ color: '#6b7280', textAlign: 'center', mt: 2 }}
                >
                  Aucune question n&apos;a encore été posée. Sois le premier à lancer la
                  discussion 🔥
                </Typography>
              ) : (
                questions.map((q) => {
                  const isOwner = user && q.authorId === user.id;
                  const canManage = isOwner || isAdmin;
                  const displayAuthor = q.authorName || q.author || 'Anonyme';

                  return (
                    <Card
                      key={q.id}
                      elevation={0}
                      sx={{
                        border: '2px solid #e5e7eb',
                        borderRadius: 3,
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: '#111827' }}
                          >
                            {displayAuthor}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            Posté le {formatDate(q.createdAt)}
                            {q.updatedAt &&
                              q.updatedAt !== q.createdAt &&
                              ' · modifié'}
                          </Typography>
                        </Box>

                        {editingId === q.id ? (
                          <>
                            <TextField
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              fullWidth
                              multiline
                              minRows={3}
                              sx={textFieldNoDoubleOutlineSx}
                            />
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1.5,
                                mt: 1.5,
                              }}
                            >
                              <Button size="small" onClick={handleCancelEdit}>
                                Annuler
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={handleSaveEdit}
                                disabled={!editingText.trim() || savingQuestion}
                                sx={{
                                  bgcolor: '#4F47E5',
                                  '&:hover': { bgcolor: '#3730a3' },
                                }}
                              >
                                Enregistrer
                              </Button>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 1.5,
                                mb: 1.5,
                                color: '#111827',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {q.content}
                            </Typography>

                            <Box
                              sx={{
                                display: 'flex',
                                gap: 1,
                                flexWrap: 'wrap',
                              }}
                            >
                              {canManage && (
                                <>
                                  <Button
                                    size="small"
                                    variant="text"
                                    onClick={() => handleStartEdit(q.id, q.content)}
                                    sx={{
                                      textTransform: 'none',
                                      fontWeight: 600,
                                    }}
                                  >
                                    Modifier la question
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="error"
                                    onClick={() => handleDeleteQuestion(q.id)}
                                    disabled={deletingPostId === q.id}
                                    sx={{
                                      textTransform: 'none',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {deletingPostId === q.id
                                      ? 'Suppression...'
                                      : 'Supprimer'}
                                  </Button>
                                </>
                              )}
                            </Box>
                          </>
                        )}

                        {/* Réponses */}
                        {q.replies && q.replies.length > 0 && (
                          <Box
                            sx={{
                              mt: 2,
                              pl: 2,
                              borderLeft: '2px solid #e5e7eb',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1.5,
                            }}
                          >
                            {q.replies.map((r) => {
                              const replyAuthor = r.authorName || r.author || 'Invité';
                              return (
                                <Box key={r.id}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, color: '#111827' }}
                                  >
                                    {replyAuthor}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#6b7280' }}
                                  >
                                    Réponse le {formatDate(r.createdAt)}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mt: 0.5,
                                      color: '#111827',
                                      whiteSpace: 'pre-wrap',
                                    }}
                                  >
                                    {r.content}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        )}

                        {/* Formulaire de réponse */}
                        <Box sx={{ mt: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Répondre à cette question"
                            multiline
                            minRows={2}
                            value={replyDrafts[q.id] || ''}
                            onChange={(e) => handleReplyChange(q.id, e.target.value)}
                            sx={textFieldNoDoubleOutlineSx}
                          />
                          <Box sx={{ textAlign: 'right', mt: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleAddReply(q.id)}
                              disabled={
                                !(replyDrafts[q.id] || '').trim() ||
                                savingReplyId === q.id
                              }
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                              {savingReplyId === q.id
                                ? 'Publication...'
                                : 'Publier la réponse'}
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default ServicesAutomationN8n;