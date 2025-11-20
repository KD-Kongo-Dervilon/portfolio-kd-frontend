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
    const dateStr = new Date().toLocaleDateString('fr-FR');
    const fmtAmount = (v) => `${v.toLocaleString('fr-FR')} ${currency}`;
    const fmtHours = (v) => `${v.toFixed(0)} h`;
    const accentColor = '#4f46e5';
    const darkText = '#111827';
    const mutedText = '#6b7280';

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 56;
      let y = 64;

      // HEADER
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(darkText);
      doc.text('Rapport ROI – Chatbot IA Support Client', marginX, y);

      y += 10;
      doc.setDrawColor(79, 70, 229); // accent indigo
      doc.setLineWidth(1.2);
      doc.line(marginX, y, pageWidth - marginX, y);

      // Sous-titre
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(mutedText);
      doc.text(
        'Estimation financière basée sur les paramètres saisis dans le calculateur de ROI.',
        marginX,
        y
      );

      // Date de génération
      y += 16;
      doc.setFontSize(10);
      doc.text(`Rapport généré le ${dateStr}`, marginX, y);

      // SECTION 1 – Paramètres
      y += 32;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(accentColor);
      doc.text('1. Paramètres analysés', marginX, y);

      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(darkText);

      const paramsLines = [
        `Équipe support : ${teamSize} ${teamSize > 1 ? 'personnes' : 'personne'}`,
        `Tickets/mois : ${monthlyTickets}`,
        `Temps moyen de résolution : ${avgResolutionTime} min`,
        `Taux d'automatisation estimé : ${automationRate} %`,
        `Pays : ${currentCountry.name}`,
        `Taux horaire moyen : ${fmtAmount(costPerHour)}/h`
      ];

      paramsLines.forEach((line) => {
        doc.text(`• ${line}`, marginX, y);
        y += 16;
      });

      // Encadré hypothèses
      y += 6;
      const boxTop = y;
      const boxHeight = 54;
      doc.setDrawColor(209, 213, 219); // gris clair
      doc.setFillColor(249, 250, 251); // fond très clair
      doc.roundedRect(
        marginX,
        boxTop,
        pageWidth - marginX * 2,
        boxHeight,
        6,
        6,
        'FD'
      );

      y += 18;
      doc.setFontSize(10);
      doc.setTextColor(mutedText);
      doc.text(
        "Hypothèse : coût d'implémentation initial d'environ 15 000 € (intégration, design, paramétrage).",
        marginX + 12,
        y
      );
      y += 16;
      doc.text(
        "Les valeurs restent indicatives et doivent être ajustées à votre contexte et à vos coûts internes.",
        marginX + 12,
        y
      );

      // SECTION 2 – Résultats chiffrés
      y += 34;
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 64;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(accentColor);
      doc.text('2. Résultats chiffrés', marginX, y);

      // Cartes de métriques principales
      const cardWidth = (pageWidth - marginX * 2 - 16) / 2;
      const cardHeight = 80;
      const firstRowTop = y + 20;

      // Carte 1 – Heures économisées
      doc.setDrawColor(209, 213, 219);
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(marginX, firstRowTop, cardWidth, cardHeight, 6, 6, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(mutedText);
      doc.text('Temps libéré / mois', marginX + 12, firstRowTop + 18);

      doc.setFontSize(18);
      doc.setTextColor(darkText);
      doc.text(fmtHours(hoursSavedPerMonth), marginX + 12, firstRowTop + 44);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(mutedText);
      doc.text(
        'Heures pouvant être réallouées à des tâches à plus forte valeur.',
        marginX + 12,
        firstRowTop + 62
      );

      // Carte 2 – ROI 12 mois
      const card2X = marginX + cardWidth + 16;
      doc.setDrawColor(22, 163, 74); // vert
      doc.setFillColor(240, 253, 250);
      doc.roundedRect(card2X, firstRowTop, cardWidth, cardHeight, 6, 6, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor('#047857');
      doc.text('ROI estimé sur 12 mois', card2X + 12, firstRowTop + 18);

      doc.setFontSize(18);
      doc.text(
        roi >= 0 ? `+${roi} %` : `${roi} %`,
        card2X + 12,
        firstRowTop + 44
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(mutedText);
      doc.text(
        "Basé sur les économies projetées et un coût d'implémentation de 15 000 €.",
        card2X + 12,
        firstRowTop + 62
      );

      // Ligne suivante – économies
      const secondRowTop = firstRowTop + cardHeight + 26;

      // Carte 3 – Économies mensuelles
      doc.setDrawColor(209, 213, 219);
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(marginX, secondRowTop, cardWidth, cardHeight, 6, 6, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(mutedText);
      doc.text('Économies mensuelles projetées', marginX + 12, secondRowTop + 18);

      doc.setFontSize(16);
      doc.setTextColor(darkText);
      doc.text(fmtAmount(monthlySavings), marginX + 12, secondRowTop + 44);

      // Carte 4 – Économies annuelles
      doc.setDrawColor(220, 252, 231);
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(card2X, secondRowTop, cardWidth, cardHeight, 6, 6, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor('#166534');
      doc.text('Économies annuelles projetées', card2X + 12, secondRowTop + 18);

      doc.setFontSize(16);
      doc.text(fmtAmount(yearlySavings), card2X + 12, secondRowTop + 44);

      // SECTION 3 – Temps de retour sur investissement
      let section3Top = secondRowTop + cardHeight + 34;
      if (section3Top > pageHeight - 120) {
        doc.addPage();
        section3Top = 64;
      }
      y = section3Top;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(accentColor);
      doc.text('3. Temps de retour sur investissement', marginX, y);

      y += 22;
      doc.setDrawColor(15, 23, 42);
      doc.setFillColor(15, 23, 42);
      const roiBoxHeight = 70;
      doc.roundedRect(
        marginX,
        y,
        pageWidth - marginX * 2,
        roiBoxHeight,
        6,
        6,
        'FD'
      );

      doc.setTextColor('#e5e7eb');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(
        'Temps estimé pour couvrir le coût du projet',
        marginX + 16,
        y + 20
      );

      doc.setFontSize(20);
      doc.setTextColor('#ffffff');
      const paybackLabel =
        paybackMonths === '—' ? 'À affiner' : `${paybackMonths} mois`;
      doc.text(paybackLabel, marginX + 16, y + 46);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor('#d1d5db');
      const paybackExplanation =
        paybackMonths === '—'
          ? "Augmentez le volume de tickets ou le taux d'automatisation pour rendre le projet rentable."
          : "Estimation basée sur vos paramètres actuels et les hypothèses de coût renseignées dans le calculateur.";
      doc.text(paybackExplanation, marginX + 16, y + 62);

      // SECTION 4 – Prochaines étapes
      let section4Top = y + roiBoxHeight + 40;
      if (section4Top > pageHeight - 96) {
        doc.addPage();
        section4Top = 64;
      }
      y = section4Top;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(accentColor);
      doc.text('4. Prochaines étapes possibles', marginX, y);

      y += 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(darkText);

      const steps = [
        "Valider les hypothèses (taux horaire, volume de tickets, temps moyen de traitement).",
        "Identifier un périmètre pilote pour lancer un POC (équipe / segment de clients restreint).",
        "Définir des KPIs de succès clairs : réduction du temps de traitement, satisfaction, coûts évités.",
        "Planifier l'industrialisation progressive si les résultats du POC sont confirmés."
      ];

      steps.forEach((s) => {
        const wrapped = doc.splitTextToSize(
          `• ${s}`,
          pageWidth - marginX * 2
        );
        if (y > pageHeight - 64) {
          doc.addPage();
          y = 64;
        }
        doc.text(wrapped, marginX, y);
        y += wrapped.length * 14 + 2;
      });

      doc.save(`rapport-roi-ia-${Date.now()}.pdf`);
    } catch (err) {
      // Fallback très simple en .txt si jamais jsPDF n'est pas disponible
      const fallback = `
Rapport ROI – Chatbot IA Support Client

Équipe support : ${teamSize} ${teamSize > 1 ? 'personnes' : 'personne'}
Tickets/mois : ${monthlyTickets}
Temps moyen de résolution : ${avgResolutionTime} min
Taux d'automatisation estimé : ${automationRate} %
Pays : ${currentCountry.name}
Taux horaire moyen : ${fmtAmount(costPerHour)}/h

Heures économisées/mois : ${fmtHours(hoursSavedPerMonth)}
Économies mensuelles estimées : ${fmtAmount(monthlySavings)}
Économies annuelles estimées : ${fmtAmount(yearlySavings)}
ROI estimé sur 12 mois : ${roi >= 0 ? `+${roi} %` : `${roi} %`}
Temps de retour sur investissement : ${
        paybackMonths === '—' ? 'À affiner' : `${paybackMonths} mois`
      }

Généré le ${dateStr}
      `.trim();

      const blob = new Blob([fallback], {
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
      sx={t => ({
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 3 },
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: t.palette.background.default,
        color: t.palette.text.primary
      })}
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
                sx={t => ({
                  mb: 1.5,
                  letterSpacing: '-0.02em',
                  color: t.palette.text.primary
                })}
              >
                💰 Calculateur de ROI IA pour votre support client
              </Typography>
              <Typography
                variant="body1"
                sx={t => ({
                  color: t.palette.text.secondary,
                  lineHeight: 1.7
                })}
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
                          sx={t => ({
                            minHeight: 48,
                            fontWeight: 500,
                            color: '#111827', // texte toujours sombre sur carte blanche
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(15,23,42,0.18)' // bordure visible sur fond blanc
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(15,23,42,0.45)'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: t.palette.primary.main,
                              boxShadow: `0 0 0 1px ${alpha(t.palette.primary.main, 0.35)}`
                            },
                            '& .MuiSelect-icon': {
                              color: '#4b5563' // flèche sombre, visible sur blanc
                            },
                            // supprime la double outline générée par CssBaseline
                            '& .MuiSelect-select:focus-visible': {
                              outline: 'none',
                              boxShadow: 'none'
                            }
                          })}
                          MenuProps={{
                            PaperProps: {
                              sx: (t) => ({
                                bgcolor:
                                  t.palette.mode === 'dark'
                                    ? alpha(t.palette.background.paper, 0.98)
                                    : t.palette.background.paper,
                                color: t.palette.text.primary,
                                borderRadius: 2,
                                mt: 0.5,
                                boxShadow: '0 18px 45px rgba(15,23,42,0.35)',
                                '& .MuiMenuItem-root': {
                                  fontWeight: 500,
                                  '&:hover': {
                                    bgcolor:
                                      t.palette.mode === 'dark'
                                        ? alpha(t.palette.primary.main, 0.22)
                                        : alpha(t.palette.primary.main, 0.06)
                                  }
                                }
                              })
                            }
                          }}
                        >
                          {countries.map(country => (
                            <MenuItem
                              key={country.code}
                              value={country.code}
                              sx={t => ({
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontWeight: 500,
                                color: t.palette.text.primary
                              })}
                            >
                              <span>{country.name}</span>
                              <span>
                                {country.hourlyRate}
                                {country.currency}
                                /h
                              </span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControlLabel
                        sx={{
                          mt: 1.5,
                          color: '#111827'
                        }}
                        control={
                          <Switch
                            checked={useCustomRate}
                            onChange={e => setUseCustomRate(e.target.checked)}
                            inputProps={{ 'aria-label': 'Utiliser un taux horaire personnalisé' }}
                            sx={t => ({
                              '& .MuiSwitch-thumb': {
                                backgroundColor: t.palette.primary.main
                              },
                              '& .MuiSwitch-track': {
                                backgroundColor:
                                  t.palette.mode === 'dark'
                                    ? t.palette.primary.dark
                                    : alpha(t.palette.primary.main, 0.4),
                                opacity: 1
                              },
                              '&.Mui-checked .MuiSwitch-thumb': {
                                backgroundColor: t.palette.primary.main
                              },
                              '&.Mui-checked .MuiSwitch-track': {
                                backgroundColor:
                                  t.palette.mode === 'dark'
                                    ? t.palette.primary.light
                                    : t.palette.primary.main,
                                opacity: 1
                              }
                            })}
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
                                <InputAdornment
                                  position="end"
                                  sx={t => ({ color: t.palette.text.secondary, fontWeight: 600 })}
                                >
                                  /h
                                </InputAdornment>
                              )
                            }}
                            InputLabelProps={{
                              sx: {
                                color: '#111827',
                                fontWeight: 600
                              }
                            }}
                            sx={t => ({
                              '& .MuiOutlinedInput-input': {
                                color: '#111827' // texte du 40/h toujours lisible
                              },
                              '& .MuiOutlinedInput-root': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(15,23,42,0.18)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(15,23,42,0.45)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: t.palette.primary.main,
                                  boxShadow: `0 0 0 1px ${alpha(t.palette.primary.main, 0.35)}`
                                }
                              },
                              // supprime la double outline sur l'input lui‑même
                              '& .MuiOutlinedInput-input:focus-visible': {
                                outline: 'none',
                                boxShadow: 'none'
                              }
                            })}
                            fullWidth
                          />
                          <FormControl sx={{ minWidth: 110 }}>
                            <InputLabel
                              sx={{
                                color: '#111827',
                                fontWeight: 600
                              }}
                            >
                              Devise
                            </InputLabel>
                            <Select
                              value={customCurrency}
                              label="Devise"
                              onChange={e =>
                                setCustomCurrency(e.target.value)
                              }
                              sx={t => ({
                                color: '#111827',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(15,23,42,0.18)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(15,23,42,0.45)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: t.palette.primary.main,
                                  boxShadow: `0 0 0 1px ${alpha(t.palette.primary.main, 0.35)}`
                                },
                                '& .MuiSelect-icon': {
                                  color: '#4b5563'
                                },
                                '& .MuiSelect-select:focus-visible': {
                                  outline: 'none',
                                  boxShadow: 'none'
                                }
                              })}
                              MenuProps={{
                                PaperProps: {
                                  sx: (t) => ({
                                    bgcolor:
                                      t.palette.mode === 'dark'
                                        ? alpha(t.palette.background.paper, 0.98)
                                        : t.palette.background.paper,
                                    color: t.palette.text.primary,
                                    borderRadius: 2,
                                    mt: 0.5,
                                    boxShadow: '0 18px 45px rgba(15,23,42,0.35)',
                                    '& .MuiMenuItem-root': {
                                      fontWeight: 500,
                                      '&:hover': {
                                        bgcolor:
                                          t.palette.mode === 'dark'
                                            ? alpha(t.palette.primary.main, 0.22)
                                            : alpha(t.palette.primary.main, 0.06)
                                      }
                                    }
                                  })
                                }
                              }}
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
                        sx={{
                          '& .MuiSlider-markLabel': {
                            color: '#4b5563',
                            fontWeight: 600,
                            fontSize: 12
                          }
                        }}
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
                        sx={{
                          '& .MuiSlider-markLabel': {
                            color: '#4b5563',
                            fontWeight: 600,
                            fontSize: 12
                          }
                        }}
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
                        sx={{
                          '& .MuiSlider-markLabel': {
                            color: '#4b5563',
                            fontWeight: 600,
                            fontSize: 12
                          }
                        }}
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
                        sx={{
                          '& .MuiSlider-markLabel': {
                            color: '#4b5563',
                            fontWeight: 600,
                            fontSize: 12
                          }
                        }}
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