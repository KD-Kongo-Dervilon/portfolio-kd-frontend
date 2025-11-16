// src/components/Portfolio.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Grow
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PROJECTS, CATEGORIES } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectDialog from './ProjectDialog';

const Portfolio = () => {
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const theme = useTheme();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const sectionTitleId = 'portfolio-title';
  const sectionDescId = 'portfolio-desc';
  const gradient = `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`;

  // 🔍 Optimisation : mémoiser le filtrage des projets
  const filteredProjects = useMemo(
    () =>
      projectFilter === 'all'
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === projectFilter),
    [projectFilter]
  );

  const hasProjects = filteredProjects && filteredProjects.length > 0;

  return (
    <Box
      id="portfolio"
      component="section"
      role="region"
      aria-labelledby={sectionTitleId}
      aria-describedby={sectionDescId}
      sx={{ py: { xs: 6, md: 10 }, px: 2 }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            id={sectionTitleId}
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Portfolio
          </Typography>
          <Typography
            id={sectionDescId}
            variant="h6"
            component="p"
            color="text.secondary"
          >
            Découvrez mes projets en IA, Product Management et Marketing Digital
          </Typography>
        </Box>

        {/* Filtres */}
        <Box
          role="toolbar"
          aria-label="Filtres du portfolio"
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            mb: 3,
            flexWrap: 'wrap'
          }}
        >
          {CATEGORIES.map((filter) => {
            const isActive = projectFilter === filter;
            return (
              <Button
                key={filter}
                variant={isActive ? 'contained' : 'outlined'}
                onClick={() => setProjectFilter(filter)}
                aria-pressed={isActive}
                aria-label={`Filtrer par ${
                  filter === 'all' ? 'tous les projets' : filter
                }`}
                sx={{
                  textTransform: 'none',
                  borderRadius: 50,
                  '&:focus-visible': {
                    outline: `2px solid ${alpha(
                      theme.palette.primary.main,
                      0.6
                    )}`,
                    outlineOffset: 2
                  },
                  ...(isActive && {
                    background: gradient,
                    boxShadow: `0 4px 14px ${alpha(
                      theme.palette.primary.main,
                      0.35
                    )}`
                  })
                }}
              >
                {filter === 'all' ? 'Tous' : filter}
              </Button>
            );
          })}
        </Box>

        {/* Toggle métriques */}
        <FormControlLabel
          control={
            <Switch
              checked={showMetrics}
              onChange={(e) => setShowMetrics(e.target.checked)}
              inputProps={{
                'aria-describedby': 'metrics-helper',
                'aria-label':
                  "Activer ou désactiver l’affichage des métriques business sur les projets"
              }}
            />
          }
          label="Afficher les métriques business"
          sx={{ mb: 3, ml: 2 }}
        />

        <Typography
          id="metrics-helper"
          variant="caption"
          color="text.secondary"
          sx={{ ml: 2, display: 'block', mb: 2 }}
        >
          Active les indicateurs clés (ROI, conversion, temps de réponse)
          sur chaque carte projet.
        </Typography>

        {/* Grille des projets */}
        {hasProjects ? (
          <Grid container spacing={3} role="list">
            {filteredProjects.map((project, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={project.id}
                role="listitem"
                sx={{ display: 'flex' }}
              >
                {reduceMotion ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%'
                    }}
                  >
                    <Box sx={{ height: '100%' }}>
                      <ProjectCard
                        project={project}
                        showMetrics={showMetrics}
                        onClick={() => setSelectedProject(project)}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Grow in timeout={300 + index * 100}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                      }}
                    >
                      <Box sx={{ height: '100%' }}>
                        <ProjectCard
                          project={project}
                          showMetrics={showMetrics}
                          onClick={() => setSelectedProject(project)}
                        />
                      </Box>
                    </Box>
                  </Grow>
                )}
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Aucun projet ne correspond à ce filtre pour le moment.
            </Typography>
          </Box>
        )}

        {/* Dialog projet */}
        <ProjectDialog
          project={selectedProject}
          open={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
        />
      </Container>
    </Box>
  );
};

export default Portfolio;