// src/components/ExpertiseQuiz.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Stack,
  Fade,
  Grow,
  Slide,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

// dnd-kit (drag & drop et reorder)
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Banque de questions de base ---
const questionsBank = [
  {
    id: 1,
    question:
      'Quelle est la différence principale entre RAG et Fine-tuning ?',
    options: [
      "RAG utilise des données externes en temps réel, Fine-tuning modifie le modèle",
      'RAG est plus cher que Fine-tuning',
      'Fine-tuning est toujours plus précis que RAG',
      "Il n'y a pas de différence",
    ],
    correct: 0,
    explanation:
      "✅ RAG (Retrieval Augmented Generation) récupère des informations externes dynamiquement, tandis que le Fine-tuning ajuste les poids du modèle avec des données d'entraînement spécifiques.",
    difficulty: 'Intermédiaire',
    category: 'IA & LLM',
  },
  {
    id: 2,
    question:
      'Quel framework Agile est le plus adapté pour un projet IA exploratoire ?',
    options: [
      'Waterfall classique',
      'Scrum avec sprints de 2 semaines',
      'Kanban avec cycle de découverte/validation',
      'Pas de framework nécessaire',
    ],
    correct: 2,
    explanation:
      "✅ Kanban permet une flexibilité optimale pour l'exploration IA où les hypothèses évoluent rapidement. Scrum peut être trop rigide pour la phase de découverte.",
    difficulty: 'Avancé',
    category: 'Product Management',
  },
  {
    id: 3,
    question: "Comment mesurer le ROI d'un chatbot IA support ?",
    options: [
      'Seulement par le nombre de conversations',
      'Temps économisé + Satisfaction client + Taux de résolution',
      "Uniquement par le coût de l'API LLM",
      "On ne peut pas mesurer le ROI d'un chatbot",
    ],
    correct: 1,
    explanation:
      '✅ Le ROI d’un chatbot se mesure via plusieurs KPIs business: temps support économisé, taux de résolution autonome, satisfaction client (CSAT/NPS) et coût par ticket résolu.',
    difficulty: 'Intermédiaire',
    category: 'ROI & Métriques',
  },
  {
    id: 4,
    question:
      'Quelle méthode privilégier pour prioriser des features IA dans une roadmap ?',
    options: [
      'RICE Score (Reach, Impact, Confidence, Effort)',
      'Développer toutes les idées en parallèle',
      'Laisser les développeurs décider',
      'Suivre uniquement les demandes clients',
    ],
    correct: 0,
    explanation:
      '✅ RICE Score permet de prioriser objectivement en équilibrant impact business (Reach x Impact) et faisabilité technique (Confidence / Effort).',
    difficulty: 'Avancé',
    category: 'Product Management',
  },
  {
    id: 5,
    question:
      "Quel est le temps de payback moyen d'un projet RAG en production ?",
    options: ['2-3 ans minimum', '6-12 mois si bien exécuté', 'Jamais rentable', '1-2 semaines'],
    correct: 1,
    explanation:
      "✅ Avec une exécution rigoureuse (POC → MVP → Production en 8-12 semaines), le payback d'un projet RAG bien cadré est généralement de 6-12 mois.",
    difficulty: 'Expert',
    category: 'ROI & Métriques',
  },
];

