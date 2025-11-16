import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('#accueil');
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = useMemo(
    () => [
      { label: 'Accueil', hash: '#accueil', type: 'hash' },
      { label: 'À propos', hash: '#about', type: 'hash' },
      { label: 'Compétences', hash: '#skills', type: 'hash' },
      { label: 'Portfolio', hash: '#portfolio', type: 'hash' },

      // 🆕 Service automatisation IA & n8n
      {
        label: 'Automatisation IA & n8n',
        path: '/services/automatisation-ia-n8n',
        type: 'route'
      },

      { label: 'Blog', path: '/blog', type: 'route' },
      { label: 'Contact', hash: '#contact', type: 'hash' },
      { label: 'Admin', path: '/admin', type: 'route' }
    ],
    []
  );

  // Détection du scroll pour effet glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mise à jour activeItem selon location
  useEffect(() => {
    if (location.pathname === '/blog' || location.pathname.startsWith('/blog/')) {
      setActiveItem('/blog');
    } else if (location.pathname.startsWith('/services/automatisation-ia-n8n')) {
      setActiveItem('/services/automatisation-ia-n8n');
    } else if (location.pathname === '/admin') {
      setActiveItem('/admin');
    } else if (location.hash) {
      setActiveItem(location.hash);
    } else {
      setActiveItem('#accueil');
    }
  }, [location]);

  const scrollToHash = useCallback((hash) => {
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    el.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start'
    });
  }, []);

  const handleNavClick = useCallback(
    (e, item) => {
      // Pour les liens de route, on laisse le <Link> ou l'ancre gérer la navigation native
      if (item.type === 'route') {
        setMobileMenuOpen(false);
        setActiveItem(item.path);
        return;
      }

      // Liens de section (hash) : on intercepte pour faire un scroll fluide
      e.preventDefault();
      setMobileMenuOpen(false);

      // Scroll vers un hash
      // Si on n'est pas sur la home, y retourner d'abord
      if (location.pathname !== '/') {
        navigate('/');
        // Attendre que le DOM soit prêt
        setTimeout(() => {
          scrollToHash(item.hash);
          setActiveItem(item.hash);
        }, 100);
      } else {
        scrollToHash(item.hash);
        setActiveItem(item.hash);
      }

      if (
        typeof window !== 'undefined' &&
        window.history &&
        typeof window.history.replaceState === 'function'
      ) {
        window.history.replaceState(null, '', item.hash);
      }
    },
    [navigate, location.pathname, scrollToHash]
  );

  // Observer pour les sections (seulement sur la page home)
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sectionIds = navigationItems
      .filter((i) => i.type === 'hash')
      .map((i) => i.hash.replace('#', ''));

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const newHash = `#${visible[0].target.id}`;
          setActiveItem((prev) => (prev !== newHash ? newHash : prev));
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [navigationItems, location.pathname]);

  const isActive = (item) => {
    if (item.type === 'route') {
      return activeItem === item.path;
    }
    return activeItem === item.hash;
  };

  return (
    <>
      {/* Lien d'évitement pour passer directement au contenu principal */}
      <a
        href="#accueil"
        style={{
          position: 'absolute',
          left: -9999,
          top: 'auto',
          width: 1,
          height: 1,
          overflow: 'hidden',
          outline: '3px solid #0b57d0',
          outlineOffset: 2
        }}
      >
        Aller au contenu
      </a>

      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled
            ? (t) => alpha(t.palette.background.paper, 0.85)
            : (t) => t.palette.background.paper,
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px)',
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,0,0,0.15)'
            : '0 1px 10px rgba(0,0,0,0.12)',
          color: (t) => t.palette.text.primary,
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: scrolled ? '1px solid' : 'none',
          borderColor: (t) => alpha(t.palette.primary.main, 0.1),
          '@keyframes barSlide': {
            '0%': { backgroundPosition: '0% 50%' },
            '100%': { backgroundPosition: '200% 50%' }
          }
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Typography
            variant="h6"
            component="a"
            href="/#accueil"
            onClick={(e) =>
              handleNavClick(e, { hash: '#accueil', type: 'hash' })
            }
            sx={{
              flexGrow: 1,
              color: '#111111',
              fontWeight: 900,
              letterSpacing: 0.5,
              position: 'relative',
              textDecoration: 'none',
              transition: 'color 0.3s',
              '&:hover': {
                color: 'primary.main'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -8,
                width: 48,
                height: 5,
                borderRadius: 3,
                background: (t) =>
                  `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.secondary.dark})`,
                boxShadow: (t) =>
                  `0 2px 8px ${alpha(t.palette.primary.main, 0.4)}`
              }
            }}
          >
            KD Dervilon
          </Typography>

          {/* Navigation desktop */}
          {!isMobile && (
            <Box
              component="nav"
              sx={{ display: 'flex', gap: 1.5 }}
              aria-label="Navigation principale"
            >
              {navigationItems.map((item) => {
                const active = isActive(item);
                const href = item.type === 'route' ? item.path : item.hash;

                const commonSx = {
                  fontWeight: 700,
                  textTransform: 'none',
                  position: 'relative',
                  px: 2,
                  py: 1,
                  color: (t) => t.palette.text.primary,
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: (t) => t.palette.primary.main,
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.06)
                  },
                  '&:focus-visible': {
                    outline: (t) => `3px solid ${t.palette.primary.main}`,
                    outlineOffset: 2,
                    borderRadius: 2
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 8,
                    right: 8,
                    bottom: -2,
                    height: 5,
                    borderRadius: 3,
                    transform: active ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'center',
                    transition:
                      'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                    background: (t) =>
                      `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.secondary.dark}, ${t.palette.primary.main})`,
                    backgroundSize: '200% 100%',
                    animation: active
                      ? 'barSlide 2.5s linear infinite'
                      : 'none',
                    boxShadow: (t) =>
                      `0 3px 12px ${alpha(t.palette.primary.main, 0.5)}`
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                    animation: 'barSlide 2.5s linear infinite'
                  }
                };

                // Liens de route : on utilise Link pour une navigation SPA,
                // tout en gardant un vrai <a href="..."> pour le SEO.
                if (item.type === 'route') {
                  return (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.path}
                      aria-current={active ? 'page' : undefined}
                      sx={commonSx}
                    >
                      {item.label}
                    </Button>
                  );
                }

                // Liens de section (hash) : ancre + scroll fluide
                return (
                  <Button
                    key={item.label}
                    href={href}
                    onClick={(e) => handleNavClick(e, item)}
                    aria-current={active ? 'page' : undefined}
                    sx={commonSx}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Bouton menu mobile */}
          {isMobile && (
            <IconButton
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-drawer"
              aria-pressed={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
              edge="end"
              sx={{
                width: 44,
                height: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:focus-visible': {
                  outline: '3px solid #0b57d0',
                  outlineOffset: 2,
                  borderRadius: 2
                }
              }}
              title={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <Box
                component="span"
                sx={{
                  position: 'relative',
                  width: 24,
                  height: 18,
                  display: 'inline-block',
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none'
                  },
                  '& .bar': {
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    height: 2.5,
                    borderRadius: 2,
                    backgroundColor: 'currentColor',
                    transition:
                      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease, top 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                  },
                  '& .bar:nth-of-type(1)': {
                    top: 0,
                    transform: mobileMenuOpen
                      ? 'translateY(8px) rotate(45deg)'
                      : 'none'
                  },
                  '& .bar:nth-of-type(2)': {
                    top: 7.5,
                    opacity: mobileMenuOpen ? 0 : 1,
                    transform: mobileMenuOpen
                      ? 'translateX(-12px)'
                      : 'none'
                  },
                  '& .bar:nth-of-type(3)': {
                    top: 15,
                    transform: mobileMenuOpen
                      ? 'translateY(-7px) rotate(-45deg)'
                      : 'none'
                  }
                }}
              >
                <Box className="bar" />
                <Box className="bar" />
                <Box className="bar" />
              </Box>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer mobile */}
      <SwipeableDrawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpen={() => setMobileMenuOpen(true)}
        disableDiscovery={false}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          id: 'mobile-menu-drawer',
          sx: {
            backgroundColor: '#0b0b0d',
            color: '#ffffff',
            width: 280,
            backgroundImage:
              'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)',
            '--drawer-accent': (t) => t.palette.primary.main,
            '--drawer-accent-dark': (t) => t.palette.secondary.dark,
            '@keyframes drawerIn': {
              '0%': { opacity: 0, transform: 'translateX(-12px)' },
              '100%': { opacity: 1, transform: 'translateX(0)' }
            },
            animation: 'drawerIn 250ms ease-out both',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' }
          }
        }}
      >
        <Box
          component="nav"
          sx={{
            width: 280,
            pt: 1,
            '@keyframes menuItemIn': {
              '0%': { opacity: 0, transform: 'translateX(-12px)' },
              '100%': { opacity: 1, transform: 'translateX(0)' }
            }
          }}
          aria-label="Menu principal mobile"
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1 }}
          >
            <Typography
              sx={{ flexGrow: 1, fontWeight: 800, fontSize: '1.1rem' }}
            >
              Menu
            </Typography>
            <IconButton
              aria-label="Fermer le menu"
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                color: 'white',
                '&:focus-visible': {
                  outline: '3px solid #8ab4ff',
                  outlineOffset: 2,
                  borderRadius: 2
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <List sx={{ py: 0 }}>
            {navigationItems.map((item, idx) => {
              const active = isActive(item);
              const href = item.type === 'route' ? item.path : item.hash;

              const commonSx = {
                position: 'relative',
                py: 1.6,
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.14)'
                },
                '&.Mui-selected': {
                  backgroundColor: (t) =>
                    alpha(t.palette.primary.main, 0.35),
                  '&:hover': {
                    backgroundColor: (t) =>
                      alpha(t.palette.primary.main, 0.4)
                  }
                },
                '&:focus-visible': {
                  outline: (t) =>
                    `3px solid ${alpha(
                      t.palette.info.light || '#8ab4ff',
                      0.9
                    )}`,
                  outlineOffset: 2,
                  borderRadius: 2
                },
                animation: 'menuItemIn 280ms ease both',
                animationDelay: `${idx * 70}ms`,
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                  animationDelay: '0ms'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 8,
                  bottom: 8,
                  width: 5,
                  borderRadius: 3,
                  transform: active ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'top',
                  transition:
                    'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  background:
                    'linear-gradient(180deg, var(--drawer-accent), var(--drawer-accent-dark), var(--drawer-accent))',
                  backgroundSize: '100% 200%',
                  animation: active
                    ? 'barSlide 2.5s linear infinite'
                    : 'none',
                  boxShadow: active ? '0 0 12px var(--drawer-accent)' : 'none'
                }
              };

              if (item.type === 'route') {
                return (
                  <ListItemButton
                    key={item.label}
                    component={Link}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    selected={active}
                    aria-current={active ? 'page' : undefined}
                    sx={commonSx}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: active ? 800 : 600,
                        color: '#ffffff'
                      }}
                    />
                  </ListItemButton>
                );
              }

              return (
                <ListItemButton
                  key={item.label}
                  component="a"
                  href={href}
                  onClick={(e) => handleNavClick(e, item)}
                  selected={active}
                  aria-current={active ? 'page' : undefined}
                  sx={commonSx}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 800 : 600,
                      color: '#ffffff'
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default Navigation;