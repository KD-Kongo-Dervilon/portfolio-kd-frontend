import React, { useEffect, useState, useCallback } from 'react';
import { Box, Paper, Typography, Grid, Chip, Button, Card, CardContent, List, ListItem, ListItemText,  } from '@mui/material';
import { Download, Delete, Visibility, Timer, TrendingUp, SmartToy } from '@mui/icons-material';
import { getAnalytics, exportAnalytics, clearAnalytics } from '../utils/analytics';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState([]);
  const [summary, setSummary] = useState({
    totalEvents: 0,
    totalSessions: 0,
    totalClicks: 0,
    avgDurationSeconds: 0,
    topSections: [],
    categories: {},
  });
  const [chatbotQuestions, setChatbotQuestions] = useState([]);
  const [showOnlyChatbot, setShowOnlyChatbot] = useState(false);

  const interactionsSource = showOnlyChatbot ? chatbotQuestions : analytics;

  const safeDate = (value) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  // Fonction memoized pour charger les analytics
  const loadAnalytics = useCallback(() => {
    const data = getAnalytics() || [];
    setAnalytics(data);

    const chatbotEvents = [];

    if (!Array.isArray(data) || data.length === 0) {
      setSummary({
        totalEvents: 0,
        totalSessions: 0,
        totalClicks: 0,
        avgDurationSeconds: 0,
        topSections: [],
        categories: {},
      });
      setChatbotQuestions([]);
      return;
    }

    const categories = {};
    const sectionCount = new Map();
    const sessionsMap = new Map();
    let totalClicks = 0;

    data.forEach((event, index) => {
      const {
        category,
        action,
        label,
        metadata = {},
        timestamp,
        time,
        date,
      } = event;

      const catKey = category || 'Autre';
      categories[catKey] = (categories[catKey] || 0) + 1;

      const sessionId =
        event.sessionId ||
        event.session_id ||
        metadata.sessionId ||
        metadata.session ||
        `session_${index}`;

      const ts =
        safeDate(timestamp) ||
        safeDate(time) ||
        safeDate(date) ||
        new Date();

      if (!sessionsMap.has(sessionId)) {
        sessionsMap.set(sessionId, []);
      }
      sessionsMap.get(sessionId).push({ ...event, ts });

      const isChatbotQuestion =
        (metadata && metadata.type === 'chatbot_question') ||
        category === 'Chatbot';

      if (isChatbotQuestion) {
        chatbotEvents.push({ ...event, ts });
      }

      const type = metadata.type || '';
      const isClick =
        (category === 'Click') ||
        (typeof action === 'string' &&
          action.toLowerCase().includes('click')) ||
        (typeof type === 'string' && type.includes('click'));

      if (isClick) {
        totalClicks += 1;
      }

      let section =
        metadata.section ||
        (category === 'Section' && label) ||
        metadata.zone ||
        metadata.area ||
        null;

      if (section) {
        const key = String(section);
        sectionCount.set(key, (sectionCount.get(key) || 0) + 1);
      }
    });

    let totalDuration = 0;
    let sessionsWithDuration = 0;

    sessionsMap.forEach((sessionEvents) => {
      sessionEvents.sort((a, b) => a.ts - b.ts);

      const explicitDurations = sessionEvents
        .map((e) => e.metadata?.duration)
        .filter((d) => typeof d === 'number' && d > 0);

      let sessionDuration = 0;

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

    const totalSessions = sessionsMap.size;
    const avgDurationSeconds =
      sessionsWithDuration > 0
        ? Math.round(totalDuration / sessionsWithDuration)
        : 0;

    const topSections = Array.from(sectionCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({ label, count }));

    chatbotEvents.sort((a, b) => b.ts - a.ts);
    setChatbotQuestions(chatbotEvents);

    setSummary({
      totalEvents: data.length,
      totalSessions,
      totalClicks,
      avgDurationSeconds,
      topSections,
      categories,
    });
  }, []); // Pas de dépendances - utilise uniquement les fonctions pures

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]); // Maintenant loadAnalytics est stable grâce à useCallback

  const handleExport = () => {
    exportAnalytics();
  };

  const handleClear = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les analytics ?')) {
      clearAnalytics();
      loadAnalytics();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography component="h1" variant="h4" fontWeight={700}>
            📊 Tableau de bord des performances — Portfolio KD
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Visualisez comment les visiteurs interagissent avec votre portfolio : trafic, engagement et sections les plus consultées.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={showOnlyChatbot ? 'contained' : 'outlined'}
            startIcon={<SmartToy />}
            onClick={() => setShowOnlyChatbot((prev) => !prev)}
          >
            Conversations IA
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Exporter
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleClear}
          >
            Effacer
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp color="primary" />
                <Typography component="p" variant="h6" fontWeight={700}>
                  {summary.totalSessions}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Nombre de visites uniques sur le portfolio.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Timer color="primary" />
                <Typography component="p" variant="h6" fontWeight={700}>
                  {summary.avgDurationSeconds > 0
                    ? `${Math.floor(summary.avgDurationSeconds / 60)}m ${summary.avgDurationSeconds % 60}s`
                    : '—'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Durée moyenne d&apos;une session sur le portfolio.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Visibility color="primary" />
                <Typography component="p" variant="h6" fontWeight={700}>
                  {summary.totalEvents}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Nombre total d&apos;événements suivis : vues, scrolls, interactions clés.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp color="primary" />
                <Typography component="p" variant="h6" fontWeight={700}>
                  {summary.totalClicks}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Clics sur les liens, boutons d&apos;action et fiches projets du portfolio.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography component="h2" variant="h6" fontWeight={700} gutterBottom>
              📈 Sections les plus consultées du portfolio
            </Typography>
            {summary.topSections.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Les sections les plus consultées s&apos;afficheront ici dès que des visiteurs auront parcouru le portfolio.
              </Typography>
            ) : (
              <List>
                {summary.topSections.map((s, index) => (
                  <ListItem key={s.label}>
                    <Chip
                      label={index + 1}
                      size="small"
                      color="primary"
                      sx={{ mr: 2 }}
                    />
                    <ListItemText
                      primary={s.label}
                      secondary={`${s.count} vue${s.count > 1 ? 's' : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography component="h2" variant="h6" fontWeight={700} gutterBottom>
              📊 Répartition des interactions par catégorie
            </Typography>
            {Object.keys(summary.categories).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Les catégories d&apos;interactions apparaîtront ici dès que des événements auront été collectés.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {Object.entries(summary.categories).map(([category, count]) => (
                  <Chip
                    key={category}
                    label={`${category}: ${count}`}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography component="h2" variant="h6" fontWeight={700} gutterBottom>
              💬 Questions posées à l&apos;assistant IA
            </Typography>
            {chatbotQuestions && chatbotQuestions.length > 0 ? (
              <List dense>
                {chatbotQuestions.slice(0, 20).map((event, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {event.label || 'Question sans libellé'}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {event.timestamp || event.time || ''}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Les questions posées au chatbot apparaîtront ici dès que des visiteurs auront utilisé l’assistant IA.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography component="h2" variant="h6" fontWeight={700} gutterBottom>
              🕵️ 20 dernières interactions des visiteurs
            </Typography>
            {interactionsSource && interactionsSource.length > 0 ? (
              <List dense>
                {interactionsSource
                  .slice()
                  .reverse()
                  .slice(0, 20)
                  .map((event, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {event.category || 'Événement'} — {event.action} — {event.label}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {event.timestamp || event.time || ''}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {showOnlyChatbot
                  ? 'Les interactions IA s&apos;afficheront ici dès que le chatbot aura été utilisé.'
                  : 'Les interactions des visiteurs s&apos;afficheront ici dès que le portfolio commencera à être consulté.'}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;