# 🚀 Portfolio KD Dervilon – Produit IA • Product Management • Automatisation

Bienvenue dans le **produit IA personnel** de  
**KD Dervilon (Dervilon Mbissi)** – Chef de Projet IA & Product Owner (CSPO).

Ce n’est pas un simple portfolio.  
C’est un **produit complet**, conçu comme le MVP d’une plateforme IA moderne :  
👉 multi‑agents  
👉 orientée valeur  
👉 pensée pour démontrer immédiatement mes compétences en **IA appliquée, Product Management et automatisation n8n**.

🎯 **Objectif : donner à un recruteur une preuve directe de ce que je sais livrer.**

- Architecture claire et scalable  
- UX propre et moderne (Material UI “iOS 2026”)  
- IA générative (GPT‑4o‑mini) au cœur des fonctionnalités  
- Agents IA spécialisés orchestrés par le backend  
- Automatisations business (n8n)  
- Analytics réels pour mesurer l’utilisation  
- Déploiement cloud (Vercel + Render)

En quelques secondes, vous pouvez voir comment je conçois, structure et déploie un produit IA **du cadrage → à la production**.

Frontend déployé sur **Vercel** :  
👉 https://portfolio-kd-frontend.vercel.app  
Backend connecté (Render) :  
👉 https://portfolio-kd-backend.onrender.com

---

# ✨ Fonctionnalités principales

## 🤖 Chatbot IA contextuel  
Assistant virtuel connecté au backend :
- Connaît ton parcours, CV, KPIs et projets
- Réponses naturelles & contextualisées
- Basé sur OpenAI GPT‑4o‑mini

---

## 🎮 Quiz IA interactif (multi‑modes)  
Module gamifié orienté UX :
- Modèles : **MCQ**, **Drag & Drop**, **Reorder**, **Swipe**
- Génération dynamique via IA (QCM JSON strict)
- Validation + fallback automatique
- Loader animé + UX premium
- Quota IA **3/jour**, illimité pour admin
- Résultats partageables LinkedIn
- **Lazy‑load dédié** → performance optimisée sur Vercel

---

## 🧷 Services IA & Automatisation (n8n)  
Section orientée Product & business :
- Scénarios : CRM, onboarding, contenus IA, agents autonomes
- Explication pédagogique accessible
- Zone Q/R via API backend

---

## 📝 Blog IA & Product  
- Page Blog + pages Article
- Contenus orientés IA, ROI, Product Management & pédagogie

---

## 📈 Analytics maison  
Tracking interne :
- Clics, interactions, scroll, pages visitées
- Sessions utilisateur
- Compatible RGPD (CookieConsent)

---

## 🛡️ Espace Admin  
- Page `/admin` (protégée par JWT)
- Accès :
  - Stats IA (Quiz + Chatbot)
  - Q/R communautaires
  - Analytics agrégés

---

## 🍪 Consentement RGPD  
- Bannière CookieConsent
- Analytics activé seulement après accord
- Compatible déploiement Vercel/Browser

---

## 📱 UX moderne + PWA  
- UI **Material UI** style “iOS 2026”
- Animations fluides
- `manifest.json` + `service-worker.js`
- Optimisé pour le SEO

---

# 🧱 Stack technique

- **React 18**
- **React Router**
- **Material UI v5**
- **React Helmet Async**
- **Lazy loading** (Quiz IA, pages lourdes)
- **PWA** (Service Worker + Manifest)
- **Analytics custom**
- Déployé via **Vercel**

---

# 🗂️ Architecture du frontend

```
frontend/
│
├── public/                      # Fichiers statiques & manifest
│
└── src/
    ├── api/                     # Appels API (vers backend Render)
    │
    ├── components/              # Composants UI réutilisables
    │   ├── ChatbotIA.jsx
    │   ├── ExpertiseQuiz.jsx         # Lazy-loaded
    │   ├── CookieConsent.jsx
    │   ├── SmartCTA.jsx
    │   ├── SEO.jsx
    │   └── ...
    │
    ├── config/                  # Constantes globales / URLs API
    │
    ├── data/                    # Données statiques
    │
    ├── hooks/                   # Custom hooks (API, UX, analytics)
    │
    ├── pages/                   # Pages principales
    │   ├── AdminDashboard.jsx
    │   ├── Blog.jsx
    │   ├── BlogArticle.jsx
    │   ├── Portfolio.jsx
    │   ├── About.jsx
    │   └── Contact.jsx
    │
    ├── services/                # Analytics, session
    │   ├── analytics.js
    │   └── session.js
    │
    ├── utils/                   # Helpers génériques
    │
    ├── App.jsx                  # Root React
    ├── theme.js                 # Thème MUI
    ├── index.js                 # Entrée principale
    └── index.css                # Styles globaux
```

---

# 🌐 Déploiement sur Vercel

Ton frontend est déployé via **Vercel** pour bénéficier de :

- Build ultra‑rapide  
- CDN global  
- HTTPS automatique  
- CI/CD GitHub automatique  
- Optimisations React et bundling intelligents

### ⚙️ Build command  
```
npm run build
```

### 📦 Output directory  
```
build/
```

### 🔗 API backend déclarée dans `src/config` :
```
https://portfolio-kd-backend.onrender.com
```

---

# 🔧 Prérequis

- **Node.js ≥ 18**
- **npm**
- Backend API disponible sur Render :
  - https://portfolio-kd-backend.onrender.com

---

# 🚀 Installation & lancement local

```bash
git clone https://github.com/KD-Kongo-Dervilon/portfolio-kd-frontend.git
cd portfolio-kd-frontend

npm install
npm start
```

Frontend local :  
➡️ http://localhost:3000

---

# 🌍 Production

Build optimisé :

```bash
npm run build
```

Déploiement recommandé : **Vercel**

---

# 🎯 Objectif du projet

Ce portfolio illustre :
- Expertise IA & LLM (Chatbot, Quiz IA)
- Vision Product (UX, flows, KPI, ROI)
- Architecture frontend/back moderne
- Automatisation n8n
- Maîtrise de React avancé & design MUI

➡️ **Un produit IA complet, idéal pour recruteurs, entreprises et investisseurs.**