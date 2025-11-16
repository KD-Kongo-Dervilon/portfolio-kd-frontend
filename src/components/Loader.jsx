import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Psychology } from '@mui/icons-material';

/**
 * Loader — version accessible + fluide
 * - Très bon contraste (fond sombre, texte clair)
 * - Animations fluides (anneau en rotation + halo pulsé)
 * - Respect du prefers-reduced-motion
 */
const Loader = () => {
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        // Fond sombre à haut contraste
        background: 'radial-gradient(1200px 600px at 50% 0%, #1b1b2f 0%, #0f0f1a 60%, #0b0b14 100%)',
        color: '#fff',
        overflow: 'hidden'
      }}
    >
      {/* Glow d'arrière-plan doux */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          filter: 'blur(48px)',
          opacity: 0.35,
          background: 'linear-gradient(135deg, #6ea8fe 0%, #9b6bff 100%)',
          animation: 'floatGlow 6s ease-in-out infinite',
          '@keyframes floatGlow': {
            '0%, 100%': { transform: 'translateY(-8px) scale(1)' },
            '50%': { transform: 'translateY(8px) scale(1.04)' }
          },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' }
        }}
      />

      {/* Conteneur principal icône + anneau */}
      <Box sx={{ position: 'relative', width: 160, height: 160, mb: 4 }}>
        {/* Anneau conique en rotation (haut contraste) */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            padding: 2,
            background: 'conic-gradient(from 0deg, #b8d0ff, #a98bff, #7aa2ff, #b8d0ff)',
            mask: 'radial-gradient(farthest-side, transparent 64%, black 65%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent 64%, black 65%)',
            animation: 'spin 1.2s linear infinite',
            boxShadow: '0 0 24px rgba(123, 97, 255, 0.25)'
          }}
        />

        {/* Halo pulsé (anneau externe) */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: -10,
            borderRadius: '50%',
            border: '2px solid rgba(160, 150, 255, 0.25)',
            animation: 'pulse 1.8s ease-in-out infinite',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' }
          }}
        />

        {/* Avatar icône */}
        <Avatar
          alt="Chargement"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 128,
            height: 128,
            background: 'linear-gradient(135deg, #4e8cff 0%, #7b61ff 100%)',
            boxShadow: '0 10px 30px rgba(50, 50, 93, 0.5), 0 6px 18px rgba(0,0,0,.4)'
          }}
        >
          <Psychology sx={{ fontSize: 64, color: '#fff', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.4))' }} />
        </Avatar>

        {/* Keyframes (déclarées une fois) */}
        <Box sx={{
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          },
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.35, transform: 'scale(1)' },
            '50%': { opacity: 0.7, transform: 'scale(1.06)' }
          }
        }} />
      </Box>

      {/* Texte à contraste élevé */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          letterSpacing: 0.4,
          textAlign: 'center',
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          lineHeight: 1.2
        }}
      >
        Chargement…
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: 1,
          opacity: 0.9,
          textAlign: 'center'
        }}
      >
        KD Dervilon — Portfolio
      </Typography>

      {/* Respect de prefers-reduced-motion : couper la rotation si besoin */}
      <Box sx={{
        '@media (prefers-reduced-motion: reduce)': {
          '& [aria-hidden]': { animation: 'none' }
        }
      }} />
    </Box>
  );
};

export default Loader;