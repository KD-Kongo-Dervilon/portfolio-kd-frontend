// src/components/Hero.jsx
// Note performance : ce Hero n'utilise aucune image bitmap (<img>),
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
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle at 10px 10px, rgba(255,255,255,0.9) 0, rgba(255,255,255,0.9) 2px, transparent 3px),
            radial-gradient(circle at 50px 30px, rgba(255,255,255,0.8) 0, rgba(255,255,255,0.8) 2px, transparent 3px),
            radial-gradient(circle at 90px 20px, rgba(255,255,255,0.85) 0, rgba(255,255,255,0.85) 2px, transparent 3px),
            radial-gradient(circle at 130px 40px, rgba(255,255,255,0.8) 0, rgba(255,255,255,0.8) 2px, transparent 3px)
          `,
          backgroundSize: '120px 120px',
          opacity: (t) => (t.palette.season === 'noel' ? 0.45 : 0),
          animation: (t) =>
            t.palette.season === 'noel' ? 'snowFall 22s linear infinite' : 'none',
          transition: 'opacity 0.8s ease',
          mixBlendMode: 'screen',
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
        '@keyframes snowFall': {
          '0%': { backgroundPosition: '0 -200px' },
          '100%': { backgroundPosition: '0 600px' },
        },
        '@keyframes fireworkBurst': {
          '0%': {
            transform: 'scale(0.3)',
            opacity: 0,
            boxShadow: '0 0 0 rgba(251,191,36,0)',
          },
          '40%': {
            transform: 'scale(1)',
            opacity: 1,
            boxShadow: '0 0 24px rgba(251,191,36,0.75)',
          },
          '100%': {
            transform: 'scale(1.4)',
            opacity: 0,
            boxShadow: '0 0 40px rgba(251,191,36,0)',
          },
        },
        '@keyframes eggFloat': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-8px)',
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
      {/* Fireworks overlay for New Year theme */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '12%', md: '10%' },
            left: { xs: '14%', md: '18%' },
            width: { xs: 90, md: 120 },
            height: { xs: 90, md: 120 },
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(251,191,36,1) 0%, rgba(251,191,36,0.8) 20%, rgba(251,191,36,0) 60%)',
            opacity: (t) => (t.palette.season === 'nouvel-an' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'nouvel-an'
                ? 'fireworkBurst 2.4s ease-out infinite'
                : 'none',
            animationDelay: '0s',
            mixBlendMode: 'screen',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '18%', md: '16%' },
            right: { xs: '12%', md: '18%' },
            width: { xs: 80, md: 110 },
            height: { xs: 80, md: 110 },
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(96,165,250,1) 0%, rgba(96,165,250,0.85) 20%, rgba(96,165,250,0) 60%)',
            opacity: (t) => (t.palette.season === 'nouvel-an' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'nouvel-an'
                ? 'fireworkBurst 2.4s ease-out infinite'
                : 'none',
            animationDelay: '0.6s',
            mixBlendMode: 'screen',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '8%', md: '12%' },
            left: { xs: '55%', md: '48%' },
            width: { xs: 70, md: 100 },
            height: { xs: 70, md: 100 },
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(244,114,182,1) 0%, rgba(244,114,182,0.85) 20%, rgba(244,114,182,0) 60%)',
            opacity: (t) => (t.palette.season === 'nouvel-an' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'nouvel-an'
                ? 'fireworkBurst 2.4s ease-out infinite'
                : 'none',
            animationDelay: '1.2s',
            mixBlendMode: 'screen',
          }}
        />
      </Box>
      {/* Easter eggs overlay for Pâques theme */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '6%', md: '8%' },
            left: { xs: '15%', md: '18%' },
            width: { xs: 36, md: 46 },
            height: { xs: 52, md: 64 },
            borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%',
            background:
              'linear-gradient(135deg, #f9a8d4 0%, #fb7185 40%, #f97316 100%)',
            boxShadow: '0 10px 24px rgba(248,113,113,0.35)',
            opacity: (t) => (t.palette.season === 'paques' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'paques'
                ? 'eggFloat 4s ease-in-out infinite'
                : 'none',
            animationDelay: '0s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '5%', md: '7%' },
            left: { xs: '45%', md: '48%' },
            width: { xs: 38, md: 50 },
            height: { xs: 54, md: 68 },
            borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%',
            background:
              'linear-gradient(145deg, #a5b4fc 0%, #6366f1 40%, #22c55e 100%)',
            boxShadow: '0 10px 24px rgba(129,140,248,0.35)',
            opacity: (t) => (t.palette.season === 'paques' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'paques'
                ? 'eggFloat 4.4s ease-in-out infinite'
                : 'none',
            animationDelay: '0.4s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '7%', md: '9%' },
            right: { xs: '14%', md: '18%' },
            width: { xs: 34, md: 44 },
            height: { xs: 50, md: 62 },
            borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%',
            background:
              'linear-gradient(150deg, #bef264 0%, #4ade80 35%, #22d3ee 100%)',
            boxShadow: '0 10px 24px rgba(74,222,128,0.35)',
            opacity: (t) => (t.palette.season === 'paques' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'paques'
                ? 'eggFloat 3.8s ease-in-out infinite'
                : 'none',
            animationDelay: '0.8s',
          }}
        />
      </Box>

      {/* Halloween overlay for Halloween theme */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Ghosts floating across the hero */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '18%', md: '20%' },
            left: { xs: '4%', md: '8%' },
            width: { xs: 64, md: 80 },
            height: { xs: 88, md: 104 },
            borderRadius: '40% 40% 55% 55% / 45% 45% 60% 60%',
            backgroundColor: 'rgba(248,250,252,0.96)',
            boxShadow: '0 14px 30px rgba(15,23,42,0.5)',
            opacity: (t) => (t.palette.season === 'halloween' ? 0.92 : 0),
            animation: (t) =>
              t.palette.season === 'halloween'
                ? 'ghostFloat 7s ease-in-out infinite'
                : 'none',
            animationDelay: '0s',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '30%',
              left: '26%',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#0f172a',
              boxShadow: '18px 0 0 #0f172a',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 18,
              borderRadius: '0 0 40% 40%',
              background:
                'radial-gradient(circle at 10% 0, rgba(15,23,42,0.08) 0, transparent 60%), radial-gradient(circle at 50% 0, rgba(15,23,42,0.08) 0, transparent 60%), radial-gradient(circle at 90% 0, rgba(15,23,42,0.08) 0, transparent 60%)',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '22%', md: '24%' },
            right: { xs: '6%', md: '10%' },
            width: { xs: 56, md: 72 },
            height: { xs: 80, md: 96 },
            borderRadius: '40% 40% 55% 55% / 45% 45% 60% 60%',
            backgroundColor: 'rgba(248,250,252,0.94)',
            boxShadow: '0 12px 26px rgba(15,23,42,0.45)',
            opacity: (t) => (t.palette.season === 'halloween' ? 0.9 : 0),
            animation: (t) =>
              t.palette.season === 'halloween'
                ? 'ghostFloat 6.2s ease-in-out infinite'
                : 'none',
            animationDelay: '1s',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '30%',
              left: '28%',
              width: 9,
              height: 9,
              borderRadius: '50%',
              backgroundColor: '#020617',
              boxShadow: '16px 0 0 #020617',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 16,
              borderRadius: '0 0 40% 40%',
              background:
                'radial-gradient(circle at 15% 0, rgba(15,23,42,0.06) 0, transparent 60%), radial-gradient(circle at 55% 0, rgba(15,23,42,0.08) 0, transparent 60%), radial-gradient(circle at 90% 0, rgba(15,23,42,0.06) 0, transparent 60%)',
            },
          }}
        />


        {/* Bats flying across the top */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '10%', md: '12%' },
            left: '-20%',
            width: { xs: 90, md: 130 },
            height: { xs: 40, md: 50 },
            opacity: (t) => (t.palette.season === 'halloween' ? 0.9 : 0),
            background:
              'radial-gradient(circle at 20% 40%, rgba(15,23,42,1) 0%, rgba(15,23,42,1) 40%, transparent 60%)',
            animation: (t) =>
              t.palette.season === 'halloween'
                ? 'batFly 14s linear infinite'
                : 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '16%', md: '18%' },
            left: '-26%',
            width: { xs: 80, md: 120 },
            height: { xs: 36, md: 46 },
            opacity: (t) => (t.palette.season === 'halloween' ? 0.85 : 0),
            background:
              'radial-gradient(circle at 70% 60%, rgba(15,23,42,1) 0%, rgba(15,23,42,1) 40%, transparent 60%)',
            animation: (t) =>
              t.palette.season === 'halloween'
                ? 'batFly 18s linear infinite'
                : 'none',
            animationDelay: '2.3s',
          }}
        />

        {/* Spider webs in top corners */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: { xs: 80, md: 110 },
            height: { xs: 80, md: 110 },
            background:
              'radial-gradient(circle at 0 0, rgba(124,58,237,0.7) 0, transparent 55%)',
            opacity: (t) => (t.palette.season === 'halloween' ? 0.75 : 0),
            borderTop: '1px solid rgba(148,163,184,0.7)',
            borderLeft: '1px solid rgba(148,163,184,0.7)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: { xs: 80, md: 110 },
            height: { xs: 80, md: 110 },
            background:
              'radial-gradient(circle at 100% 0, rgba(124,58,237,0.6) 0, transparent 55%)',
            opacity: (t) => (t.palette.season === 'halloween' ? 0.75 : 0),
            borderTop: '1px solid rgba(148,163,184,0.7)',
            borderRight: '1px solid rgba(148,163,184,0.7)',
          }}
        />
      </Box>

      {/* Back-to-school overlay for Rentrée theme */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Pencils rolling on the floor */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '4%', md: '5%' },
            left: '-20%',
            width: { xs: 160, md: 200 },
            height: { xs: 10, md: 12 },
            borderRadius: 999,
            background: 'linear-gradient(90deg, #facc15 0%, #f97316 40%, #b45309 100%)',
            boxShadow: '0 6px 14px rgba(180,83,9,0.35)',
            opacity: (t) => (t.palette.season === 'rentree' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'rentree'
                ? 'pencilRoll 10s cubic-bezier(0.42,0,0.58,1) infinite'
                : 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              right: { xs: -14, md: -18 },
              top: { xs: -4, md: -5 },
              borderLeft: { xs: '14px solid #eab308', md: '18px solid #eab308' },
              borderTop: { xs: '7px solid transparent', md: '8px solid transparent' },
              borderBottom: { xs: '7px solid transparent', md: '8px solid transparent' },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: { xs: 14, md: 18 },
              height: '100%',
              background: '#fed7aa',
              borderRadius: '999px 0 0 999px',
              opacity: 0.9,
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '6%', md: '7%' },
            left: '-24%',
            width: { xs: 150, md: 190 },
            height: { xs: 9, md: 11 },
            borderRadius: 999,
            background: 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 40%, #0369a1 100%)',
            boxShadow: '0 6px 14px rgba(37,99,235,0.35)',
            opacity: (t) => (t.palette.season === 'rentree' ? 0.95 : 0),
            animation: (t) =>
              t.palette.season === 'rentree'
                ? 'pencilRoll 11s cubic-bezier(0.42,0,0.58,1) infinite'
                : 'none',
            animationDelay: '1.2s',
            '&::before': {
              content: '""',
              position: 'absolute',
              right: { xs: -14, md: -18 },
              top: { xs: -4, md: -5 },
              borderLeft: { xs: '14px solid #0ea5e9', md: '18px solid #0ea5e9' },
              borderTop: { xs: '7px solid transparent', md: '8px solid transparent' },
              borderBottom: { xs: '7px solid transparent', md: '8px solid transparent' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '5%', md: '6%' },
            left: '-18%',
            width: { xs: 140, md: 180 },
            height: { xs: 9, md: 11 },
            borderRadius: 999,
            background: 'linear-gradient(90deg, #f97373 0%, #ef4444 40%, #b91c1c 100%)',
            boxShadow: '0 6px 14px rgba(185,28,28,0.35)',
            opacity: (t) => (t.palette.season === 'rentree' ? 0.9 : 0),
            animation: (t) =>
              t.palette.season === 'rentree'
                ? 'pencilRoll 12s cubic-bezier(0.42,0,0.58,1) infinite'
                : 'none',
            animationDelay: '2s',
            '&::before': {
              content: '""',
              position: 'absolute',
              right: { xs: -14, md: -18 },
              top: { xs: -4, md: -5 },
              borderLeft: { xs: '14px solid #ef4444', md: '18px solid #ef4444' },
              borderTop: { xs: '7px solid transparent', md: '8px solid transparent' },
              borderBottom: { xs: '7px solid transparent', md: '8px solid transparent' },
            },
          }}
        />

        {/* Floating books */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '12%', md: '14%' },
            right: { xs: '10%', md: '14%' },
            width: { xs: 64, md: 82 },
            height: { xs: 44, md: 56 },
            borderRadius: 8,
            background:
              'linear-gradient(145deg, #1d4ed8 0%, #3b82f6 50%, #93c5fd 100%)',
            boxShadow: '0 10px 24px rgba(30,64,175,0.45)',
            opacity: (t) => (t.palette.season === 'rentree' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'rentree'
                ? 'bookFloat 6.5s ease-in-out infinite'
                : 'none',
            transformOrigin: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: 6,
              height: '100%',
              borderRadius: '8px 0 0 8px',
              background: 'rgba(15,23,42,0.25)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 4,
              top: 6,
              width: '55%',
              height: 2,
              borderRadius: 999,
              background: 'rgba(248,250,252,0.8)',
              boxShadow: '0 6px 0 rgba(248,250,252,0.7)',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '20%', md: '22%' },
            right: { xs: '20%', md: '22%' },
            width: { xs: 56, md: 74 },
            height: { xs: 40, md: 50 },
            borderRadius: 8,
            background:
              'linear-gradient(145deg, #fb923c 0%, #f97316 40%, #facc15 100%)',
            boxShadow: '0 10px 24px rgba(180,83,9,0.4)',
            opacity: (t) => (t.palette.season === 'rentree' ? 0.95 : 0),
            animation: (t) =>
              t.palette.season === 'rentree'
                ? 'bookFloat 7.2s ease-in-out infinite'
                : 'none',
            animationDelay: '0.8s',
            transformOrigin: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: 6,
              height: '100%',
              borderRadius: '8px 0 0 8px',
              background: 'rgba(15,23,42,0.25)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 6,
              top: 8,
              width: '55%',
              height: 2,
              borderRadius: 999,
              background: 'rgba(248,250,252,0.85)',
              boxShadow: '0 5px 0 rgba(248,250,252,0.7)',
            },
          }}
        />

        {/* Flying lined papers */}
        <Box
          sx={{
            position: 'absolute',
            top: '-40px',
            left: '12%',
            width: { xs: 34, md: 42 },
            height: { xs: 46, md: 56 },
            borderRadius: 4,
            background:
              'repeating-linear-gradient(180deg, #ffffff 0, #ffffff 10px, #e5e7eb 11px, #e5e7eb 12px)',
            border: '1px solid rgba(148,163,184,0.7)',
            boxShadow: '0 8px 18px rgba(148,163,184,0.4)',
            opacity: (t) => (t.palette.season === 'rentree' ? 1 : 0),
            animation: (t) =>
              t.palette.season === 'rentree'
                ? 'paperFly 12s ease-in-out infinite'
                : 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '-50px',
            left: '60%',
            width: { xs: 30, md: 40 },
            height: { xs: 42, md: 52 },
            borderRadius: 4,
            background:
              'repeating-linear-gradient(180deg, #ffffff 0, #ffffff 10px, #e5e7eb 11px, #e5e7eb 12px)',
            border: '1px solid rgba(148,163,184,0.7)',
            boxShadow: '0 8px 18px rgba(148,163,184,0.4)',
            opacity: (t) => (t.palette.season === 'rentree' ? 0.95 : 0),
            animation: (t) =>
              t.palette.season === 'rentree'
                ? 'paperFly 13.5s ease-in-out infinite'
                : 'none',
            animationDelay: '1.4s',
          }}
        />
      </Box>
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
                    bgcolor: (t) =>
                      t.palette.mode === 'dark'
                        ? alpha(t.palette.background.paper, 0.4)
                        : t.palette.common.white,
                    color: (t) => t.palette.text.primary,
                    fontWeight: 700,
                    border: (t) =>
                      t.palette.mode === 'dark'
                        ? `2px solid ${alpha(t.palette.text.primary, 0.3)}`
                        : `2px solid ${t.palette.divider}`,
                    animation: `fadeInUp .8s ease-out ${chip.delay}s both`,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.25)',
                      borderColor: (t) => t.palette.primary.main,
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
                      bgcolor: (t) =>
                        t.palette.mode === 'dark'
                          ? alpha(t.palette.background.paper, 0.6)
                          : t.palette.common.white,
                      color: (t) => t.palette.text.primary,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                      border: (t) =>
                        t.palette.mode === 'dark'
                          ? `1px solid ${alpha(t.palette.text.primary, 0.3)}`
                          : `1px solid ${t.palette.divider}`,
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