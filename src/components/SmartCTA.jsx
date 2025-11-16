// src/components/SmartCTA.jsx
import React, { useState, useEffect } from 'react';
import { 
  Fab, 
  Zoom, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  Grow,
  useMediaQuery
} from '@mui/material';
import { 
  Add, 
  Email, 
  Download, 
  LinkedIn,
  Close,
  EventAvailable
} from '@mui/icons-material';

import { alpha } from '@mui/material/styles';

const SmartCTA = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCTA, setShowCTA] = useState(false);

  const visuallyHidden = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  };

  const menuId = 'smartcta-menu';

  useEffect(() => {
    const timer = setTimeout(() => setShowCTA(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowCTA(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const actions = [
    {
      icon: <EventAvailable aria-hidden="true" focusable="false" />,
      label: 'Prendre rendez-vous',
      action: () => {
        // Ouvre directement ton lien Zoom Calendly dans un nouvel onglet
        window.open(
          'https://calendly.com/dervilon-mbissi/30min',
          '_blank',
          'noopener,noreferrer'
        );
      }
    },
    {
      icon: <Email aria-hidden="true" focusable="false" />,
      label: 'Envoyer un email',
      action: () =>
        (window.location.href =
          'mailto:dervilon.mbissi@gmail.com?subject=Intéressé par votre profil')
    },
    {
      icon: <Download aria-hidden="true" focusable="false" />,
      label: 'Télécharger CV',
      action: () =>
        window.open(
          '/CV-product_owner-Mbissi-dervilon.pdf',
          '_blank',
          'noopener,noreferrer'
        )
    },
    {
      icon: <LinkedIn aria-hidden="true" focusable="false" />,
      label: 'Voir LinkedIn',
      action: () =>
        window.open(
          'https://linkedin.com/in/dervilon',
          '_blank',
          'noopener,noreferrer'
        )
    }
  ];

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const highContrast = useMediaQuery('(forced-colors: active)');

  const [announced, setAnnounced] = useState(false);
  useEffect(() => {
    if (showCTA && !announced) {
      setAnnounced(true);
    }
  }, [showCTA, announced]);

  return (
    <>
      <div aria-live="polite" aria-atomic="true" style={visuallyHidden}>
        {announced
          ? 'Actions rapides disponibles : prendre rendez-vous, email, CV, LinkedIn.'
          : ''}
      </div>

      {showCTA &&
        (reduceMotion ? (
          <Tooltip
            title="Actions rapides : prendre rendez-vous, email, CV, LinkedIn"
            arrow
            placement="right"
            disableInteractive
          >
            <Fab
              id="smartcta-fab"
              aria-label="Actions rapides : prendre rendez-vous, contacter par email, télécharger mon CV ou consulter mon LinkedIn"
              aria-haspopup="menu"
              aria-controls={open ? menuId : undefined}
              aria-expanded={open ? 'true' : undefined}
              color="primary"
              sx={{
                position: 'fixed',
                bottom: { xs: 100, sm: 24 },
                left: 24,
                color: '#ffffff',
                background:
                  'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                boxShadow: '0 10px 24px rgba(17, 24, 39, 0.35)',
                zIndex: 1000,
                transition: 'transform 200ms ease, box-shadow 200ms ease',
                outline: highContrast ? '2px solid ButtonText' : 'none',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #3a32b6 0%, #5a23c6 100%)',
                  boxShadow: `0 14px 32px ${alpha('#111827', 0.45)}`
                },
                '&:active': { transform: 'scale(0.98)' },
                '&:focus-visible': {
                  outline: '3px solid #ffffff',
                  boxShadow: '0 0 0 4px #1e1b4b'
                }
              }}
              onClick={handleClick}
            >
              {open ? (
                <Close aria-hidden="true" focusable="false" />
              ) : (
                <Add aria-hidden="true" focusable="false" />
              )}
            </Fab>
          </Tooltip>
        ) : (
          <Zoom in timeout={300}>
            <Tooltip
              title="Actions rapides : prendre rendez-vous, email, CV, LinkedIn"
              arrow
              placement="right"
              disableInteractive
            >
              <Fab
                id="smartcta-fab"
                aria-label="Actions rapides : prendre rendez-vous, contacter par email, télécharger mon CV ou consulter mon LinkedIn"
                aria-haspopup="menu"
                aria-controls={open ? menuId : undefined}
                aria-expanded={open ? 'true' : undefined}
                color="primary"
                sx={{
                  position: 'fixed',
                  bottom: { xs: 100, sm: 24 },
                  left: 24,
                  color: '#ffffff',
                  background:
                    'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                  boxShadow: '0 10px 24px rgba(17, 24, 39, 0.35)',
                  zIndex: 1000,
                  transition:
                    'transform 200ms ease, box-shadow 200ms ease',
                  outline: highContrast ? '2px solid ButtonText' : 'none',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #3a32b6 0%, #5a23c6 100%)',
                    boxShadow: `0 14px 32px ${alpha('#111827', 0.45)}`,
                    transform: 'translateY(-2px) scale(1.03)'
                  },
                  '&:active': { transform: 'scale(0.98)' },
                  '&:focus-visible': {
                    outline: '3px solid #ffffff',
                    boxShadow: '0 0 0 4px #1e1b4b'
                  }
                }}
                onClick={handleClick}
              >
                {open ? (
                  <Close aria-hidden="true" focusable="false" />
                ) : (
                  <Add aria-hidden="true" focusable="false" />
                )}
              </Fab>
            </Tooltip>
          </Zoom>
        ))}

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        MenuListProps={{ 'aria-labelledby': 'smartcta-fab', role: 'menu' }}
        TransitionComponent={Grow}
        transitionDuration={reduceMotion ? 0 : 200}
        keepMounted
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              border: highContrast
                ? '1px solid ButtonText'
                : '1px solid rgba(17,24,39,0.12)',
              boxShadow: '0 10px 24px rgba(17,24,39,0.12)'
            }
          }
        }}
      >
        {actions.map((action, idx) => (
          <MenuItem
            key={idx}
            role="menuitem"
            dense
            onClick={() => {
              action.action();
              setOpen(false);
            }}
            aria-label={action.label}
            sx={{
              gap: 1,
              transition:
                'transform 120ms ease, background-color 120ms ease',
              '&:hover': {
                transform: reduceMotion ? 'none' : 'translateX(2px)',
                backgroundColor: 'rgba(102,126,234,0.12)'
              }
            }}
          >
            <ListItemIcon
              sx={{ color: 'primary.main', minWidth: 36 }}
            >
              {action.icon}
            </ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SmartCTA;