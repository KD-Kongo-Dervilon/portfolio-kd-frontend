// src/components/Blog.jsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Stack,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import {
  ArrowForward,
  AccessTime,
  Search,
  Favorite,
  FavoriteBorder,
  Share,
  TrendingUp,
  ChatBubbleOutline,
} from '@mui/icons-material';

// 📝 Données des articles
const articles = [
  {
    slug: 'chatbot-ia-reduction-60-support',
    title: "Comment j'ai réduit de 60% le temps support avec un chatbot IA",
    excerpt:
      "Retour d'expérience sur la mise en place d'un chatbot LLM avec RAG pour automatiser le support client. Méthodologie, pièges à éviter, et résultats mesurables.",
    date: '2024-12-15',
    readTime: '8 min',
    category: 'IA & Automatisation',
    image: '🤖',
    likes: 247,
    comments: 32,
    trending: true,
  },
  {
    slug: 'roi-projet-rag-3-metriques',
    title: "ROI d'un projet RAG : 3 métriques à suivre absolument",
    excerpt:
      "Quels KPIs suivre pour mesurer le succès d'un projet RAG ? Découvrez les 3 métriques business essentielles qui prouvent la valeur de votre investissement IA.",
    date: '2024-12-10',
    readTime: '6 min',
    category: 'Product Management',
    image: '📊',
    likes: 189,
    comments: 18,
    trending: true,
  },
  {
    slug: 'poc-mvp-21-jours-methode',
    title: 'De POC à MVP en 21 jours : ma méthode step-by-step',
    excerpt:
      "Comment j'ai livré un système de recommandation IA opérationnel en 3 semaines. Framework complet pour accélérer votre time-to-market sans sacrifier la qualité.",
    date: '2024-12-05',
    readTime: '10 min',
    category: 'Méthodologie',
    image: '🚀',
    likes: 312,
    comments: 45,
    trending: false,
  },
];

const categories = ['Tous', 'IA & Automatisation', 'Product Management', 'Méthodologie'];

// 🧩 Card d'article (liste) – design type blog pro
const ArticleCard = React.memo(function ArticleCard({
  article,
  index,
  onNavigate,
  liked,
  onToggleLike,
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleClick = useCallback(() => {
    onNavigate(`/blog/${article.slug}`);
  }, [article.slug, onNavigate]);

  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();
      onToggleLike(article.slug);
    },
    [article.slug, onToggleLike]
  );

  const handleShare = useCallback(
    async (e) => {
      e.stopPropagation();
      const url =
        typeof window !== 'undefined'
          ? `${window.location.origin}/blog/${article.slug}`
          : `https://kddervilon.com/blog/${article.slug}`;

      try {
        if (navigator.share) {
          await navigator.share({
            title: article.title,
            text: article.excerpt,
            url,
          });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        }
      } catch {
        // user cancel → ignore
      }
    },
    [article]
  );

  const displayLikes = article.likes + (liked ? 1 : 0);

  return (
    <Paper
      component="article"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        backgroundColor: 'background.paper',
        transition:
          'transform 220ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1), border-color 220ms ease',
        boxShadow: (t) => `0 10px 30px ${alpha(t.palette.common.black, 0.04)}`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 22px 70px rgba(15, 23, 42, 0.16)',
          borderColor: theme.palette.primary.main,
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': {
            transform: 'none',
          },
        },
      }}
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Lire l'article: ${article.title}`}
    >
      {/* Bandeau emoji / catégorie */}
      <Box
        sx={{
          height: 190,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {article.trending && (
          <Chip
            icon={<TrendingUp />}
            label="Tendance"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'error.main',
              color: 'white',
              fontWeight: 700,
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.32)',
            }}
            aria-label="Article tendance"
          />
        )}
        <Box
          component="span"
          role="img"
          aria-label={`Icône ${article.category}`}
          sx={{
            fontSize: 90,
            transform: 'translateY(4px)',
          }}
        >
          {article.image}
        </Box>
      </Box>

      {/* Contenu card */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Chip
          label={article.category}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            mb: 2,
            fontWeight: 700,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
          }}
        />

        <Typography
          variant="h6"
          component="h2"
          fontWeight={800}
          gutterBottom
          sx={{
            mb: 1.5,
            lineHeight: 1.35,
            letterSpacing: '-0.02em',
          }}
        >
          {article.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
            lineHeight: 1.7,
            flexGrow: 1,
          }}
        >
          {article.excerpt}
        </Typography>

        {/* Meta / auteur / temps */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                width: 26,
                height: 26,
                bgcolor: theme.palette.primary.main,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              KD
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              KD Dervilon
            </Typography>
          </Stack>

          <Chip
            icon={<AccessTime />}
            label={article.readTime}
            size="small"
            variant="outlined"
            sx={{
              ml: 'auto',
              borderRadius: 999,
              fontWeight: 600,
              px: 0.75,
              borderColor: isDarkMode
                ? alpha(theme.palette.common.white, 0.28)
                : alpha(theme.palette.text.primary, 0.25),
              color: isDarkMode
                ? alpha(theme.palette.common.white, 0.92)
                : theme.palette.text.primary,
              backgroundColor: isDarkMode
                ? alpha(theme.palette.common.white, 0.06)
                : alpha(theme.palette.common.black, 0.02),
              '& .MuiChip-icon': {
                color: isDarkMode
                  ? alpha(theme.palette.common.white, 0.92)
                  : theme.palette.text.primary,
              },
            }}
            aria-label={`Temps de lecture: ${article.readTime}`}
          />
        </Stack>

        {/* Likes / commentaires / CTA */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Likes */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip
                title={liked ? 'Retirer le like' : "J'aime cet article"}
              >
                <IconButton
                  size="small"
                  onClick={handleLike}
                  aria-label={liked ? 'Retirer le like' : "J'aime cet article"}
                  aria-pressed={liked}
                  sx={{
                    color: liked ? 'error.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      color: 'error.main',
                    },
                  }}
                >
                  {liked ? (
                    <Favorite fontSize="small" />
                  ) : (
                    <FavoriteBorder fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ minWidth: 22, textAlign: 'left' }}
              >
                {displayLikes}
              </Typography>
            </Stack>

            {/* Commentaires */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ChatBubbleOutline
                fontSize="small"
                sx={{ color: 'text.secondary' }}
                aria-hidden="true"
              />
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {article.comments}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Partage */}
            <Tooltip title="Partager l'article">
              <IconButton
                size="small"
                onClick={handleShare}
                aria-label="Partager l'article"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                <Share fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* CTA Lire – version SEO-friendly avec Link */}
            <Button
              component={Link}
              to={`/blog/${article.slug}`}
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                fontWeight: 700,
                borderRadius: 999,
                textTransform: 'none',
                px: 2.5,
                minHeight: 36,
              }}
              aria-label={`Lire l'article : ${article.title}`}
            >
              Lire
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
});

