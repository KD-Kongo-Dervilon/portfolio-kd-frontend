import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  Chip,
  Grid,
  IconButton,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const ProjectDialog = ({ project, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!project) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: '#ffffff',
          color: '#111827',
        },
      }}
    >
      <Box
        sx={{
          height: 200,
          background: (t) =>
            `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 100,
          position: 'relative',
          color: (t) => t.palette.primary.contrastText,
          borderBottom: (t) => `1px solid ${alpha(t.palette.common.black, 0.08)}`
        }}
      >
        {project.image}
        <IconButton
          onClick={onClose}
          aria-label="Fermer le dialogue du projet"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: (t) =>
              t.palette.mode === 'dark'
                ? alpha(t.palette.background.paper, 0.9)
                : 'rgba(255,255,255,0.95)',
            color: (t) => t.palette.text.primary,
            '&:hover': {
              bgcolor: (t) =>
                t.palette.mode === 'dark'
                  ? alpha(t.palette.background.paper, 1)
                  : '#ffffff'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogTitle component="div">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={project.category} color="primary" />
          <Typography variant="h5" component="p" fontWeight={600}>
            {project.title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography
          paragraph
          sx={{
            color: '#111827',
            fontSize: '1rem',
            lineHeight: 1.7,
          }}
        >
          {project.details}
        </Typography>

        <Box
          sx={{
            mb: 3,
            p: 2.2,
            borderRadius: 2,
            bgcolor: (t) =>
              t.palette.mode === 'dark'
                ? alpha(t.palette.background.paper, 0.95)
                : alpha(t.palette.primary.main, 0.03),
            border: (t) =>
              `1px solid ${
                t.palette.mode === 'dark'
                  ? alpha(t.palette.primary.main, 0.4)
                  : alpha(t.palette.primary.main, 0.15)
              }`
          }}
        >
          <Typography
            variant="subtitle2"
            component="h3"
            fontWeight={600}
            gutterBottom
            sx={(t) => ({
              color:
                t.palette.mode === 'dark'
                  ? t.palette.common.white
                  : t.palette.text.primary
            })}
          >
            📊 Résultats Business
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                ROI
              </Typography>
              <Typography
                variant="h6"
                component="p"
                color="success.main"
                fontWeight={600}
              >
                {project.metrics.roi}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Durée du projet
              </Typography>
              <Typography
                variant="h6"
                component="p"
                fontWeight={600}
                sx={(t) => ({
                  color:
                    t.palette.mode === 'dark'
                      ? t.palette.common.white
                      : '#111827',
                })}
              >
                {project.metrics.time}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Impact
              </Typography>
              <Typography
                variant="h6"
                component="p"
                color="primary"
                fontWeight={600}
              >
                {project.metrics.impact}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography
          variant="subtitle2"
          component="h3"
          fontWeight={600}
          gutterBottom
        >
          Compétences mobilisées
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            mt: 1.5
          }}
        >
          {project.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              sx={(t) => ({
                fontWeight: 600,
                borderRadius: 999,
                px: 0.6,
                height: 26,
                bgcolor: alpha(t.palette.primary.main, 0.06),
                color: t.palette.primary.main,
                border: `1px solid ${alpha(t.palette.primary.main, 0.4)}`,
                '& .MuiChip-label': {
                  px: 1.2,
                },
                '&:hover': {
                  bgcolor: alpha(t.palette.primary.main, 0.12),
                  borderColor: t.palette.primary.main,
                },
              })}
            />
          ))}
        </Box>
        {project.title === 'Prototype utilisateur' && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              component="h3"
              fontWeight={600}
              gutterBottom
            >
              🔗 Prototype interactif
            </Typography>
            <Button
              href="https://previewer.adalo.com/82f33a4c-6ace-41e1-91b3-d6902eada497"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              color="secondary"
              sx={{ fontWeight: 700 }}
            >
              Voir le prototype utilisateur
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;