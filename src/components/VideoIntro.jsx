// src/components/VideoIntro.jsx
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

const VideoIntro = () => {
  const [canRenderVideo, setCanRenderVideo] = useState(false);

  // ⏱️ On attend la fin du premier "paint" pour monter la vidéo
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutId = window.setTimeout(() => {
      setCanRenderVideo(true);
    }, 800); // assez tard pour ne pas impacter le LCP

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Box
      component="section"
      aria-labelledby="video-intro-title"
      sx={{ py: 10, px: 2 }}
    >
      <Typography
        id="video-intro-title"
        component="h2"
        variant="h4"
        textAlign="center"
        fontWeight={800}
        mb={4}
      >
        🎥 Découvrez mon profil en 22 secondes
      </Typography>

      <Paper
        sx={{
          maxWidth: 800,
          mx: 'auto',
          p: 2.5,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // ratio 16:9
            bgcolor: 'black',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* On garde un bloc noir fixe pour ne pas créer de CLS */}
          {canRenderVideo && (
            <video
              controls
              preload="none"
              poster="/images/video-thumbnail.jpg"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
              aria-label="Vidéo de présentation de KD Dervilon, Chef de Projet IA et Product Owner"
            >
              {/* Version MP4 (fallback universel) */}
              <source src="/video/kd-intro.mp4" type="video/mp4" />

              {/* Version WebM (meilleure compression si supportée) */}
              <source src="/video/kd-intro.webm" type="video/webm" />

              {/* Sous-titres disponibles mais désactivés par défaut */}
              <track
                kind="captions"
                src="/video/kd-intro-captions.vtt"
                srcLang="fr"
                label="Français"
              />

              {/* Fallback navigateurs très anciens */}
              Votre navigateur ne supporte pas la lecture vidéo. Voici une version lisible :
              <a href="/video/kd-intro.mp4">Télécharger la vidéo</a>.
            </video>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default VideoIntro;