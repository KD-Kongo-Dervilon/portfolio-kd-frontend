// src/components/ChatbotIA.jsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Fab,
  Slide,
  Fade,
  CircularProgress,
  Tooltip,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Send,
  Close,
  SmartToy,
  Person,
  Psychology,
  TipsAndUpdates,
  Mic,
  MicOff,
  Download,
  VolumeUp,
  VolumeOff,
  PlayArrow,
  Stop
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { useChatbotIA } from '../hooks/useChatbotIA';

// --- Config UI locale (on pourra déplacer ça plus tard dans chatbotHelpers) ---
const ROUTE_AUTOMATIONS = '/services/automatisation-ia-n8n';
const ROUTE_BLOG = '/blog';
const CV_DOWNLOAD_URL = '/cv/dervilon-mbissi.pdf';

const BOT_HEADER_TITLE = 'Amara · Assistant IA du portfolio';

const suggestedQuestions = [
  "Peux-tu me résumer le profil de Dervilon ?",
  "Quels sont ses projets IA préférés ?",
  "Parle-moi de Dervilon",
  "Comment il peut m’aider avec l’IA et les automatisations ?"
];

const ChatbotIA = () => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const highContrast = useMediaQuery('(forced-colors: active)');
  const navigate = useNavigate();

  const visuallyHidden = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1
  };

  // 🧠 Tout l’état et les helpers viennent du hook
  const {
    // état principal
    open,
    setOpen,
    messages,
    input,
    setInput,
    isTyping,
    isListening,
    isSpeaking,
    voiceEnabled,
    setVoiceEnabled,
    error,
    setError,
    chatbotUsageCount,
    chatbotLimitReached,
    isAdmin,
    liveAnnounce,

    // refs
    messagesEndRef,

    // helpers
    scrollToBottom,
    stopSpeaking,
    speak,
    toggleListening,
    handleSend,
    handleSuggestedQuestion,
    exportConversation,
    CHATBOT_DAILY_LIMIT
  } = useChatbotIA();

  // 🔁 scroll au bas à chaque nouveau message
  React.useEffect(() => {
    scrollToBottom(reduceMotion);
  }, [messages, scrollToBottom, reduceMotion]);

  // 🗣️ wrapper pour lire un message précis (utilise le TTS du hook)
  const handleSpeakMessage = (text) => {
    speak(text);
  };

  return (
    <>
      {/* zone ARIA pour lecteurs d'écran */}
      <div aria-live="polite" aria-atomic="true" style={visuallyHidden}>
        {liveAnnounce}
      </div>

      {/* Bouton flottant pour ouvrir le chatbot */}
      {!open && (
        <Tooltip title="Ouvrir Amara, l'assistant IA" arrow placement="left" disableInteractive>
          <Fab
            aria-label="Ouvrir Amara, l'assistant IA"
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: theme.palette.primary.contrastText,
              width: 64,
              height: 64,
              zIndex: (theme) => theme.zIndex.modal + 25,
              boxShadow: '0 10px 28px rgba(17, 24, 39, 0.45)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
              outline: highContrast ? '2px solid ButtonText' : 'none',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                boxShadow: '0 14px 36px rgba(17,24,39,0.55)',
                transform: reduceMotion ? 'none' : 'translateY(-2px) scale(1.04)'
              },
              '&:active': {
                transform: 'scale(0.98)'
              },
              '&:focus-visible': {
                boxShadow: 'var(--focus-ring)'
              }
            }}
            onClick={() => setOpen(true)}
          >
            <SmartToy sx={{ fontSize: 32 }} aria-hidden="true" focusable="false" />
          </Fab>
        </Tooltip>
      )}

      {/* Panneau du chatbot */}
      <Slide
        direction="up"
        in={open}
        mountOnEnter
        unmountOnExit
        timeout={reduceMotion ? 0 : 250}
      >
        <Paper
          component="section"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: {
              xs: 'calc(100vw - 32px)',
              sm: 420
            },
            height: {
              xs: 'calc(100vh - 104px)',
              sm: 650
            },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: (theme) => theme.zIndex.modal + 20,
            boxShadow: '0 12px 48px rgba(0,0,0,0.25)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: theme.palette.primary.contrastText,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              outline: highContrast ? '1px solid ButtonText' : 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 40,
                  height: 40
                }}
              >
                <Psychology aria-hidden="true" focusable="false" />
              </Avatar>
              <Box>
                <Typography
                  id="chatbot-title"
                  component="h2"
                  variant="subtitle1"
                  fontWeight={600}
                >
                  {BOT_HEADER_TITLE}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={`⚡ Amara · IA propulsée par GPT-4${isSpeaking ? ' 🔊' : ''}`}
                    sx={{
                      height: 24,
                      bgcolor: 'rgba(255,255,255,0.98)',
                      color: theme.palette.primary.dark,
                      fontWeight: 700,
                      letterSpacing: 0.2,
                      borderRadius: 1,
                      '& .MuiChip-label': {
                        px: 1,
                        fontSize: '0.72rem'
                      },
                      outline: highContrast ? '1px solid ButtonText' : 'none'
                    }}
                  />
                  {isAdmin && (
                    <Chip
                      size="small"
                      label="👑 Mode admin : aucune limite"
                      sx={{
                        height: 24,
                        bgcolor: 'rgba(15,23,42,0.95)',
                        color: '#f9fafb',
                        fontWeight: 600,
                        letterSpacing: 0.2,
                        borderRadius: 1,
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.7rem'
                        },
                        outline: highContrast ? '1px solid ButtonText' : 'none'
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {/* toggle TTS */}
              <Tooltip
                title={
                  voiceEnabled
                    ? 'Désactiver les réponses vocales'
                    : 'Activer les réponses vocales'
                }
              >
                <IconButton
                  onClick={() => {
                    setVoiceEnabled(!voiceEnabled);
                    if (voiceEnabled) stopSpeaking();
                  }}
                  aria-label={
                    voiceEnabled
                      ? 'Désactiver les réponses vocales'
                      : 'Activer les réponses vocales'
                  }
                  aria-pressed={voiceEnabled}
                  sx={{
                    color: 'white',
                    '&:focus-visible': {
                      outline: '2px solid #ffffff'
                    }
                  }}
                  size="small"
                >
                  {voiceEnabled ? (
                    <VolumeUp fontSize="small" aria-hidden="true" focusable="false" />
                  ) : (
                    <VolumeOff fontSize="small" aria-hidden="true" focusable="false" />
                  )}
                </IconButton>
              </Tooltip>

              {/* export */}
              <Tooltip title="Exporter la conversation">
                <IconButton
                  onClick={exportConversation}
                  aria-label="Exporter la conversation"
                  sx={{
                    color: 'white',
                    '&:focus-visible': {
                      outline: '2px solid #ffffff'
                    }
                  }}
                  size="small"
                >
                  <Download fontSize="small" aria-hidden="true" focusable="false" />
                </IconButton>
              </Tooltip>

              {/* fermer */}
              <IconButton
                onClick={() => setOpen(false)}
                aria-label="Fermer l'assistant"
                sx={{
                  color: 'white',
                  '&:focus-visible': {
                    outline: '2px solid #ffffff'
                  }
                }}
                size="small"
              >
                <Close aria-hidden="true" focusable="false" />
              </IconButton>
            </Box>
          </Box>

          {/* Zone messages */}
          <Box
            role="list"
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {messages.map((message, index) => (
              <Box key={index} role="listitem">
                {reduceMotion ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: 1
                    }}
                    aria-label={`${
                      message.type === 'user' ? 'Vous' : 'Assistant'
                    } — ${message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`}
                  >
                    {message.type === 'bot' && (
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.dark,
                          width: 32,
                          height: 32
                        }}
                      >
                        <SmartToy
                          sx={{ fontSize: 18 }}
                          aria-hidden="true"
                          focusable="false"
                        />
                      </Avatar>
                    )}
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '80%',
                        bgcolor:
                          message.type === 'user'
                            ? theme.palette.primary.dark
                            : theme.palette.background.paper,
                        color:
                          message.type === 'user'
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                        borderRadius: 2,
                        whiteSpace: 'pre-line',
                        position: 'relative',
                        border:
                          message.type === 'user'
                            ? 'none'
                            : `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {message.text}
                      </Typography>

                      {/* suggestions de navigation éventuelles */}
                      {message.suggestions &&
                        Array.isArray(message.suggestions) &&
                        message.suggestions.length > 0 && (
                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.5
                            }}
                          >
                            {message.suggestions.includes('automations') && (
                              <Chip
                                label="Voir les automatisations n8n"
                                size="small"
                                onClick={() => navigate(ROUTE_AUTOMATIONS)}
                                sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
                              />
                            )}
                            {message.suggestions.includes('blog') && (
                              <Chip
                                label="Voir les articles du blog"
                                size="small"
                                onClick={() => navigate(ROUTE_BLOG)}
                                sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
                              />
                            )}
                            {message.suggestions.includes('cv') && (
                              <Chip
                                label="Ouvrir le CV de Dervilon"
                                size="small"
                                onClick={() =>
                                  window.open(CV_DOWNLOAD_URL, '_blank', 'noopener,noreferrer')
                                }
                                sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
                              />
                            )}
                          </Box>
                        )}

                      {/* heure + bouton lire */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 0.5
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={(theme) => ({
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color:
                              theme.palette.mode === 'dark'
                                ? 'rgba(148,163,184,0.95)'
                                : 'rgba(107,114,128,0.95)'
                          })}
                        >
                          {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        {message.type === 'bot' && (
                          <Tooltip
                            title={
                              !voiceEnabled
                                ? "Active d'abord la voix pour utiliser la lecture audio"
                                : isSpeaking
                                ? 'Lecture en cours… clique sur stop pour arrêter'
                                : 'Lire ce message'
                            }
                          >
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (!voiceEnabled) return;
                                  if (isSpeaking) {
                                    stopSpeaking();
                                  } else {
                                    handleSpeakMessage(message.text);
                                  }
                                }}
                                aria-label={
                                  isSpeaking
                                    ? 'Arrêter la lecture du message'
                                    : 'Lire ce message'
                                }
                                disabled={!voiceEnabled || isSpeaking}
                                sx={{
                                  ml: 1,
                                  p: 0.5,
                                  color: theme.palette.primary.dark,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.dark, 0.08)
                                  },
                                  '&:focus-visible': {
                                    boxShadow: 'var(--focus-ring)'
                                  },
                                  '&.Mui-disabled': {
                                    color: alpha(theme.palette.primary.dark, 0.35)
                                  }
                                }}
                              >
                                {isSpeaking ? (
                                  <Stop
                                    sx={{ fontSize: 14 }}
                                    aria-hidden="true"
                                    focusable="false"
                                  />
                                ) : (
                                  <PlayArrow
                                    sx={{ fontSize: 14 }}
                                    aria-hidden="true"
                                    focusable="false"
                                  />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    </Paper>
                    {message.type === 'user' && (
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.success.main,
                          width: 32,
                          height: 32
                        }}
                      >
                        <Person sx={{ fontSize: 18 }} aria-hidden="true" focusable="false" />
                      </Avatar>
                    )}
                  </Box>
                ) : (
                  <Fade in appear timeout={220}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          message.type === 'user' ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-start',
                        gap: 1
                      }}
                      aria-label={`${
                        message.type === 'user' ? 'Vous' : 'Assistant'
                      } — ${message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`}
                    >
                      {message.type === 'bot' && (
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.dark,
                            width: 32,
                            height: 32
                          }}
                        >
                          <SmartToy
                            sx={{ fontSize: 18 }}
                            aria-hidden="true"
                            focusable="false"
                          />
                        </Avatar>
                      )}
                      <Paper
                        sx={{
                          p: 1.5,
                          maxWidth: '80%',
                          bgcolor:
                            message.type === 'user'
                              ? theme.palette.primary.dark
                              : theme.palette.background.paper,
                          color:
                            message.type === 'user'
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                          borderRadius: 2,
                          whiteSpace: 'pre-line',
                          position: 'relative',
                          border:
                            message.type === 'user'
                              ? 'none'
                              : `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {message.text}
                        </Typography>

                        {message.suggestions &&
                          Array.isArray(message.suggestions) &&
                          message.suggestions.length > 0 && (
                            <Box
                              sx={{
                                mt: 1,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5
                              }}
                            >
                              {message.suggestions.includes('automations') && (
                                <Chip
                                  label="Voir les automatisations n8n"
                                  size="small"
                                  onClick={() => navigate(ROUTE_AUTOMATIONS)}
                                  sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
                                />
                              )}
                              {message.suggestions.includes('blog') && (
                                <Chip
                                  label="Voir les articles du blog"
                                  size="small"
                                  onClick={() => navigate(ROUTE_BLOG)}
                                  sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
                                />
                              )}
                              {message.suggestions.includes('cv') && (
                                <Chip
                                  label="Ouvrir le CV de Dervilon"
                                  size="small"
                                  onClick={() =>
                                    window.open(CV_DOWNLOAD_URL, '_blank', 'noopener,noreferrer')
                                  }
                                  sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
                                />
                              )}
                            </Box>
                          )}

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 0.5
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={(theme) => ({
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              color:
                                theme.palette.mode === 'dark'
                                  ? 'rgba(148,163,184,0.95)'
                                  : 'rgba(107,114,128,0.95)'
                            })}
                          >
                            {message.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          {message.type === 'bot' && (
                            <Tooltip
                              title={
                                !voiceEnabled
                                  ? "Active d'abord la voix pour utiliser la lecture audio"
                                  : isSpeaking
                                  ? 'Lecture en cours… clique sur stop pour arrêter'
                                  : 'Lire ce message'
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    if (!voiceEnabled) return;
                                    if (isSpeaking) {
                                      stopSpeaking();
                                    } else {
                                      handleSpeakMessage(message.text);
                                    }
                                  }}
                                  aria-label={
                                    isSpeaking
                                      ? 'Arrêter la lecture du message'
                                      : 'Lire ce message'
                                  }
                                  disabled={!voiceEnabled || isSpeaking}
                                  sx={{
                                    ml: 1,
                                    p: 0.5,
                                    color: theme.palette.primary.dark,
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.primary.dark, 0.08)
                                    },
                                    '&:focus-visible': {
                                      boxShadow: 'var(--focus-ring)'
                                    },
                                    '&.Mui-disabled': {
                                      color: alpha(theme.palette.primary.dark, 0.35)
                                    }
                                  }}
                                >
                                  {isSpeaking ? (
                                    <Stop
                                      sx={{ fontSize: 14 }}
                                      aria-hidden="true"
                                      focusable="false"
                                    />
                                  ) : (
                                    <PlayArrow
                                      sx={{ fontSize: 14 }}
                                      aria-hidden="true"
                                      focusable="false"
                                    />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Box>
                      </Paper>
                      {message.type === 'user' && (
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.success.main,
                            width: 32,
                            height: 32
                          }}
                        >
                          <Person sx={{ fontSize: 18 }} aria-hidden="true" focusable="false" />
                        </Avatar>
                      )}
                    </Box>
                  </Fade>
                )}
              </Box>
            ))}

            {/* Indicateur "l'IA réfléchit" */}
            {isTyping && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    width: 32,
                    height: 32
                  }}
                >
                  <SmartToy sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    borderRadius: 2
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      alignItems: 'center'
                    }}
                  >
                    <CircularProgress size={8} />
                    <Typography
                      variant="caption"
                      sx={{ ml: 1 }}
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      L&apos;IA réfléchit…
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* erreurs éventuelles */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Suggestions de départ */}
          {messages.length === 1 && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'white',
                borderTop: '1px solid #e0e0e0'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1
                }}
              >
                <TipsAndUpdates
                  sx={{
                    fontSize: 18,
                    color: 'primary.main'
                  }}
                  aria-hidden="true"
                  focusable="false"
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    color: '#0f172a'
                  }}
                >
                  Questions suggérées :
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5
                }}
              >
                {suggestedQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    size="small"
                    onClick={() => handleSuggestedQuestion(question)}
                    aria-label={`Question suggérée: ${question}`}
                    sx={(theme) => ({
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      borderRadius: 999,
                      px: 1.4,
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.primary.main, 0.18)
                          : alpha(theme.palette.primary.main, 0.08),
                      color: '#0f172a',
                      '& .MuiChip-label': {
                        py: 0.4
                      },
                      '&:hover': {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText
                      }
                    })}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Zone input */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'white',
              borderTop: '1px solid #e0e0e0'
            }}
          >
            {chatbotLimitReached && !isAdmin && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mb: 0.5, display: 'block' }}
              >
                Limite quotidienne d&apos;utilisation atteinte ({CHATBOT_DAILY_LIMIT}{' '}
                messages).
              </Typography>
            )}

            <Typography
              variant="caption"
              sx={{
                mb: 1,
                display: 'block',
                fontWeight: 500,
                color: '#0f172a'
              }}
            >
              {isAdmin ? (
                "Mode admin : aucune limite d'utilisation aujourd'hui."
              ) : (
                <>
                  Messages IA aujourd&apos;hui :{' '}
                  {Math.min(chatbotUsageCount, CHATBOT_DAILY_LIMIT)}/{CHATBOT_DAILY_LIMIT}
                </>
              )}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}
            >
              {/* bouton micro */}
              <Tooltip
                title={
                  isListening
                    ? "Arrêter l'écoute"
                    : 'Activer la reconnaissance vocale'
                }
              >
                <span>
                  <IconButton
                    onClick={() => {
                      if (!chatbotLimitReached || isAdmin) {
                        toggleListening();
                      }
                    }}
                    aria-label={
                      isListening ? "Arrêter l'écoute" : 'Activer la reconnaissance vocale'
                    }
                    sx={{
                      color: isListening ? 'error.main' : 'primary.main',
                      '&:disabled': {
                        color: 'grey.400'
                      },
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: isListening
                          ? theme.palette.error.main
                          : theme.palette.primary.dark
                      }
                    }}
                  >
                    {isListening ? (
                      <MicOff aria-hidden="true" focusable="false" />
                    ) : (
                      <Mic aria-hidden="true" focusable="false" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>

              {/* champ texte */}
              <TextField
                fullWidth
                size="small"
                placeholder={isListening ? '🎤 En écoute...' : 'Posez votre question...'}
                aria-label="Champ de saisie du message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!chatbotLimitReached || isAdmin) {
                      handleSend();
                    } else {
                      setError("Limite quotidienne d'utilisation de l'IA atteinte.");
                    }
                  }
                }}
                disabled={isListening || (chatbotLimitReached && !isAdmin)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 50,
                    color: '#0f172a',
                    backgroundColor: 'rgba(15,23,42,0.02)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(148,163,184,0.6)'
                          : 'rgba(148,163,184,0.55)',
                      borderWidth: 1
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(209,213,219,0.95)'
                          : theme.palette.primary.main
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(15,23,42,0.6)',
                      opacity: 1
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: (theme) => theme.palette.primary.main,
                      borderWidth: 2
                    }
                  }
                }}
              />

              {/* bouton send */}
              <IconButton
                color="primary"
                onClick={() => {
                  if (!chatbotLimitReached || isAdmin) {
                    handleSend();
                  } else {
                    setError("Limite quotidienne d'utilisation de l'IA atteinte.");
                  }
                }}
                aria-label="Envoyer le message"
                disabled={
                  !input.trim() || isListening || isTyping || (chatbotLimitReached && !isAdmin)
                }
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300'
                  },
                  '&:focus-visible': {
                    boxShadow: 'var(--focus-ring)'
                  }
                }}
              >
                <Send aria-hidden="true" focusable="false" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default ChatbotIA;