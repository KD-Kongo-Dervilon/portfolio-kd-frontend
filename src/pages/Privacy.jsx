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
} from '@mui/material';

const STORAGE_KEY = 'kd-cookie-consent-v1';

const getInitialConsent = () => {
  if (typeof window === 'undefined') {
    return {
      necessary: true,
      analytics: false,
      marketing: true, // ✅ performance / marketing activé par défaut côté page
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

  return (
    <Box
      component="main"
      role="main"
      sx={{
        py: { xs: 6, md: 8 },
        px: 2,
        bgcolor: '#f9fafb',
        mt: { xs: 'env(safe-area-inset-top)', md: 0 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 2 }}>
          <Link
            href="/"
            underline="none"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            ← Retour au site
          </Link>
        </Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 1,
              letterSpacing: '-0.03em',
            }}
          >
            Politique de confidentialité & cookies
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </Typography>
        </Box>

        {/* Bloc de gestion des préférences */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: '1px solid rgba(148, 163, 184, 0.5)',
            background:
              'linear-gradient(135deg, rgba(129,140,248,0.06), rgba(196,181,253,0.06))',
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 800, mb: 1.5 }}
          >
            Gérer vos préférences cookies
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.7 }}
          >
            Ici, vous pouvez ajuster les cookies optionnels utilisés sur ce site.
            Les cookies techniques indispensables au fonctionnement du site restent
            toujours activés.
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={true}
                  disabled
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Cookies essentiels (obligatoires)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nécessaires pour la sécurité, la gestion de session et le
                    fonctionnement de base du site.
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
              label={
                <Box>
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
              label={
                <Box>
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
        <section aria-labelledby="intro">
          <Typography
            id="intro"
            variant="h5"
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

        <section aria-labelledby="data">
          <Typography
            id="data"
            variant="h5"
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

        <section aria-labelledby="purposes">
          <Typography
            id="purposes"
            variant="h5"
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

        <section aria-labelledby="retention">
          <Typography
            id="retention"
            variant="h5"
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

        <section aria-labelledby="rights">
          <Typography
            id="rights"
            variant="h5"
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

        <section aria-labelledby="manage">
          <Typography
            id="manage"
            variant="h5"
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
            variant="h5"
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
      </Container>
    </Box>
  );
};

export default Privacy;