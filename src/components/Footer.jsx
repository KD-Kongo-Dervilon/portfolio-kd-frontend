import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Link as MuiLink, Divider } from '@mui/material';
import { GitHub, LinkedIn, Twitter, Email, ArrowUpward } from '@mui/icons-material';
import { CookiePrefsButton } from './CookieConsent';
import { alpha } from '@mui/material/styles';

/**
 * Footer moderne et accessible aligné sur le style du portfolio KD
 * - Gradients purple/indigo cohérents avec le reste du site
 * - Design épuré et professionnel
 * - Accessibilité renforcée
 * - Navigation simplifiée
 */

const currentYear = new Date().getFullYear();

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navLinks = [
    { label: 'Accueil', href: '/#accueil' },
    { label: 'À propos', href: '/#about' },
    { label: 'Compétences', href: '/#skills' },
    { label: 'Projets', href: '/#portfolio' },
    { label: 'Contact', href: '/#contact' },
  ];

  const socialLinks = [
    { 
      label: 'GitHub', 
      href: 'https://github.com/KD-Kongo-Dervilon', 
      icon: <GitHub />,
    },
    { 
      label: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/kongo-dervilon', 
      icon: <LinkedIn />,
    },
    { 
      label: 'Twitter/X', 
      href: 'https://twitter.com/votre-username', 
      icon: <Twitter />,
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        mt: 'auto',
        // Fond qui s'adapte au thème (clair / sombre)
        background: (t) =>
          `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.03)} 0%, ${t.palette.background.default} 40%, ${t.palette.background.paper} 100%)`,
        borderTop: (t) => `1px solid ${alpha(t.palette.divider, 0.9)}`,
        overflow: 'hidden',
      }}
    >
      {/* Ligne décorative gradient animée */}
      <Box
        sx={{
          height: 3,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 8s ease infinite',
          '@keyframes gradient-shift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }}
        aria-hidden="true"
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Colonne 1 : Branding */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                KD Dervilon
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  maxWidth: '32ch',
                  lineHeight: 1.6,
                  fontSize: '0.95rem',
                }}
              >
                Chef de Projet IA &amp; Product Owner. Conception de solutions IA innovantes et pilotage de produits digitaux.
              </Typography>
            </Box>

            {/* Réseaux sociaux */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ouvrir mon profil ${social.label}`}
                  sx={{
                    color: 'text.secondary',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      transform: 'translateY(-2px)',
                      color: 'primary.main',
                    },
                    '&:focus-visible': {
                      outline: '3px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Colonne 2 : Navigation */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle2"
              component="p"
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'text.secondary',
                mb: 2,
                fontSize: '0.8rem',
              }}
            >
              Navigation
            </Typography>
            <Box
              component="nav"
              aria-label="Navigation du pied de page"
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
            >
              {navLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: 'text.primary',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 'fit-content',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      width: 0,
                      height: 2,
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(4px)',
                      '&::after': {
                        width: '100%',
                      },
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 4,
                      borderRadius: 1,
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Colonne 3 : CTA Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle2"
              component="p"
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'text.secondary',
                mb: 2,
                fontSize: '0.8rem',
              }}
            >
              Travaillons ensemble
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, lineHeight: 1.6, maxWidth: '30ch' }}
            >
              Un projet IA ou produit digital à lancer ? Discutons-en.
            </Typography>
            <MuiLink
              href="/#contact"
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                },
                '&:focus-visible': {
                  outline: '3px solid',
                  outlineColor: 'primary.dark',
                  outlineOffset: 2,
                },
              }}
            >
              <Email fontSize="small" />
              Me contacter
            </MuiLink>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

        {/* Bas du footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.85rem' }}
          >
            © {currentYear} KD Dervilon. Tous droits réservés.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <CookiePrefsButton
              as="link"
              sx={{
                fontSize: '0.85rem',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Préférences cookies
            </CookiePrefsButton>

            <IconButton
              onClick={scrollToTop}
              aria-label="Retour en haut de page"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  transform: 'translateY(-2px)',
                  color: 'primary.main',
                },
                '&:focus-visible': {
                  outline: '3px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              <ArrowUpward />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;