// src/components/RendezVous.jsx
import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { CalendarMonth, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RendezVous = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box
      component="main"
      id="rendez-vous"
      aria-labelledby="rendez-vous-title"
      sx={{
        py: { xs: 8, md: 10 },
        px: 2,
        bgcolor: '#f8fafc',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        {/* Bouton retour */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Retour
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: '1px solid rgba(148, 163, 184, 0.4)',
            background:
              'linear-gradient(135deg, rgba(129,140,248,0.06), rgba(196,181,253,0.06))'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(79,70,229,0.12)'
              }}
            >
              <CalendarMonth sx={{ color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography
                id="rendez-vous-title"
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  mb: 0.5
                }}
              >
                Prendre rendez-vous avec moi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                30 minutes pour parler de votre projet IA, produit ou
                automatisation.
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.7 }}
          >
            Choisissez un créneau directement dans mon agenda en ligne. Nous
            pourrons parler de vos besoins, de votre contexte, et voir comment
            je peux vous aider à transformer vos idées en résultats concrets.
          </Typography>

          {/* Zone d'intégration Calendly */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: '#ffffff',
              border: '1px solid rgba(148, 163, 184, 0.5)',
              minHeight: 480
            }}
          >
            <iframe
              title="Agenda de rendez-vous KD Dervilon"
              src="https://calendly.com/kd-dervilon"
              style={{
                width: '100%',
                height: '100%',
                minHeight: 480,
                border: 'none'
              }}
              loading="lazy"
            />
          </Box>

          {/* Fallback lien direct */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Si le calendrier ne s’affiche pas correctement, vous pouvez aussi
              réserver via ce lien :
            </Typography>
            <Button
              href="https://calendly.com/kd-dervilon"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
            >
              Ouvrir l’agenda Calendly dans un nouvel onglet
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RendezVous;