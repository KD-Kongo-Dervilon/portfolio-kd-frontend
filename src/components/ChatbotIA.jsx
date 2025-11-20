// src/components/ChatbotIA.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Fab,
  Slide,
  Fade,
  CircularProgress,
  Tooltip,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Send,
  Close,
  SmartToy,
  Person,
  Psychology,
  TipsAndUpdates,
  Mic,
  MicOff,
  Download,
  VolumeUp,
  VolumeOff,
  PlayArrow,
  Stop
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { trackEvent } from '../utils/analytics';
import { useNavigate } from 'react-router-dom';

const audioCache = new Map();
const MAX_CACHE_SIZE = 20;

const CHATBOT_DAILY_LIMIT = 10;
const CHATBOT_USAGE_KEY = 'chatbot_ia_usage_v1';

const ROUTE_AUTOMATIONS = '/automations'; // À adapter si ta route est différente
const ROUTE_BLOG = '/blog'; // À adapter si nécessaire
const ROUTE_CV = '/cv'; // Route de la page CV ou section profil

// URL de téléchargement du CV (peut être une page ou un PDF direct)
const CV_DOWNLOAD_URL = process.env.REACT_APP_CV_URL || ROUTE_CV;

const getTodayKey = () => {
  try {
    return new Date().toISOString().slice(0, 10);
  } catch {
    return '';
  }
};

