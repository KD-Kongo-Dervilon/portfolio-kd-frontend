// src/components/ProjectCard.jsx - Version optimisée (perf + accessibilité)
import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Grid,
  Stack
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TrendingUp, Speed, AttachMoney } from '@mui/icons-material';

const ProjectCard = ({ project, showMetrics, onClick }) => {
  return (
    <Card
      component="article"
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 48px rgba(102, 126, 234, 0.25)',
          borderColor: 'primary.main'
        },
        '&:focus-visible': {
          outline: '3px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Voir les détails du projet ${project.title}`}
    >
      {/* Image/Icône du projet */}
      <Box
        sx={{
          height: 200,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 72,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)'
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))'
          }}
        >
          {project.image}
        </Box>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Catégorie */}
        <Chip
          label={project.category}
          size="small"
          sx={(theme) => ({
            alignSelf: 'flex-start',
            mb: 2,
            fontWeight: 700,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '& .MuiChip-label': {
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            },
          })}
        />

        {/* Titre */}
        <Typography
          variant="h6"
          component="h3"
          fontWeight={700}
          gutterBottom
          sx={{
            mb: 1.5,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {project.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {project.description}
        </Typography>

        {/* Métriques business (si activées) */}
        {showMetrics && project.metrics && (
          <Box
            sx={{
              mb: 2.5,
              p: 2.5,
              bgcolor: alpha('#667eea', 0.04),
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha('#667eea', 0.15)
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{
                display: 'block',
                mb: 1.5,
                color: 'text.primary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              📊 Métriques clés
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={4}>
                <Stack alignItems="center" spacing={0.5}>
                  <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{
                      color: 'success.main',
                      fontSize: '1rem'
                    }}
                  >
                    {project.metrics.roi}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', textAlign: 'center' }}
                  >
                    ROI
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack alignItems="center" spacing={0.5}>
                  <Speed sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ fontSize: '1rem' }}
                  >
                    {project.metrics.time}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', textAlign: 'center' }}
                  >
                    Durée
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack alignItems="center" spacing={0.5}>
                  <AttachMoney sx={{ fontSize: 20, color: 'secondary.main' }} />
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{
                      color: 'secondary.main',
                      fontSize: '1rem'
                    }}
                  >
                    {project.metrics.impact}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', textAlign: 'center' }}
                  >
                    Impact
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Technologies */}
        <Box
          sx={{
            display: 'flex',
            gap: 0.75,
            flexWrap: 'wrap',
            mt: 'auto'
          }}
        >
          {project.skills.slice(0, 4).map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              variant="outlined"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha('#667eea', 0.08)
                }
              }}
            />
          ))}
          {project.skills.length > 4 && (
            <Chip
              label={`+${project.skills.length - 4}`}
              size="small"
              sx={(theme) => ({
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 700,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                border: '1px solid',
                borderColor: theme.palette.primary.main,
              })}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(ProjectCard);