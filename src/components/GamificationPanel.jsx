import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Divider,
  Fade
} from '@mui/material';
import {
  Star,
  CheckCircle,
  AutoAwesome,
  TrendingUp,
  EmojiObjects
} from '@mui/icons-material';

const GamificationPanel = () => {
  const metrics = [
    { label: 'Livraison prévisible', value: 92 },
    { label: 'Impact produit mesurable', value: 86 },
    { label: 'Alignement parties prenantes', value: 88 }
  ];

  const businessMetrics = [
    { label: 'Recommandation IA', value: '+45%' },
    { label: 'Automatisation', value: '+60%' },
    { label: 'Chatbot IA', value: '+50%' },
    { label: 'ROI moyen', value: '3.2x' }
  ];

  return (
    <Fade in timeout={800}>
      <Paper sx={{ p: 4, bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Star sx={{ color: '#ffc107', fontSize: 32 }} />
          <Typography
            variant="h5"
            component="h3"
            fontWeight={600}
          >
            Performance & Impact Mesurable
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric) => (
            <Grid item xs={12} md={4} key={metric.label}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {metric.label}
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight={600}>
                    {metric.value}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)'
                    }
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
          <Chip icon={<CheckCircle />} label="MVP livré" color="success" />
          <Chip icon={<CheckCircle />} label="RAG prêt" color="primary" />
          <Chip icon={<CheckCircle />} label="Sprints stables" color="success" />
          <Chip icon={<AutoAwesome />} label="Gains growth" sx={{ bgcolor: '#ffc107', color: 'white' }} />
          <Chip icon={<TrendingUp />} label="KPIs atteints" color="info" />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.3)'
          }}
        >
          <Typography
            variant="h6"
            component="h4"
            fontWeight={600}
            gutterBottom
          >
            💡 Pourquoi cette section aide votre décision de recrutement
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'white' }}>
                <Typography
                  variant="h4"
                  component="p"
                  color="primary"
                  fontWeight={700}
                >
                  21j
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Time-to-MVP moyen
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'white' }}>
                <Typography
                  variant="h4"
                  component="p"
                  color="primary"
                  fontWeight={700}
                >
                  92%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Respect des délais
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'white' }}>
                <Typography
                  variant="h4"
                  component="p"
                  color="primary"
                  fontWeight={700}
                >
                  4.6/5
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Satisfaction stakeholders
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="subtitle2"
            component="h3"
            fontWeight={600}
            gutterBottom
          >
            📊 ROI Business des Projets IA
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {businessMetrics.map((metric, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    component="p"
                    color={idx < 3 ? 'success.main' : 'primary.main'}
                    fontWeight={700}
                  >
                    {metric.value}
                  </Typography>
                  <Typography variant="caption">{metric.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>🎯 Ce que ces métriques vous disent :</strong> Capacité démontrée à livrer rapidement des solutions IA qui génèrent un impact business mesurable, tout en maintenant une excellente collaboration avec les équipes et stakeholders.
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
          <EmojiObjects sx={{ color: '#4caf50' }} />
          <Typography variant="body2" fontWeight={500}>
            <strong>Bonus recruteur :</strong> Tous mes projets incluent une documentation complète, des KPIs de suivi, et un processus de handover structuré pour assurer la pérennité des solutions.
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

export default GamificationPanel;