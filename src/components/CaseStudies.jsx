// src/components/CaseStudies.jsx

import React, { useState, useRef, useEffect, memo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Container,
  useMediaQuery,
  Slide,
  Fade,
  Divider,
  Stack,
  Skeleton
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  Groups,
  CheckCircle,
  ArrowForward,
  Close,
  AttachMoney,
  AccessTime,
  BusinessCenter,
  AutoAwesome,
  Insights,
  RocketLaunch
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

const caseStudies = [
  {
    id: 1,
    title: 'Automatisation Chatbot IA',
    subtitle: 'Réduction de 60% du temps support',
    company: 'SaaS B2B',
    category: 'IA & Automatisation',
    emoji: '🤖',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    challenge:
      "L'équipe support était submergée par 500+ tickets/mois de questions répétitives.",
    solution:
      "Conception et déploiement d'un chatbot LLM avec RAG, connecté à la base de connaissances et au helpdesk.",
    results: [
      {
        metric: 'Tickets support',
        value: '-60%',
        icon: TrendingUp,
        color: 'success',
        description: 'De 500 à 200 tickets/mois'
      },
      {
        metric: 'Temps de réponse',
        value: '-85%',
        icon: Speed,
        color: 'success',
        description: 'De 4h à 36 min'
      },
      {
        metric: 'Satisfaction',
        value: '+32%',
        icon: Groups,
        color: 'primary',
        description: 'CSAT de 3.2/5 à 4.2/5'
      },
      {
        metric: 'ROI',
        value: '8 mois',
        icon: AttachMoney,
        color: 'primary',
        description: 'Payback atteint'
      }
    ],
    steps: [
      {
        label: 'Analyse & Cadrage (Semaine 1)',
        description:
          'Audit des 1000 derniers tickets, clustering thématique, définition des intents prioritaires.'
      },
      {
        label: 'POC & Validation (Semaines 2-3)',
        description:
          'POC GPT-4 + RAG sur 100 articles. Tests internes & bêta: 73% de résolution autonome.'
      },
      {
        label: 'MVP & Intégration (Semaines 4-6)',
        description:
          'Connexion Zendesk, routage intelligent, fallback humain, monitoring qualité en temps réel.'
      },
      {
        label: 'Scaling & Optimisation (Semaines 7-8)',
        description:
          'Optimisation prompts, ajout de 50 réponses premium, formation équipe support.'
      }
    ],
    technologies: ['GPT-4', 'RAG', 'Python', 'FastAPI', 'Zendesk API', 'PostgreSQL'],
    duration: '8 semaines',
    team: '3 personnes'
  },
  {
    id: 2,
    title: 'Système de Recommandation IA',
    subtitle: '+45% de conversion e-commerce',
    company: 'E-commerce',
    category: 'IA & Product',
    emoji: '🎯',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    challenge:
      'Un taux de conversion bloqué à 2.3% et un panier moyen figé à 67€ malgré un trafic qualifié.',
    solution:
      'Moteur de recommandation IA contextuel (LLM + signaux comportementaux) intégré au tunnel d’achat.',
    results: [
      {
        metric: 'Conversion',
        value: '+45%',
        icon: TrendingUp,
        color: 'success',
        description: 'De 2.3% à 3.3%'
      },
      {
        metric: 'Panier moyen',
        value: '+28%',
        icon: AttachMoney,
        color: 'success',
        description: 'De 67€ à 86€'
      },
      {
        metric: 'Revenu additionnel',
        value: '+340K€/an',
        icon: TrendingUp,
        color: 'primary',
        description: 'Impact direct mesuré'
      },
      {
        metric: 'Time-to-market',
        value: '21 jours',
        icon: Speed,
        color: 'primary',
        description: 'POC → Production'
      }
    ],
    steps: [
      {
        label: 'Data Analysis (Jours 1-3)',
        description:
          'Exploration de 50K transactions, construction de personas et cartes de décision.'
      },
      {
        label: 'Prototype IA (Jours 4-10)',
        description:
          'Génération de recommandations personnalisées, test A/B sur un segment de trafic.'
      },
      {
        label: 'Intégration UX (Jours 11-18)',
        description:
          'Intégration front, placements dynamiques, tests de charge et optimisation temps réel.'
      },
      {
        label: 'Lancement (Jours 19-21)',
        description:
          'Rollout progressif, dashboard live, alignement marketing & produit sur les insights.'
      }
    ],
    technologies: ['Claude API', 'React', 'Node.js', 'MongoDB', 'Segment', 'GA4'],
    duration: '21 jours',
    team: '2 personnes'
  },
  {
    id: 3,
    title: 'Prédiction de churn avancée',
    subtitle: '-38% de résiliations clients',
    company: 'Fintech B2C',
    category: 'IA & Data',
    emoji: '📊',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    challenge:
      'Churn mensuel à 6.4% sur les offres premium, sans visibilité claire sur les signaux faibles.',
    solution:
      "Modèle de scoring churn (XGBoost + embeddings LLM) connecté au CRM pour orchestrer des actions ciblées.",
    results: [
      {
        metric: 'Churn',
        value: '-38%',
        icon: TrendingUp,
        color: 'success',
        description: 'De 6.4% à 4.0%'
      },
      {
        metric: 'Réactivation',
        value: '+19%',
        icon: Groups,
        color: 'primary',
        description: 'Campagnes ciblées performantes'
      },
      {
        metric: 'ARPU',
        value: '+14%',
        icon: AttachMoney,
        color: 'primary',
        description: 'Hausse revenu moyen'
      },
      {
        metric: 'Time-to-value',
        value: '4 semaines',
        icon: Speed,
        color: 'primary',
        description: 'Impact mesuré rapide'
      }
    ],
    steps: [
      {
        label: 'Exploration (Semaine 1)',
        description:
          'Cohortes 12 mois, signaux faibles, corrélations comportement / churn.'
      },
      {
        label: 'Modélisation (Semaines 2-3)',
        description:
          'XGBoost + embeddings LLM, AUC=0.86, focus sur le top 20% des clients à risque.'
      },
      {
        label: 'Activation CRM (Semaines 4-5)',
        description:
          'Scénarios multi-canal (email, in-app, call), intégration équipe sales & success.'
      },
      {
        label: 'Monitoring (Semaines 6-8)',
        description:
          'Dashboard lift, recalibrage des seuils, tests A/B continus.'
      }
    ],
    technologies: [
      'Python',
      'XGBoost',
      'OpenAI Embeddings',
      'dbt',
      'BigQuery',
      'HubSpot API'
    ],
    duration: '8 semaines',
    team: '3 personnes'
  }
];

const CaseStudyCard = memo(function CaseStudyCard({ caseStudy, index, onOpen, reduceMotion }) {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const currentRef = cardRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setImageLoaded(true);
          observer.unobserve(entries[0].target);
        }
      },
      { rootMargin: '80px' }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <Grid
      item
      xs={12}
      sm={6}
      lg={4}
      role="listitem"
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        transformOrigin: 'center center',
        transition: reduceMotion
          ? 'none'
          : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: reduceMotion ? 'auto' : 'transform',
        '&:hover': {
          transform: reduceMotion ? 'none' : 'translateY(-12px) scale(1.02)'
        }
      }}
    >
      <Fade
        in
        timeout={reduceMotion ? 0 : 520}
        style={reduceMotion ? undefined : { transitionDelay: `${index * 90}ms` }}
      >
        <Paper
          ref={cardRef}
          component="article"
          elevation={0}
          onClick={() => onOpen(caseStudy)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen(caseStudy);
            }
          }}
          tabIndex={0}
          aria-label={`Voir les détails de l'étude de cas : ${caseStudy.title}`}
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            borderRadius: 4,
            padding: 0,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
            bgcolor: '#ffffff',
            boxShadow: '0 10px 40px rgba(15,23,42,0.10)',
            transition:
              'box-shadow 0.35s ease, border-color 0.35s ease, background-color 0.35s ease, opacity 0.35s ease',
            willChange: 'box-shadow, border-color, background-color',
            '&:hover': {
              boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
              borderColor: alpha(theme.palette.primary.main, 0.7)
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.06
              )}, transparent)`,
              opacity: 0,
              transition: 'opacity 0.35s ease',
              pointerEvents: 'none'
            },
            '&:hover::before': {
              opacity: reduceMotion ? 0 : 1
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 4
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: 130,
              background: caseStudy.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.2,
              py: 1.8,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Chip
                label={caseStudy.category}
                size="small"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  bgcolor: alpha('#ffffff', 0.16),
                  color: '#ffffff',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(6px)'
                }}
              />
              <Typography
                variant="subtitle2"
                component="p"
                sx={{
                  color: alpha('#ffffff', 0.9),
                  fontWeight: 500
                }}
              >
                {caseStudy.company}
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  mt: 0.5,
                  color: '#ffffff',
                  fontWeight: 800,
                  lineHeight: 1.25
                }}
              >
                {caseStudy.subtitle}
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {imageLoaded ? (
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: '3rem',
                    filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.45))',
                    animation: reduceMotion
                      ? 'none'
                      : 'float 3s ease-in-out infinite'
                  }}
                >
                  {caseStudy.emoji}
                </Typography>
              ) : (
                <Skeleton
                  variant="circular"
                  width={64}
                  height={64}
                  sx={{ bgcolor: 'rgba(255,255,255,0.25)' }}
                />
              )}
            </Box>

            <Box
              sx={{
                position: 'absolute',
                inset: '-40%',
                background:
                  'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 55%)',
                opacity: 0.9,
                mixBlendMode: 'screen',
                pointerEvents: 'none'
              }}
            />
          </Box>

          <Box
            sx={{
              p: 3,
              pt: 2.4,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.3
              }}
            >
              {caseStudy.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mt: 0.5
              }}
            >
              <strong>Challenge :</strong> {caseStudy.challenge}
            </Typography>

            <Box sx={{ mt: 1.8 }}>
              <Grid container spacing={1.1}>
                {caseStudy.results.slice(0, 3).map((result, idx) => {
                  const Icon = result.icon;
                  return (
                    <Grid item xs={4} key={idx}>
                      <Stack
                        spacing={0.3}
                        alignItems="center"
                        sx={{ px: 0.5 }}
                      >
                        <Icon
                          sx={{
                            fontSize: 18,
                            color: `${result.color}.main`
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                            color: `${result.color}.main`,
                            fontSize: '1.3rem'
                          }}
                        >
                          {result.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: 'center',
                            color: 'text.secondary',
                            fontSize: '0.65rem'
                          }}
                        >
                          {result.metric}
                        </Typography>
                      </Stack>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1.6, flexWrap: 'wrap' }}
            >
              <Chip
                icon={<AccessTime sx={{ fontSize: 16 }} />}
                label={caseStudy.duration}
                size="small"
                sx={{
                  fontWeight: 600,
                  height: 26,
                  borderRadius: 999
                }}
              />
              <Chip
                icon={<Groups sx={{ fontSize: 16 }} />}
                label={caseStudy.team}
                size="small"
                sx={{
                  fontWeight: 600,
                  height: 26,
                  borderRadius: 999
                }}
              />
            </Stack>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => onOpen(caseStudy)}
              sx={{
                mt: 2.4,
                alignSelf: 'flex-start',
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: 999,
                px: 2.6,
                py: 0.9,
                boxShadow: '0 10px 30px rgba(79,70,229,0.25)',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  boxShadow: '0 16px 42px rgba(79,70,229,0.35)',
                  transform: reduceMotion ? 'none' : 'translateY(-2px)'
                }
              }}
              aria-label={`Voir le playbook complet de ${caseStudy.title}`}
            >
              Voir le playbook
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Grid>
  );
});

const DialogTransition = React.forwardRef(function DialogTransition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CaseStudies = () => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedCase, setSelectedCase] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogTitleRef = useRef(null);

  useEffect(() => {
    if (dialogOpen && dialogTitleRef.current) {
      dialogTitleRef.current.focus();
    }
  }, [dialogOpen]);

  const handleOpenCase = caseStudy => {
    setSelectedCase(caseStudy);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      if (selectedCase?.title) {
        const trigger = document.querySelector(
          `[aria-label*="${selectedCase.title}"]`
        );
        if (trigger) trigger.focus();
      }
    }, 140);
  };

  const totalImpact = '+340K€+ / an';
  const avgRoi = 'x3.2';
  const avgTimeToValue = '≤ 8 semaines';

  return (
    <Box
      id="case-studies"
      component="section"
      role="region"
      aria-labelledby="case-studies-title"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 3 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#f5f7fb'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: '-10%',
          background:
            'radial-gradient(circle at top left, rgba(102,126,234,0.16), transparent 65%)',
          opacity: 0.4,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={reduceMotion ? 0 : 700}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip
              icon={<Insights sx={{ fontSize: 18 }} />}
              label="Études de cas IA orientées ROI"
              sx={{
                mb: 2,
                fontWeight: 700,
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                color: theme.palette.primary.main,
                borderRadius: 999,
                px: 1.5,
                border: `1px solid ${alpha(
                  theme.palette.primary.main,
                  0.28
                )}`
              }}
            />
            <Typography
              id="case-studies-title"
              component="h2"
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1.5,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.9rem', sm: '2.4rem', md: '3rem' },
                background:
                  'linear-gradient(135deg, #111827 0%, #3730a3 45%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              De la slide PowerPoint au résultat mesurable
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{
                maxWidth: 760,
                mx: 'auto',
                lineHeight: 1.7,
                fontSize: { xs: '0.96rem', sm: '1.05rem' }
              }}
            >
              Trois cas réels où l’IA, le product management et la data ont
              généré un impact concret sur le support, la conversion et la
              rétention.
            </Typography>
          </Box>
        </Fade>

        <Fade in timeout={reduceMotion ? 0 : 800}>
          <Paper
            elevation={0}
            sx={{
              mt: '2rem',
              mb: 5,
              p: { xs: 2.4, md: 3 },
              borderRadius: 4,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, minmax(0,1fr))'
              },
              alignItems: 'stretch',
              background:
                'linear-gradient(135deg, rgba(102,126,234,0.08), rgba(124,58,237,0.06))',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`
            }}
          >
            <Stack
              direction="row"
              spacing={1.4}
              alignItems="center"
              sx={{
                height: '100%',
                p: 1.2,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 10px 26px ${alpha(
                    theme.palette.primary.main,
                    0.22
                  )}`,
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              <RocketLaunch
                sx={{ fontSize: 30, color: theme.palette.primary.main }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  component="p"
                  sx={{ fontWeight: 700, color: '#111827' }}
                >
                  Impact cumulé
                </Typography>
                <Typography
                  variant="h5"
                  component="p"
                  sx={{ fontWeight: 800, color: theme.palette.primary.main }}
                >
                  {totalImpact}
                </Typography>
              </Box>
            </Stack>

            <Stack
              spacing={0.3}
              sx={{
                height: '100%',
                p: 1.2,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 10px 26px ${alpha(
                    theme.palette.success.main,
                    0.18
                  )}`,
                  bgcolor: alpha(theme.palette.success.main, 0.03)
                }
              }}
            >
              <Typography
                variant="subtitle2"
                component="p"
                sx={{ fontWeight: 700, color: '#111827' }}
              >
                ROI moyen
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  fontWeight: 800,
                  color: '#16a34a'
                }}
              >
                {avgRoi}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Basé sur les projets présentés
              </Typography>
            </Stack>

            <Stack
              spacing={0.3}
              sx={{
                height: '100%',
                p: 1.2,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 10px 26px ${alpha(
                    theme.palette.secondary.main,
                    0.18
                  )}`,
                  bgcolor: alpha(theme.palette.secondary.main, 0.03)
                }
              }}
            >
              <Typography
                variant="subtitle2"
                component="p"
                sx={{ fontWeight: 700, color: '#111827' }}
              >
                Time-to-value
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.secondary.main
                }}
              >
                {avgTimeToValue}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                De l’idée au résultat business
              </Typography>
            </Stack>
          </Paper>
        </Fade>

        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          component="ul"
          sx={{ listStyle: 'none', p: 0, m: 0 }}
        >
          {caseStudies.map((caseStudy, index) => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={index}
              onOpen={handleOpenCase}
              reduceMotion={reduceMotion}
            />
          ))}
        </Grid>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isSmallScreen}
          TransitionComponent={reduceMotion ? undefined : DialogTransition}
          TransitionProps={reduceMotion ? { timeout: 0 } : {}}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? 0 : 4,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(15,23,42,0.35)'
            }
          }}
        >
          {selectedCase && (
            <>
              <DialogTitle
                sx={{
                  position: 'relative',
                  p: 3,
                  pb: 2.5,
                  background: selectedCase.gradient,
                  color: '#ffffff'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 70%)',
                    opacity: 0.9,
                    pointerEvents: 'none'
                  }}
                />
                <Box sx={{ position: 'relative', zIndex: 2, pr: 6 }}>
                  <Typography
                    variant="h4"
                    id="dialog-title"
                    tabIndex={-1}
                    ref={dialogTitleRef}
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.25
                    }}
                  >
                    {selectedCase.emoji} {selectedCase.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1.4, flexWrap: 'wrap' }}
                  >
                    <Chip
                      icon={<BusinessCenter sx={{ fontSize: 16 }} />}
                      label={selectedCase.company}
                      size="small"
                      sx={{
                        bgcolor: alpha('#ffffff', 0.12),
                        color: '#ffffff',
                        fontWeight: 700,
                        borderRadius: 999
                      }}
                    />
                    <Chip
                      icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                      label={selectedCase.category}
                      size="small"
                      sx={{
                        bgcolor: alpha('#ffffff', 0.12),
                        color: '#ffffff',
                        fontWeight: 700,
                        borderRadius: 999
                      }}
                    />
                    <Chip
                      icon={<AccessTime sx={{ fontSize: 16 }} />}
                      label={selectedCase.duration}
                      size="small"
                      sx={{
                        bgcolor: alpha('#ffffff', 0.12),
                        color: '#ffffff',
                        fontWeight: 700,
                        borderRadius: 999
                      }}
                    />
                  </Stack>
                </Box>
                <IconButton
                  onClick={handleCloseDialog}
                  aria-label="Fermer la fenêtre de dialogue"
                  sx={{
                    position: 'absolute',
                    right: '39px',
                    top: '31px',
                    zIndex: 3,
                    color: '#ffffff',
                    bgcolor: alpha('#000', 0.14),
                    '&:hover': {
                      bgcolor: alpha('#000', 0.26)
                    }
                  }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>

              <DialogContent
                id="dialog-description"
                sx={{
                  p: { xs: 2.4, md: 3.2 },
                  bgcolor: '#ffffff'
                }}
              >
                <Stack
                  spacing={2.4}
                  sx={{ mb: 2.8, mt: '2rem' }}
                  direction={{ xs: 'column', md: 'row' }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      flex: 1,
                      p: 2.2,
                      mt: 2,
                      borderRadius: 3,
                      borderLeft: `4px solid ${theme.palette.error.main}`,
                      bgcolor: alpha(theme.palette.error.main, 0.02)
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      gutterBottom
                      color="#111827"
                    >
                      🎯 Challenge
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {selectedCase.challenge}
                    </Typography>
                  </Paper>
                  <Paper
                    variant="outlined"
                    sx={{
                      flex: 1,
                      p: 2.2,
                      borderRadius: 3,
                      borderLeft: `4px solid ${theme.palette.success.main}`,
                      bgcolor: alpha(theme.palette.success.main, 0.02)
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      gutterBottom
                      color="#111827"
                    >
                      💡 Solution déployée
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {selectedCase.solution}
                    </Typography>
                  </Paper>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h6"
                  component="h3"
                  fontWeight={700}
                  gutterBottom
                  color="#111827"
                >
                  📊 Résultats clés
                </Typography>
                <Grid container spacing={2.2} sx={{ mb: 3 }}>
                  {selectedCase.results.map((result, idx) => {
                    const Icon = result.icon;
                    return (
                      <Grid item xs={6} sm={3} key={idx}>
                        <Paper
                          sx={{
                            p: 1.8,
                            textAlign: 'center',
                            borderRadius: 3,
                            bgcolor: alpha(
                              theme.palette[result.color].main,
                              0.03
                            ),
                            border: `1px solid ${alpha(
                              theme.palette[result.color].main,
                              0.22
                            )}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 10px 26px ${alpha(
                                theme.palette[result.color].main,
                                0.24
                              )}`
                            }
                          }}
                        >
                          <Icon
                            sx={{
                              fontSize: 22,
                              color: theme.palette[result.color].main,
                              mb: 0.5
                            }}
                          />
                          <Typography
                            variant="h5"
                            component="p"
                            fontWeight={800}
                            sx={{
                              color: theme.palette[result.color].main,
                              mb: 0.5
                            }}
                          >
                            {result.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: '#111827', mb: 0.3 }}
                          >
                            {result.metric}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {result.description}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h6"
                  component="h3"
                  fontWeight={700}
                  gutterBottom
                  color="#111827"
                >
                  🗺️ Playbook & timeline
                </Typography>
                <Stepper
                  orientation="vertical"
                  sx={{
                    mb: 3,
                    pl: 0.5
                  }}
                >
                  {selectedCase.steps.map((step, index) => (
                    <Step key={index} active completed>
                      <StepLabel
                        StepIconComponent={() => (
                          <CheckCircle
                            sx={{
                              color: theme.palette.success.main,
                              fontSize: 20
                            }}
                          />
                        )}
                      >
                        <Typography
                          fontWeight={700}
                          sx={{ color: '#111827' }}
                        >
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1.7,
                            mt: 0.8,
                            mb: 1.8,
                            borderRadius: 2,
                            bgcolor: alpha('#111827', 0.02)
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                          >
                            {step.description}
                          </Typography>
                        </Paper>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h6"
                  component="h3"
                  fontWeight={700}
                  gutterBottom
                  color="#111827"
                >
                  🛠️ Stack technique
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.8,
                    flexWrap: 'wrap',
                    mb: 1
                  }}
                >
                  {selectedCase.technologies.map((tech, idx) => (
                    <Chip
                      key={idx}
                      label={tech}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        fontWeight: 700,
                        bgcolor: alpha(
                          theme.palette.primary.main,
                          0.06
                        ),
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.24
                        )}`,
                        color: theme.palette.primary.main
                      }}
                    />
                  ))}
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </Box>
  );
};

export default CaseStudies;