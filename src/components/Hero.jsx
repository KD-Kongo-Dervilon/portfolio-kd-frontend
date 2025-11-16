// src/components/Hero.jsx
// Note performance : ce Hero n'utilise aucune image bitmap (<img>),
// uniquement un Avatar MUI + icônes => pas d'optimisation WebP nécessaire ici.
import React from 'react';
import { Box, Typography, Button, IconButton, Avatar, Chip, Container, Grow, Stack } from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Email,
  KeyboardArrowDown,
  Code,
  Speed,
  AutoAwesome,
  Psychology
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const Hero = () => {
  return (
    <Box
      id="accueil"
      role="banner"
      aria-labelledby="hero-title"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 10,
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(102,126,234,0.03) 0%, transparent 70%)',
          animation: 'rotate 20s linear infinite',
        },
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes floatY': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        '@keyframes spin360': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '@keyframes pulseGlow': {
          '0%, 100%': {
            boxShadow: (t) => `0 10px 40px ${alpha(t.palette.primary.dark, 0.45)}`,
            filter: 'brightness(1)'
          },
          '50%': {
            boxShadow: (t) => `0 14px 56px ${alpha(t.palette.secondary.dark, 0.55)}`,
            filter: 'brightness(1.05)'
          },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animation: 'none !important',
            transition: 'none !important',
          },
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grow in timeout={900}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              role="img"
              aria-label="Icône représentant l'intelligence artificielle au service du produit"
              sx={{
                position: 'relative',
                display: 'inline-block',
                width: { xs: 140, md: 180 },
                height: { xs: 140, md: 180 },
                mx: 'auto',
                mb: 4,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: { xs: -10, md: -12 },
                  borderRadius: '50%',
                  background: (t) => `conic-gradient(${t.palette.primary.dark}, ${t.palette.secondary.dark}, ${t.palette.primary.dark})`,
                  WebkitMask: {
                    background: 'radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0)'
                  },
                  mask: {
                    background: 'radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0)'
                  },
                  animation: 'spin360 3s linear infinite',
                  boxShadow: (t) => `0 0 24px ${alpha(t.palette.primary.dark, 0.25)}`,
                },
              }}
            >
              <Avatar
                alt="Icône représentant l'intelligence artificielle au service de vos produits"
                sx={{
                  width: { xs: 140, md: 180 },
                  height: { xs: 140, md: 180 },
                  mx: 'auto',
                  background: (t) => `linear-gradient(135deg, ${t.palette.primary.dark} 0%, ${t.palette.secondary.dark} 100%)`,
                  boxShadow: (t) => `0 12px 48px ${alpha(t.palette.primary.dark, 0.5)}`,
                  animation: 'fadeInUp .8s ease-out both, pulseGlow 4s ease-in-out infinite',
                  border: (t) => `3px solid ${alpha(t.palette.common.white, 0.95)}`,
                }}
              >
                <Psychology aria-hidden sx={{ fontSize: { xs: 70, md: 90 }, color: 'white' }} />
              </Avatar>
            </Box>

            <Typography
              component="h1"
              variant="h2"
              id="hero-title"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: (t) => `linear-gradient(135deg, ${t.palette.primary.dark} 0%, ${t.palette.secondary.dark} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 1px 1px rgba(0,0,0,0.25)',
                animation: 'fadeInUp .9s ease-out .1s both',
              }}
            >
              Chef de Projet IA
            </Typography>

            <Typography
              component="h2"
              variant="h4"
              aria-describedby="hero-title"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: 0,
                animation: 'fadeInUp .9s ease-out .2s both',
              }}
            >
              &amp; Product Owner
            </Typography>

            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="center" 
              flexWrap="wrap" 
              sx={{ mb: 4, gap: 1 }}
            >
              {[
                { icon: <Code />, label: 'LLM • RAG • Agents', delay: 0.25 },
                { icon: <Speed />, label: 'Scrum • Agile', delay: 0.35 },
                { icon: <AutoAwesome />, label: 'Impact Business', delay: 0.45 }
              ].map((chip, idx) => (
                <Chip
                  key={idx}
                  icon={chip.icon}
                  label={chip.label}
                  sx={{
                    bgcolor: 'common.white',
                    color: 'text.primary',
                    fontWeight: 700,
                    border: (t) => `2px solid ${t.palette.divider}`,
                    animation: `fadeInUp .8s ease-out ${chip.delay}s both`,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.25)',
                      borderColor: 'primary.main',
                    }
                  }}
                />
              ))}
            </Stack>

            <Typography
              variant="h6"
              component="p"
              sx={{
                maxWidth: 720,
                mx: 'auto',
                mb: 4,
                color: 'text.secondary',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.125rem' },
                animation: 'fadeInUp .9s ease-out .4s both',
              }}
            >
              J'orchestre des solutions IA pragmatiques et scalables, du cadrage à la mise en production,
              avec une obsession pour la valeur utilisateur et la clarté produit.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                href="#portfolio"
                aria-label="Voir mes projets"
                sx={{
                  background: (t) => `linear-gradient(135deg, ${t.palette.primary.dark} 0%, ${t.palette.secondary.dark} 100%)`,
                  px: 4,
                  py: 1.5,
                  borderRadius: 50,
                  textTransform: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: (t) => `0 8px 28px ${alpha(t.palette.primary.dark, 0.4)}`,
                  transition: 'all .3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animation: 'fadeInUp .9s ease-out .5s both',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    boxShadow: (t) => `0 12px 36px ${alpha(t.palette.primary.dark, 0.5)}`,
                    transform: 'translateY(-3px) scale(1.02)',
                    '&::before': {
                      left: '100%',
                    }
                  },
                  '&:active': {
                    transform: 'translateY(-1px) scale(0.98)'
                  },
                  '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                  minHeight: 44,
                }}
              >
                Voir mes projets
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="#contact"
                aria-label="Me contacter"
                sx={{
                  borderColor: 'primary.dark',
                  color: 'primary.dark',
                  px: 4,
                  py: 1.5,
                  borderRadius: 50,
                  textTransform: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  borderWidth: 2,
                  transition: 'all .3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animation: 'fadeInUp .9s ease-out .6s both',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 0,
                    height: 0,
                    borderRadius: '50%',
                    background: (t) => alpha(t.palette.primary.main, 0.1),
                    transform: 'translate(-50%, -50%)',
                    transition: 'width 0.6s, height 0.6s',
                  },
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: 'secondary.dark',
                    bgcolor: (t) => alpha(t.palette.primary.dark, 0.08),
                    transform: 'translateY(-3px) scale(1.02)',
                    '&::before': {
                      width: '300px',
                      height: '300px',
                    }
                  },
                  '&:active': {
                    transform: 'translateY(-1px) scale(0.98)'
                  },
                  '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                  minHeight: 44,
                }}
              >
                Me contacter
              </Button>
            </Box>

            <Box
              component="nav"
              sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}
              aria-label="Liens vers mes réseaux professionnels"
            >
              {[
                { href: 'https://github.com/KD-Kongo-Dervilon', icon: <GitHub />, label: 'GitHub', delay: 0.7 },
                { href: 'https://www.linkedin.com/in/kongo-dervilon/', icon: <LinkedIn />, label: 'LinkedIn', delay: 0.75 },
                { href: 'mailto:dervilon.mbissi@gmail.com', icon: <Email />, label: 'Email', delay: 0.8 }
              ].map((social, idx) => (
                <Box
                  key={idx}
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    transformOrigin: 'center center',
                    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)'
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                      '&:hover': { transform: 'none' }
                    }
                  }}
                >
                  <IconButton
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={`Ouvrir mon ${social.label}`}
                    sx={{
                      bgcolor: 'white',
                      color: 'text.primary',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                      border: (t) => `1px solid ${t.palette.divider}`,
                      transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                      animation: `fadeInUp .9s ease-out ${social.delay}s both`,
                      '&:hover': {
                        boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
                        borderColor: 'primary.main'
                      },
                      '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                      width: 52,
                      height: 52,
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <IconButton
                aria-label="Faire défiler vers la section À propos"
                onClick={() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '999px',
                  border: (t) => `2px solid ${t.palette.divider}`,
                  color: 'text.secondary',
                  backgroundColor: 'background.paper',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'floatY 2.4s ease-in-out infinite',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    boxShadow: '0 10px 26px rgba(102,126,234,0.22)',
                    transform: 'translateY(-4px)',
                  },
                  '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 3,
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                    transform: 'none',
                  },
                }}
              >
                <KeyboardArrowDown sx={{ fontSize: 40 }} />
              </IconButton>
            </Box>
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default Hero;