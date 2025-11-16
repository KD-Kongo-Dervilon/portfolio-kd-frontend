// src/components/Skills.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Fade,
  Grow,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Groups,
  AutoAwesome,
  Build,
  CheckCircle
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const SKILLS_DATA = [
  {
    category: 'IA & Technologies',
    icon: <Psychology />,
    color: '#667eea',
    skills: [
      { name: 'LLM (GPT-4, Claude, Mistral)', tags: ['Production', 'Expert'] },
      { name: 'RAG & Vector Databases', tags: ['Pinecone', 'Weaviate'] },
      { name: 'Agents IA & Orchestration', tags: ['LangChain', 'CrewAI'] },
      { name: 'Python / FastAPI', tags: ['Backend', 'APIs'] },
      { name: 'React.js / Next.js', tags: ['Frontend', 'SSR'] },
      { name: 'Prompt Engineering', tags: ['Optimisation', 'Chain-of-Thought'] }
    ]
  },
  {
    category: 'Product Management',
    icon: <TrendingUp />,
    color: '#764ba2',
    skills: [
      { name: 'Scrum / Agile', tags: ['Certified CSPO'] },
      { name: 'User Stories & Backlog', tags: ['Priorisation', 'MoSCoW'] },
      { name: 'Product Discovery', tags: ['Jobs to be Done', 'User Research'] },
      { name: 'Roadmapping stratégique', tags: ['OKR', 'Vision'] },
      { name: 'Analytics & KPIs', tags: ['Mixpanel', 'Amplitude'] },
      { name: 'Go-to-Market', tags: ['Positionnement', 'Lancement'] }
    ]
  },
  {
    category: 'Leadership & Soft Skills',
    icon: <Groups />,
    color: '#10b981',
    skills: [
      { name: 'Communication transverse', tags: ['Stakeholders', 'Équipes Tech'] },
      { name: "Animation d'ateliers", tags: ['Design Sprint', 'Brainstorming'] },
      { name: 'Pédagogie & Mentoring', tags: ['Formation', 'Onboarding'] },
      { name: 'Résolution de conflits', tags: ['Médiation', 'Négociation'] },
      { name: "Esprit d'analyse", tags: ['Data-driven', 'Problem Solving'] },
      { name: 'Adaptabilité', tags: ['Pivot', 'Ambiguïté'] }
    ]
  }
];

