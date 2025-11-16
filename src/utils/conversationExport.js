// Fonction d'export de conversation

export const exportConversation = (messages) => {
  const conversationText = messages.map(msg => {
    const time = msg.timestamp.toLocaleString('fr-FR');
    const sender = msg.type === 'bot' ? 'Assistant KD Dervilon' : 'Vous';
    return `[${time}] ${sender}:\n${msg.text}\n`;
  }).join('\n');

  const header = `===========================================
CONVERSATION AVEC L'ASSISTANT IA
Portfolio KD Dervilon - Chef de Projet IA & Product Owner
Date: ${new Date().toLocaleString('fr-FR')}
Session ID: ${sessionStorage.getItem('sessionId') || 'N/A'}
===========================================\n\n`;

  const footer = `\n===========================================
Pour me contacter:
Email: dervilon.mbissi@gmail.com
Téléphone: 06-36-15-88-31
LinkedIn: Dervilon
Portfolio: Portfolio Product_Owner

Merci de votre intérêt pour mon profil !
===========================================`;

  const fullText = header + conversationText + footer;

  // Créer et télécharger le fichier
  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `conversation-kd-dervilon-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportConversationJSON = (messages) => {
  const conversationData = {
    exportDate: new Date().toISOString(),
    sessionId: sessionStorage.getItem('sessionId'),
    totalMessages: messages.length,
    messages: messages.map(msg => ({
      type: msg.type,
      text: msg.text,
      timestamp: msg.timestamp.toISOString()
    })),
    contact: {
      email: 'dervilon.mbissi@gmail.com',
      phone: '06-36-15-88-31',
      linkedin: 'Dervilon'
    }
  };

  const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `conversation-kd-dervilon-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};