// src/hooks/useServiceWorker.js
import { useEffect, useState } from 'react';

export const useServiceWorker = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      setRegistration(reg);
      setIsInstalled(true);

      // Écouter les mises à jour
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nouvelle version disponible
            setUpdateAvailable(true);
            console.log('[SW] Mise à jour disponible');
          }
        });
      });

      // Check périodiquement pour les updates (toutes les 60min)
      setInterval(() => {
        reg.update();
      }, 60 * 60 * 1000);

      console.log('[SW] Service Worker enregistré avec succès');
    } catch (error) {
      console.error('[SW] Erreur d\'enregistrement:', error);
    }
  };

  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Demander au SW en attente de prendre le contrôle
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Recharger la page après activation
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  return { isInstalled, updateAvailable, updateServiceWorker };
};