const Skills = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <Box
      id="skills"
      component="section"
      aria-labelledby="skills-title"
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        background: 'linear-gradient(180deg, #f7f8fc 0%, #eef1f8 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '60%',
          background:
            'radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={reduceMotion ? 0 : 800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              id="skills-title"
              component="h2"
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                letterSpacing: '-0.02em',
                background:
                  'linear-gradient(135deg, #111827 0%, #667eea 40%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              💪 Compétences & Expertise
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ maxWidth: 640, mx: 'auto', lineHeight: 1.7 }}
            >
              Compétences activées en production sur des projets IA, produit et data à fort ROI.
            </Typography>
          </Box>
        </Fade>

        {/* Colonnes de compétences (ciblant css-klqxk8-MuiPaper-root) */}
        <Grid container spacing={isMobile ? 3 : 4}>
          {SKILLS_DATA.map((category, catIdx) => (
            <Grid item xs={12} lg={4} key={catIdx}>
              <Grow in timeout={reduceMotion ? 0 : 900 + catIdx * 150}>
                {/* Wrapper = gère le hover transform comme Portfolio/CaseStudies */}
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    transition: reduceMotion
                      ? 'none'
                      : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center center',
                    willChange: reduceMotion ? 'auto' : 'transform',
                    '&:hover': {
                      transform: reduceMotion ? 'none' : 'translateY(-12px) scale(1.02)'
                    }
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, sm: 3.5 },
                      height: '100%',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: '#ffffff',
                      boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
                      transition:
                        'box-shadow 0.35s ease, border-color 0.35s ease, background-color 0.35s ease',
                      '&:hover': {
                        boxShadow: `0 22px 52px ${alpha(category.color, 0.22)}`,
                        borderColor: alpha(category.color, 0.85),
                        backgroundColor: '#ffffff'
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 24,
                        background: `linear-gradient(135deg, ${alpha(
                          category.color,
                          0.08
                        )}, transparent)`,
                        opacity: 0,
                        transition: 'opacity 0.35s ease',
                        pointerEvents: 'none'
                      },
                      '&:hover::before': {
                        opacity: reduceMotion ? 0 : 1
                      }
                    }}
                  >
                    {/* Titre catégorie */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 3,
                        pb: 2,
                        borderBottom: '1px solid',
                        borderColor: alpha(category.color, 0.22)
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
                          bgcolor: alpha(category.color, 0.08),
                          color: category.color,
                          transition: 'transform 0.3s ease',
                          transformOrigin: 'center',
                          '&:hover': {
                            transform: reduceMotion
                              ? 'none'
                              : 'translateY(-2px) scale(1.06)'
                          }
                        }}
                      >
                        {React.cloneElement(category.icon, {
                          sx: { fontSize: 26 }
                        })}
                      </Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight={700}
                        sx={{ color: '#111827' }}
                      >
                        {category.category}
                      </Typography>
                    </Box>

                    {/* Liste des skills */}
                    <Stack spacing={2.1}>
                      {category.skills.map((skill, skillIdx) => {
                        const key = `${catIdx}-${skillIdx}`;
                        const isHovered = hoveredSkill === key;

                        return (
                          <Box
                            key={key}
                            onMouseEnter={() => setHoveredSkill(key)}
                            onMouseLeave={() => setHoveredSkill(null)}
                            sx={{
                              p: 1.8,
                              borderRadius: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.75,
                              cursor: 'default',
                              border: '1px solid',
                              borderColor: isHovered
                                ? alpha(category.color, 0.4)
                                : 'transparent',
                              bgcolor: isHovered
                                ? alpha(category.color, 0.04)
                                : 'transparent',
                              boxShadow: isHovered
                                ? `0 10px 26px ${alpha(category.color, 0.16)}`
                                : 'none',
                              transition:
                                'border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                              transform: isHovered
                                ? 'translateY(-3px)'
                                : 'translateY(0)'
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <CheckCircle
                                sx={{
                                  color: category.color,
                                  fontSize: 18
                                }}
                              />
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={{ color: '#111827' }}
                              >
                                {skill.name}
                              </Typography>
                            </Stack>

                            <Box
                              sx={{
                                display: 'flex',
                                gap: 0.5,
                                flexWrap: 'wrap',
                                mt: 0.5,
                                ml: 3
                              }}
                            >
                              {skill.tags.map((tag, tagIdx) => (
                                <Chip
                                  key={tagIdx}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    height: 22,
                                    px: 0.8,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    borderRadius: 999,
                                    bgcolor: alpha(category.color, 0.06),
                                    color: category.color,
                                    border: `1px solid ${alpha(
                                      category.color,
                                      0.28
                                    )}`,
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                      bgcolor: alpha(category.color, 0.14)
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Paper>
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Bloc Outils & Certifications (ciblant css-662j7-MuiPaper-root) */}
        <Fade in timeout={reduceMotion ? 0 : 1500}>
          <Box sx={{ mt: 6 }}>
            {/* Wrapper global hover */}
            <Box
              sx={{
                position: 'relative',
                transition: reduceMotion
                  ? 'none'
                  : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'center center',
                willChange: reduceMotion ? 'auto' : 'transform',
                '&:hover': {
                  transform: reduceMotion
                    ? 'none'
                    : 'translateY(-12px) scale(1.02)'
                }
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 3 : 4,
                  borderRadius: 3,
                  bgcolor: '#ffffff',
                  border: '1px solid',
                  borderColor: alpha('#111827', 0.12),
                  boxShadow: '0 12px 34px rgba(15,23,42,0.10)',
                  transition:
                    'box-shadow 0.35s ease, border-color 0.35s ease, background-color 0.35s ease',
                  '&:hover': {
                    boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
                    borderColor: alpha(theme.palette.primary.main, 0.8),
                    backgroundColor: '#ffffff'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 24,
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
                  }
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={4}
                >
                  {/* Outils & Stack */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
                      <Build sx={{ color: 'primary.main' }} />
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight={700}
                        sx={{ color: '#111827' }}
                      >
                        Outils & Stack
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.85,
                        flexWrap: 'wrap'
                      }}
                    >
                      {[
                        'OpenAI API',
                        'Anthropic API',
                        'Pinecone',
                        'Weaviate',
                        'LangChain',
                        'CrewAI',
                        'Jira',
                        'Notion',
                        'Figma',
                        'Mixpanel',
                        'Amplitude',
                        'PostgreSQL',
                        'Docker'
                      ].map((tool, idx) => (
                        <Chip
                          key={idx}
                          label={tool}
                          size="medium"
                          sx={{
                            fontWeight: 600,
                            borderRadius: 999,
                            bgcolor: '#ffffff',
                            border: '1px solid',
                            borderColor: alpha('#111827', 0.14),
                            boxShadow: '0 4px 10px rgba(15,23,42,0.06)',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                              borderColor: theme.palette.primary.main,
                              boxShadow:
                                '0 8px 18px rgba(79,70,229,0.22)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Certifications */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
                      <AutoAwesome sx={{ color: 'secondary.main' }} />
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight={700}
                        sx={{ color: '#111827' }}
                      >
                        Certifications
                      </Typography>
                    </Stack>
                    <Stack spacing={1.4}>
                      {[
                        {
                          name: 'Chef de projet IA ',
                          year: '2025'
                        },
                        {
                          name: 'Certified Scrum Product Owner (CSPO)',
                          year: '2024'
                        },
                        {
                          name: 'Product Management ',
                          year: '2024'
                        }
                      ].map((cert, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 1.8,
                            borderRadius: 2,
                            bgcolor: '#ffffff',
                            border: '1px solid',
                            borderColor: alpha('#111827', 0.12),
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.4,
                            boxShadow: '0 4px 10px rgba(15,23,42,0.04)',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                              transform: 'translateX(8px)',
                              borderColor:
                                theme.palette.secondary.main,
                              boxShadow:
                                '0 10px 24px rgba(124,58,237,0.18)'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 9,
                              height: 9,
                              borderRadius: '999px',
                              bgcolor: theme.palette.secondary.main,
                              flexShrink: 0
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{ color: '#111827' }}
                            >
                              {cert.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {cert.year}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Skills;