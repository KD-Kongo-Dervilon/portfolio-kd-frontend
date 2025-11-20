// src/components/Achievements.jsx - Premium 10/10 avec animations
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Fade,
  Grow,
  useMediaQuery,
  alpha,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  EmojiEvents,
  Speed,
  TrendingUp,
  Groups,
  CheckCircle,
  Star,
  Verified,
  Lightbulb,
  Psychology,
  Rocket
} from '@mui/icons-material';

const achievements = [
  {
    id: 1,
    icon: TrendingUp,
    value: 340000,
    suffix: '€',
    prefix: '+',
    label: 'Revenu additionnel généré',
    description: 'Impact business direct sur un projet e-commerce IA',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    category: 'Impact Business'
  },
  {
    id: 2,
    icon: Speed,
    value: 85,
    suffix: '%',
    prefix: '-',
    label: 'Réduction temps de réponse',
    description: 'Chatbot IA automatisant le support client',
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #4f46e5 100%)',
    category: 'Efficacité Opérationnelle'
  },
  {
    id: 3,
    icon: Groups,
    value: 60,
    suffix: '%',
    prefix: '-',
    label: 'Tickets support automatisés',
    description: 'Libération de 500+ heures/mois équipe support',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    category: 'Automatisation'
  },
  {
    id: 4,
    icon: CheckCircle,
    value: 21,
    suffix: ' jours',
    prefix: '',
    label: 'Time-to-market record',
    description: 'POC → MVP → Production système recommandation',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    category: 'Agilité'
  },
  {
    id: 5,
    icon: Rocket,
    value: 8,
    suffix: ' projets',
    prefix: '',
    label: 'Projets IA livrés',
    description: 'Chatbots, RAG, scoring, recommandation',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    category: 'Expérience'
  },
  {
    id: 6,
    icon: Star,
    value: 45,
    suffix: '%',
    prefix: '+',
    label: 'Augmentation conversion',
    description: 'Système de recommandation personnalisé',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    category: 'Performance'
  }
];

const badges = [
  { icon: Verified, label: 'Certifié Product Owner', color: '#667eea' },
  { icon: Psychology, label: 'Expert IA & LLM', color: '#10b981' },
  { icon: Lightbulb, label: 'Innovation & R&D', color: '#f59e0b' },
  { icon: EmojiEvents, label: 'MVP < 30 jours', color: '#ec4899' }
];

// Hook pour animation compteur
const useCountUp = (end, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) return;

    const animate = (currentTime) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime;
      const progress = Math.min((currentTime - startTimeRef.current) / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      countRef.current = Math.floor(easeOutQuart * end);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, shouldStart]);

  return count;
};

