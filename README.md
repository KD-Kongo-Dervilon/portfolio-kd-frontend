# Portfolio KD Dervilon – Chef de Projet IA & Product Owner

Portfolio professionnel de **Dervilon Mbissi (KD Dervilon)**, Chef de Projet IA & Product Owner (CSPO), spécialisé en :

- 🤖 IA générative & LLM (OpenAI, Claude…)
- 🔗 Automatisation de workflows avec **n8n**
- 🧩 Conception de produits pédagogiques & serious games
- 🧠 Agents IA, RAG, Q/R intelligentes

Ce dépôt contient **le frontend React** du portfolio.  
Il consomme un **backend Node.js** séparé (API IA, Q/R, admin, etc.).

---

## ✨ Fonctionnalités principales (frontend)

- 🤖 **Chatbot IA personnalisé**
  - Questions/réponses sur mon profil, mes projets, mes compétences
  - Connecté à une API IA (backend)

- 🧷 **Automatisation IA & n8n**
  - Page dédiée à mes services d’automatisation
  - Explication des scénarios n8n (CRM, onboarding, contenus, etc.)
  - Formulaire / section Q/R pour échanger sur les besoins

- 📰 **Blog**
  - Liste d’articles (page `Blog`)
  - Page article détaillée (`BlogArticle`) pour présenter :
    - retours d’expérience,
    - cas d’usage IA,
    - pédagogie & innovation.

- 📈 **Analytics & tracking**
  - Suivi basique du comportement utilisateur (pages visitées, clics…)
  - Logiciel maison dans `src/utils/analytics.js`
  - Prévu pour alimenter un **Dashboard Admin**

- 🛡️ **Dashboard Admin (frontend)**
  - Page `/admin` dédiée
  - Login admin (mail + mot de passe, via backend)
  - Vue d’ensemble des stats (tracking, Q/R, interactions)

- 🍪 **Bannière RGPD & cookies**
  - Composant `CookieConsent` pour gérer le consentement
  - Intégration avec le système d’analytics

- 🧑‍💻 **UX moderne & PWA**
  - Design basé sur **Material UI (MUI)**
  - Thème personnalisé dans `src/theme.js`
  - Manifest & Service Worker pour support PWA
  - SEO côté frontend via `src/components/SEO.jsx`

---

## 🧱 Stack technique

- **React 18**
- **React Router** (navigation SPA)
- **Material UI (MUI)** pour le design system
- **React Helmet Async** pour les metas SEO
- **Service Worker + Manifest** pour la PWA
- Gestion d’analytics maison (localStorage / sessionStorage)

---

## ✅ Prérequis

- **Node.js** ≥ 18
- **npm** (ou yarn)
- Un backend Node.js (API) qui tourne sur :
  - `http://localhost:3001` en développement (par défaut)
  - une URL publique en production (ex : `https://api.kd-dervilon.com`)

---

## 🚀 Installation & lancement (frontend)

```bash
# Cloner le projet
git clone https://github.com/KD-Kongo-Dervilon/portfolio-kd-frontend.git
cd portfolio-kd-frontend

# Installer les dépendances
npm install

# Lancer en développement
npm start