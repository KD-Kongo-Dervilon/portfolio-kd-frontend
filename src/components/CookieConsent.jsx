// src/components/CookieConsent.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Slide,
  useMediaQuery,
  Link as MuiLink,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CookieIcon from '@mui/icons-material/Cookie';

const STORAGE_KEY = 'kd-cookie-consent-v1';
const OPEN_PREFS_EVENT = 'kd-open-cookie-prefs';

const getInitialConsent = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          necessary: true,
          analytics: false,
          marketing: true, // ✅ performance / marketing activé par défaut si on n’a encore rien
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

/**
 * Bouton réutilisable pour ouvrir le panneau de préférences
 * Utilisé notamment par le Footer (CookiePrefsButton)
 */
export const CookiePrefsButton = ({ as = 'button', sx, children, ...props }) => {
  const handleClick = (event) => {
    if (props.onClick) {
      props.onClick(event);
      return;
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(OPEN_PREFS_EVENT));
    }
  };

  // Variante "link" : on garde le style de lien, mais on rend un <button>
  if (as === 'link') {
    return (
      <MuiLink
        component="button"
        type="button"
        onClick={handleClick}
        sx={{
          fontSize: '0.85rem',
          textTransform: 'none',
          p: 0,
          minWidth: 'auto',
          bgcolor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          ...sx,
        }}
        {...props}
      >
        {children || 'Préférences cookies'}
      </MuiLink>
    );
  }

  // Variante bouton classique
  return (
    <Button
      {...props}
      type="button"
      onClick={handleClick}
      sx={{
        fontSize: '0.85rem',
        textTransform: 'none',
        p: 0,
        minWidth: 'auto',
        ...sx,
      }}
    >
      {children || 'Préférences cookies'}
    </Button>
  );
};

const CookieConsent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [consent, setConsent] = useState(() => getInitialConsent());
  const [open, setOpen] = useState(false);

  // Afficher la bannière seulement si pas encore de consentement explicite
  useEffect(() => {
    if (consent === null) {
      setOpen(true);
    }
  }, [consent]);

  // Réouvrir la bannière quand on clique sur "Préférences cookies" dans le footer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOpenPrefs = () => {
      setOpen(true);
    };

    window.addEventListener(OPEN_PREFS_EVENT, handleOpenPrefs);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, handleOpenPrefs);
  }, []);

  const handleAcceptAll = useCallback(() => {
    const value = {
      necessary: true,
      analytics: true,
      marketing: true, // ✅ tout accepter = analytics + performance/marketing activés
      date: new Date().toISOString(),
    };
    setConsent(value);
    saveConsent(value);
    setOpen(false);
  }, []);

  const handleRefuseAll = useCallback(() => {
    const value = {
      necessary: true,
      analytics: false,
      marketing: false,
      date: new Date().toISOString(),
    };
    setConsent(value);
    saveConsent(value);
    setOpen(false);
  }, []);

  const handleManagePrefs = useCallback(() => {
    window.location.assign('/privacy');
  }, []);

  return (
    <Slide
      in={open}
      direction="up"
      timeout={reduceMotion ? 0 : 250}
      mountOnEnter
      unmountOnExit
    >
      <Box
        component="section"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (t) => t.zIndex.snackbar + 1,
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: 960,
            mx: 'auto',
            p: { xs: 2, sm: 2.5 },
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(15,23,42,0.35)',
            bgcolor: '#0b1120',
            color: '#e5e7eb',
            border: '1px solid rgba(148,163,184,0.4)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          {/* Texte */}
          <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
            <Box
              sx={{
                mt: 0.5,
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: 'rgba(59,130,246,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <CookieIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                id="cookie-banner-title"
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: 0.5 }}
              >
                Gestion des cookies
              </Typography>
              <Typography
                id="cookie-banner-description"
                variant="body2"
                sx={{ lineHeight: 1.6, color: '#e5e7eb' }}
              >
                J’utilise des cookies techniques pour faire fonctionner ce site
                et des mesures d’audience anonymisées pour l’améliorer.
                Vous pouvez accepter tous les cookies, refuser les cookies
                de mesure ou gérer vos préférences plus en détail.
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 0.5, color: '#9ca3af' }}
              >
                Vous pouvez modifier votre choix à tout moment depuis le
                lien « Préférences cookies » en bas de page.
              </Typography>
            </Box>
          </Box>

          {/* Boutons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'flex-end',
              gap: 1,
              flexShrink: 0,
              minWidth: { sm: 260 },
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={handleRefuseAll}
              sx={{
                borderColor: 'rgba(148,163,184,0.7)',
                color: '#e5e7eb',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.7,
                '&:hover': {
                  borderColor: '#e5e7eb',
                  backgroundColor: 'rgba(148,163,184,0.08)',
                },
              }}
            >
              Tout refuser
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleManagePrefs}
              sx={{
                borderColor: 'rgba(129,140,248,0.9)',
                color: '#c7d2fe',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.7,
                '&:hover': {
                  borderColor: '#e5e7eb',
                  backgroundColor: 'rgba(129,140,248,0.18)',
                },
              }}
            >
              Gérer les préférences
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleAcceptAll}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                px: 2.5,
                py: 0.8,
                bgcolor: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                backgroundImage:
                  'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 8px 20px rgba(79,70,229,0.6)',
                '&:hover': {
                  backgroundImage:
                    'linear-gradient(135deg, #4338ca, #6d28d9)',
                  boxShadow: '0 10px 30px rgba(79,70,229,0.8)',
                },
              }}
            >
              Tout accepter
            </Button>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

export default CookieConsent;