const AchievementCard = ({ achievement, index, visible }) => {
  const theme = useTheme();
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);
  const count = useCountUp(achievement.value, 2000, isInView);
  const Icon = achievement.icon;
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!visible || reduceMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = cardRef.current; // ✅ capture de la référence actuelle

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // ✅ utilise la valeur capturée
      }
      observer.disconnect();
    };
  }, [visible, reduceMotion]);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Grow
        in={visible}
        timeout={reduceMotion ? 0 : 600}
        style={reduceMotion ? undefined : { transitionDelay: `${index * 100}ms` }}
      >
        <Paper
          ref={cardRef}
          elevation={0}
          sx={{
            p: 4,
            height: '100%',
            borderRadius: 4,
            border: '2px solid',
            borderColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.15)
              : 'divider',
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: achievement.gradient,
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.35s ease'
            },
            '&:hover': {
              transform: 'translateY(-12px) scale(1.02)',
              boxShadow: `0 20px 48px ${alpha(achievement.color, 0.3)}`,
              borderColor: achievement.color,
              '&::before': {
                transform: 'scaleX(1)'
              }
            }
          }}
        >
          {/* Icône + Badge catégorie */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box
              sx={{
                width: 55,
                height: 55,
                borderRadius: 3,
                background: achievement.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${alpha(achievement.color, 0.4)}`,
                transform: isInView ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-45deg)',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <Icon sx={{ fontSize: 36, color: '#ffffff' }} />
            </Box>
            <Chip
              label={achievement.category}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(achievement.color, 0.25)
                  : alpha(achievement.color, 0.12),
                color: theme.palette.mode === 'dark'
                  ? theme.palette.primary.contrastText
                  : achievement.color,
                border: `1px solid ${
                  theme.palette.mode === 'dark'
                    ? alpha(achievement.color, 0.5)
                    : alpha(achievement.color, 0.3)
                }`
              }}
            />
          </Stack>

          {/* Valeur animée */}
          <Typography
            variant="h3"
            component="p"
            fontWeight={800}
            sx={{
              mb: 1,
              background: achievement.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', sm: '1.7rem' }
            }}
          >
            {achievement.prefix}
            {reduceMotion ? achievement.value : count}
            {achievement.suffix}
          </Typography>

          {/* Label */}
          <Typography
            variant="h6"
            component="p"
            fontWeight={700}
            color={theme.palette.text.primary}
            gutterBottom
            sx={{ lineHeight: 1.3, mb: 1.5 }}
          >
            {achievement.label}
          </Typography>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {achievement.description}
          </Typography>
        </Paper>
      </Grow>
    </Grid>
  );
};

const Achievements = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <Box
      id="achievements"
      component="section"
      role="region"
      aria-labelledby="achievements-title"
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        bgcolor: theme.palette.mode === 'dark'
          ? theme.palette.background.default
          : '#f8f9fa',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background:
            'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in={visible} timeout={reduceMotion ? 0 : 800}>
            <Box>
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mb={2}>
                <EmojiEvents sx={{ fontSize: 40, color: '#f59e0b' }} />
                <Typography
                  id="achievements-title"
                  component="h2"
                  variant="h3"
                  fontWeight={700}
                  color={theme.palette.text.primary}
                >
                  Réalisations & Impact
                </Typography>
                <EmojiEvents sx={{ fontSize: 40, color: '#f59e0b' }} />
              </Stack>
              <Typography
                variant="h6"
                component="p"
                color="text.secondary"
                sx={{ maxWidth: 700, mx: 'auto' }}
              >
                Résultats concrets et mesurables sur mes projets IA & Product Management
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Badges expertise */}
        <Fade in={visible} timeout={reduceMotion ? 0 : 1000}>
          <Box sx={{ mb: 6 }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 2 }}
            >
              {badges.map((badge, index) => {
                const BadgeIcon = badge.icon;
                return (
                  <Tooltip key={index} title={badge.label} arrow placement="top">
                    <Paper
                      elevation={0}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: theme.palette.mode === 'dark'
                          ? alpha(badge.color, 0.5)
                          : alpha(badge.color, 0.3),
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha(badge.color, 0.25)
                          : alpha(badge.color, 0.08),
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.05)',
                          boxShadow: `0 12px 32px ${alpha(badge.color, 0.3)}`,
                          borderColor: badge.color
                        }
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BadgeIcon sx={{ fontSize: 24, color: badge.color }} />
                        <Typography variant="body2" fontWeight={700} color={theme.palette.text.primary}>
                          {badge.label}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Tooltip>
                );
              })}
            </Stack>
          </Box>
        </Fade>

        {/* Grille achievements */}
        <Grid container spacing={3}>
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={index}
              visible={visible}
            />
          ))}
        </Grid>

        {/* CTA Bottom */}
        <Fade in={visible} timeout={reduceMotion ? 0 : 1400}>
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              p: 4,
              textAlign: 'center',
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: theme.palette.mode === 'dark'
                ? theme.palette.primary.contrastText
                : '#ffffff',
              boxShadow: '0 20px 48px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Typography
              variant="h5"
              component="p"
              fontWeight={700}
              gutterBottom
            >
              🚀 Prêt à générer des résultats similaires ?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
              Je transforme vos défis IA en opportunités business mesurables
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Box
                component="a"
                href="#contact"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: '#ffffff',
                  color: '#667eea',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(255,255,255,0.3)'
                  }
                }}
              >
                💼 Discutons de votre projet
              </Box>
              <Box
                component="a"
                href="#case-studies"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  border: '2px solid #ffffff',
                  color: '#ffffff',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.15),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                📚 Voir les études de cas
              </Box>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Achievements;