// --- Helpers: shuffle / sample / modes ---
const shuffle = (arr) => {
  const a = Array.isArray(arr) ? [...arr] : [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const sampleSize = (arr, n) => shuffle(arr).slice(0, n);

const MODES = ['mcq', 'dragdrop', 'reorder', 'swipe'];
const nextMode = (prev) => {
  const choices = MODES.filter((m) => m !== prev);
  return choices[Math.floor(Math.random() * choices.length)];
};

// --- (Optionnel) pool de sujets variés (IA + Produit + ROI + éthique + data) ---
const TOPIC_POOL = [
  'IA',
  'LLM',
  'RAG',
  'Agents IA',
  'Prompting',
  'Vector DB',
  'Agile/Scrum',
  'Roadmap Produit',
  'Discovery/Delivery',
  'ROI & KPIs',
  'Métriques Produit',
  'A/B testing',
  'Analytics',
  'UX',
  'Sécurité',
  'RGPD',
  'Éthique de l’IA',
  'Biais algorithmiques',
  'Observability IA',
];

const pickTopics = (n = 3) => shuffle(TOPIC_POOL).slice(0, n);

// Base API : Vite -> VITE_API_BASE, CRA -> REACT_APP_API_BASE, sinon localhost:3001
const API_BASE =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  'http://localhost:3001';

const AI_DAILY_LIMIT = 3;
const AI_USAGE_STORAGE_KEY = 'expertise_quiz_ai_usage_v1';

const getTodayKey = () => {
  try {
    return new Date().toISOString().slice(0, 10);
  } catch {
    return '';
  }
};

// --- Génération IA de nouvelles questions ---
async function fetchAIQuestions({ count = 5 } = {}) {
  try {
    const topics = pickTopics(Math.random() < 0.5 ? 3 : 4);

    console.log('[Quiz] Appel IA /api/quiz/generate', { API_BASE, topics, count });

    const res = await fetch(`${API_BASE}/api/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n: count, topics, difficultyMix: true }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log('[Quiz] Réponse brute IA', data);

    const itemsArray = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];

    const isValid = (q) =>
      q &&
      typeof q.question === 'string' &&
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      Number.isInteger(q.correct) &&
      q.correct >= 0 &&
      q.correct < q.options.length;

    const seen = new Set();
    const items = itemsArray
      .filter(isValid)
      .filter((q) => {
        const key = q.question.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, count);

    console.log('[Quiz] Questions IA retenues:', items);

    return items.length ? items : null;
  } catch (e) {
    console.warn('IA quiz fallback (local bank):', e?.message || e);
    return null;
  }
}

// --- Construction de session (questions remixées selon mode) ---
const buildSession = async (mode, useAIFlag = false) => {
  const aiSet = useAIFlag ? await fetchAIQuestions({ count: 5 }) : null;
  const hasAI = Array.isArray(aiSet) && aiSet.length >= 3;
  const sourceType = hasAI ? 'ia' : 'local';
  const sourceArray = hasAI ? aiSet : questionsBank;

  console.log(
    '[Quiz] Source utilisée:',
    sourceType === 'ia' ? 'IA' : 'questionsBank'
  );

  const baseSet = sampleSize(sourceArray, Math.min(sourceArray.length, 5)).map(
    (q, idx) => {
      const optionsArray = Array.isArray(q.options) ? q.options : [];
      const idxs = [...optionsArray.keys()];
      const s = shuffle(idxs);
      const opts = s.map((i) => optionsArray[i]);
      const correctIndex = typeof q.correct === 'number' ? q.correct : 0;
      const correct = s.indexOf(correctIndex);
      return {
        ...q,
        id: q.id ?? idx + 1,
        options: opts,
        correct: correct >= 0 ? correct : 0,
        explanation: q.explanation || '',
      };
    }
  );

  if (mode === 'mcq' || mode === 'dragdrop') {
    return { mode, source: sourceType, items: baseSet };
  }

  if (mode === 'reorder') {
    const sequences = [
      {
        id: 'seq-1',
        title: 'Cycle IA (du plus tôt au plus tard)',
        items: ['Cadrage', 'POC', 'MVP', 'Production'],
      },
      {
        id: 'seq-2',
        title: 'Pipeline RAG (ordre logique)',
        items: ['Ingestion', 'Indexation', 'Retrieval', 'Generation'],
      },
      {
        id: 'seq-3',
        title: 'Mesure de valeur (du plus direct au plus indirect)',
        items: ['Temps gagné', 'Revenu', 'Satisfaction', 'Engagement'],
      },
    ];
    const seq = sequences[Math.floor(Math.random() * sequences.length)];
    return {
      mode,
      source: sourceType,
      items: [
        {
          id: seq.id,
          title: seq.title,
          correctOrder: seq.items,
          current: shuffle(seq.items),
        },
      ],
    };
  }

  // >>> SWIPE: garder question + proposition séparées
  if (mode === 'swipe') {
    const candidates = sampleSize(baseSet, Math.min(4, baseSet.length));
    const statements = [];

    candidates.forEach((q) => {
      const opts = Array.isArray(q.options) ? q.options : [];
      if (!opts.length) return;

      // vrai: option correcte
      const correctOpt = opts[q.correct] ?? opts[0];
      statements.push({
        id: `t-${q.id}`,
        text: `${q.question} → « ${correctOpt} »`,
        questionText: q.question,
        optionText: correctOpt,
        truthy: true,
      });

      // faux: une option incorrecte au hasard
      const wrongs = opts.filter((_, i) => i !== q.correct);
      if (wrongs.length) {
        const wrongOpt = wrongs[Math.floor(Math.random() * wrongs.length)];
        statements.push({
          id: `f-${q.id}`,
          text: `${q.question} → « ${wrongOpt} »`,
          questionText: q.question,
          optionText: wrongOpt,
          truthy: false,
        });
      }
    });

    return { mode, source: sourceType, items: shuffle(statements).slice(0, 6) };
  }

  return { mode: 'mcq', source: sourceType, items: baseSet };
};

// ----- Composants utilitaires DnD -----
function SortableRow({ id, label, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      variant="outlined"
      sx={{
        p: 1.2,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        cursor: 'grab',
      }}
    >
      <Typography fontWeight={700}>
        {index + 1}. {label}
      </Typography>
      <IconButton size="small" aria-label="drag" {...attributes} {...listeners}>
        <DragIndicatorIcon />
      </IconButton>
    </Paper>
  );
}

function DraggableChip({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 2 : 1,
    touchAction: 'none',
    willChange: 'transform',
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      variant="outlined"
      {...attributes}
      {...listeners}
      sx={{
        p: 1.5,
        px: 2,
        borderRadius: 999,
        cursor: 'grab',
        borderColor: 'divider',
        userSelect: 'none',
      }}
    >
      <Typography variant="body2" fontWeight={700}>
        {label}
      </Typography>
    </Paper>
  );
}

function DropZone({ id, isActive, flash, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const active = isOver || isActive;
  return (
    <Box
      ref={setNodeRef}
      sx={{
        p: 3,
        mb: 3,
        textAlign: 'center',
        borderRadius: 3,
        border: '2px dashed',
        borderColor: active ? 'primary.main' : '#9ca3af',
        color: active ? 'primary.main' : '#4b5563',
        minHeight: 96,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(102,126,234,0.03)',
        transition: 'border-color .25s ease, background-color .25s ease',
        position: 'relative',
      }}
    >
      {children}
      <Grow in={!!flash} timeout={250} mountOnEnter unmountOnExit>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ position: 'absolute', bottom: 8, right: 12 }}>
          <CheckCircleIcon sx={{ color: '#10b981' }} />
          <Typography variant="caption" fontWeight={700} sx={{ color: '#10b981' }}>
            Déposé
          </Typography>
        </Stack>
      </Grow>
    </Box>
  );
}

const ExpertiseQuiz = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [aiLimitReached, setAiLimitReached] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const rootRef = useRef(null);

  // État global
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // Variante et session
  const [mode, setMode] = useState('mcq');
  const [session, setSession] = useState({ mode: 'mcq', source: 'local', items: [] });
  const lastModeRef = useRef(null);

  // États communs
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  // Spécifiques
  const [reorderItems, setReorderItems] = useState(null);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipeAnswer, setSwipeAnswer] = useState(null);

  // DnD kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Drop flash feedback
  const [dropFlash, setDropFlash] = useState(false);

  // Swipe feedback
  const [swipeFeedbackVisible, setSwipeFeedbackVisible] = useState(false);
  const [swipeCorrect, setSwipeCorrect] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AI_USAGE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const todayKey = getTodayKey();
      if (parsed && parsed.date === todayKey && typeof parsed.count === 'number') {
        setAiUsageCount(parsed.count);
        if (parsed.count >= AI_DAILY_LIMIT) {
          setAiLimitReached(true);
        }
      } else {
        window.localStorage.removeItem(AI_USAGE_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('AI usage storage error (init)', e);
    }
  }, []);

  useEffect(() => {
    try {
      const token =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem('adminToken')
          : null;
      setIsAdmin(!!token);
    } catch (e) {
      console.warn('Admin detection error', e);
      setIsAdmin(false);
    }
  }, []);

  const incrementAIUsage = () => {
    setAiUsageCount((prev) => {
      const next = prev + 1;
      const todayKey = getTodayKey();
      try {
        window.localStorage.setItem(
          AI_USAGE_STORAGE_KEY,
          JSON.stringify({ date: todayKey, count: next })
        );
      } catch (e) {
        console.warn('AI usage storage error (update)', e);
      }
      if (next >= AI_DAILY_LIMIT) {
        setAiLimitReached(true);
      }
      return next;
    });
  };

  // Items count / progress
  const itemsCount = Array.isArray(session.items) ? session.items.length : 0;
  const totalItems = mode === 'reorder' ? 1 : Math.max(itemsCount, 1);
  const progress =
    mode === 'swipe'
      ? ((swipeIndex + 1) / totalItems) * 100
      : ((currentQuestion + 1) / totalItems) * 100;

  // Question courante (MCQ / DragDrop)
  const question =
    (mode === 'mcq' || mode === 'dragdrop') && Array.isArray(session.items)
      ? session.items[currentQuestion]
      : null;

  const appendAnswer = (qid, correct) => {
    setAnswers((prev) => [...prev, { questionId: qid, correct }]);
    if (correct) setScore((p) => p + 1);
  };

  const handleSwipe = (choice) => {
    const itemsArray = Array.isArray(session.items) ? session.items : [];
    const item = itemsArray[swipeIndex];
    if (!item) return;
    const isCorrect = item.truthy === choice;
    setSwipeCorrect(isCorrect);
    setSwipeFeedbackVisible(true);
    appendAnswer(item.id, isCorrect);

    const isLast = swipeIndex >= totalItems - 1;
    setTimeout(() => {
      setSwipeFeedbackVisible(false);
      setSwipeCorrect(null);
      if (isLast) {
        setShowResult(true);
      } else {
        setSwipeIndex((i) => i + 1);
      }
    }, 700);
  };

  // Démarrage d’une nouvelle session
  const startNewSession = async () => {
    setIsBuilding(true);
    try {
      const newMode = nextMode(lastModeRef.current);
      lastModeRef.current = newMode;
      setMode(newMode);

      let newSession = null;

      // 1) On tente d'abord l'IA si activée et si quota dispo
      //    (sauf pour l'admin qui est illimité)
      const canUseAI = useAI && (!aiLimitReached || isAdmin);
      if (canUseAI) {
        const start = Date.now();
        const aiSession = await buildSession(newMode, true);
        const elapsed = Date.now() - start;
        const MIN_AI_BUILD_MS = 3000;

        if (elapsed < MIN_AI_BUILD_MS) {
          await new Promise((res) => setTimeout(res, MIN_AI_BUILD_MS - elapsed));
        }

        // On ne consomme le quota IA que si on a vraiment obtenu des questions IA,
        // et uniquement pour un utilisateur non admin.
        if (
          aiSession &&
          aiSession.source === 'ia' &&
          Array.isArray(aiSession.items) &&
          aiSession.items.length >= 3
        ) {
          newSession = aiSession;
          if (!isAdmin) {
            incrementAIUsage();
          }
        } else {
          console.warn(
            '[Quiz] IA non disponible ou questions invalides, fallback local sans consommer de quota.'
          );
        }
      }

      // 2) Si IA non utilisée ou pas de questions valides, on bascule sur la banque locale
      if (!newSession) {
        const localSession = await buildSession(newMode, false);
        newSession = localSession;
      }

      setSession(newSession);

      // Reset des états du quiz
      setQuizStarted(true);
      setShowResult(false);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswers([]);
      setScore(0);
      setReorderItems(null);
      setSwipeIndex(0);
      setSwipeAnswer(null);

      requestAnimationFrame(() => {
        rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        rootRef.current?.focus({ preventScroll: true });
      });
    } finally {
      setIsBuilding(false);
    }
  };

  // Préparer une session "prochaine variante" au premier rendu (preview, local)
  useEffect(() => {
    let ignore = false;
    const prepare = async () => {
      const firstMode = nextMode(null);
      if (ignore) return;
      lastModeRef.current = firstMode;
      setMode(firstMode);
      const s = await buildSession(firstMode, false); // preview en local
      if (!ignore) setSession(s);
    };
    if (!Array.isArray(session.items) || !session.items.length) prepare();
    return () => {
      ignore = true;
    };
  }, [session.items]);

  // Reorder: charger la séquence au moment où le mode est actif
  useEffect(() => {
    if (mode === 'reorder' && Array.isArray(session.items) && session.items.length) {
      const first = session.items[0] || {};
      setReorderItems({
        id: first.id || 'seq',
        title: first.title || 'Séquence',
        correctOrder: Array.isArray(first.correctOrder) ? first.correctOrder : [],
        current: Array.isArray(first.current) ? first.current : [],
      });
    }
  }, [mode, session.items]);

  // Décompte pendant la génération IA
  useEffect(() => {
    if (!isBuilding || !useAI) {
      setCountdown(null);
      return;
    }

    let remaining = 3;
    setCountdown(remaining);

    const timer = setInterval(() => {
      remaining -= 1;
      setCountdown((prev) => (prev !== null ? remaining : null));
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBuilding, useAI]);

  const handleAnswer = () => {
    let isCorrect = false;

    if (mode === 'mcq' || mode === 'dragdrop') {
      if (selectedAnswer === null || !question) return;
      isCorrect = selectedAnswer === question.correct;
      appendAnswer(question.id, isCorrect);

      if (currentQuestion < (Array.isArray(session.items) ? session.items.length : 0) - 1) {
        setTimeout(() => {
          setCurrentQuestion((p) => p + 1);
          setSelectedAnswer(null);
        }, 300);
      } else {
        setTimeout(() => setShowResult(true), 300);
      }
      return;
    }

    if (mode === 'reorder' && reorderItems) {
      const cur = Array.isArray(reorderItems.current) ? reorderItems.current : [];
      const cor = Array.isArray(reorderItems.correctOrder) ? reorderItems.correctOrder : [];
      isCorrect = cur.length === cor.length && cur.every((v, i) => v === cor[i]);
      appendAnswer(reorderItems.id, isCorrect);
      setTimeout(() => setShowResult(true), 250);
      return;
    }

    // (mode swipe normalement géré par handleSwipe)
    if (mode === 'swipe') {
      const itemsArray = Array.isArray(session.items) ? session.items : [];
      const item = itemsArray[swipeIndex];
      if (!item || swipeAnswer === null) return;
      isCorrect = item.truthy === swipeAnswer;
      appendAnswer(item.id, isCorrect);
      if (swipeIndex < itemsArray.length - 1) {
        setSwipeIndex((i) => i + 1);
        setSwipeAnswer(null);
      } else {
        setTimeout(() => setShowResult(true), 250);
      }
    }
  };

  // UI helpers
  const getScoreLabel = () => {
    const total = mode === 'reorder'
      ? 1
      : (Array.isArray(session.items) && session.items.length ? session.items.length : questionsBank.length);
    const percentage = total > 0 ? (score / total) * 100 : 0;
    if (percentage === 100)
      return { label: '🏆 Expert IA & Product', color: '#10b981', badge: 'Expert' };
    if (percentage >= 80)
      return { label: '🎯 Excellent niveau', color: '#667eea', badge: 'Avancé' };
    if (percentage >= 60)
      return { label: '👍 Bon niveau', color: '#f59e0b', badge: 'Intermédiaire' };
    return { label: '📚 À approfondir', color: '#6b7280', badge: 'Débutant' };
  };

  const shareOnLinkedIn = () => {
    const total = mode === 'reorder'
      ? 1
      : (Array.isArray(session.items) && session.items.length ? session.items.length : questionsBank.length);
    const data = getScoreLabel();
    const text = `Je viens de scorer ${score}/${total} au Quiz d'Expertise IA & Product Management ! 🎯 Niveau: ${data.badge}\n\nTestez vos compétences: ${window.location.href}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}&summary=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  // --- ÉCRAN D’INTRO ---
  if (!quizStarted) {
    const previewCount = Array.isArray(session.items) ? session.items.length : 0;

    return (
      <Box
        id="quiz"
        ref={rootRef}
        tabIndex={-1}
        sx={{
          py: { xs: 6, md: 10 },
          px: 2,
          scrollMarginTop: 80,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            transition: reduceMotion
              ? 'border-color 0.25s ease'
              : 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, border-color 0.35s ease',
            willChange: reduceMotion ? 'auto' : 'transform, box-shadow, border-color',
            transformOrigin: 'center center',
            boxShadow: '0 10px 40px rgba(15,23,42,0.10)',
            '&:hover': {
              transform: reduceMotion ? 'none' : 'translateY(-12px) scale(1.02)',
              boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
              borderColor: 'primary.main',
            },
          }}
        >
          <Fade in timeout={reduceMotion ? 0 : 800}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                textAlign: 'center',
                border: 'none',
                bgcolor: '#ffffff',
                boxShadow: 'none',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha('#667eea', 0.15),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <PsychologyIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              </Box>

              <Typography variant="h4" fontWeight={700} gutterBottom color="#111111">
                🎮 Testez mon expertise
              </Typography>
              <Typography
                variant="h6"
                paragraph
                sx={(t) => ({
                  mb: 4,
                  color:
                    t.palette.mode === 'dark'
                      ? 'rgba(17,17,17,0.82)'
                      : t.palette.text.secondary,
                })}
              >
                Quiz interactif sur l&apos;IA, les LLM et le Product Management
              </Typography>

              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={2}
                justifyContent="center"
                sx={{ mb: 4 }}
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  icon={<StarIcon />}
                  label={`${Math.max(previewCount, 5)} questions`}
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  icon={<SpeedIcon />}
                  label="~5 minutes"
                  sx={(theme) => ({
                    fontWeight: 700,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '& .MuiChip-icon': {
                      color: theme.palette.primary.contrastText,
                    },
                  })}
                />
                <Chip
                  icon={<TrendingUpIcon />}
                  label="Score partageable"
                  sx={(theme) => ({
                    fontWeight: 700,
                    bgcolor: theme.palette.success.main,
                    color: theme.palette.success.contrastText,
                    '& .MuiChip-icon': {
                      color: theme.palette.success.contrastText,
                    },
                  })}
                />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant="body1" fontWeight={600} gutterBottom color="#111111">
                  Thèmes abordés :
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {['IA & LLM', 'RAG', 'Product Management', 'ROI & Métriques', 'Méthodologies Agile'].map(
                    (themeLabel) => (
                      <Chip
                        key={themeLabel}
                        label={themeLabel}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600, my: 0.5 }}
                      />
                    )
                  )}
                </Stack>
              </Box>

              {/* Toggle IA */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="body2" fontWeight={600} color="#111111">
                  Utiliser l&apos;IA :
                </Typography>
                <Button
                  variant={useAI ? 'contained' : 'outlined'}
                  onClick={() => {
                    if ((aiLimitReached && !isAdmin) || isBuilding) return;
                    setUseAI((v) => !v);
                  }}
                  disabled={isBuilding || (aiLimitReached && !isAdmin)}
                  sx={{ fontWeight: 700 }}
                >
                  {aiLimitReached && !isAdmin
                    ? 'Limite IA atteinte'
                    : useAI
                    ? 'IA activée'
                    : 'IA désactivée'}
                </Button>
              </Stack>

              {aiLimitReached && !isAdmin && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  Limite quotidienne d&apos;utilisation de l&apos;IA atteinte pour ce navigateur.
                  Le quiz utilisera ma banque de questions interne.
                </Typography>
              )}

              {useAI && (
                <Chip
                  label="Questions IA générées en temps réel ✨"
                  size="small"
                  color="secondary"
                  sx={{ mb: 3, fontWeight: 600 }}
                />
              )}

              <Typography
                variant="caption"
                sx={(t) => ({
                  display: 'block',
                  mb: 3,
                  color:
                    t.palette.mode === 'dark'
                      ? 'rgba(17,17,17,0.72)'
                      : t.palette.text.secondary,
                })}
              >
                {isAdmin
                  ? "Utilisation de l'IA aujourd'hui : illimitée (mode admin)"
                  : `Utilisation de l'IA aujourd'hui : ${Math.min(aiUsageCount, AI_DAILY_LIMIT)}/${AI_DAILY_LIMIT}`}
              </Typography>

              {/* Prochaine variante + bouton */}
              <Stack
                direction={isMobile ? 'column' : 'row'}
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 2 }}
              >
                <Chip
                  label={`Prochaine variante: ${
                    mode === 'mcq'
                      ? 'Quiz'
                      : mode === 'dragdrop'
                      ? 'Glisser-déposer'
                      : mode === 'reorder'
                      ? 'Reorder'
                      : 'Swipe'
                  }`}
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    mb: isMobile ? 1.5 : 0,
                    mr: isMobile ? 0 : '1rem',
                  }}
                />

                <Button
                  variant="contained"
                  size="medium"
                  onClick={startNewSession}
                  disabled={isBuilding}
                  sx={{
                    px: 3,
                    py: 1,
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    borderRadius: 2.5,
                    boxShadow: '0 4px 14px rgba(102,126,234,0.35)',
                    '&:hover': {
                      transform: isBuilding ? 'none' : 'translateY(-1px)',
                      boxShadow: isBuilding
                        ? '0 4px 14px rgba(102,126,234,0.35)'
                        : '0 8px 20px rgba(102,126,234,0.45)',
                    },
                  }}
                >
                  {isBuilding
                    ? (useAI ? '✨ Génération avec l’IA...' : 'Préparation du quiz...')
                    : '🚀 Commencer le quiz'}
                </Button>
              </Stack>

              {isBuilding && (
                useAI ? (
                  <Box
                    sx={{
                      mt: 3,
                      px: 2,
                      py: 2,
                      borderRadius: 3,
                      bgcolor: alpha('#667eea', 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <CircularProgress size={26} />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" fontWeight={700} color="#111111">
                        L&apos;IA prépare un quiz personnalisé pour vous...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {countdown !== null && countdown > 0
                          ? `Environ ${countdown}s restantes…`
                          : 'Cela prend généralement 3 à 5 secondes. Les questions arrivent dès que l’IA a terminé.'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Je prépare le quiz...
                  </Typography>
                )
              )}

              <Typography
                variant="caption"
                sx={(t) => ({
                  display: 'block',
                  mt: 3,
                  color:
                    t.palette.mode === 'dark'
                      ? 'rgba(17,17,17,0.72)'
                      : t.palette.text.secondary,
                })}
              >
                💡 Prouvez vos compétences et partagez votre score sur LinkedIn
              </Typography>
            </Paper>
          </Fade>
        </Container>
      </Box>
    );
  }

  // --- ÉCRAN RÉSULTAT ---
  if (showResult) {
    const scoreData = getScoreLabel();
    const total = mode === 'reorder'
      ? 1
      : (Array.isArray(session.items) && session.items.length ? session.items.length : questionsBank.length);

    return (
      <Box
        ref={rootRef}
        tabIndex={-1}
        sx={{
          py: { xs: 6, md: 10 },
          px: 2,
          scrollMarginTop: 80,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            transition: reduceMotion
              ? 'border-color 0.25s ease'
              : 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, border-color 0.35s ease',
            willChange: reduceMotion ? 'auto' : 'transform, box-shadow, border-color',
            transformOrigin: 'center center',
            boxShadow: '0 10px 40px rgba(15,23,42,0.10)',
            '&:hover': {
              transform: reduceMotion ? 'none' : 'translateY(-12px) scale(1.02)',
              boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
              borderColor: 'primary.main',
            },
          }}
        >
          <Grow in timeout={reduceMotion ? 0 : 600}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                textAlign: 'center',
                border: 'none',
                bgcolor: '#ffffff',
                boxShadow: 'none',
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: alpha(scoreData.color, 0.15),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  border: `4px solid ${scoreData.color}`,
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 72, color: scoreData.color }} />
              </Box>

              <Typography variant="h4" fontWeight={800} gutterBottom color="#111111">
                {scoreData.label}
              </Typography>

              <Typography variant="h2" fontWeight={800} sx={{ my: 3, color: scoreData.color }}>
                {score}/{total}
              </Typography>

              <Box sx={{ mt: 1.5, mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: 0.1,
                    color: '#111111',
                  }}
                >
                  Source du quiz :{' '}
                  {session.source === 'ia'
                    ? `IA (questions générées en temps réel, ${
                        Array.isArray(session.items) ? session.items.length : 0
                      } questions)`
                    : `Banque de questions perso (${
                        Array.isArray(session.items) ? session.items.length : 0
                      } questions)`}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.75,
                    color: '#4b5563',
                  }}
                >
                  🔁 En relançant, le quiz change de questions et passe dans un autre mode
                  (Quiz / Drag &amp; Drop / Reorder / Swipe).
                </Typography>
              </Box>

              <Chip
                label={`Niveau: ${scoreData.badge}`}
                sx={{
                  mb: 4,
                  px: 2,
                  py: 3,
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  bgcolor: alpha(scoreData.color, 0.15),
                  color: scoreData.color,
                  border: `2px solid ${scoreData.color}`,
                }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Détails réponses */}
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography
                  variant="h6"
                  component="p"
                  fontWeight={700}
                  gutterBottom
                  color="#111111"
                >
                  📋 Détails de vos réponses
                </Typography>

                {(mode === 'mcq' || mode === 'dragdrop') &&
                  (Array.isArray(session.items) ? session.items : []).map((q, idx) => {
                    const userAnswer = answers.find((a) => a.questionId === q.id);
                    return (
                      <Paper
                        key={q.id ?? idx}
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          borderColor: userAnswer?.correct ? '#10b981' : '#ef4444',
                          bgcolor: userAnswer?.correct
                            ? alpha('#10b981', 0.05)
                            : alpha('#ef4444', 0.05),
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          {userAnswer?.correct ? (
                            <CheckCircleIcon sx={{ color: '#10b981' }} />
                          ) : (
                            <CancelIcon sx={{ color: '#ef4444' }} />
                          )}
                          <Typography variant="body2" fontWeight={700} color="#111111">
                            Question {idx + 1}: {q.question}
                          </Typography>
                        </Stack>
                        {q.explanation && (
                          <Typography
                            variant="body2"
                            sx={{
                              pl: 4,
                              mt: 0.5,
                              lineHeight: 1.55,
                              color: '#4b5563',
                            }}
                          >
                            {q.explanation}
                          </Typography>
                        )}
                      </Paper>
                    );
                  })}

                {mode === 'reorder' && reorderItems && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      borderColor:
                        answers[0]?.correct ? '#10b981' : '#ef4444',
                      bgcolor: answers[0]?.correct
                        ? alpha('#10b981', 0.05)
                        : alpha('#ef4444', 0.05),
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      {answers[0]?.correct ? (
                        <CheckCircleIcon sx={{ color: '#10b981' }} />
                      ) : (
                        <CancelIcon sx={{ color: '#ef4444' }} />
                      )}
                      <Typography variant="body2" fontWeight={700} color="#111111">
                        {reorderItems.title}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        pl: 4,
                        mt: 0.5,
                        lineHeight: 1.55,
                        color: '#4b5563',
                      }}
                    >
                      {(() => {
                        const order = Array.isArray(reorderItems.correctOrder)
                          ? reorderItems.correctOrder
                          : [];
                        return `Ordre correct: ${
                          order.length ? order.join(' → ') : '—'
                        }`;
                      })()}
                    </Typography>
                  </Paper>
                )}

                {mode === 'swipe' &&
                  (Array.isArray(session.items) ? session.items : []).map((st, idx) => {
                    const userAnswer = answers[idx];
                    const correct = userAnswer?.correct;
                    return (
                      <Paper
                        key={st.id ?? idx}
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          borderColor: correct ? '#10b981' : '#ef4444',
                          bgcolor: correct
                            ? alpha('#10b981', 0.05)
                            : alpha('#ef4444', 0.05),
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          {correct ? (
                            <CheckCircleIcon sx={{ color: '#10b981' }} />
                          ) : (
                            <CancelIcon sx={{ color: '#ef4444' }} />
                          )}
                          <Typography variant="body2" fontWeight={700} color="#111111">
                            Assertion {idx + 1}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            pl: 4,
                            mt: 0.5,
                            lineHeight: 1.55,
                            color: '#4b5563',
                          }}
                        >
                          {st.questionText}: « {st.optionText} » — attendu:{' '}
                          {st.truthy ? 'Vrai' : 'Faux'}
                        </Typography>
                      </Paper>
                    );
                  })}
              </Box>

              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={2}
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  startIcon={<LinkedInIcon />}
                  onClick={shareOnLinkedIn}
                  disabled={isBuilding}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    bgcolor: '#0077b5',
                    '&:hover': { bgcolor: '#005885' },
                  }}
                >
                  Partager sur LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={startNewSession}
                  disabled={isBuilding}
                  sx={{ px: 4, py: 1.5, fontWeight: 700 }}
                >
                  {isBuilding
                    ? (useAI ? '✨ Nouveau quiz IA en cours...' : 'Préparation du nouveau quiz...')
                    : 'Recommencer'}
                </Button>
              </Stack>

              {isBuilding && (
                useAI ? (
                  <Box
                    sx={{
                      mt: 3,
                      px: 2,
                      py: 2,
                      borderRadius: 3,
                      bgcolor: alpha('#667eea', 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <CircularProgress size={26} />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" fontWeight={700} color="#111111">
                        L&apos;IA génère un nouveau quiz rien que pour vous...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {countdown !== null && countdown > 0
                          ? `Encore ${countdown}s…`
                          : 'Cela prend généralement quelques secondes, le quiz se recharge dès que l’IA a terminé.'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Je prépare un nouveau quiz...
                  </Typography>
                )
              )}

              <Paper sx={{ mt: 4, p: 3, bgcolor: alpha('#667eea', 0.08), borderRadius: 3 }}>
                <Typography variant="body1" fontWeight={700} gutterBottom color="#111111">
                  💼 Intéressé par mon profil ?
                </Typography>
                <Typography
                  variant="body2"
                  paragraph
                  sx={{
                    color: '#4b5563',
                  }}
                >
                  Je suis disponible pour échanger sur vos projets IA et Product Management
                </Typography>
                <Button variant="contained" href="#contact" sx={{ fontWeight: 700 }}>
                  Me contacter
                </Button>
              </Paper>
            </Paper>
          </Grow>
        </Container>
      </Box>
    );
  }

  // --- ÉCRAN QUIZ EN COURS ---
  const dropId = 'answer-dropzone';

  return (
    <Box
      ref={rootRef}
      tabIndex={-1}
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        scrollMarginTop: 80,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          transition: reduceMotion
            ? 'border-color 0.25s ease'
            : 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, border-color 0.35s.ease',
          willChange: reduceMotion ? 'auto' : 'transform, box-shadow, border-color',
          transformOrigin: 'center center',
          boxShadow: '0 10px 40px rgba(15,23,42,0.10)',
          '&:hover': {
            transform: reduceMotion ? 'none' : 'translateY(-12px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
            borderColor: 'primary.main',
          },
        }}
      >
        <Slide direction="up" in timeout={reduceMotion ? 0 : 500}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              border: 'none',
              bgcolor: '#ffffff',
              boxShadow: 'none',
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main' }}>
              SECTION • QUIZ
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Header / Progress */}
            <Box sx={{ mb: 3 }}>
              {mode !== 'reorder' && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2" fontWeight={700} color="#111111">
                    {mode === 'swipe'
                      ? `Question ${swipeIndex + 1} / ${totalItems}`
                      : `Question ${currentQuestion + 1} / ${totalItems}`}
                  </Typography>
                  <Chip
                    size="small"
                    label={
                      mode === 'mcq'
                        ? 'Quiz'
                        : mode === 'dragdrop'
                        ? 'Glisser-déposer'
                        : mode === 'reorder'
                        ? 'Reorder'
                        : 'Swipe'
                    }
                    sx={(theme) => ({
                      fontWeight: 700,
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? alpha('#c7d2fe', 0.25)
                          : 'rgba(102,126,234,0.16)',
                      color: '#111111',
                      '& .MuiChip-label': {
                        fontWeight: 700,
                      },
                    })}
                  />
                </Stack>
              )}
              {mode !== 'reorder' && (
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha('#667eea', 0.15),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#667eea',
                      borderRadius: 4,
                    },
                  }}
                />
              )}
            </Box>

            {/* MCQ */}
            {mode === 'mcq' && question && (
              <>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  color="#111111"
                  sx={{ mb: 4 }}
                >
                  {question.question}
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(Number(e.target.value))}
                  >
                    {(question.options || []).map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      return (
                        <Paper
                          key={index}
                          variant="outlined"
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            bgcolor: 'transparent',
                            transformOrigin: 'center center',
                            transition: reduceMotion
                              ? 'border-color .25s ease'
                              : 'transform .45s cubic-bezier(0.4,0,0.2,1), box-shadow .45s ease, border-color .35s ease',
                            willChange: reduceMotion
                              ? 'auto'
                              : 'transform, box-shadow, border-color',
                            '&:hover': reduceMotion
                              ? {}
                              : {
                                  transform: 'translateY(-8px) scale(1.01)',
                                  boxShadow: '0 18px 45px rgba(15,23,42,0.18)',
                                  borderColor: 'primary.main',
                                },
                          }}
                          onClick={() => setSelectedAnswer(index)}
                        >
                          <FormControlLabel
                            value={index}
                            control={<Radio />}
                            label={
                              <Typography
                                variant="body1"
                                fontWeight={isSelected ? 700 : 400}
                                color="#111111"
                              >
                                {option}
                              </Typography>
                            }
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Paper>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </>
            )}

            {/* DRAGDROP */}
            {mode === 'dragdrop' && question && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { over, active } = event;
                  if (!over) return;
                  if (over.id === dropId) {
                    const idx = Number(String(active.id).replace('opt-', ''));
                    setSelectedAnswer(idx);
                    setDropFlash(true);
                    setTimeout(() => setDropFlash(false), 600);
                  }
                }}
              >
                <Typography
                  variant="h6"
                  component="p"
                  fontWeight={700}
                  color="#111111"
                  sx={{ mb: 2 }}
                >
                  Glissez la bonne réponse dans la zone ci-dessous
                </Typography>
                <Typography variant="h5" fontWeight={700} gutterBottom color="#111111" sx={{ mb: 3 }}>
                  {question.question}
                </Typography>

                <DropZone id={dropId} isActive={selectedAnswer !== null} flash={dropFlash}>
                  {selectedAnswer === null ? (
                    'Déposez la réponse ici'
                  ) : (
                    <Typography fontWeight={800} color="primary.main">
                      {(question.options || [])[selectedAnswer]}
                    </Typography>
                  )}
                </DropZone>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {(question.options || []).map((opt, idx) => (
                    <DraggableChip key={`opt-${idx}`} id={`opt-${idx}`} label={opt} />
                  ))}
                </Stack>
              </DndContext>
            )}

            {/* REORDER */}
            {mode === 'reorder' && reorderItems && (
              <>
                <Typography
                  variant="h6"
                  component="p"
                  fontWeight={700}
                  color="#111111"
                  sx={{ mb: 2 }}
                >
                  Réordonne les éléments pour obtenir l’ordre correct
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#111111" sx={{ mb: 3 }}>
                  {reorderItems.title}
                </Typography>

                <DndContext
                  sensors={sensors}
                  onDragEnd={(evt) => {
                    const { active, over } = evt;
                    if (!reorderItems || !over || active.id === over.id) return;
                    const currentArr = Array.isArray(reorderItems.current)
                      ? reorderItems.current
                      : [];
                    const oldIndex = currentArr.findIndex((i) => i === active.id);
                    const newIndex = currentArr.findIndex((i) => i === over.id);
                    if (oldIndex === -1 || newIndex === -1) return;
                    const newArr = arrayMove(currentArr, oldIndex, newIndex);
                    setReorderItems((r) => ({ ...r, current: newArr }));
                  }}
                >
                  <SortableContext
                    items={Array.isArray(reorderItems.current) ? reorderItems.current : []}
                    strategy={verticalListSortingStrategy}
                  >
                    <Stack spacing={1.2} sx={{ mb: 2 }}>
                      {(Array.isArray(reorderItems.current) ? reorderItems.current : []).map(
                        (label, idx) => (
                          <SortableRow key={label} id={label} label={label} index={idx} />
                        )
                      )}
                    </Stack>
                  </SortableContext>
                </DndContext>
              </>
            )}

            {/* SWIPE */}
            {mode === 'swipe' && (
              <>
                <Typography
                  variant="h6"
                  component="p"
                  fontWeight={700}
                  color="#111111"
                  sx={{ mb: 2 }}
                >
                  Swipe droite = Vrai • Swipe gauche = Faux (ou utilisez les boutons)
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: '#111111',
                    fontWeight: 600,
                  }}
                >
                  Vrai ou Faux ?
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: swipeFeedbackVisible ? (swipeCorrect ? '#10b981' : '#ef4444') : 'divider',
                    bgcolor: swipeFeedbackVisible
                      ? swipeCorrect
                        ? 'rgba(16,185,129,0.06)'
                        : 'rgba(239,68,68,0.06)'
                      : 'transparent',
                    textAlign: 'center',
                    transformOrigin: 'center center',
                    transition: reduceMotion
                      ? 'border-color .2s ease, background-color .2s ease'
                      : 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, border-color 0.25s ease, background-color 0.25s ease',
                    '&:hover': reduceMotion
                      ? {}
                      : {
                          transform: 'translateY(-8px) scale(1.01)',
                          boxShadow: '0 18px 45px rgba(15,23,42,0.18)',
                        },
                  }}
                >
                  {(() => {
                    const itemsArray = Array.isArray(session.items) ? session.items : [];
                    const it = itemsArray[swipeIndex];
                    const questionTxt = it?.questionText || it?.text?.split(' → ')[0] || '';
                    const optionTxt =
                      it?.optionText ||
                      it?.text?.split(' → ')[1]?.replace(/[«»]/g, '') ||
                      '';
                    return (
                      <Stack spacing={1.5} alignItems="center">
                        <Stack spacing={0.5} sx={{ width: '100%' }}>
                          <Typography
                            variant="overline"
                            sx={{
                              color: '#111111',
                              letterSpacing: 1,
                            }}
                          >
                            Question
                          </Typography>
                          <Typography
                            variant="h6"
                            component="p"
                            fontWeight={800}
                            color="#111111"
                          >
                            {questionTxt}
                          </Typography>
                        </Stack>
                        <Stack spacing={0.5} sx={{ width: '100%' }}>
                          <Typography
                            variant="overline"
                            sx={{
                              color: '#111111',
                              letterSpacing: 1,
                            }}
                          >
                            Proposition
                          </Typography>
                          <Paper
                            variant="outlined"
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: 2,
                              bgcolor: 'rgba(102,126,234,0.06)',
                              borderColor: 'primary.light',
                            }}
                          >
                            <Typography
                              variant="h6"
                              component="p"
                              fontWeight={700}
                              sx={{
                                fontStyle: 'italic',
                                color: '#111111',
                              }}
                            >
                              « {optionTxt} »
                            </Typography>
                          </Paper>
                        </Stack>
                        {swipeFeedbackVisible && (
                          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                            {swipeCorrect ? (
                              <>
                                <CheckCircleIcon sx={{ color: '#10b981' }} />
                                <Typography variant="body2" fontWeight={700} sx={{ color: '#10b981' }}>
                                  Correct
                                </Typography>
                              </>
                            ) : (
                              <>
                                <CancelIcon sx={{ color: '#ef4444' }} />
                                <Typography variant="body2" fontWeight={700} sx={{ color: '#ef4444' }}>
                                  Faux
                                </Typography>
                              </>
                            )}
                          </Stack>
                        )}
                      </Stack>
                    );
                  })()}
                </Paper>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="outlined" disabled={swipeFeedbackVisible} onClick={() => handleSwipe(false)}>
                    ← Faux
                  </Button>
                  <Button variant="contained" disabled={swipeFeedbackVisible} onClick={() => handleSwipe(true)}>
                    Vrai →
                  </Button>
                </Stack>
              </>
            )}

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#111111',
                  fontWeight: 600,
                }}
              >
                🎯 Score actuel: <strong>{score}</strong>
              </Typography>
              {mode === 'swipe' ? null : (
                <Button
                  variant="contained"
                  onClick={handleAnswer}
                  disabled={
                    mode === 'mcq' || mode === 'dragdrop'
                      ? selectedAnswer === null
                      : mode === 'reorder'
                      ? false
                      : true
                  }
                  sx={{ px: 4, py: 1.2, fontWeight: 700, minWidth: 120 }}
                >
                  {(mode === 'mcq' || mode === 'dragdrop')
                    ? currentQuestion < totalItems - 1
                      ? 'Suivant'
                      : 'Terminer'
                    : mode === 'reorder'
                    ? 'Terminer'
                    : 'Valider'}
                </Button>
              )}
            </Stack>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default ExpertiseQuiz;