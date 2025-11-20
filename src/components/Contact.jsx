import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
} from '@mui/material';
import { Email, LinkedIn, GitHub } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';

const Contact = () => {
  const theme = useTheme();
  const primaryDark = theme.palette.primary.dark;
  const contrastText = theme.palette.primary.contrastText;
  const divider = theme.palette.divider;

  const contactInfo = [
    { icon: <Email aria-hidden="true" focusable="false" />, title: 'Email', value: 'dervilon.mbissi@gmail.com', link: 'mailto:dervilon.mbissi@gmail.com' },
    { icon: <LinkedIn aria-hidden="true" focusable="false" />, title: 'LinkedIn', value: 'KD Dervilon', link: 'https://www.linkedin.com/in/kongo-dervilon/' },
    { icon: <GitHub aria-hidden="true" focusable="false" />, title: 'GitHub', value: '@kddervilon', link: 'https://github.com/KD-Kongo-Dervilon' }
  ];

  // Animation d’apparition douce (respecte prefers-reduced-motion)
  const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  return (
    <Box
      id="contact"
      component="section"
      role="region"
      aria-labelledby="contact-title"
      sx={{
        py: 10,
        px: 2,
        // Fond qui s'adapte au thème : halo léger + background par défaut
        background: (t) =>
          `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.06)} 0%, ${t.palette.background.default} 45%, ${t.palette.background.default} 100%)`,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            id="contact-title"
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            Discutons de votre projet
          </Typography>
          <Box aria-live="polite">
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
            >
              Vous cherchez un Chef de Projet IA ou un Product Owner passionné ?
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
            >
              Contactez-moi pour échanger sur vos besoins !
            </Typography>
          </Box>
          {/* Petit accent accessible sous le titre */}
          <Box
            aria-hidden="true"
            sx={{
              width: 80,
              height: 4,
              mx: 'auto',
              mt: 2,
              borderRadius: 2,
              bgcolor: primaryDark,
            }}
          />
        </Box>

        <Grid container spacing={2} role="list">
          {contactInfo.map((contact, idx) => (
            <Grid
              item
              xs={12}
              sm={4}
              key={contact.title}
              role="listitem"
              sx={{
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
              <Paper
                component="a"
                href={contact.link}
                target={contact.link.startsWith('http') ? '_blank' : undefined}
                rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={`${contact.title}: ${contact.value}`}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  textDecoration: 'none',
                  display: 'block',
                  border: `1px solid ${divider}`,
                  borderRadius: 3,
                  outline: 'none',
                  transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                  animation: `${fadeInUp} 420ms ease both`,
                  animationDelay: `${idx * 90}ms`,
                  '&:hover': {
                    boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
                    borderColor: primaryDark
                  },
                  '&:focus-visible': {
                    boxShadow: 'var(--focus-ring)',
                    borderColor: primaryDark,
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                    animation: 'none',
                  },
                }}
              >
                <Avatar
                  aria-hidden="true"
                  sx={{
                    mx: 'auto',
                    mb: 2,
                    bgcolor: primaryDark,
                    color: contrastText,
                    width: 56,
                    height: 56,
                  }}
                >
                  {contact.icon}
                </Avatar>
                <Typography
                  variant="subtitle1"
                  component="p"
                  fontWeight={800}
                  gutterBottom
                  color="text.primary"
                >
                  {contact.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;