const Blog = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isDarkMode = theme.palette.mode === 'dark';
  const primary = theme.palette.primary;
  const secondary = theme.palette.secondary || theme.palette.primary;

  const BLOG_COLORS = {
    pageBg: isDarkMode
      ? theme.palette.background.default || '#020617'
      : `linear-gradient(180deg, ${alpha(primary.light || primary.main, 0.08)} 0%, ${alpha(
          secondary.light || secondary.main,
          0.06
        )} 22%, ${theme.palette.background.default || '#f9fafb'} 100%)`,
    heroBg: `linear-gradient(135deg, ${primary.main} 0%, ${secondary.main} 40%, ${
      secondary.dark || primary.dark || primary.main
    } 100%)`,
    heroChipBg: alpha(theme.palette.common.black, 0.72),
    heroSubtitle: 'rgba(249,250,251,0.9)',
    heroSearchBg: theme.palette.background.paper,
    heroSearchShadow: `0 18px 45px ${alpha(
      theme.palette.common.black,
      0.35
    )}, 0 0 0 1px ${alpha(theme.palette.divider, 0.4)}`,
    categoryChipInactiveBg: isDarkMode
      ? alpha(theme.palette.background.paper, 0.9)
      : theme.palette.background.paper,
    categoryChipBorder: alpha(theme.palette.divider, 0.6),
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [likedArticles, setLikedArticles] = useState(new Set());

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'Tous' ||
        article.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategory(cat);
  }, []);

  const handleToggleLike = useCallback((slug) => {
    setLikedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const resultCount = filteredArticles.length;

  return (
    <Box
      component="main"
      aria-labelledby="blog-title"
      sx={{
        py: { xs: 8, md: 10 },
        px: { xs: 2, md: 0 },
        bgcolor: BLOG_COLORS.pageBg,
      }}
    >
      <Container maxWidth="lg">
        {/* En-tête type blog avec carte hero */}
        <Box sx={{ mb: 6 }}>
          <Box
            component="header"
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              background: BLOG_COLORS.heroBg,
              color: '#ffffff',
              px: { xs: 3, md: 5 },
              py: { xs: 3.5, md: 5 },
              boxShadow:
                '0 28px 80px rgba(15, 23, 42, 0.48), 0 0 0 1px rgba(15, 23, 42, 0.12)',
            }}
          >
            {/* Halo décoratif */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  borderRadius: '999px',
                  filter: 'blur(48px)',
                  opacity: 0.5,
                },
                '&::before': {
                  width: 260,
                  height: 260,
                  top: -60,
                  right: -40,
                  background:
                    'radial-gradient(circle, rgba(244,244,245,0.85) 0%, transparent 60%)',
                },
                '&::after': {
                  width: 220,
                  height: 220,
                  bottom: -40,
                  left: -40,
                  background:
                    'radial-gradient(circle, rgba(129,230,217,0.65) 0%, transparent 60%)',
                },
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Chip
                label="Blog & insights IA · Product"
                size="small"
                sx={{
                  mb: 2,
                  px: 1.5,
                  height: 26,
                  borderRadius: 999,
                  bgcolor: BLOG_COLORS.heroChipBg,
                  color: 'rgba(249,250,251,0.95)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}
              />

              <Typography
                id="blog-title"
                component="h1"
                variant={isMobile ? 'h4' : 'h3'}
                fontWeight={800}
                sx={{
                  mb: 1.5,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.1,
                }}
              >
                Retours d&apos;expérience, cas concrets
                <Box component="span" sx={{ display: 'block' }}>
                  et frameworks pour vos projets IA
                </Box>
              </Typography>

              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  maxWidth: 620,
                  mb: 3.5,
                  color: BLOG_COLORS.heroSubtitle,
                  lineHeight: 1.7,
                }}
              >
                Études de cas, métriques de ROI et méthodes opérationnelles pour
                passer de l&apos;idée au MVP, puis à la mise en production
                (chatbots, RAG, automatisations n8n...).
              </Typography>

              {/* Barre de recherche intégrée au hero */}
              <Box
                sx={{
                  maxWidth: 520,
                  bgcolor: BLOG_COLORS.heroSearchBg,
                  borderRadius: 999,
                  boxShadow: BLOG_COLORS.heroSearchShadow,
                  p: 0.5,
                }}
              >
                <TextField
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un article (chatbot, RAG, ROI, MVP...)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          aria-hidden="true"
                          sx={{ color: 'text.secondary' }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    'aria-label': "Rechercher dans les articles du blog",
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 999,
                      backgroundColor: BLOG_COLORS.heroSearchBg,
                      '& fieldset': { borderColor: 'transparent' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                      '&.Mui-focused': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    },
                    '& input': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                      WebkitBoxShadow: 'none !important',
                    },
                    '& input[type="search"]': {
                      WebkitAppearance: 'none',
                    },
                    '& .MuiOutlinedInput-input': {
                      '&:focus': {
                        outline: 'none !important',
                      },
                    },
                  }}
                />
              </Box>

              <Typography
                variant="caption"
                sx={{
                  mt: 1.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'rgba(241,245,249,0.9)',
                }}
              >
                {resultCount} article{resultCount > 1 ? 's' : ''} disponible
                {resultCount > 1 ? 's' : ''} pour inspirer ton prochain projet.
              </Typography>
            </Box>
          </Box>

          {/* Filtres catégories sous la hero card */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 3 }}
            component="nav"
            aria-label="Filtres par catégorie"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => handleCategoryChange(cat)}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 999,
                    px: 1,
                    bgcolor: active
                      ? 'primary.main'
                      : BLOG_COLORS.categoryChipInactiveBg,
                    color: active ? 'primary.contrastText' : 'text.primary',
                    border: active ? 'none' : `1px solid ${BLOG_COLORS.categoryChipBorder}`,
                    boxShadow: active
                      ? `0 10px 30px ${alpha(theme.palette.primary.main, 0.4)}`
                      : `0 8px 20px ${alpha(theme.palette.common.black, 0.16)}`,
                    '&:hover': {
                      bgcolor: active
                        ? 'primary.dark'
                        : alpha(theme.palette.primary.main, 0.08),
                    },
                    '&:focus-visible': {
                      outline: `3px solid ${alpha(
                        theme.palette.primary.main,
                        0.5
                      )}`,
                      outlineOffset: 2,
                    },
                  }}
                  aria-pressed={active}
                  aria-label={`Filtrer par ${cat}`}
                />
              );
            })}
          </Stack>

          {/* Résultats (accessibilité) */}
          <Box
            component="span"
            tabIndex="-1"
            sx={{
              position: 'absolute',
              left: '-10000px',
              width: 1,
              height: 1,
              overflow: 'hidden',
            }}
            role="status"
            aria-live="polite"
          >
            {resultCount} article
            {resultCount > 1 ? 's' : ''} trouvé
            {resultCount > 1 ? 's' : ''}.
          </Box>
        </Box>

        {/* Grille des articles */}
        <Grid
          container
          spacing={4}
          component="section"
          aria-label="Liste des articles du blog"
        >
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <Grid item xs={12} md={4} key={article.slug}>
                <ArticleCard
                  article={article}
                  index={index}
                  onNavigate={handleNavigate}
                  liked={likedArticles.has(article.slug)}
                  onToggleLike={handleToggleLike}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <Typography
                  component="p"
                  variant="body1"
                  color="text.secondary"
                >
                  Aucun article ne correspond à votre recherche pour le
                  moment.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Blog;