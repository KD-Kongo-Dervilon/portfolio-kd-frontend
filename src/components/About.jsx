// src/components/About.jsx
import React, { useState, memo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Fade,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Groups,
  AutoAwesome,
  ExpandMore,
  Verified,
  Timeline
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

// TabPanel avec animation latérale douce (mémoïsé pour éviter les re-renders inutiles)
const TabPanel = memo(function TabPanel({ children, value, index, direction = 'left' }) {
  const isActive = value === index;

  return (
    <Box
      role="tabpanel"
      hidden={!isActive}
      aria-hidden={!isActive}
      sx={{
        width: '100%',
        animation: isActive
          ? `${direction === 'left' ? 'slideInLeft' : 'slideInRight'} 0.5s ease`
          : 'none',
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none'
        },
        '@keyframes slideInLeft': {
          '0%': { opacity: 0, transform: 'translateX(-24px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        '@keyframes slideInRight': {
          '0%': { opacity: 0, transform: 'translateX(24px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        }
      }}
    >
      {isActive && (
        <Fade in={isActive} timeout={500}>
          <Box>{children}</Box>
        </Fade>
      )}
    </Box>
  );
});

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredReason, setHoveredReason] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);

  const reasons = [
    {
      icon: Psychology,
      iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      title: 'Double compétence IA & Produit',
      description:
        "Capacité à parler aussi bien modèles, RAG et stack technique que vision produit, CAC, churn et expérience utilisateur."
    },
    {
      icon: TrendingUp,
      iconBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      title: 'Obsédé par le ROI',
      description:
        'Chaque initiative IA est reliée à un KPI métier clair : support, conversion, MRR, rétention ou cycle de vente.'
    },
    {
      icon: Groups,
      iconBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      title: 'Leadership & Delivery',
      description:
        "Habitué à aligner C-level, sales, marketing et tech, et à livrer des itérations visibles rapidement."
    }
  ];

  const steps = [
    {
      title: '1. Cadrage & design de la valeur',
      color: theme.palette.primary.main,
      icon: Timeline,
      description:
        "On commence par les bons problèmes : où l’IA peut réellement bouger vos métriques plutôt que générer des slides.",
      bullets: [
        'Cartographie des irritants métier & opportunités IA',
        'Priorisation des use cases selon impact / faisabilité',
        'Définition des KPIs (support, conversion, churn, MRR, NPS, etc.)'
      ]
    },
    {
      title: '2. POC → MVP en environnement réel',
      color: theme.palette.success.main,
      icon: Verified,
      description:
        'On teste vite, mais proprement, au contact du terrain, avec des POC qui ressemblent déjà à un vrai produit.',
      bullets: [
        'POC ciblé sur un segment réel (équipe support, trafic test, comptes clés)',
        'Intégration légère : API, chatbot, widget, workflows',
        'Décisions basées sur des résultats mesurés, pas sur des intuitions'
      ]
    },
    {
      title: '3. Industrialisation progressive',
      color: theme.palette.secondary.main,
      icon: AutoAwesome,
      description:
        'On sécurise, on scale, sans tout réécrire : de la brique IA isolée à un actif durable dans votre stack.',
      bullets: [
        'Monitoring, garde-fous, observabilité & gestion des prompts',
        'Documentation & transfert vers vos équipes internes',
        'Boucles d’amélioration continue basées sur les usages'
      ]
    }
  ];

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  return (
    <Box
      id="about"
      component="section"
      aria-labelledby="about-title"
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f7fb',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-8%',
          left: '-5%',
          width: '40%',
          height: '40%',
          background:
            'radial-gradient(circle, rgba(102,126,234,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '32%',
          height: '38%',
          background:
            'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Fade in timeout={reduceMotion ? 0 : 600}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip
              label="À propos"
              icon={<AutoAwesome sx={{ fontSize: 18 }} />}
              sx={{
                mb: 2,
                px: 1.8,
                fontWeight: 700,
                borderRadius: 999,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.22)
                    : alpha(theme.palette.primary.main, 0.06),
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.primary.contrastText
                    : theme.palette.primary.main,
                border:
                  theme.palette.mode === 'dark'
                    ? `1px solid ${alpha(theme.palette.primary.light, 0.8)}`
                    : `1px solid ${alpha(theme.palette.primary.main, 0.25)}`
              }}
            />
            <Typography
              id="about-title"
              component="h2"
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1.5,
                letterSpacing: '-0.02em',
                fontSize: { xs: '2rem', md: '2.6rem' },
                background: theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, #f9fafb 0%, #e5e7eb 35%, ${theme.palette.primary.main} 100%)`
                  : 'linear-gradient(135deg, #111827 0%, #1f2937 40%, #4f46e5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Un profil hybride pour transformer vos idées IA en résultats business
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{
                maxWidth: 780,
                mx: 'auto',
                lineHeight: 1.7
              }}
            >
              Entre stratégie produit, expérimentation IA et exécution terrain,
              je vous aide à passer du POC à l’impact mesurable sans bullshit.
            </Typography>
          </Box>
        </Fade>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered={!isMobile}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
          sx={{
            mb: 4,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', md: '1rem' },
              minWidth: isMobile ? 'auto' : 180
            }
          }}
          aria-label="Navigation à propos"
        >
          <Tab label="Pourquoi travailler avec moi" />
          <Tab label="Approche & méthodo" />
          <Tab label="Expériences sélectionnées" />
        </Tabs>

        {/* TAB 1 - Pourquoi travailler avec moi */}
        <TabPanel value={activeTab} index={0} direction="left">
          <Grid container spacing={3}>
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              const key = `reason-${index}`;
              const isHovered = hoveredReason === key;

              return (
                <Grid item xs={12} md={4} key={key}>
                  <Box
                    onMouseEnter={() => setHoveredReason(key)}
                    onMouseLeave={() => setHoveredReason(null)}
                    sx={{
                      position: 'relative',
                      height: '100%',
                      transition: reduceMotion
                        ? 'none'
                        : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: 'center center',
                      willChange: reduceMotion ? 'auto' : 'transform',
                      transform:
                        isHovered && !reduceMotion
                          ? 'translateY(-12px) scale(1.02)'
                          : 'translateY(0) scale(1)'
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        height: '100%',
                        p: 3,
                        borderRadius: 3,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.96)
                            : '#ffffff',
                        border: '1px solid',
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.16)
                            : alpha('#111827', 0.12),
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? '0 16px 40px rgba(0,0,0,0.65)'
                            : '0 10px 30px rgba(15,23,42,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        transition:
                          'box-shadow 0.35s ease, border-color 0.35s ease, background-color 0.35s ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 24,
                          background: reason.iconBg,
                          opacity: isHovered && !reduceMotion ? 0.06 : 0,
                          transition: 'opacity 0.35s ease',
                          pointerEvents: 'none'
                        },
                        ...(isHovered && {
                          boxShadow: `0 22px 52px ${alpha(
                            theme.palette.primary.main,
                            0.16
                          )}`,
                          borderColor: alpha(theme.palette.primary.main, 0.85)
                        })
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: reason.iconBg,
                          color: '#ffffff',
                          boxShadow: '0 10px 24px rgba(15,23,42,0.22)'
                        }}
                      >
                        <Icon sx={{ fontSize: 24 }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        component="h3"
                        fontWeight={700}
                        sx={{ color: theme.palette.text.primary }}
                      >
                        {reason.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexGrow: 1, lineHeight: 1.7 }}
                      >
                        {reason.description}
                      </Typography>
                    </Paper>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        {/* TAB 2 - Approche & méthodo (3 cards) */}
        <TabPanel value={activeTab} index={1} direction="right">
          <Grid container spacing={3}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const key = `step-${index}`;
              const isHovered = hoveredStep === key;

              return (
                <Grid item xs={12} md={4} key={key}>
                  <Box
                    onMouseEnter={() => setHoveredStep(key)}
                    onMouseLeave={() => setHoveredStep(null)}
                    sx={{
                      position: 'relative',
                      height: '100%',
                      transition: reduceMotion
                        ? 'none'
                        : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: 'center center',
                      willChange: reduceMotion ? 'auto' : 'transform',
                      transform:
                        isHovered && !reduceMotion
                          ? 'translateY(-12px) scale(1.02)'
                          : 'translateY(0) scale(1)'
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        height: '100%',
                        p: 3,
                        borderRadius: 3,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.96)
                            : '#ffffff',
                        border: '1px solid',
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.16)
                            : alpha('#111827', 0.12),
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? '0 16px 40px rgba(0,0,0,0.65)'
                            : '0 10px 30px rgba(15,23,42,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.4,
                        transition:
                          'box-shadow 0.35s ease, border-color 0.35s ease, background-color 0.35s ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 24,
                          background: `linear-gradient(135deg, ${alpha(
                            step.color,
                            0.09
                          )}, transparent)`,
                          opacity: isHovered && !reduceMotion ? 0.06 : 0,
                          transition: 'opacity 0.35s ease',
                          pointerEvents: 'none'
                        },
                        ...(isHovered && {
                          boxShadow: `0 22px 52px ${alpha(step.color, 0.22)}`,
                          borderColor: alpha(step.color, 0.9)
                        })
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(step.color, 0.12),
                          color: step.color
                        }}
                      >
                        <Icon sx={{ fontSize: 22 }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ color: theme.palette.text.primary }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {step.description}
                      </Typography>
                      <Box
                        component="ul"
                        sx={{
                          pl: 2,
                          m: 0,
                          listStyle: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.6
                        }}
                      >
                        {step.bullets.map((b, i) => (
                          <Typography
                            key={i}
                            component="li"
                            variant="body2"
                            color="text.secondary"
                          >
                            • {b}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              href="#case-studies"
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 999,
                px: 3.2,
                py: 1.1,
                boxShadow: '0 10px 30px rgba(79,70,229,0.25)',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  boxShadow: '0 18px 40px rgba(79,70,229,0.35)',
                  transform: reduceMotion ? 'none' : 'translateY(-2px)'
                }
              }}
            >
              Voir comment cette approche se traduit en résultats
            </Button>
          </Box>
        </TabPanel>

        {/* TAB 3 - Expériences sélectionnées */}
        <TabPanel value={activeTab} index={2} direction="left">
          <Box
            sx={{
              position: 'relative',
              transition: reduceMotion
                ? 'none'
                : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              transformOrigin: 'center center',
              '&:hover': {
                transform: reduceMotion ? 'none' : 'translateY(-6px)'
              }
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.96)
                    : '#ffffff',
                border: '1px solid',
                borderColor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.16)
                    : alpha('#111827', 0.12),
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 18px 44px rgba(0,0,0,0.7)'
                    : '0 12px 34px rgba(15,23,42,0.08)',
                transition:
                  'box-shadow 0.35s ease, border-color 0.35s ease',
                '&:hover': {
                  boxShadow: '0 22px 52px rgba(15,23,42,0.14)',
                  borderColor: alpha(theme.palette.primary.main, 0.75)
                }
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 2.5, color: theme.palette.text.primary }}
              >
                Quelques missions représentatives
              </Typography>

              {/* Automatisation Chatbot IA – SaaS B2B */}
              <Accordion
                disableGutters
                sx={{
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  borderBottom: `1px solid ${
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.12)
                      : alpha('#111827', 0.06)
                  }`
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    '& .MuiAccordionSummary-expandIconWrapper': {
                      color: theme.palette.text.primary
                    },
                    '& .MuiSvgIcon-root': {
                      color: theme.palette.text.primary
                    }
                  }}
                >
                  <Typography fontWeight={600}>
                    Automatisation Chatbot IA – SaaS B2B
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    Réduction de la charge support grâce à un chatbot IA connecté
                    à la base de connaissances et au helpdesk :
                    <br />• Analyse des tickets existants & identification des intents
                    <br />• Chatbot LLM + RAG intégré au helpdesk
                    <br />• Routage intelligent & fallback humain
                    <br />• Suivi continu de la qualité & de la satisfaction.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {/* Système de recommandation IA – E-commerce */}
              <Accordion
                disableGutters
                sx={{
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  borderBottom: `1px solid ${
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.12)
                      : alpha('#111827', 0.06)
                  }`
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    '& .MuiAccordionSummary-expandIconWrapper': {
                      color: theme.palette.text.primary
                    },
                    '& .MuiSvgIcon-root': {
                      color: theme.palette.text.primary
                    }
                  }}
                >
                  <Typography fontWeight={600}>
                    Système de recommandation IA – E-commerce
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    Mise en place d’un moteur de recommandations contextuelles
                    pour augmenter conversion & panier moyen :
                    <br />• Analyse des données de navigation & transactions
                    <br />• Modèle de recommandation personnalisé (LLM + signaux comportementaux)
                    <br />• Tests A/B sur un segment de trafic
                    <br />• Intégration front légère dans le tunnel d&apos;achat.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {/* Prédiction de churn avancée – Fintech B2C */}
              <Accordion
                disableGutters
                sx={{
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  borderBottom: `1px solid ${
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.12)
                      : alpha('#111827', 0.06)
                  }`
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    '& .MuiAccordionSummary-expandIconWrapper': {
                      color: theme.palette.text.primary
                    },
                    '& .MuiSvgIcon-root': {
                      color: theme.palette.text.primary
                    }
                  }}
                >
                  <Typography fontWeight={600}>
                    Prédiction de churn avancée – Fintech B2C
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    Anticipation des résiliations pour cibler les actions de rétention :
                    <br />• Analyse cohortes & signaux faibles sur 12 mois
                    <br />• Modèle de scoring (XGBoost + embeddings LLM)
                    <br />• Connexion CRM pour campagnes ciblées multi-canal
                    <br />• Suivi du lift & ajustement continu des seuils.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {/* Éditeur d’activité pédagogique – Ludicius (2024–2025) */}
              <Accordion
                disableGutters
                sx={{
                  bgcolor: 'transparent',
                  boxShadow: 'none'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    '& .MuiAccordionSummary-expandIconWrapper': {
                      color: theme.palette.text.primary
                    },
                    '& .MuiSvgIcon-root': {
                      color: theme.palette.text.primary
                    }
                  }}
                >
                  <Typography fontWeight={600}>
                    Éditeur d’activité pédagogique – Ludicius
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, mb: 1.5 }}
                  >
                    Conception et développement d’un éditeur IA d’activités pédagogiques interactives
                    pour la formation et les serious games.
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.8,
                      mb: 1.5
                    }}
                  >
                    {[
                      'Large Language Models',
                      'RAG & Agents IA',
                      'Automatisation',
                      'Python & API',
                      'React / Node.js',
                      'POC → MVP'
                    ].map((tag, i) => (
                      <Box
                        key={i}
                        sx={{
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 999,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.primary.light, 0.2)
                              : alpha(theme.palette.primary.main, 0.04),
                          border: `1px solid ${
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.primary.light, 0.8)
                              : alpha(theme.palette.primary.main, 0.16)
                          }`,
                          color:
                            theme.palette.mode === 'dark'
                              ? theme.palette.primary.contrastText
                              : theme.palette.primary.main
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    • Création d’un éditeur d’activités IA (QCM, drag &amp; drop, scénarios interactifs)
                    <br />• Passage du POC au MVP intégré à la plateforme de vente
                    <br />• Automatisation et intégration IA pour accélérer la conception
                    et la personnalisation de contenus pédagogiques
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default memo(About);