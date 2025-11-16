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
    >
      <Box
        sx={{
          height: 200,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 100,
          position: 'relative'
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
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              bgcolor: 'white'
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
        <Typography paragraph color="text.secondary">
          {project.details}
        </Typography>

        <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
          <Typography
            variant="subtitle2"
            component="h3"
            fontWeight={600}
            gutterBottom
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
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {project.skills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              color="primary"
              variant="filled"
              sx={{
                bgcolor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
                fontWeight: 700,
                '& .MuiChip-label': { px: 1 },
                '&:hover': { filter: 'brightness(0.95)' }
              }}
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