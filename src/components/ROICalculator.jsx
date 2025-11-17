// src/components/ROICalculator.jsx - Version optimisée (contraste, accessibilité, perf, design)

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Slider,
  Grid,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Switch,
  InputLabel,
  InputAdornment,
  Fade,
  Grow,
  Divider,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  AttachMoney,
  Download,
  AutoAwesome,
  Calculate
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const countries = [
  { code: 'FR', name: 'France', hourlyRate: 40, currency: '€' },
  { code: 'US', name: 'États-Unis', hourlyRate: 50, currency: '$' },
  { code: 'CA', name: 'Canada', hourlyRate: 45, currency: 'CAD' },
  { code: 'GB', name: 'Royaume-Uni', hourlyRate: 45, currency: '£' },
  { code: 'DE', name: 'Allemagne', hourlyRate: 42, currency: '€' },
  { code: 'CH', name: 'Suisse', hourlyRate: 65, currency: 'CHF' },
  { code: 'BE', name: 'Belgique', hourlyRate: 38, currency: '€' }
];

const ROICalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [teamSize, setTeamSize] = useState(5);
  const [monthlyTickets, setMonthlyTickets] = useState(500);
  const [avgResolutionTime, setAvgResolutionTime] = useState(30);
  const [automationRate, setAutomationRate] = useState(60);
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [visible, setVisible] = useState(false);
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState(40);
  const [customCurrency, setCustomCurrency] = useState('€');

  useEffect(() => {
    setVisible(true);
  }, []);

  const currentCountry =
    countries.find(c => c.code === selectedCountry) || countries[0];

  const costPerHour = useCustomRate
    ? Number(customRate || 0)
    : currentCountry.hourlyRate;
  const currency = useCustomRate ? customCurrency : currentCountry.currency;

  const hoursSavedPerMonth =
    (monthlyTickets * avgResolutionTime * (automationRate / 100)) / 60;

  const monthlySavings = hoursSavedPerMonth * costPerHour;
  const yearlySavings = monthlySavings * 12;
  const implementationCost = 15000;

  const roi =
    implementationCost > 0
      ? (
          ((yearlySavings - implementationCost) / implementationCost) *
          100
        ).toFixed(0)
      : '0';

  const paybackMonths =
    monthlySavings > 0
      ? (implementationCost / monthlySavings).toFixed(1)
      : '—';

  const downloadReport = async () => {
    const report = `
ROI CALCULATEUR IA - RAPPORT DÉTAILLÉ
======================================

PARAMÈTRES
----------
• Équipe support : ${teamSize} ${teamSize > 1 ? 'personnes' : 'personne'}
• Tickets/mois : ${monthlyTickets}
• Temps résolution : ${avgResolutionTime} min
• Automatisation : ${automationRate}%
• Pays : ${currentCountry.name}
• Taux horaire : ${costPerHour}${currency}/h

RÉSULTATS
---------
✓ Heures économisées/mois : ${hoursSavedPerMonth.toFixed(0)}h
✓ Économies mensuelles : ${monthlySavings.toLocaleString('fr-FR')}${currency}
✓ Économies annuelles : ${yearlySavings.toLocaleString('fr-FR')}${currency}
✓ ROI 1 an : ${roi >= 0 ? '+' : ''}${roi}%
✓ Rentabilité estimée : ${
      paybackMonths === '—'
        ? 'non atteinte (paramètres à ajuster)'
        : `${paybackMonths} mois`
    }

Rapport généré le ${new Date().toLocaleDateString('fr-FR')}
    `.trim();

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      let y = 48;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ROI CALCULATEUR IA', 48, y);

      y += 28;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      const paragraphs = report.split('\n');
      paragraphs.forEach(p => {
        const lines = doc.splitTextToSize(
          p,
          doc.internal.pageSize.getWidth() - 96
        );
        lines.forEach(line => {
          if (y > doc.internal.pageSize.getHeight() - 48) {
            doc.addPage();
            y = 48;
          }
          doc.text(line, 48, y);
          y += 18;
        });
        y += 6;
      });

      doc.save(`rapport-roi-ia-${Date.now()}.pdf`);
    } catch (err) {
      const blob = new Blob([report], {
        type: 'text/plain;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-roi-ia-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Box
      component="section"
      aria-label="Calculateur de retour sur investissement d'un chatbot IA pour le support client"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 3 },
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#f5f7fb'
      }}
    >
      {/* Halo de fond cohérent avec le portfolio */}
      <Box
        sx={{
          position: 'absolute',
          inset: '-20%',
          background:
            'radial-gradient(circle at top left, rgba(79,70,229,0.16), transparent 65%)',
          opacity: 0.7,
          pointerEvents: 'none'
        }}
      />

      <Fade in={visible} timeout={reduceMotion ? 0 : 800}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            {/* Header */}
            <Box
              sx={{
                textAlign: 'center',
                mb: { xs: 4, md: 6 },
                maxWidth: 760,
                mx: 'auto'
              }}
            >
              <Typography
                component="h1"
                variant={isSmall ? 'h5' : 'h4'}
                fontWeight={800}
                sx={{
                  mb: 1.5,
                  letterSpacing: '-0.02em',
                  color: '#111827'
                }}
              >
                💰 Calculateur de ROI IA pour votre support client
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#4b5563',
                  lineHeight: 1.7
                }}
              >
                Modifiez les paramètres de votre équipe pour estimer
                en temps réel l’impact d’un chatbot IA sur vos coûts
                et votre rentabilité. Aucun blabla, uniquement des
                chiffres actionnables.
              </Typography>
            </Box>

            <Grid
              container
              rowSpacing={{ xs: 3, md: 4 }}
              columnSpacing={{ xs: 0, sm: 3, md: 4 }}
              direction={isMobile ? 'column' : 'row'}
            >
              {/* Colonne Paramètres - hover fluide via Grid + Paper */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  transformOrigin: 'center center',
                  transition: reduceMotion
                    ? 'none'
                    : 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                  willChange: reduceMotion ? 'auto' : 'transform',
                  '&:hover': {
                    transform: reduceMotion
                      ? 'none'
                      : 'translateY(-12px) scale(1.02)'
                  }
                }}
              >
                <Grow
                  in={visible}
                  timeout={reduceMotion ? 0 : 900}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      width: '100%',
                      bgcolor: 'rgba(255,255,255,0.98)',
                      borderRadius: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                      boxShadow: '0 10px 34px rgba(15,23,42,0.10)',
                      backdropFilter: 'blur(10px)',
                      transition:
                        'box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease',
                      '&:hover': {
                        boxShadow: '0 22px 70px rgba(15,23,42,0.16)',
                        borderColor: theme.palette.primary.main
                      }
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                      mb={3}
                    >
                      <Calculate
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: 28
                        }}
                      />
                      <Typography
                        variant="h6"
                        component="p"
                        fontWeight={700}
                        sx={{ color: '#111827' }}
                      >
                        Vos paramètres
                      </Typography>
                    </Stack>

                    {/* Sélecteur de pays */}
                    <Box sx={{ mb: 4 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel
                          id="country-label"
                          sx={{
                            color: '#111827',
                            fontWeight: 600
                          }}
                        >
                          Pays & taux horaire
                        </InputLabel>
                        <Select
                          labelId="country-label"
                          value={selectedCountry}
                          label="Pays & taux horaire"
                          onChange={e => setSelectedCountry(e.target.value)}
                          sx={{ minHeight: 48, fontWeight: 500 }}
                        >
                          {countries.map(country => (
                            <MenuItem key={country.code} value={country.code}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <Typography
                                  fontWeight={600}
                                  sx={{ color: '#111827' }}
                                >
                                  {country.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: '#6b7280' }}
                                >
                                  {country.hourlyRate}
                                  {country.currency}
                                  /h
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControlLabel
                        sx={{ mt: 1.5, color: '#111827' }}
                        control={
                          <Switch
                            checked={useCustomRate}
                            onChange={e =>
                              setUseCustomRate(e.target.checked)
                            }
                            inputProps={{
                              'aria-label':
                                'Utiliser un taux horaire personnalisé'
                            }}
                          />
                        }
                        label="Taux horaire personnalisé"
                      />

                      {useCustomRate && (
                        <Box
                          sx={{
                            mt: 2,
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              sm: '1fr auto'
                            },
                            gap: 2
                          }}
                        >
                          <TextField
                            label="Taux horaire"
                            value={customRate}
                            onChange={e =>
                              setCustomRate(
                                Math.max(
                                  0,
                                  Math.min(
                                    10000,
                                    Number(e.target.value || 0)
                                  )
                                )
                              )
                            }
                            inputProps={{
                              inputMode: 'decimal',
                              pattern: '[0-9]*',
                              'aria-label':
                                'Taux horaire personnalisé'
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  /h
                                </InputAdornment>
                              )
                            }}
                            fullWidth
                          />
                          <FormControl sx={{ minWidth: 110 }}>
                            <InputLabel>Devise</InputLabel>
                            <Select
                              value={customCurrency}
                              label="Devise"
                              onChange={e =>
                                setCustomCurrency(e.target.value)
                              }
                            >
                              {['€', '$', 'CAD', '£', 'CHF'].map(cur => (
                                <MenuItem key={cur} value={cur}>
                                  {cur}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      )}
                    </Box>

                    <Divider
                      sx={{
                        my: 3,
                        borderColor: alpha('#9ca3af', 0.5)
                      }}
                    />

                    {/* Sliders */}
                    <Box sx={{ mb: 3.5 }}>
                      <Typography
                        gutterBottom
                        fontWeight={600}
                        sx={{ mb: 1, color: '#111827' }}
                      >
                        Taille de l&apos;équipe :{' '}
                        <Box
                          component="span"
                          sx={{ color: theme.palette.primary.main }}
                        >
                          {teamSize}
                        </Box>
                      </Typography>
                      <Slider
                        value={teamSize}
                        onChange={(_, val) => setTeamSize(val)}
                        min={1}
                        max={50}
                        aria-label="Taille de l'équipe support"
                        marks={[
                          { value: 1, label: '1' },
                          { value: 25, label: '25' },
                          { value: 50, label: '50' }
                        ]}
                      />
                    </Box>

                    <Box sx={{ mb: 3.5 }}>
                      <Typography
                        gutterBottom
                        fontWeight={600}
                        sx={{ mb: 1, color: '#111827' }}
                      >
                        Tickets/mois :{' '}
                        <Box
                          component="span"
                          sx={{ color: theme.palette.primary.main }}
                        >
                          {monthlyTickets}
                        </Box>
                      </Typography>
                      <Slider
                        value={monthlyTickets}
                        onChange={(_, val) => setMonthlyTickets(val)}
                        min={100}
                        max={5000}
                        step={100}
                        aria-label="Nombre de tickets par mois"
                        marks={[
                          { value: 100, label: '100' },
                          { value: 2500, label: '2.5K' },
                          { value: 5000, label: '5K' }
                        ]}
                      />
                    </Box>

                    <Box sx={{ mb: 3.5 }}>
                      <Typography
                        gutterBottom
                        fontWeight={600}
                        sx={{ mb: 1, color: '#111827' }}
                      >
                        Temps moyen de résolution :{' '}
                        <Box
                          component="span"
                          sx={{ color: theme.palette.primary.main }}
                        >
                          {avgResolutionTime} min
                        </Box>
                      </Typography>
                      <Slider
                        value={avgResolutionTime}
                        onChange={(_, val) =>
                          setAvgResolutionTime(val)
                        }
                        min={5}
                        max={60}
                        step={5}
                        aria-label="Temps moyen de résolution en minutes"
                        marks={[
                          { value: 5, label: '5' },
                          { value: 30, label: '30' },
                          { value: 60, label: '60' }
                        ]}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mb={1}
                      >
                        <AutoAwesome
                          sx={{
                            fontSize: 20,
                            color: theme.palette.primary.main
                          }}
                        />
                        <Typography
                          fontWeight={600}
                          sx={{ color: '#111827' }}
                        >
                          Taux d&apos;automatisation :{' '}
                          <Box
                            component="span"
                            sx={{ color: theme.palette.primary.main }}
                          >
                            {automationRate}%
                          </Box>
                        </Typography>
                      </Stack>
                      <Slider
                        value={automationRate}
                        onChange={(_, val) =>
                          setAutomationRate(val)
                        }
                        min={10}
                        max={90}
                        step={5}
                        aria-label="Taux d'automatisation estimé"
                        marks={[
                          { value: 10, label: '10%' },
                          { value: 50, label: '50%' },
                          { value: 90, label: '90%' }
                        ]}
                      />
                    </Box>

                    <Alert
                      severity="info"
                      sx={{
                        mt: 2.5,
                        bgcolor: alpha(
                          theme.palette.primary.main,
                          0.06
                        ),
                        color: '#111827',
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.24
                        )}`,
                        fontSize: '0.85rem'
                      }}
                    >
                      Les valeurs sont inspirées de cas réels. Adaptons ensemble
                      ces chiffres à votre contexte.
                    </Alert>
                  </Paper>
                </Grow>
              </Grid>

              {/* Colonne Résultats - même logique hover / design */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  transformOrigin: 'center center',
                  transition: reduceMotion
                    ? 'none'
                    : 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                  willChange: reduceMotion ? 'auto' : 'transform',
                  '&:hover': {
                    transform: reduceMotion
                      ? 'none'
                      : 'translateY(-12px) scale(1.02)'
                  }
                }}
              >
                <Grow
                  in={visible}
                  timeout={reduceMotion ? 0 : 1050}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      width: '100%',
                      bgcolor: 'rgba(255,255,255,0.99)',
                      borderRadius: 4,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.32
                      )}`,
                      boxShadow: '0 14px 40px rgba(79,70,229,0.18)',
                      backdropFilter: 'blur(12px)',
                      transition:
                        'box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease',
                      '&:hover': {
                        boxShadow:
                          '0 26px 90px rgba(79,70,229,0.26)',
                        borderColor:
                          theme.palette.primary.main
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="p"
                      fontWeight={700}
                      gutterBottom
                      sx={{ color: '#111827' }}
                    >
                      💎 Résultats estimés
                    </Typography>

                    {/* Métriques principales */}
                    <Grid
                      container
                      spacing={2.4}
                      sx={{ mb: 3.2 }}
                    >
                      {/* Temps libéré */}
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.4,
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: alpha(
                              theme.palette.primary.main,
                              0.06
                            ),
                            border: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.32
                            )}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            mb={1.5}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: '#eef2ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Speed
                                sx={{
                                  fontSize: 24,
                                  color: theme.palette.primary.main
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{ color: '#111827' }}
                            >
                              Temps libéré / mois
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h3"
                            component="p"
                            fontWeight={800}
                            sx={{
                              fontSize: '1.7rem',
                              lineHeight: 1.2,
                              color: '#111827'
                            }}
                          >
                            {hoursSavedPerMonth.toFixed(0)}h
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#4b5563',
                              mt: 0.5
                            }}
                          >
                            de vos équipes redirigées vers des tâches à forte
                            valeur.
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* ROI */}
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.4,
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: alpha('#10b981', 0.06),
                            border: `1px solid ${alpha('#10b981', 0.32)}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            mb={1.5}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: '#d1fae5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <TrendingUp
                                sx={{
                                  fontSize: 24,
                                  color: '#047857'
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{ color: '#111827' }}
                            >
                              ROI sur 12 mois
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h3"
                            component="p"
                            fontWeight={800}
                            sx={{
                              fontSize: '1.7rem',
                              lineHeight: 1.2,
                              color: '#047857'
                            }}
                          >
                            {roi >= 0 ? `+${roi}%` : `${roi}%`}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#4b5563',
                              mt: 0.5
                            }}
                          >
                            incluant un coût d&apos;implémentation estimé à{' '}
                            {implementationCost}€ la première année.
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Économies */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.6,
                        mb: 3,
                        borderRadius: 3,
                        bgcolor: alpha(
                          theme.palette.primary.main,
                          0.03
                        ),
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.4}
                        alignItems="center"
                        mb={1.5}
                      >
                        <AttachMoney
                          sx={{
                            fontSize: 24,
                            color: theme.palette.primary.main
                          }}
                        />
                        <Typography
                          variant="subtitle1"
                          component="p"
                          fontWeight={700}
                          sx={{ color: '#111827' }}
                        >
                          Économies projetées
                        </Typography>
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              p: 1.8,
                              borderRadius: 2,
                              bgcolor: '#f9fafb',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                color: '#6b7280',
                                mb: 0.5
                              }}
                            >
                              Par mois
                            </Typography>
                            <Typography
                              variant="h6"
                              component="p"
                              fontWeight={700}
                              sx={{ color: '#111827' }}
                            >
                              {monthlySavings.toLocaleString(
                                'fr-FR'
                              )}
                              {currency}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              p: 1.8,
                              borderRadius: 2,
                              bgcolor: '#ecfdf5',
                              border: '1px solid #bbf7d0'
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                color: '#166534',
                                mb: 0.5
                              }}
                            >
                              Par an
                            </Typography>
                            <Typography
                              variant="h6"
                              component="p"
                              fontWeight={800}
                              sx={{ color: '#065f46' }}
                            >
                              {yearlySavings.toLocaleString(
                                'fr-FR'
                              )}
                              {currency}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Payback */}
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 3,
                        bgcolor: '#111827',
                        color: '#f9fafb',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          fontWeight: 600,
                          color: '#9ca3af'
                        }}
                      >
                        Temps de retour sur investissement
                      </Typography>
                      <Typography
                        variant="h3"
                        component="p"
                        fontWeight={800}
                        sx={{
                          fontSize: '1.7rem',
                          lineHeight: 1.2
                        }}
                      >
                        {paybackMonths === '—'
                          ? 'À affiner'
                          : `${paybackMonths} mois`}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#e5e7eb' }}
                      >
                        {paybackMonths === '—'
                          ? 'Augmentez le volume ou le taux d’automatisation pour rendre le projet rentable.'
                          : 'Sur la base de vos paramètres actuels et des hypothèses renseignées.'}
                      </Typography>
                    </Box>

                    {/* Bouton download */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 3.4
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={downloadReport}
                        fullWidth={isMobile}
                        sx={{
                          px: isMobile ? 2 : 4,
                          py: 1.5,
                          borderRadius: 999,
                          fontWeight: 800,
                          fontSize: '0.98rem',
                          textTransform: 'none',
                          boxShadow:
                            '0 14px 40px rgba(79,70,229,0.35)',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${
                            theme.palette.secondary?.main || '#7c3aed'
                          })`,
                          '&:hover': {
                            boxShadow:
                              '0 20px 60px rgba(79,70,229,0.45)'
                          }
                        }}
                        aria-label="Télécharger un rapport détaillé basé sur vos paramètres"
                      >
                        Télécharger le rapport personnalisé
                      </Button>
                    </Box>
                  </Paper>
                </Grow>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>
    </Box>
  );
};

export default ROICalculator;