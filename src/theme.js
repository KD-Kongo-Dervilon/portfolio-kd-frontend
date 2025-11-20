// src/theme.js (exemple)
import { createTheme, alpha } from '@mui/material/styles';

const primaryMain   = '#4f46e5'; // Indigo 600 – très bon contraste sur fond blanc
const primaryDark   = '#3730a3'; // Indigo 800
const primaryLight  = '#818cf8'; // Indigo 300 (utilisé prudemment)

const secondaryMain = '#6d28d9'; // Purple 700
const secondaryDark = '#4c1d95'; // Purple 900
const secondaryLight= '#a78bfa'; // Purple 300

const successMain   = '#2e7d32'; // >= AA sur blanc
const warningMain   = '#b45309';
const errorMain     = '#b91c1c';
const infoMain      = '#0ea5e9';

const textPrimary   = '#111111'; // quasi-noir pour un contraste maximal
const textSecondary = '#444444'; // suffisamment sombre pour AA sur #fff

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
      dark: primaryDark,
      light: primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryMain,
      dark: secondaryDark,
      light: secondaryLight,
      contrastText: '#ffffff',
    },
    success: { main: successMain, contrastText: '#ffffff' },
    warning: { main: warningMain, contrastText: '#ffffff' },
    error:   { main: errorMain,   contrastText: '#ffffff' },
    info:    { main: infoMain,    contrastText: '#ffffff' },

    background: {
      default: '#ffffff',   // blanc pur pour le meilleur contraste
      paper:   '#ffffff',
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: '#6b7280',
    },

    // Aide MUI à choisir automatiquement une couleur de texte lisible
    contrastThreshold: 4.5, // vise AA pour petits textes
    tonalOffset: 0.1,
    divider: '#e5e7eb',
    action: {
      hover: alpha('#000', 0.04),
      selected: alpha('#000', 0.08),
      disabled: alpha('#000', 0.26),
      disabledBackground: alpha('#000', 0.12),
      focus: alpha(primaryMain, 0.25),
    },
    season: 'default',
  },

  typography: {
    fontFamily:
      '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto",system-ui,sans-serif',
    // tailles + line-heights pour lisibilité
    h1: { fontWeight: 800, fontSize: '3rem',  lineHeight: 1.15, letterSpacing: '-0.01em' },
    h2: { fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.25 },
    h4: { fontWeight: 700, fontSize: '1.5rem',   lineHeight: 1.3 },
    h5: { fontWeight: 700, fontSize: '1.25rem',  lineHeight: 1.35 },
    h6: { fontWeight: 700, fontSize: '1rem',     lineHeight: 1.4 },
    body1: { fontSize: '1rem',   lineHeight: 1.7 },
    body2: { fontSize: '0.9375rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: 0 },
    caption: { color: '#374151' },
  },

  shape: { borderRadius: 12 },

  components: {
    // Focus visible global + respect reduced motion
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        ':root': {
          '--focus-ring': `0 0 0 3px ${alpha('#ffffff', 1)}, 0 0 0 6px ${alpha(primaryMain, 0.6)}`,
        },
        'html:focus-within': { scrollBehavior: 'smooth' },
        '@media (prefers-reduced-motion: reduce)': {
          'html:focus-within': { scrollBehavior: 'auto' },
          '*': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
        // Liens visibles et accessibles
        a: {
          color: primaryDark,
          textDecorationColor: alpha(primaryDark, 0.6),
          textUnderlineOffset: '3px',
        },
        'a:hover': { textDecorationColor: primaryDark },
        // Focus anneau visible accessible
        ':focus-visible': {
          outline: 'none',
          boxShadow: 'var(--focus-ring)',
          borderRadius: '6px',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontWeight: 700,
          paddingInline: '18px',
          paddingBlock: '10px',
          minHeight: 44, // cible tactile >= 44px
        },
        containedPrimary: {
          '&:hover': { backgroundColor: primaryDark },
          '&.Mui-disabled': {
            color: alpha('#fff', 0.8),
            backgroundColor: alpha(primaryMain, 0.5),
          },
        },
        outlinedPrimary: {
          borderColor: primaryDark,
          '&:hover': { borderColor: primaryDark, backgroundColor: alpha(primaryMain, 0.06) },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&:focus-visible': { boxShadow: 'var(--focus-ring)' },
          '&.Mui-disabled': { color: '#9ca3af' },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          '&.MuiChip-colorPrimary': { color: '#ffffff' }, // assure contraste texte chip
        },
        outlined: {
          borderColor: '#9ca3af',
          color: textPrimary,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          backgroundImage: 'none',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: textPrimary,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.875rem',
          fontWeight: 600,
          backgroundColor: '#111111',
          color: '#ffffff',
        },
      },
    },

    MuiLink: {
      defaultProps: { underline: 'hover' },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: { color: '#111111' },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#111111' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryMain,
            boxShadow: `0 0 0 3px ${alpha(primaryMain, 0.15)}`,
          },
        },
      },
    },
  },
});

