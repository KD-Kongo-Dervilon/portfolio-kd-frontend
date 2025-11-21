import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link as MuiLink,
  Grid,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Stack,
} from '@mui/material';
import { Lock, Download } from '@mui/icons-material';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' &&
    window.location.hostname === 'localhost' &&
    window.location.port === '3000'
    ? 'http://localhost:3001'
    : '');

/**
 * AdminDashboard (accessibilité renforcée)
 * - Contrastes élevés (fond sombre + texte clair pour l'écran de connexion)
 * - Landmarks sémantiques (header/main)
 * - Lien "Aller au contenu" (skip link)
 * - Formulaire accessible (submit au clavier, aria-invalid, aria-live pour erreurs)
 * - Boutons avec focus visible renforcé
 */

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({
    totalSessions: 0,
    totalClicks: 0,
    avgDurationSeconds: 0,
    topSections: [],
  });
  const [email, setEmail] = useState('');
  const [aiInsights, setAiInsights] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [analyticsPrompt, setAnalyticsPrompt] = useState(
    `Tu es un agent d'analytics pour le portfolio de KD (https://portfolio-kd-frontend.vercel.app/).
- Tu reçois la liste brute des événements de tracking (scroll, CTA, sections, chatbot, etc.).
- Tu dois produire :
  1) Un résumé en 5 bullet points max (trafic, sections les plus vues, CTAs cliqués, questions posées au chatbot).
  2) 3 recommandations concrètes pour améliorer le portfolio (UX, contenu, CTA, FAQ, etc.).
- Sois très concret, orienté action, évite le blabla.
- Contexte : Chef de Projet IA / Product Owner orienté ROI, LLM, RAG, Agents IA, automatisation et n8n.`
  );
  const [showAnalyticsPrompt, setShowAnalyticsPrompt] = useState(false);
  const [faqPrompt, setFaqPrompt] = useState(
    `Tu es l'agent "Content IA" de KD (portfolio kddervilon.com).
Tu connais son positionnement : Chef de Projet IA, Product Owner, LLM, RAG, Agents IA, automatisation et n8n.
Objectif : proposer des Q/R de FAQ pour le portfolio de KD.
- Tu reçois la FAQ actuelle (dynamique) et un sujet éventuel.
- Tu renvoies UNIQUEMENT un JSON : tableau d'objets {question, answer, category}.
- Le ton doit rester proche de la FAQ actuelle : concret, rassurant, orienté business.
- Évite les doublons de questions.`
  );
  const [faqTopic, setFaqTopic] = useState('');
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState('');
  const [faqMessage, setFaqMessage] = useState('');
  const [showFaqPrompt, setShowFaqPrompt] = useState(false);
  const [rdvRequests, setRdvRequests] = useState([]);
  const [rdvLoading, setRdvLoading] = useState(false);
  const [rdvError, setRdvError] = useState('');
  const [rdvFilter, setRdvFilter] = useState('pending'); // 'all' | 'pending' | 'accepted' | 'declined'

  const loadRdvRequests = useCallback(async () => {
    setRdvError('');
    setRdvLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        setRdvError("Non authentifié : aucun jeton admin trouvé.");
        setRdvRequests([]);
        setRdvLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/rdv-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors du chargement des demandes de rendez-vous.');
      }

      const items = Array.isArray(data.items) ? data.items : [];
      const sorted = [...items].sort((a, b) => {
        const da = new Date(a.createdAt || a.date || 0);
        const db = new Date(b.createdAt || b.date || 0);
        return db - da;
      });

      setRdvRequests(sorted);
    } catch (err) {
      console.error('Erreur chargement RDV:', err);
      setRdvError("Impossible de charger les demandes de rendez-vous pour le moment.");
      setRdvRequests([]);
    } finally {
      setRdvLoading(false);
    }
  }, []);


  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setAuthenticated(true);
          setEmail(data.admin?.email || '');
        } else {
          sessionStorage.removeItem('adminToken');
        }
      } catch (err) {
        console.error('Erreur vérification admin:', err);
        sessionStorage.removeItem('adminToken');
      }
    };

    verify();
  }, []);

  const loadAnalytics = useCallback(() => {
    const safeDate = (value) => {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    };

    try {
      const raw = localStorage.getItem('analytics_events');
      if (!raw) {
        setEvents([]);
        setSummary({
          totalSessions: 0,
          totalClicks: 0,
          avgDurationSeconds: 0,
          topSections: [],
        });
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        setEvents([]);
        setSummary({
          totalSessions: 0,
          totalClicks: 0,
          avgDurationSeconds: 0,
          topSections: [],
        });
        return;
      }

      const cleaned = parsed
        .filter((e) => e && (e.timestamp || e.time || e.date))
        .map((e, index) => {
          const ts =
            safeDate(e.timestamp) ||
            safeDate(e.time) ||
            safeDate(e.date) ||
            new Date();
          const sessionId =
            e.sessionId ||
            e.session_id ||
            e.session ||
            (e.metadata && (e.metadata.sessionId || e.metadata.session)) ||
            `session_${index}`;
          const section =
            e.section ||
            (e.metadata && (e.metadata.section || e.metadata.zone || e.metadata.area)) ||
            e.label ||
            e.path ||
            null;
          const action = e.action || e.event || 'event';
          const duration =
            typeof e.duration === 'number'
              ? e.duration
              : typeof e.metadata?.duration === 'number'
              ? e.metadata.duration
              : null;

          return {
            ...e,
            ts,
            sessionId,
            section,
            action,
            duration,
          };
        });

      // Regrouper par session
      const sessionsMap = new Map();
      cleaned.forEach((ev) => {
        if (!sessionsMap.has(ev.sessionId)) {
          sessionsMap.set(ev.sessionId, []);
        }
        sessionsMap.get(ev.sessionId).push(ev);
      });

      let totalDuration = 0;
      let sessionsWithDuration = 0;
      let totalClicks = 0;
      const sectionCount = new Map();

      sessionsMap.forEach((sessionEvents) => {
        sessionEvents.sort((a, b) => a.ts - b.ts);

        let sessionDuration = 0;
        // si des durées explicites existent, on les privilégie
        const explicitDurations = sessionEvents
          .map((e) => e.duration)
          .filter((d) => typeof d === 'number' && d > 0);

        if (explicitDurations.length) {
          sessionDuration = explicitDurations.reduce((a, b) => a + b, 0);
        } else if (sessionEvents.length > 1) {
          sessionDuration =
            (sessionEvents[sessionEvents.length - 1].ts -
              sessionEvents[0].ts) /
            1000;
        }

        if (sessionDuration > 0) {
          totalDuration += sessionDuration;
          sessionsWithDuration += 1;
        }
      });

      cleaned.forEach((ev) => {
        const isClick =
          typeof ev.action === 'string' &&
          ev.action.toLowerCase().includes('click');
        if (isClick) totalClicks += 1;

        if (ev.section) {
          const key = String(ev.section);
          sectionCount.set(key, (sectionCount.get(key) || 0) + 1);
        }
      });

      const topSections = Array.from(sectionCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, count]) => ({ label, count }));

      const totalSessions = sessionsMap.size;
      const avgDurationSeconds =
        sessionsWithDuration > 0
          ? Math.round(totalDuration / sessionsWithDuration)
          : 0;

      setEvents(
        cleaned
          .sort((a, b) => b.ts - a.ts)
          .slice(0, 50)
      );
      setSummary({
        totalSessions,
        totalClicks,
        avgDurationSeconds,
        topSections,
      });
    } catch (err) {
      console.error('Erreur chargement analytics:', err);
      setEvents([]);
      setSummary({
        totalSessions: 0,
        totalClicks: 0,
        avgDurationSeconds: 0,
        topSections: [],
      });
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadAnalytics();
      loadRdvRequests();
    }
  }, [authenticated, loadAnalytics, loadRdvRequests]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Merci de renseigner votre email et votre mot de passe.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.token) {
        setError(data.message || 'Identifiants invalides');
        return;
      }

      sessionStorage.setItem('adminToken', data.token);
      setAuthenticated(true);
      setError('');
    } catch (err) {
      console.error('Erreur connexion admin:', err);
      setError('Erreur serveur. Réessayez plus tard.');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('adminToken');
    setEmail('');
  };

  // Styles de focus visibles et constants
  const focusVisible = {
    '&:focus-visible': {
      outline: '3px solid #000',
      outlineOffset: '2px'
    }
  };

  const exportEventsToCSV = () => {
    if (!events || events.length === 0) {
      // Rien à exporter
      return;
    }

    const headers = [
      'timestamp',
      'sessionId',
      'category',
      'action',
      'label',
      'section',
      'duration',
      'url',
    ];

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (/[",\n;]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = events.map((ev) => {
      const {
        timestamp,
        ts,
        sessionId,
        category,
        action,
        label,
        section,
        duration,
        url,
        path,
      } = ev;

      return [
        ts instanceof Date ? ts.toISOString() : timestamp || '',
        sessionId || '',
        category || '',
        action || '',
        label || '',
        section || '',
        typeof duration === 'number' ? duration : '',
        url || path || '',
      ].map(escapeCSV);
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `portfolio-analytics-events-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateAiInsights = async () => {
    setAiError('');
    setAiInsights('');
    setAiLoading(true);

    try {
      const raw = localStorage.getItem('analytics_events') || '[]';
      let analytics = [];

      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          analytics = parsed;
        }
      } catch (e) {
        console.error('Erreur parsing analytics_events:', e);
      }

      if (!analytics.length) {
        setAiError("Pas assez de données analytics pour générer une analyse IA.");
        setAiLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/agents/analytics-insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analytics, prompt: analyticsPrompt }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur agent analytics');
      }

      setAiInsights(data.insights || '');
    } catch (err) {
      console.error('Erreur analyse IA analytics:', err);
      setAiError("Erreur lors de l'analyse IA des analytics.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateFaqWithIa = async () => {
    setFaqError('');
    setFaqMessage('');
    setFaqLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/agents/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'faq',
          topic: faqTopic,
          prompt: faqPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur agent FAQ IA');
      }

      setFaqMessage(
        `FAQ mise à jour. Nombre de nouvelles entrées ajoutées : ${data.addedCount ?? 0}.`
      );
    } catch (err) {
      console.error('Erreur génération FAQ IA:', err);
      setFaqError("Erreur lors de la génération IA de la FAQ.");
    } finally {
      setFaqLoading(false);
    }
  };

  // Mettre à jour le statut d’un RDV via l’API admin
  const handleUpdateRdvStatus = async (id, newStatus) => {
    setRdvError('');
    setRdvLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        setRdvError("Non authentifié : aucun jeton admin trouvé.");
        setRdvLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/rdv-requests/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Erreur lors de la mise à jour du statut.');
      }

      const updated = data.item;
      setRdvRequests((prev) =>
        Array.isArray(prev)
          ? prev.map((r) => (String(r.id) === String(id) ? updated : r))
          : []
      );
    } catch (err) {
      console.error('Erreur mise à jour RDV:', err);
      setRdvError("Impossible de mettre à jour la demande de rendez-vous pour le moment.");
    } finally {
      setRdvLoading(false);
    }
  };

  // Suppression d’un RDV (backend + mise à jour locale)
  const handleDeleteRdv = async (id) => {
    setRdvError('');
    setRdvLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        setRdvError("Non authentifié : aucun jeton admin trouvé.");
        setRdvLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/rdv-requests/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Erreur lors de la suppression du RDV.');
      }

      setRdvRequests((prev) =>
        Array.isArray(prev)
          ? prev.filter((r) => String(r.id) !== String(id))
          : []
      );
    } catch (err) {
      console.error('Erreur suppression RDV:', err);
      setRdvError("Impossible de supprimer cette demande de rendez-vous pour le moment.");
    } finally {
      setRdvLoading(false);
    }
  };

  const filteredRdvRequests = rdvRequests.filter((rdv) => {
    if (!rdvFilter || rdvFilter === 'all') return true;
    const status = rdv.status || 'pending';
    return status === rdvFilter;
  });

  if (!authenticated) {
    return (
      <>
        {/* Skip link pour utilisateurs clavier/lecteurs d'écran */}
        <Box component="nav" sx={{ position: 'absolute', left: 0, top: 0 }}>
          <MuiLink
            href="#admin-login"
            sx={{
              position: 'absolute',
              left: '-10000px',
              top: 'auto',
              width: 1,
              height: 1,
              overflow: 'hidden',
              '&:focus': {
                position: 'static',
                width: 'auto',
                height: 'auto',
                m: 1,
                p: 1,
                bgcolor: '#ffffff',
                color: '#000000',
                border: '2px solid #000'
              }
            }}
          >
            Aller directement au formulaire de connexion
          </MuiLink>
        </Box>

        <Box
          component="main"
          id="admin-login"
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Fond pro : dégradé radial subtil bleu nuit
            background: 'radial-gradient(circle at top, #1b325f 0%, #050816 50%, #02030a 100%)',
            color: '#FFFFFF',
            px: 2
          }}
          aria-label="Écran de connexion administrateur"
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              maxWidth: 420,
              width: '100%',
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.98)',
              boxShadow: 6,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Lock titleAccess="Icône cadenas" sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h5" fontWeight={700} color="text.primary">
                Dashboard Admin
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accès réservé à KD Dervilon
              </Typography>
            </Box>

            {/* Utiliser un <form> pour permettre Enter/Espace au clavier */}
            <Box
              component="form"
              noValidate
              onSubmit={handleLogin}
              aria-describedby={error ? 'login-error' : undefined}
            >
              <TextField
                fullWidth
                type="email"
                label="Email administrateur"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                inputProps={{ 'aria-label': "Email de connexion administrateur" }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-invalid={Boolean(error)}
                inputProps={{ 'aria-label': 'Mot de passe administrateur' }}
                sx={{ mb: 2 }}
              />

              {error && (
                <Alert id="login-error" severity="error" sx={{ mb: 2 }} role="alert" aria-live="assertive">
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                aria-label="Se connecter au tableau de bord administrateur"
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  // Couleurs à fort contraste : bouton sombre, texte clair
                  bgcolor: '#111111',
                  color: '#FFFFFF',
                  '&:hover': { bgcolor: '#000000' },
                  ...focusVisible
                }}
              >
                Se connecter
              </Button>
            </Box>
          </Paper>
        </Box>
      </>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          component="header"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            gap: 2,
            p: 3,
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.shadows[2],
          }}
        >
          <Box>
            <Typography component="h1" variant="h5" fontWeight={800}>
              Dashboard Admin — Vue d’ensemble
            </Typography>
            {email && (
              <Typography variant="caption" color="text.secondary">
                Connecté en tant que {email}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              Aperçu simple et lisible de l’activité sur ton portfolio : visites, clics, sections vues, temps moyen passé.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={handleGenerateAiInsights}
              disabled={aiLoading}
              aria-label="Générer une analyse IA de l'activité du portfolio"
              sx={{
                ...focusVisible,
                whiteSpace: 'nowrap',
              }}
            >
              {aiLoading ? 'Analyse IA…' : 'Analyse IA'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowAnalyticsPrompt((v) => !v)}
              aria-label="Voir et modifier le prompt Analytics IA"
              sx={{
                ...focusVisible,
                whiteSpace: 'nowrap',
              }}
            >
              {showAnalyticsPrompt ? 'Masquer prompt Analytics' : 'Voir prompt Analytics'}
            </Button>
            <Button
              variant="outlined"
              onClick={exportEventsToCSV}
              aria-label="Exporter les dernières interactions au format CSV"
              sx={{
                ...focusVisible,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Download fontSize="small" />
              Export CSV
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
              aria-label="Se déconnecter du tableau de bord administrateur"
              sx={{ ...focusVisible, whiteSpace: 'nowrap' }}
            >
              Déconnexion
            </Button>
          </Stack>
        </Box>

        {/* Cartes de synthèse */}
        <Grid container spacing={2} sx={{ mb: 3 }} aria-label="Statistiques synthétiques">
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(135deg, rgba(25,118,210,0.06), rgba(25,118,210,0.01))',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Visites (sessions)
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {summary.totalSessions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Nombre de sessions distinctes enregistrées.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Temps moyen par visite
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {summary.avgDurationSeconds > 0
                  ? `${Math.floor(summary.avgDurationSeconds / 60)}m ${summary.avgDurationSeconds % 60}s`
                  : '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Calculé à partir des événements horodatés.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Clics suivis
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {summary.totalClicks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Liens et actions marqués comme clics.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Sections les plus vues
              </Typography>
              {summary.topSections.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Pas encore de données.
                </Typography>
              ) : (
                <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                  {summary.topSections.map((s) => (
                    <Chip
                      key={s.label}
                      label={`${s.label} (${s.count})`}
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>

        {showAnalyticsPrompt && (
          <Box sx={{ mb: 2 }} aria-label="Prompt Analytics IA">
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Prompt utilisé pour l&apos;analyse IA des analytics
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              value={analyticsPrompt}
              onChange={(e) => setAnalyticsPrompt(e.target.value)}
              size="small"
            />
          </Box>
        )}
        <Divider sx={{ my: 2 }} />

        {/* Synthèse IA des analytics */}
        {(aiError || aiInsights) && (
          <Box sx={{ mb: 3 }} aria-label="Synthèse IA de l'activité du portfolio">
            {aiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {aiError}
              </Alert>
            )}
            {aiInsights && (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Synthèse IA de l&apos;activité
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
                >
                  {aiInsights}
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Tableau des derniers événements */}
        <Box aria-label="Détail des derniers événements de visite">
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Dernières interactions
          </Typography>
          {events.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucune donnée trouvée. Vérifie que le script de tracking enregistre bien les événements dans
              <code> localStorage["analytics_events"]</code>.
            </Typography>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                maxHeight: 360,
                overflow: 'auto',
                borderRadius: 3,
                borderColor: 'divider',
                boxShadow: (theme) => theme.shadows[1],
              }}
            >
              <Table
                size="small"
                aria-label="Tableau des derniers événements"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Horodatage</TableCell>
                    <TableCell>Session</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Section / Clic</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((ev, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>
                        {ev.ts instanceof Date
                          ? ev.ts.toLocaleString()
                          : String(ev.timestamp || '')}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {String(ev.sessionId).slice(0, 10)}
                        </Typography>
                      </TableCell>
                      <TableCell>{ev.action}</TableCell>
                      <TableCell>
                        {ev.section || ev.label || ev.path || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Demandes de rendez-vous */}
        <Box aria-label="Demandes de rendez-vous" sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Demandes de rendez-vous
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Liste des demandes envoyées via le chatbot et les formulaires du portfolio.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant={rdvFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setRdvFilter('all')}
            >
              Tous
            </Button>
            <Button
              size="small"
              variant={rdvFilter === 'pending' ? 'contained' : 'outlined'}
              onClick={() => setRdvFilter('pending')}
            >
              En attente
            </Button>
            <Button
              size="small"
              variant={rdvFilter === 'accepted' ? 'contained' : 'outlined'}
              onClick={() => setRdvFilter('accepted')}
            >
              Acceptés
            </Button>
            <Button
              size="small"
              variant={rdvFilter === 'declined' ? 'contained' : 'outlined'}
              onClick={() => setRdvFilter('declined')}
            >
              Refusés
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={() => setRdvFilter('all')}
            >
              Voir l’historique
            </Button>
          </Stack>

          {rdvError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {rdvError}
            </Alert>
          )}

          {rdvLoading ? (
            <Typography variant="body2" color="text.secondary">
              Chargement des demandes de rendez-vous…
            </Typography>
          ) : filteredRdvRequests.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucune demande de rendez-vous trouvée pour le moment.
            </Typography>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                maxHeight: 360,
                overflow: 'auto',
                borderRadius: 3,
                borderColor: 'divider',
                boxShadow: (theme) => theme.shadows[1],
              }}
            >
              <Table size="small" aria-label="Tableau des demandes de rendez-vous">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Créneau souhaité</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRdvRequests.map((rdv) => (
                    <TableRow key={rdv.id} hover>
                      <TableCell>
                        {rdv.createdAt
                          ? new Date(rdv.createdAt).toLocaleString()
                          : '—'}
                      </TableCell>
                      <TableCell>{rdv.fullName || '—'}</TableCell>
                      <TableCell>{rdv.email || '—'}</TableCell>
                      <TableCell>{rdv.preferredSlot || '—'}</TableCell>
                      <TableCell>{rdv.message || '—'}</TableCell>
                      <TableCell>{rdv.source || '—'}</TableCell>
                      <TableCell>
                        {(() => {
                          const status = rdv.status || 'pending';
                          const label =
                            status === 'accepted'
                              ? 'Accepté'
                              : status === 'declined'
                              ? 'Refusé'
                              : 'En attente';
                          const color =
                            status === 'accepted'
                              ? 'success'
                              : status === 'declined'
                              ? 'error'
                              : 'warning';
                          return (
                            <Chip
                              label={label}
                              size="small"
                              color={color}
                              variant="outlined"
                            />
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleUpdateRdvStatus(rdv.id, 'accepted')}
                          >
                            Valider
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() => handleUpdateRdvStatus(rdv.id, 'declined')}
                          >
                            Refuser
                          </Button>
                          {rdv.status && rdv.status !== 'pending' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteRdv(rdv.id)}
                            >
                              Supprimer
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>

        {/* Contenu IA : FAQ dynamique */}
        <Box aria-label="Gestion IA de la FAQ dynamique" sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            FAQ dynamique (IA)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Utilise cet agent pour enrichir la FAQ de ton portfolio avec des questions/réponses
            orientées ROI, LLM, RAG, Agents IA, automatisation et n8n.
          </Typography>

          {faqError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {faqError}
            </Alert>
          )}
          {faqMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {faqMessage}
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              label="Sujet à pousser dans la FAQ (facultatif)"
              placeholder="Ex : LLM + RAG pour les équipes support"
              fullWidth
              size="small"
              value={faqTopic}
              onChange={(e) => setFaqTopic(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => setShowFaqPrompt((v) => !v)}
              aria-label="Voir et modifier le prompt FAQ IA"
              sx={{ ...focusVisible, alignSelf: 'flex-start' }}
            >
              {showFaqPrompt ? 'Masquer prompt FAQ' : 'Voir prompt FAQ'}
            </Button>
            {showFaqPrompt && (
              <TextField
                multiline
                minRows={6}
                fullWidth
                value={faqPrompt}
                onChange={(e) => setFaqPrompt(e.target.value)}
                size="small"
              />
            )}
            <Button
              variant="contained"
              onClick={handleGenerateFaqWithIa}
              disabled={faqLoading}
              aria-label="Générer de nouvelles entrées de FAQ via IA"
              sx={{ ...focusVisible, alignSelf: 'flex-start' }}
            >
              {faqLoading ? 'Génération FAQ…' : 'Générer FAQ (IA)'}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;