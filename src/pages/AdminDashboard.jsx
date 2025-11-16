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
    }
  }, [authenticated, loadAnalytics]);

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
            // Fond pro : dégradé radial subtil bleu nuit
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

        <Divider sx={{ my: 2 }} />

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
      </Container>
    </Box>
  );
};

export default AdminDashboard;