// 🎨 Variantes de thème pilotées par le chatbot (Noël, Nouvel An, Halloween, Rentrée, Pâques, Défaut)
// Les thèmes sombres utilisent un texte très clair pour garder un bon contraste.

const themeNoel = createTheme(theme, {
  palette: {
    mode: 'dark',
    primary: {
      ...theme.palette.primary,
      main: '#b91c1c', // rouge profond
      dark: '#7f1d1d',
    },
    secondary: {
      ...theme.palette.secondary,
      main: '#16a34a', // vert sapin
      dark: '#166534',
    },
    background: {
      ...theme.palette.background,
      default: '#020617', // fond très sombre
      paper: '#020617',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#e5e7eb',
      disabled: alpha('#e5e7eb', 0.5),
    },
    season: 'noel',
  },
});

const themeNouvelAn = createTheme(theme, {
  palette: {
    mode: 'dark',
    primary: {
      ...theme.palette.primary,
      main: '#facc15', // or lumineux
      dark: '#eab308',
    },
    secondary: {
      ...theme.palette.secondary,
      main: '#0ea5e9', // bleu néon
      dark: '#0369a1',
    },
    background: {
      ...theme.palette.background,
      default: '#020617',
      paper: '#020617',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#e5e7eb',
      disabled: alpha('#e5e7eb', 0.5),
    },
    season: 'nouvel-an',
  },
});

const themeHalloween = createTheme(theme, {
  palette: {
    mode: 'dark',
    primary: {
      ...theme.palette.primary,
      main: '#f97316', // orange citrouille
      dark: '#c2410c',
    },
    secondary: {
      ...theme.palette.secondary,
      main: '#4b5563', // gris ardoise
      dark: '#111827',
    },
    background: {
      ...theme.palette.background,
      default: '#020617',
      paper: '#030712',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#e5e7eb',
      disabled: alpha('#e5e7eb', 0.5),
    },
    season: 'halloween',
  },
});

const themeRentree = createTheme(theme, {
  palette: {
    // reste un thème clair
    primary: {
      ...theme.palette.primary,
      main: '#2563eb', // bleu cahier
      dark: '#1d4ed8',
    },
    secondary: {
      ...theme.palette.secondary,
      main: '#22c55e', // vert stabilo
      dark: '#15803d',
    },
    background: {
      ...theme.palette.background,
      default: '#eff6ff',
      paper: '#ffffff',
    },
    text: {
      ...theme.palette.text,
    },
    season: 'rentree',
  },
});

const themePaques = createTheme(theme, {
  palette: {
    // Thème pastel mais avec texte foncé pour la lisibilité
    primary: {
      ...theme.palette.primary,
      main: '#db2777', // rose
      dark: '#be185d',
    },
    secondary: {
      ...theme.palette.secondary,
      main: '#a3e635', // vert pastel
      dark: '#65a30d',
    },
    background: {
      ...theme.palette.background,
      default: '#fdf4ff', // lavande très claire
      paper: '#ffffff',
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: '#6b7280',
    },
    season: 'paques',
  },
});

export const getThemeByKey = (key) => {
  switch (key) {
    case 'noel':
      return themeNoel;
    case 'nouvel-an':
      return themeNouvelAn;
    case 'halloween':
      return themeHalloween;
    case 'rentree':
      return themeRentree;
    case 'paques':
      return themePaques;
    case 'default':
    default:
      return theme;
  }
};

export default theme;