const ChatbotIA = () => {
  const visuallyHidden = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1
  };

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const highContrast = useMediaQuery('(forced-colors: active)');
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Bonjour ! 👋 Je suis l'assistant IA de Dervilon. Je connais parfaitement son profil, son expérience et ses compétences. N'hésitez pas à me poser toutes vos questions !",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [chatbotUsageCount, setChatbotUsageCount] = useState(0);
  const [chatbotLimitReached, setChatbotLimitReached] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const [liveAnnounce, setLiveAnnounce] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const API_URL = `${API_BASE_URL}/api`;
  const navigate = useNavigate();

  // Détection d'intention "prendre rendez-vous"
  const detectRdvIntent = (text = '') => {
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

  // Suggestions de pages (Automations / Blog / CV) en fonction de la question
  const detectPageSuggestions = (text = '') => {
    const lower = text.toLowerCase();
    const suggestions = [];

    // Intent "Automatisations / n8n"
    if (
      lower.includes('automatisation') ||
      lower.includes('automatiser') ||
      lower.includes('n8n') ||
      lower.includes('workflow') ||
      lower.includes('processus') ||
      lower.includes('automation')
    ) {
      suggestions.push('automations');
    }

    // Intent "Blog / articles / cas d'usage"
    if (
      lower.includes('blog') ||
      lower.includes('article') ||
      lower.includes("cas d'usage") ||
      lower.includes('case study') ||
      lower.includes('étude de cas')
    ) {
      suggestions.push('blog');
    }

    // Intent "CV / parcours complet"
    if (
      lower.includes('cv') ||
      lower.includes('curriculum') ||
      lower.includes('parcours complet') ||
      lower.includes('profil détaillé') ||
      lower.includes('télécharger ton cv') ||
      lower.includes('télécharger votre cv')
    ) {
      suggestions.push('cv');
    }

    // On renvoie des suggestions uniques
    return [...new Set(suggestions)];
  };

  const buildSuggestionMessage = (suggestions) => {
    const lines = [];

    if (suggestions.includes('automations')) {
      lines.push(
        "🧩 Pour voir des exemples concrets d'automatisations (notamment avec n8n), tu peux consulter la page « Automatisations & n8n » dans le menu du portfolio."
      );
    }

    if (suggestions.includes('blog')) {
      lines.push(
        '📝 Dervilon partage aussi ses analyses et retours d’expérience sur la page Blog du portfolio.'
      );
    }

    if (suggestions.includes('cv')) {
      lines.push(
        `📄 Tu peux consulter ou télécharger le CV complet de Dervilon ici : ${CV_DOWNLOAD_URL}`
      );
    }

    return lines.join('\n\n');
  };

  // --- Theme intent helpers ---
  const detectThemeChangeIntent = (text = '') => {
    const lower = text.toLowerCase();

    if (
      lower.includes('thème par défaut') ||
      lower.includes('theme par defaut') ||
      lower.includes('remet le thème normal') ||
      lower.includes('remets le thème normal') ||
      lower.includes('thème classique')
    ) {
      return 'default';
    }

    if (lower.includes('noël') || lower.includes('noel')) {
      return 'noel';
    }

    if (
      lower.includes('nouvel an') ||
      lower.includes('nouveau an') ||
      lower.includes('new year')
    ) {
      return 'nouvel-an';
    }

    if (lower.includes('halloween')) {
      return 'halloween';
    }

    if (
      lower.includes('rentrée scolaire') ||
      lower.includes('rentrée') ||
      lower.includes('rentree') ||
      lower.includes('back to school')
    ) {
      return 'rentree';
    }

    if (
      lower.includes('pâques') ||
      lower.includes('paques') ||
      lower.includes('easter')
    ) {
      return 'paques';
    }

    return null;
  };

  const getThemeLabel = (key) => {
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

  const applyThemeChangeFromChatbot = (themeKey, setMessagesFn) => {
    if (!themeKey) return;

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('kd-theme-change', {
            detail: { theme: themeKey }
          })
        );
      }

      const label = getThemeLabel(themeKey);
      const confirmationMessage = {
        type: 'bot',
        text: `Parfait, je viens d'appliquer le ${label} sur le portfolio.`,
        timestamp: new Date()
      };

      setMessagesFn((prev) => [...prev, confirmationMessage]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors du changement de thème depuis le chatbot:', e);
    }
  };

  // Contexte profil envoyé au backend à chaque requête
  const profileContext = `
  Données structurées sur le profil de Dervilon Mbissi Kongo :
  
  - Diplômes :
    - Formation BAC+5 / Master en Product Management (MediaSchools & OpenClassrooms, 2023-2024).
    - Formation en développement frontend (JavaScript / React) avec OpenClassrooms (2021-2022).
  - Compétences clés :
    - Product Management : cadrage produit, discovery, priorisation, gestion de backlog, animation de sprints, roadmapping.
    - Développement web frontend : HTML, CSS, JavaScript, React.js.
    - Culture IA et automatisation appliquées aux produits pédagogiques et digitaux.
  - Expérience significative :
    - Année de professionnalisation chez Ludicius à Nantes (serious games).
    - Rôle de Chef de Projet IA / Product : mise en place d’automatisations et conception d’un éditeur d’activités pédagogiques (QCM, scénarios interactifs, activités gamifiées).
  - Soft skills :
    - Pédagogie, écoute, adaptabilité, rigueur, orientation valeur utilisateur, aisance avec les équipes pluridisciplinaires.
  - Objectif :
    - Occuper un poste orienté Product Owner / Product Manager / Chef de projet IA & outils pédagogiques numériques, avec un focus sur l’impact concret et mesurable.
  `;

  const suggestedQuestions = [
    "Parle-moi de Dervilon",
    "Pourquoi l'embaucher ?",
    "Quelle est son expertise en IA ?",
    "Quels résultats a-t-il obtenus ?"
  ];

  // 🚀 États pour le flow RDV conversationnel
  const [rdvMode, setRdvMode] = useState(false);
  const [rdvStep, setRdvStep] = useState(0);
  const [rdvData, setRdvData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    preferredSlot: '',
    initialIntent: ''
  });
  const [isCreatingRdv, setIsCreatingRdv] = useState(false);

  // TTS ElevenLabs avec cache
  const speakWithElevenLabs = async (text) => {
    if (!voiceEnabled) {
      console.log('🔇 Réponses vocales désactivées');
      return;
    }

    const cacheKey = text.substring(0, 100).trim();

    if (audioCache.has(cacheKey)) {
      console.log('✅ Audio trouvé en cache');
      const cachedAudioData = audioCache.get(cacheKey);
      const audio = new Audio(cachedAudioData);

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        setIsSpeaking(false);
        speak(text); // fallback
      };

      await audio.play();
      return;
    }

    console.log('🎙️ ElevenLabs TTS demandé:', text.substring(0, 50));
    setIsSpeaking(true);

    try {
      const response = await fetch(`${API_URL}/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (data.success) {
        const audioData = `data:audio/mpeg;base64,${data.audio}`;

        // Cache FIFO
        if (audioCache.size >= MAX_CACHE_SIZE) {
          const firstKey = audioCache.keys().next().value;
          audioCache.delete(firstKey);
        }
        audioCache.set(cacheKey, audioData);

        const audio = new Audio(audioData);

        audio.onplay = () => {
          console.log('🔊 Lecture ElevenLabs démarrée');
          setIsSpeaking(true);
        };

        audio.onended = () => {
          console.log('✅ Lecture terminée');
          setIsSpeaking(false);
        };

        audio.onerror = (e) => {
          console.error('❌ Erreur lecture audio:', e);
          setIsSpeaking(false);
          speak(text);
        };

        await audio.play();
      } else {
        console.error('❌ Erreur ElevenLabs:', data.error);
        setIsSpeaking(false);
        speak(text);
      }
    } catch (err) {
      console.error('❌ Erreur ElevenLabs:', err);
      setIsSpeaking(false);
      speak(text);
    }
  };

  // Fallback TTS navigateur
  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current) return;

    synthRef.current.cancel();

    const cleanText = text
      .replace(/[😊🚀💼🎯✅📊🤖💡👋📧☎️🔥💪😎🎓📱💬⚡👥📈🌟🎉✨🔍📋🇫🇷]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n\n+/g, '. ')
      .replace(/\n/g, ', ')
      .replace(/\s+/g, ' ')
      .substring(0, 400)
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    const voices = synthRef.current.getVoices();
    const frenchVoice =
      voices.find(
        (v) =>
          v.lang === 'fr-FR' &&
          v.name.toLowerCase().includes('female')
      ) || voices.find((v) => v.lang === 'fr-FR');

    if (frenchVoice) utterance.voice = frenchVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Chargement des voix
  useEffect(() => {
    const loadVoices = () => {
      if (synthRef.current) {
        const voices = synthRef.current.getVoices();
        console.log(`🎤 ${voices.length} voix chargées`);
      }
    };

    loadVoices();

    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialisation reconnaissance vocale
  useEffect(() => {
    if (
      'webkitSpeechRecognition' in window ||
      'SpeechRecognition' in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'fr-FR';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        setTimeout(() => handleSendVoice(transcript), 300);
      };

      recognitionInstance.onerror = () => setIsListening(false);
      recognitionInstance.onend = () => setIsListening(false);

      setRecognition(recognitionInstance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Limite quotidienne d'utilisation du chatbot
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CHATBOT_USAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const today = getTodayKey();
      if (parsed && parsed.date === today && typeof parsed.count === 'number') {
        setChatbotUsageCount(parsed.count);
        if (parsed.count >= CHATBOT_DAILY_LIMIT) {
          setChatbotLimitReached(true);
        }
      } else {
        window.localStorage.removeItem(CHATBOT_USAGE_KEY);
      }
    } catch (e) {
      console.warn('Chatbot usage storage error (init)', e);
    }
  }, []);

  const incrementChatbotUsage = () => {
    setChatbotUsageCount((prev) => {
      const next = prev + 1;
      const today = getTodayKey();
      try {
        window.localStorage.setItem(
          CHATBOT_USAGE_KEY,
          JSON.stringify({ date: today, count: next })
        );
      } catch (e) {
        console.warn('Chatbot usage storage error (update)', e);
      }
      if (next >= CHATBOT_DAILY_LIMIT) {
        setChatbotLimitReached(true);
      }
      return next;
    });
  };

  // ✅ scrollToBottom mémoïsé pour satisfaire react-hooks/exhaustive-deps
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
  }, [reduceMotion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleListening = () => {
    if (!recognition) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Erreur reconnaissance vocale:', err);
        setIsListening(false);
      }
    }
  };

  // 🔁 Flow RDV : démarrage + étapes + création côté backend
  const startRdvFlow = (initialText) => {
    setRdvMode(true);
    setRdvStep(1);
    setRdvData((prev) => ({
      ...prev,
      initialIntent: (initialText || '').trim()
    }));

    const botMessage = {
      type: 'bot',
      text:
        "Super, on peut prévoir un rendez-vous ensemble. Pour commencer, peux-tu me donner ton prénom et ton nom ?",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const createMeetingRequest = async (finalPreferredSlot) => {
    try {
      setIsCreatingRdv(true);

      const contextSnippet = messages
        .map((m) => `${m.type === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.text}`)
        .slice(-8)
        .join('\n');

      const payload = {
        fullName: rdvData.fullName,
        email: rdvData.email,
        company: rdvData.company,
        phone: rdvData.phone,
        preferredSlot: finalPreferredSlot || rdvData.preferredSlot,
        message: rdvData.initialIntent,
        source: 'chatbot',
        context: contextSnippet
      };

      const response = await fetch(`${API_URL}/agents/meeting-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📅 RDV créé:', data);

      const successMessage = {
        type: 'bot',
        text:
          'Merci, j’ai bien enregistré ta demande de rendez-vous. Dervilon va te recontacter rapidement pour confirmer le créneau.',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, successMessage]);
    } catch (err) {
      console.error('❌ Erreur création RDV :', err);
      const errorMessage = {
        type: 'bot',
        text:
          "⚠️ Une erreur est survenue lors de la création du rendez-vous. Tu peux aussi contacter directement Dervilon :\n📧 dervilon.mbissi@gmail.com\n📞 06-36-15-88-31",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsCreatingRdv(false);
      setRdvMode(false);
      setRdvStep(0);
      setRdvData({
        fullName: '',
        email: '',
        company: '',
        phone: '',
        preferredSlot: '',
        initialIntent: ''
      });
    }
  };

  const handleRdvStep = async (answer) => {
    const trimmed = (answer || '').trim();

    if (!trimmed) {
      const retryMessage = {
        type: 'bot',
        text: "Je n'ai pas bien compris. Peux-tu reformuler s'il te plaît ?",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, retryMessage]);
      return;
    }

    if (rdvStep === 1) {
      setRdvData((prev) => ({ ...prev, fullName: trimmed }));
      setRdvStep(2);
      const botMessage = {
        type: 'bot',
        text: "Merci ! Quel est ton email pour que Dervilon puisse te répondre ?",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    if (rdvStep === 2) {
      const email = trimmed;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const botMessage = {
          type: 'bot',
          text:
            "L'email ne semble pas valide. Peux-tu me donner une adresse email correcte (ex: prenom.nom@exemple.com) ?",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }
      setRdvData((prev) => ({ ...prev, email }));
      setRdvStep(3);
      const botMessage = {
        type: 'bot',
        text:
          "Parfait. Si tu as une entreprise, peux-tu me dire son nom ? (Sinon, dis juste « aucune »)",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    if (rdvStep === 3) {
      setRdvData((prev) => ({ ...prev, company: trimmed === 'aucune' ? '' : trimmed }));
      setRdvStep(4);
      const botMessage = {
        type: 'bot',
        text:
          "As-tu un numéro de téléphone où Dervilon peut te joindre ? (Tu peux répondre « non » si tu préfères rester sur l’email)",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    if (rdvStep === 4) {
      if (trimmed.toLowerCase() !== 'non') {
        setRdvData((prev) => ({ ...prev, phone: trimmed }));
      }
      setRdvStep(5);
      const botMessage = {
        type: 'bot',
        text:
          "Dernière question : quels sont les créneaux qui t’arrangent le mieux ? (par exemple : « mardi entre 14h et 16h » ou « plutôt en fin de journée »)",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    if (rdvStep === 5) {
      setRdvData((prev) => ({ ...prev, preferredSlot: trimmed }));
      await createMeetingRequest(trimmed);
    }
  };

  const handleSendVoice = async (transcript) => {
    if (chatbotLimitReached) {
      setError("Limite quotidienne d'utilisation de l'IA atteinte.");
      return;
    }

    if (!transcript.trim()) return;

    const userMessage = {
      type: 'user',
      text: transcript,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    // Log vocal question to analytics
    try {
      trackEvent('Chatbot', 'Question vocale', transcript, {
        type: 'chatbot_question',
        source: 'chatbot',
        channel: 'voice'
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Erreur analytics chatbot (voice):', e);
    }

    // Si on est déjà dans le flow RDV, on continue les étapes
    if (rdvMode) {
      await handleRdvStep(transcript);
      setIsTyping(false);
      return;
    }

    // Si l'intention RDV est détectée, on démarre le flow dédié
    if (detectRdvIntent(transcript)) {
      startRdvFlow(transcript);
      setIsTyping(false);
      return;
    }

    // Détection d'intention de changement de thème
    const themeKey = detectThemeChangeIntent(transcript);
    if (themeKey) {
      applyThemeChangeFromChatbot(themeKey, setMessages);
      setIsTyping(false);
      return;
    }

    try {
      const conversationHistory = messages
        .filter((m) => m.type !== 'system')
        .map((m) => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      console.log("📤 Envoi vocal à l'API:", transcript);

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: transcript,
          conversationHistory,
          profileContext
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Réponse API:', data);

      if (data.success) {
        const botResponse = {
          type: 'bot',
          text: data.response,
          timestamp: new Date()
        };

        // Suggestions de pages en fonction de la question vocale
        const suggestions = detectPageSuggestions(transcript);

        setMessages((prev) => {
          const next = [...prev, botResponse];
          if (suggestions.length > 0) {
            next.push({
              type: 'bot',
              text: buildSuggestionMessage(suggestions),
              suggestions,
              timestamp: new Date()
            });
          }
          return next;
        });

        setLiveAnnounce(
          `Nouvelle réponse de l'assistant à ${new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}.`
        );
        incrementChatbotUsage();
        setTimeout(() => {
          console.log('🔊 Lancement ElevenLabs TTS...');
          speakWithElevenLabs(data.response);
        }, 800);
      } else {
        throw new Error(data.error || 'Erreur API');
      }
    } catch (err) {
      console.error('❌ Erreur:', err);

      const errorMsg = err.message.includes('fetch')
        ? "Le serveur backend n'est pas accessible. Vérifiez qu'il tourne sur le port 3001."
        : 'Erreur lors de la communication avec l’IA.';

      setError(errorMsg);

      const errorMessage = {
        type: 'bot',
        text: `⚠️ ${errorMsg}\n\nVous pouvez contacter Dervilon directement :\n📧 dervilon.mbissi@gmail.com\n📞 06-36-15-88-31`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (chatbotLimitReached) {
      setError("Limite quotidienne d'utilisation de l'IA atteinte.");
      return;
    }

    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    setError(null);

    // Log text question to analytics
    try {
      trackEvent('Chatbot', 'Question texte', currentInput, {
        type: 'chatbot_question',
        source: 'chatbot',
        channel: 'text'
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Erreur analytics chatbot (text):', e);
    }

    // Flow RDV en cours : on continue les étapes
    if (rdvMode) {
      await handleRdvStep(currentInput);
      setIsTyping(false);
      return;
    }

    // Détection d'intention RDV : on lance le flow dédié
    if (detectRdvIntent(currentInput)) {
      startRdvFlow(currentInput);
      setIsTyping(false);
      return;
    }

    // Détection d'intention de changement de thème
    const themeKey = detectThemeChangeIntent(currentInput);
    if (themeKey) {
      applyThemeChangeFromChatbot(themeKey, setMessages);
      setIsTyping(false);
      return;
    }

    try {
      const conversationHistory = messages
        .filter((m) => m.type !== 'system')
        .map((m) => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      console.log("📤 Envoi à l'API:", currentInput);

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory,
          profileContext
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Réponse API:', data);

      if (data.success) {
        const botResponse = {
          type: 'bot',
          text: data.response,
          timestamp: new Date()
        };

        // Suggestions de pages en fonction de la question texte
        const suggestions = detectPageSuggestions(currentInput);

        setMessages((prev) => {
          const next = [...prev, botResponse];
          if (suggestions.length > 0) {
            next.push({
              type: 'bot',
              text: buildSuggestionMessage(suggestions),
              suggestions,
              timestamp: new Date()
            });
          }
          return next;
        });

        setLiveAnnounce(
          `Nouvelle réponse de l'assistant à ${new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}.`
        );
        incrementChatbotUsage();
      } else {
        throw new Error(data.error || 'Erreur API');
      }
    } catch (err) {
      console.error('❌ Erreur:', err);

      const errorMsg = err.message.includes('fetch')
        ? "Le serveur backend n'est pas accessible. Vérifiez qu'il tourne sur le port 3001."
        : 'Erreur lors de la communication avec l’IA.';

      setError(errorMsg);

      const errorMessage = {
        type: 'bot',
        text: `⚠️ ${errorMsg}\n\nVous pouvez contacter Dervilon directement :\n📧 dervilon.mbissi@gmail.com\n📞 06-36-15-88-31`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(
        (m) =>
          `[${m.timestamp.toLocaleTimeString()}] ${
            m.type === 'user' ? 'Vous' : 'Assistant IA'
          }: ${m.text}`
      )
      .join('\n\n');

    const blob = new Blob([conversationText], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-dervilon-ia-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div aria-live="polite" aria-atomic="true" style={visuallyHidden}>
        {liveAnnounce}
      </div>

      {!open && (
        <Tooltip title="Ouvrir l'assistant IA" arrow placement="left" disableInteractive>
          <Fab
            aria-label="Ouvrir l'assistant IA"
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: theme.palette.primary.contrastText,
              width: 64,
              height: 64,
              zIndex: (theme) => theme.zIndex.modal + 25,
              boxShadow: '0 10px 28px rgba(17, 24, 39, 0.45)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
              outline: highContrast ? '2px solid ButtonText' : 'none',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                boxShadow: '0 14px 36px rgba(17,24,39,0.55)',
                transform: reduceMotion ? 'none' : 'translateY(-2px) scale(1.04)'
              },
              '&:active': {
                transform: 'scale(0.98)'
              },
              '&:focus-visible': {
                boxShadow: 'var(--focus-ring)'
              }
            }}
            onClick={() => setOpen(true)}
          >
            <SmartToy sx={{ fontSize: 32 }} aria-hidden="true" focusable="false" />
          </Fab>
        </Tooltip>
      )}

      <Slide
        direction="up"
        in={open}
        mountOnEnter
        unmountOnExit
        timeout={reduceMotion ? 0 : 250}
      >
        <Paper
          component="section"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: {
              xs: 'calc(100vw - 32px)',
              sm: 420
            },
            height: {
              xs: 'calc(100vh - 104px)', // 32px margin + ~72px app bar
              sm: 650
            },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: (theme) => theme.zIndex.modal + 20,
            boxShadow: '0 12px 48px rgba(0,0,0,0.25)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: theme.palette.primary.contrastText,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              outline: highContrast ? '1px solid ButtonText' : 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 40,
                  height: 40
                }}
              >
                <Psychology aria-hidden="true" focusable="false" />
              </Avatar>
              <Box>
                <Typography
                  id="chatbot-title"
                  component="h2"
                  variant="subtitle1"
                  fontWeight={600}
                >
                  Assistant IA Dervilon
                </Typography>
                <Chip
                  size="small"
                  label={`⚡ Alimenté par GPT-4${isSpeaking ? ' 🔊' : ''}`}
                  sx={{
                    height: 24,
                    bgcolor: 'rgba(255,255,255,0.98)',
                    color: theme.palette.primary.dark,
                    fontWeight: 700,
                    letterSpacing: 0.2,
                    borderRadius: 1,
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.72rem'
                    },
                    outline: highContrast ? '1px solid ButtonText' : 'none'
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {/* Toggle voix */}
              <Tooltip
                title={
                  voiceEnabled
                    ? 'Désactiver les réponses vocales'
                    : 'Activer les réponses vocales'
                }
              >
                <IconButton
                  onClick={() => {
                    setVoiceEnabled(!voiceEnabled);
                    if (voiceEnabled) stopSpeaking();
                  }}
                  aria-label={
                    voiceEnabled
                      ? 'Désactiver les réponses vocales'
                      : 'Activer les réponses vocales'
                  }
                  aria-pressed={voiceEnabled}
                  sx={{
                    color: 'white',
                    '&:focus-visible': {
                      outline: '2px solid #ffffff'
                    }
                  }}
                  size="small"
                >
                  {voiceEnabled ? (
                    <VolumeUp fontSize="small" aria-hidden="true" focusable="false" />
                  ) : (
                    <VolumeOff fontSize="small" aria-hidden="true" focusable="false" />
                  )}
                </IconButton>
              </Tooltip>

              {/* Export */}
              <Tooltip title="Exporter la conversation">
                <IconButton
                  onClick={exportConversation}
                  aria-label="Exporter la conversation"
                  sx={{
                    color: 'white',
                    '&:focus-visible': {
                      outline: '2px solid #ffffff'
                    }
                  }}
                  size="small"
                >
                  <Download fontSize="small" aria-hidden="true" focusable="false" />
                </IconButton>
              </Tooltip>

              {/* Close */}
              <IconButton
                onClick={() => setOpen(false)}
                aria-label="Fermer l'assistant"
                sx={{
                  color: 'white',
                  '&:focus-visible': {
                    outline: '2px solid #ffffff'
                  }
                }}
                size="small"
              >
                <Close aria-hidden="true" focusable="false" />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            role="list"
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {messages.map((message, index) => (
              <Box key={index} role="listitem">
                {reduceMotion ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: 1
                    }}
                    aria-label={`${
                      message.type === 'user' ? 'Vous' : 'Assistant'
                    } — ${message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`}
                  >
                    {message.type === 'bot' && (
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.dark,
                          width: 32,
                          height: 32
                        }}
                      >
                        <SmartToy
                          sx={{ fontSize: 18 }}
                          aria-hidden="true"
                          focusable="false"
                        />
                      </Avatar>
                    )}
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '80%',
                        bgcolor:
                          message.type === 'user'
                            ? theme.palette.primary.dark
                            : theme.palette.background.paper,
                        color:
                          message.type === 'user'
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                        borderRadius: 2,
                        whiteSpace: 'pre-line',
                        position: 'relative',
                        border:
                          message.type === 'user'
                            ? 'none'
                            : `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {message.text}
                      </Typography>
                      {message.suggestions &&
                        Array.isArray(message.suggestions) &&
                        message.suggestions.length > 0 && (
                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.5
                            }}
                          >
                            {message.suggestions.includes('automations') && (
                              <Chip
                                label="Voir les automatisations n8n"
                                size="small"
                                onClick={() => navigate(ROUTE_AUTOMATIONS)}
                                sx={{
                                  fontSize: '0.7rem',
                                  cursor: 'pointer'
                                }}
                              />
                            )}
                            {message.suggestions.includes('blog') && (
                              <Chip
                                label="Voir les articles du blog"
                                size="small"
                                onClick={() => navigate(ROUTE_BLOG)}
                                sx={{
                                  fontSize: '0.7rem',
                                  cursor: 'pointer'
                                }}
                              />
                            )}
                            {message.suggestions.includes('cv') && (
                              <Chip
                                label="Ouvrir le CV de Dervilon"
                                size="small"
                                onClick={() =>
                                  window.open(CV_DOWNLOAD_URL, '_blank', 'noopener,noreferrer')
                                }
                                sx={{
                                  fontSize: '0.7rem',
                                  cursor: 'pointer'
                                }}
                              />
                            )}
                          </Box>
                        )}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 0.5
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={(theme) => ({
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color:
                              theme.palette.mode === 'dark'
                                ? 'rgba(148,163,184,0.95)'
                                : 'rgba(107,114,128,0.95)',
                          })}
                        >
                          {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        {message.type === 'bot' && (
                          <IconButton
                            size="small"
                            onClick={() => speakWithElevenLabs(message.text)}
                            aria-label={
                              isSpeaking
                                ? 'Arrêter la lecture du message'
                                : 'Lire ce message'
                            }
                            sx={{
                              ml: 1,
                              p: 0.5,
                              color: theme.palette.primary.dark,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.dark, 0.08)
                              },
                              '&:focus-visible': {
                                boxShadow: 'var(--focus-ring)'
                              }
                            }}
                          >
                            {isSpeaking ? (
                              <Stop
                                sx={{ fontSize: 14 }}
                                aria-hidden="true"
                                focusable="false"
                              />
                            ) : (
                              <PlayArrow
                                sx={{ fontSize: 14 }}
                                aria-hidden="true"
                                focusable="false"
                              />
                            )}
                          </IconButton>
                        )}
                      </Box>
                    </Paper>
                    {message.type === 'user' && (
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.success.main,
                          width: 32,
                          height: 32
                        }}
                      >
                        <Person
                          sx={{ fontSize: 18 }}
                          aria-hidden="true"
                          focusable="false"
                        />
                      </Avatar>
                    )}
                  </Box>
                ) : (
                  <Fade in appear timeout={220}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          message.type === 'user' ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-start',
                        gap: 1
                      }}
                      aria-label={`${
                        message.type === 'user' ? 'Vous' : 'Assistant'
                      } — ${message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`}
                    >
                      {message.type === 'bot' && (
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.dark,
                            width: 32,
                            height: 32
                          }}
                        >
                          <SmartToy
                            sx={{ fontSize: 18 }}
                            aria-hidden="true"
                            focusable="false"
                          />
                        </Avatar>
                      )}
                      <Paper
                        sx={{
                          p: 1.5,
                          maxWidth: '80%',
                          bgcolor:
                            message.type === 'user'
                              ? theme.palette.primary.dark
                              : theme.palette.background.paper,
                          color:
                            message.type === 'user'
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                          borderRadius: 2,
                          whiteSpace: 'pre-line',
                          position: 'relative',
                          border:
                            message.type === 'user'
                              ? 'none'
                              : `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {message.text}
                        </Typography>
                        {message.suggestions &&
                          Array.isArray(message.suggestions) &&
                          message.suggestions.length > 0 && (
                            <Box
                              sx={{
                                mt: 1,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5
                              }}
                            >
                              {message.suggestions.includes('automations') && (
                                <Chip
                                  label="Voir les automatisations n8n"
                                  size="small"
                                  onClick={() => navigate(ROUTE_AUTOMATIONS)}
                                  sx={{
                                    fontSize: '0.7rem',
                                    cursor: 'pointer'
                                  }}
                                />
                              )}
                              {message.suggestions.includes('blog') && (
                                <Chip
                                  label="Voir les articles du blog"
                                  size="small"
                                  onClick={() => navigate(ROUTE_BLOG)}
                                  sx={{
                                    fontSize: '0.7rem',
                                    cursor: 'pointer'
                                  }}
                                />
                              )}
                              {message.suggestions.includes('cv') && (
                                <Chip
                                  label="Ouvrir le CV de Dervilon"
                                  size="small"
                                  onClick={() =>
                                    window.open(CV_DOWNLOAD_URL, '_blank', 'noopener,noreferrer')
                                  }
                                  sx={{
                                    fontSize: '0.7rem',
                                    cursor: 'pointer'
                                  }}
                                />
                              )}
                            </Box>
                          )}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 0.5
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={(theme) => ({
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              color:
                                theme.palette.mode === 'dark'
                                  ? 'rgba(148,163,184,0.95)'
                                  : 'rgba(107,114,128,0.95)',
                            })}
                          >
                            {message.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          {message.type === 'bot' && (
                            <IconButton
                              size="small"
                              onClick={() => speakWithElevenLabs(message.text)}
                              aria-label={
                                isSpeaking
                                  ? 'Arrêter la lecture du message'
                                  : 'Lire ce message'
                              }
                              sx={{
                                ml: 1,
                                p: 0.5,
                                color: theme.palette.primary.dark,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.dark, 0.08)
                                },
                                '&:focus-visible': {
                                  boxShadow: 'var(--focus-ring)'
                                }
                              }}
                            >
                              {isSpeaking ? (
                                <Stop
                                  sx={{ fontSize: 14 }}
                                  aria-hidden="true"
                                  focusable="false"
                                />
                              ) : (
                                <PlayArrow
                                  sx={{ fontSize: 14 }}
                                  aria-hidden="true"
                                  focusable="false"
                                />
                              )}
                            </IconButton>
                          )}
                        </Box>
                      </Paper>
                      {message.type === 'user' && (
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.success.main,
                            width: 32,
                            height: 32
                          }}
                        >
                          <Person
                            sx={{ fontSize: 18 }}
                            aria-hidden="true"
                            focusable="false"
                          />
                        </Avatar>
                      )}
                    </Box>
                  </Fade>
                )}
              </Box>
            ))}

            {isTyping && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    width: 32,
                    height: 32
                  }}
                >
                  <SmartToy sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    borderRadius: 2
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      alignItems: 'center'
                    }}
                  >
                    <CircularProgress size={8} />
                    <Typography
                      variant="caption"
                      sx={{ ml: 1 }}
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      L&apos;IA réfléchit…
                      {isCreatingRdv ? ' (création du rendez-vous en cours)' : ''}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Suggestions */}
          {messages.length === 1 && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'white',
                borderTop: '1px solid #e0e0e0'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1
                }}
              >
                <TipsAndUpdates
                  sx={{
                    fontSize: 18,
                    color: 'primary.main'
                  }}
                  aria-hidden="true"
                  focusable="false"
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    color: '#0f172a',
                  }}
                >
                  Questions suggérées :
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5
                }}
              >
                {suggestedQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    size="small"
                    onClick={() => handleSuggestedQuestion(question)}
                    aria-label={`Question suggérée: ${question}`}
                    sx={(theme) => ({
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      borderRadius: 999,
                      px: 1.4,
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.primary.main, 0.18)
                          : alpha(theme.palette.primary.main, 0.08),
                      color: '#0f172a',
                      '& .MuiChip-label': {
                        py: 0.4,
                      },
                      '&:hover': {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText
                      }
                    })}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'white',
              borderTop: '1px solid #e0e0e0'
            }}
          >
            {chatbotLimitReached && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mb: 0.5, display: 'block' }}
              >
                Limite quotidienne d&apos;utilisation atteinte ({CHATBOT_DAILY_LIMIT}{' '}
                messages).
              </Typography>
            )}

            <Typography
              variant="caption"
              sx={{
                mb: 1,
                display: 'block',
                fontWeight: 500,
                color: '#0f172a',
              }}
            >
              Messages IA aujourd&apos;hui :{' '}
              {Math.min(chatbotUsageCount, CHATBOT_DAILY_LIMIT)}/{CHATBOT_DAILY_LIMIT}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <Tooltip
                title={
                  recognition
                    ? isListening
                      ? "Arrêter l'écoute"
                      : 'Activer la reconnaissance vocale'
                    : 'Reconnaissance vocale non disponible'
                }
              >
                <span>
                  <IconButton
                    onClick={toggleListening}
                    disabled={!recognition}
                    aria-label={
                      recognition
                        ? isListening
                          ? "Arrêter l'écoute"
                          : 'Activer la reconnaissance vocale'
                        : 'Reconnaissance vocale non disponible'
                    }
                    sx={{
                      color: isListening ? 'error.main' : 'primary.main',
                      '&:disabled': {
                        color: 'grey.400'
                      },
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: isListening
                          ? theme.palette.error.main
                          : theme.palette.primary.dark
                      }
                    }}
                  >
                    {isListening ? (
                      <MicOff aria-hidden="true" focusable="false" />
                    ) : (
                      <Mic aria-hidden="true" focusable="false" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>

              <TextField
                fullWidth
                size="small"
                placeholder={isListening ? '🎤 En écoute...' : 'Posez votre question...'}
                aria-label="Champ de saisie du message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isListening || chatbotLimitReached}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 50,
                    color: '#0f172a',
                    backgroundColor: 'rgba(15,23,42,0.02)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(148,163,184,0.6)'
                          : 'rgba(148,163,184,0.55)',
                      borderWidth: 1,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(209,213,219,0.95)'
                          : theme.palette.primary.main,
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(15,23,42,0.6)',
                      opacity: 1,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: (theme) => theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <IconButton
                color="primary"
                onClick={handleSend}
                aria-label="Envoyer le message"
                disabled={
                  !input.trim() || isListening || isTyping || chatbotLimitReached
                }
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300'
                  },
                  '&:focus-visible': {
                    boxShadow: 'var(--focus-ring)'
                  }
                }}
              >
                <Send aria-hidden="true" focusable="false" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default ChatbotIA;