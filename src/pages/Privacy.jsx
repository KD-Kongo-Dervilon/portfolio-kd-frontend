// src/pages/Privacy.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Link,
  Divider,
  Paper,
  Switch,
  FormControlLabel,
  Stack,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';

const STORAGE_KEY = 'kd-cookie-consent-v1';

const getInitialConsent = () => {
  if (typeof window === 'undefined') {
    return {
      necessary: true,
      analytics: false,
      marketing: true,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          necessary: true,
          analytics: false,
          marketing: true,
        };
  } catch {
    return {
      necessary: true,
      analytics: false,
      marketing: true,
    };
  }
};

const saveConsent = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
};

const Privacy = () => {
  const [consent, setConsent] = useState(() => getInitialConsent());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggle = (key) => (event) => {
    const checked = event.target.checked;
    setConsent((prev) => ({
      ...prev,
      [key]: checked,
      necessary: true,
    }));
    setSaved(false);
  };

  const handleSave = useCallback(() => {
    const value = {
      ...consent,
      necessary: true,
      date: new Date().toISOString(),
    };
    saveConsent(value);
    setSaved(true);
  }, [consent]);

  const lastUpdate = new Date().toLocaleDateString('fr-FR');

  return (
    <Box
      component="main"
      role="main"
      sx={(theme) => ({
        py: { xs: 8, md: 10 },
        px: 2,
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        mt: { xs: 'calc(env(safe-area-inset-top) + 72px)', md: 0 },
      })}
    >
      <Container
        maxWidth="md"
        sx={(theme) => ({
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 10px 40px rgba(15,23,42,0.30)',
          p: 0,
          background: 'transparent',
          transition:
            'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, border-color 0.35s ease',
          transformOrigin: 'center center',
          '&:hover': {
            transform: 'translateY(-10px) scale(1.01)',
            boxShadow: '0 20px 60px rgba(15,23,42,0.55)',
            borderColor: theme.palette.primary.main,
          },
        })}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: 'background.paper',
          }}
        >
          {/* Back link */}
          <Box sx={{ mb: 2 }}>
            <Link
              href="/"
              underline="none"
              sx={(theme) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: theme.palette.primary.main,
                '&:hover': {
                  textDecoration: 'underline',
                },
              })}
            >
              ← Retour au portfolio
            </Link>
          </Box>

          {/* Header */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 4 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={(theme) => ({
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(148,163,184,0.15)'
                    : 'rgba(129,140,248,0.12)',
                })}
              >
                <SecurityOutlinedIcon
                  sx={(theme) => ({
                    fontSize: 32,
                    color: theme.palette.primary.main,
                  })}
                />
              </Box>
              <Box>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    mb: 0.5,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Politique de confidentialité & cookies
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Chip
                    size="small"
                    icon={<CookieOutlinedIcon fontSize="small" />}
                    label="Respect de votre vie privée"
                    sx={{
                      fontWeight: 600,
                      bgcolor: 'rgba(129,140,248,0.10)',
                    }}
                  />
                  <span>Dernière mise à jour : {lastUpdate}</span>
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Bloc de gestion des préférences */}
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: '1px solid rgba(148, 163, 184, 0.45)',
              background:
                'linear-gradient(135deg, rgba(148,163,184,0.16), rgba(129,140,248,0.16))',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 800, mb: 1 }}
                >
                  Gérer vos préférences cookies
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Choisissez les types de cookies que vous acceptez. Les cookies
                  techniques indispensables au fonctionnement du site restent
                  toujours activés.
                </Typography>
              </Box>
              <Chip
                size="small"
                label={
                  consent.analytics || consent.marketing
                    ? 'Préférences personnalisées enregistrées'
                    : 'Configuration minimale active'
                }
                sx={{
                  alignSelf: { xs: 'flex-start', md: 'flex-end' },
                  fontWeight: 600,
                  bgcolor: 'rgba(15,118,110,0.08)',
                  color: '#0f766e',
                }}
              />
            </Stack>

            <Stack spacing={2.5}>
              <FormControlLabel
                control={
                  <Switch
                    checked
                    disabled
                    color="primary"
                  />
                }
                sx={{
                  alignItems: 'flex-start',
                  m: 0,
                }}
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Cookies essentiels (obligatoires)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nécessaires pour la sécurité, la gestion de session et le
                      fonctionnement de base du site. Ils ne peuvent pas être
                      désactivés.
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={!!consent?.analytics}
                    onChange={handleToggle('analytics')}
                    color="primary"
                  />
                }
                sx={{
                  alignItems: 'flex-start',
                  m: 0,
                }}
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Cookies d’analyse de fréquentation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Utilisés pour comprendre de manière anonymisée comment le site
                      est consulté (pages vues, temps passé, type d’appareil…).
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={!!consent?.marketing}
                    onChange={handleToggle('marketing')}
                    color="primary"
                  />
                }
                sx={{
                  alignItems: 'flex-start',
                  m: 0,
                }}
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Cookies de performance / marketing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Servent à personnaliser certains contenus, suivre l’efficacité
                      d’une campagne ou d’un lien partagé (par exemple depuis LinkedIn),
                      et alimentent uniquement le tableau de bord Analytics de ce
                      portfolio.
                    </Typography>
                  </Box>
                }
              />
            </Stack>

            <Box
              sx={{
                mt: 3,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  borderRadius: 999,
                }}
              >
                Enregistrer mes préférences
              </Button>
              {saved && (
                <Alert
                  severity="success"
                  variant="outlined"
                  sx={{ py: 0.5, px: 1.5, fontSize: '0.85rem' }}
                >
                  Vos préférences cookies ont été mises à jour.
                </Alert>
              )}
            </Box>
          </Paper>

          <Divider sx={{ mb: 4 }} />

          {/* Sections légales */}
          <section aria-labelledby="intro" style={{ marginBottom: 24 }}>
            <Typography
              id="intro"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 800, mb: 1.5 }}
            >
              1. Introduction
            </Typography>
            <Typography paragraph color="text.secondary">
              Cette page explique quelles données sont traitées sur ce site, à
              quelles fins, et quels sont vos droits. L’objectif est de rester
              transparent, sans jargon inutile.
            </Typography>
          </section>

          <section aria-labelledby="data" style={{ marginBottom: 24 }}>
            <Typography
              id="data"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 800, mb: 1.5 }}
            >
              2. Données traitées
            </Typography>
            <Typography paragraph color="text.secondary">
              • <strong>Cookies essentiels</strong> (fonctionnement du site, sécurité) — toujours actifs.
            </Typography>
            <Typography paragraph color="text.secondary">
              • <strong>Cookies d’analyse</strong> (mesure d’audience anonymisée) — activés uniquement avec votre accord.
            </Typography>
            <Typography paragraph color="text.secondary">
              • <strong>Cookies de performance / marketing</strong> — utilisés pour
              suivre l’efficacité d’un lien ou d’une campagne (par exemple un lien
              partagé depuis LinkedIn) et améliorer l’expérience sur ce portfolio.
            </Typography>
          </section>

          <section aria-labelledby="purposes" style={{ marginBottom: 24 }}>
            <Typography
              id="purposes"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 800, mb: 1.5 }}
            >
              3. Finalités et base légale
            </Typography>
            <Typography paragraph color="text.secondary">
              Les cookies nécessaires reposent sur l’intérêt légitime (faire fonctionner
              le site correctement). Les cookies optionnels reposent sur votre consentement,
              que vous pouvez modifier à tout moment depuis cette page.
            </Typography>
          </section>

          <section aria-labelledby="retention" style={{ marginBottom: 24 }}>
            <Typography
              id="retention"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 800, mb: 1.5 }}
            >
              4. Durées de conservation
            </Typography>
            <Typography paragraph color="text.secondary">
              Vos préférences cookies sont conservées jusqu’à 12 mois, puis une nouvelle
              demande de consentement pourra vous être proposée.
            </Typography>
          </section>

          <section aria-labelledby="rights" style={{ marginBottom: 24 }}>
            <Typography
              id="rights"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 800, mb: 1.5 }}
            >
              5. Vos droits
            </Typography>
            <Typography paragraph color="text.secondary">
              Vous pouvez demander l’accès, la rectification ou la suppression des données
              personnelles vous concernant, ainsi que retirer votre consentement pour les
              cookies optionnels.
            </Typography>
          </section>

          <section aria-labelledby="manage" style={{ marginBottom: 24 }}>
            <Typography
              id="manage"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 800, mb: 1.5 }}
            >
              6. Comment modifier vos choix
            </Typography>
            <Typography paragraph color="text.secondary">
              Vous pouvez à tout moment revenir sur cette page ou utiliser le lien
              « Préférences cookies » en bas de chaque page pour ajuster vos choix.
            </Typography>
          </section>

          <section aria-labelledby="contact">
            <Typography
              id="contact"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 800, mb: 1.5 }}
            >
              7. Contact
            </Typography>
            <Typography paragraph color="text.secondary">
              Pour toute question sur la confidentialité ou les cookies, vous pouvez écrire à :{' '}
              <Link href="mailto:dervilon.mbissi@gmail.com">
                dervilon.mbissi@gmail.com
              </Link>
            </Typography>
          </section>
        </Paper>
      </Container>
    </Box>
  );
};

export default Privacy;