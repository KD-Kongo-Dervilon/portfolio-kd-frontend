// src/hooks/useChatbotIA.js
// Custom hook pour regrouper l'état et la logique du chatbot IA.

import { useState, useEffect, useRef, useCallback } from 'react';
import { trackEvent } from '../utils/analytics';
import {
  detectRdvIntent,
  detectProfileIntent,
  detectRecruiterIntent
} from '../utils/chatbotIntents';
import { detectFormalTone } from '../utils/chatbotConfig';

import {
  CHATBOT_DAILY_LIMIT,
  CHATBOT_USAGE_KEY,
  initialBotMessage,
  getTodayKey,
  profileContext,
  isGeneralProfileQuestion,
  detectAnalyticsIntent,
  detectAutomationTopic,
  detectPageSuggestions,
  buildSuggestionMessage,
  detectThemeChangeIntent
} from '../utils/chatbotHelpers';

export function useChatbotIA() {
  // --- État principal ---
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: initialBotMessage, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [chatbotUsageCount, setChatbotUsageCount] = useState(0);
  const [chatbotLimitReached, setChatbotLimitReached] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveAnnounce, setLiveAnnounce] = useState('');

  // --- États avancés (recruteur, RDV, funnel automatisation, ton) ---
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [useFormalTone, setUseFormalTone] = useState(false);

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

  const [automationIdeaMode, setAutomationIdeaMode] = useState(false);

  // --- Refs ---
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const API_URL = `${API_BASE_URL}/api`;

  // --- Détection admin via JWT ---
  useEffect(() => {
    try {
      const sessionToken = window.sessionStorage.getItem('adminToken');
      const localToken = window.localStorage.getItem('admin_token');
      const token = sessionToken || localToken;

      if (!token) {
        setIsAdmin(false);
        return;
      }

      fetch(`${API_URL}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            setIsAdmin(true);
            try {
              window.localStorage.setItem('admin_token', token);
            } catch {
              // ignore
            }
          } else {
            setIsAdmin(false);
          }
        })
        .catch(() => setIsAdmin(false));
    } catch {
      setIsAdmin(false);
    }
  }, [API_URL]);

  // --- Limite quotidienne d'utilisation ---
  useEffect(() => {
    if (isAdmin) {
      setChatbotLimitReached(false);
      return;
    }

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
    } catch {
      // ignore erreur stockage
    }
  }, [isAdmin]);

  const incrementChatbotUsage = useCallback(() => {
    if (isAdmin) return;

    setChatbotUsageCount((prev) => {
      const next = prev + 1;
      const today = getTodayKey();

      try {
        window.localStorage.setItem(
          CHATBOT_USAGE_KEY,
          JSON.stringify({ date: today, count: next })
        );
      } catch {
        // ignore
      }

      if (next >= CHATBOT_DAILY_LIMIT) {
        setChatbotLimitReached(true);
      }
      return next;
    });
  }, [isAdmin]);

  // --- Helpers UI ---
  const scrollToBottom = useCallback((reduceMotion = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    try {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    } catch {
      // ignore
    }

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      audioRef.current = null;
    }

    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text) => {
      if (!voiceEnabled) return;

      // Si on clique sur un autre "play", on stoppe avant
      stopSpeaking();

      const clean = (text || '')
        .replace(/[😊🚀💼🎯✅📊🤖💡👋📧☎️🔥💪😎🎓📱💬⚡👥📈🌟🎉✨🔍📋🇫🇷]/g, '')
        .replace(/\*\*/g, '')
        .replace(/\n\n+/g, '. ')
        .replace(/\n/g, ', ')
        .replace(/\s+/g, ' ')
        .slice(0, 400)
        .trim();

      if (!clean) return;

      // On indique tout de suite que la lecture est en cours/préparation
      setIsSpeaking(true);

      // 1) Tentative ElevenLabs via backend
      try {
        const res = await fetch(`${API_URL}/text-to-speech`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clean })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.audio) {
            const audio = new Audio(
              `data:audio/${data.format || 'mp3'};base64,${data.audio}`
            );
            audioRef.current = audio;

            audio.onplay = () => setIsSpeaking(true);
            audio.onended = () => {
              setIsSpeaking(false);
              audioRef.current = null;
            };
            audio.onerror = () => {
              setIsSpeaking(false);
              audioRef.current = null;
            };

            audio.play().catch(() => {
              setIsSpeaking(false);
            });

            return; // ✅ On a réussi avec ElevenLabs, pas besoin de fallback
          }
        }
      } catch (e) {
        console.error('Erreur ElevenLabs TTS, fallback Web Speech :', e);
      }

      // 2) Fallback : synthèse vocale du navigateur
      if (!synthRef.current) {
        // Aucun moteur dispo → on réinitialise l'état vocal
        setIsSpeaking(false);
        return;
      }

      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'fr-FR';
      u.pitch = 1.1;
      u.rate = 0.95;
      u.volume = 1.0;

      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(u);
    },
    [voiceEnabled, stopSpeaking, API_URL]
  );

  // --- STT : initialisation reconnaissance vocale ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const inst = new Rec();
      inst.continuous = false;
      inst.interimResults = false;
      inst.lang = 'fr-FR';

      inst.onresult = (e) => {
        const t = e.results[0][0].transcript;
        setInput(t);
        setIsListening(false);
        // Ici on ne déclenche PAS automatiquement l'envoi :
        // l'utilisateur décide en appuyant sur "Envoyer".
      };

      inst.onerror = () => setIsListening(false);
      inst.onend = () => setIsListening(false);
      recognitionRef.current = inst;
    }
  }, []);

  const toggleListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("La reconnaissance vocale n'est pas disponible");
      return;
    }

    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        rec.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, [isListening, stopSpeaking]);

  // --- Helpers RDV & thème (logique métier) ---

  const startRdvFlow = (initialText) => {
    setRdvMode(true);
    setRdvStep(1);
    setRdvData((prev) => ({
      ...prev,
      initialIntent: (initialText || '').trim()
    }));

    setMessages((prev) => [
      ...prev,
      {
        type: 'bot',
        text:
          "Super, on peut prévoir un rendez-vous ensemble. Pour commencer, peux-tu me donner ton prénom et ton nom ?",
        timestamp: new Date()
      }
    ]);
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

      const successMessage = {
        type: 'bot',
        text:
          'Merci, j’ai bien enregistré ta demande de rendez-vous. Dervilon va te recontacter rapidement pour confirmer le créneau.',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, successMessage]);
    } catch (err) {
      console.error('Erreur création RDV :', err);
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
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: "Je n'ai pas bien compris. Peux-tu reformuler s'il te plaît ?",
          timestamp: new Date()
        }
      ]);
      return;
    }

    if (rdvStep === 1) {
      setRdvData((prev) => ({ ...prev, fullName: trimmed }));
      setRdvStep(2);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: "Merci ! Quel est ton email pour que Dervilon puisse te répondre ?",
          timestamp: new Date()
        }
      ]);
      return;
    }

    if (rdvStep === 2) {
      const email = trimmed;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text:
              "L'email ne semble pas valide. Peux-tu me donner une adresse email correcte (ex: prenom.nom@exemple.com) ?",
            timestamp: new Date()
          }
        ]);
        return;
      }
      setRdvData((prev) => ({ ...prev, email }));
      setRdvStep(3);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text:
            "Parfait. Si tu as une entreprise, peux-tu me dire son nom ? (Sinon, dis juste « aucune »)",
          timestamp: new Date()
        }
      ]);
      return;
    }

    if (rdvStep === 3) {
      setRdvData((prev) => ({ ...prev, company: trimmed === 'aucune' ? '' : trimmed }));
      setRdvStep(4);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text:
            "As-tu un numéro de téléphone où Dervilon peut te joindre ? (Tu peux répondre « non » si tu préfères rester sur l’email)",
          timestamp: new Date()
        }
      ]);
      return;
    }

    if (rdvStep === 4) {
      if (trimmed.toLowerCase() !== 'non') {
        setRdvData((prev) => ({ ...prev, phone: trimmed }));
      }
      setRdvStep(5);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text:
            "Dernière question : quels sont les créneaux qui t’arrangent le mieux ? (par exemple : « mardi entre 14h et 16h » ou « plutôt en fin de journée »)",
          timestamp: new Date()
        }
      ]);
      return;
    }

    if (rdvStep === 5) {
      setRdvData((prev) => ({ ...prev, preferredSlot: trimmed }));
      await createMeetingRequest(trimmed);
    }
  };

  const applyThemeChangeFromChatbot = (themeKey) => {
    if (!themeKey) return;

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('kd-theme-change', {
            detail: { theme: themeKey }
          })
        );
      }

      const confirmationMessage = {
        type: 'bot',
        text: `Parfait, je viens d'appliquer le ${
          // simple label
          themeKey === 'noel'
            ? 'thème de Noël 🎄'
            : themeKey === 'nouvel-an'
            ? 'thème du Nouvel An 🎆'
            : themeKey === 'halloween'
            ? 'thème Halloween 🎃'
            : themeKey === 'rentree'
            ? 'thème Rentrée scolaire 🧑‍🏫'
            : themeKey === 'paques'
            ? 'thème de Pâques 🐣'
            : 'thème par défaut du portfolio'
        } sur le portfolio.`,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, confirmationMessage]);
    } catch (e) {
      console.error('Erreur lors du changement de thème depuis le chatbot:', e);
    }
  };

  // --- Cœur du traitement d’un message (intents + agents + fallback /chat) ---

  const processMessage = async (rawText, channel = 'text') => {
    if (chatbotLimitReached && !isAdmin) {
      setError("Limite quotidienne d'utilisation de l'IA atteinte.");
      return;
    }

    const trimmed = (rawText || '').trim();
    if (!trimmed) return;

    // Ajout du message user
    const userMessage = {
      type: 'user',
      text: trimmed,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    // Analytics simple
    try {
      trackEvent('Chatbot', channel === 'voice' ? 'Question vocale' : 'Question texte', trimmed, {
        type: 'chatbot_question',
        source: 'chatbot',
        channel
      });
    } catch (e) {
      console.warn('Erreur analytics chatbot:', e);
    }

    // Détection du ton (tutoiement / vouvoiement)
    if (!useFormalTone && detectFormalTone(trimmed)) {
      setUseFormalTone(true);
    }

    // Mini-funnel "idée d'automatisation" (2ème étape)
    if (automationIdeaMode) {
      setAutomationIdeaMode(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text:
            "Top, merci pour ton idée d'automatisation 🙌\n\n" +
            "C'est exactement le type de sujet sur lequel Dervilon intervient : agents IA, n8n/Make, optimisation de process et réduction du temps passé sur les tâches répétitives.\n\n" +
            "Le mieux, c'est d'en parler quelques minutes en visio ou au téléphone pour voir comment adapter ça à ton contexte.\n\n" +
            "Si tu veux, je peux t'aider à demander un rendez-vous avec lui : il suffit de me dire que tu veux prendre un rendez-vous avec Dervilon.",
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
      return;
    }

    // Flow RDV déjà en cours
    if (rdvMode) {
      await handleRdvStep(trimmed);
      setIsTyping(false);
      return;
    }

    // Intention RDV
    if (detectRdvIntent(trimmed)) {
      startRdvFlow(trimmed);
      setIsTyping(false);
      return;
    }

    // Intention de changement de thème
    const themeKey = detectThemeChangeIntent(trimmed);
    if (themeKey) {
      applyThemeChangeFromChatbot(themeKey);
      setIsTyping(false);
      return;
    }

    // Mode recruteur
    if (detectRecruiterIntent(trimmed) && !recruiterMode) {
      setRecruiterMode(true);

      const introText =
        "Top, merci pour ton intérêt 🙌\n\n" +
        "Je peux te résumer rapidement :\n" +
        "• le profil de Dervilon (rôle, stack, ce qu’il fait concrètement),\n" +
        "• ses résultats clés (ROI, projets chez Ludicius),\n" +
        "• son format de travail (freelance, recherche de poste, mobilité).\n\n" +
        "Tu préfères quoi pour commencer :\n" +
        "1️⃣ Un résumé en 30 secondes\n" +
        "2️⃣ Ses expériences & résultats\n" +
        "3️⃣ Ses compétences IA & automatisation\n" +
        "4️⃣ Ses disponibilités & modalités de collaboration ?";

      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: introText, timestamp: new Date() }
      ]);
      setIsTyping(false);
      return;
    }

    // Intent "profil / parcours / agents IA / portfolio" → /api/agents/profile-qa
    if (detectProfileIntent(trimmed)) {
      const lowerSelf = trimmed.toLowerCase();

      if (lowerSelf.includes('parle-moi de toi') || lowerSelf.includes('parle moi de toi')) {
        const botText =
          "Je suis Amara, l’assistant IA de Dervilon. Je suis là pour t’aider à comprendre son parcours, ses compétences et ses projets en IA.\n\n" +
          'Tu cherches à en savoir plus sur lui, son métier, ou tu réfléchis à un besoin IA / automatisation de ton côté ?';

        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: botText, timestamp: new Date() }
        ]);
        setLiveAnnounce(
          `Nouvelle réponse de l'assistant profil à ${new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}.`
        );
        incrementChatbotUsage();
        setIsTyping(false);
        return;
      }

      // Question générale sur le profil
      if (isGeneralProfileQuestion(trimmed)) {
        const botText =
          "Dervilon est Chef de Projet IA et Product Owner, certifié Chef de Projet IA et Scrum Product Owner, passionné par l’IA et le management produit.\n\n" +
          'Tu souhaites en savoir plus sur ses diplômes, ses expériences ?';

        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: botText, timestamp: new Date() }
        ]);
        setLiveAnnounce(
          `Nouvelle réponse de l'assistant profil à ${new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}.`
        );
        incrementChatbotUsage();
        setIsTyping(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/agents/profile-qa`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: trimmed })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        let answer = data.answer || data.response || '';

        let cleanAnswer = answer.replace(/^#{1,6}\s*/gm, '').replace(/\*\*/g, '');
        if (cleanAnswer.length > 800) {
          cleanAnswer = `${cleanAnswer.slice(0, 800)} [...]`;
        }

        const botText =
          cleanAnswer ||
          "Je ne peux pas répondre précisément avec les informations que j'ai dans mon profil.";

        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: botText, timestamp: new Date() }
        ]);
        setLiveAnnounce(
          `Nouvelle réponse de l'assistant profil à ${new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}.`
        );
        incrementChatbotUsage();
      } catch (err) {
        console.error('Erreur agent profil:', err);
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text:
              "⚠️ Impossible d'interroger l'agent profil pour le moment. Tu peux consulter la page CV ou la page À propos du portfolio pour en savoir plus sur Dervilon.",
            timestamp: new Date()
          }
        ]);
        setError("Erreur lors de la communication avec l'agent profil.");
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // Intent "analytics" → /api/agents/analytics-insights
    if (detectAnalyticsIntent(trimmed)) {
      try {
        const response = await fetch(`${API_URL}/agents/analytics-insights`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: trimmed })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const botText =
          data.answer ||
          data.response ||
          "Je n'ai pas encore assez de données de navigation pour te donner une réponse utile.";

        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: botText, timestamp: new Date() }
        ]);
        setLiveAnnounce(
          `Nouvelle réponse de l'assistant analytics à ${new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}.`
        );
        incrementChatbotUsage();
      } catch (err) {
        console.error('Erreur agent analytics:', err);
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text:
              "⚠️ Je n'arrive pas à récupérer les statistiques de visite pour le moment. Tu peux jeter un œil au tableau de bord Analytics du portfolio pour voir ce que les visiteurs consultent.",
            timestamp: new Date()
          }
        ]);
        setError("Erreur lors de la communication avec l'agent analytics.");
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // Fallback : /api/chat + suggestions + funnel automatisation
    try {
      const conversationHistory = messages
        .filter((m) => m.type !== 'system')
        .map((m) => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversationHistory,
          profileContext
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const botText =
        data.response ||
        data.answer ||
        "Je n'ai pas encore de réponse précise à te donner sur ce point.";

      const suggestions = detectPageSuggestions(trimmed);
      const isAutomationTopic = detectAutomationTopic(trimmed);

      setMessages((prev) => {
        const next = [
          ...prev,
          { type: 'bot', text: botText, timestamp: new Date() }
        ];

        if (isAutomationTopic) {
          next.push({
            type: 'bot',
            text:
              "Pour les automatisations, Dervilon aide surtout à mettre en place des agents IA et des workflows n8n/Make pour gagner du temps sur les tâches répétitives.\n\n" +
              "Si tu veux voir des exemples concrets, tu peux consulter la page « Automatisations & n8n » dans le portfolio.\n\n" +
              "Est-ce que tu as déjà une idée d'automatisation que tu aimerais mettre en place dans ton contexte ?",
            suggestions: ['automations'],
            timestamp: new Date()
          });
        } else if (suggestions.length > 0) {
          next.push({
            type: 'bot',
            text: buildSuggestionMessage(suggestions),
            suggestions,
            timestamp: new Date()
          });
        }

        return next;
      });

      if (isAutomationTopic) {
        setAutomationIdeaMode(true);
      }

      setLiveAnnounce(
        `Nouvelle réponse de l'assistant à ${new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })}.`
      );
      incrementChatbotUsage();
    } catch (err) {
      console.error('Erreur chatbot (fallback):', err);
      const errorMsg =
        err.message && err.message.includes('Failed to fetch')
          ? "Le serveur backend n'est pas accessible. Vérifie qu'il tourne bien sur le port 3001."
          : "Erreur lors de la communication avec l'IA.";

      setError(errorMsg);

      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text:
            `⚠️ ${errorMsg}\n\nTu peux aussi contacter Dervilon directement :\n` +
            '📧 dervilon.mbissi@gmail.com\n📞 06-36-15-88-31',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Envoi texte (utilisé par l’UI) ---
  const handleSend = async () => {
    await processMessage(input, 'text');
  };

  // --- Envoi vocal : on réutilise la même logique en injectant le texte reconnu ---
  const handleSendVoice = async (text) => {
    if (!text) return;
    setInput(text);
    await processMessage(text, 'voice');
  };

  const handleSuggestedQuestion = useCallback((q) => {
    setInput(q);
  }, []);

  const exportConversation = useCallback(() => {
    const text = messages
      .map(
        (m) =>
          `[${m.timestamp.toLocaleTimeString()}] ${
            m.type === 'user' ? 'Vous' : 'Assistant'
          }: ${m.text}`
      )
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `conversation-${Date.now()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  }, [messages]);

  return {
    // état principal
    open,
    setOpen,
    messages,
    setMessages,
    input,
    setInput,
    isTyping,
    setIsTyping,
    isListening,
    setIsListening,
    isSpeaking,
    voiceEnabled,
    setVoiceEnabled,
    error,
    setError,
    chatbotUsageCount,
    chatbotLimitReached,
    isAdmin,
    liveAnnounce,
    setLiveAnnounce,

    // états avancés (recruteur, RDV, automatisation)
    recruiterMode,
    setRecruiterMode,
    useFormalTone,
    setUseFormalTone,
    rdvMode,
    setRdvMode,
    rdvStep,
    setRdvStep,
    rdvData,
    setRdvData,
    isCreatingRdv,
    setIsCreatingRdv,
    automationIdeaMode,
    setAutomationIdeaMode,

    // refs
    messagesEndRef,
    synthRef,
    audioRef,
    recognitionRef,

    // helpers
    scrollToBottom,
    stopSpeaking,
    speak,
    toggleListening,
    handleSendVoice,
    handleSend,
    handleSuggestedQuestion,
    exportConversation,
    incrementChatbotUsage,

    CHATBOT_DAILY_LIMIT
  };
}