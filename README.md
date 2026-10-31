# D. Mk — Portfolio produit, automatisation et IA

**Chef de projet digital · Product Owner · Automatisation & IA appliquée**

> Une démonstration vaut mieux qu'une promesse : produits accessibles, décisions expliquées, code client inspectable et limites de validation affichées.

[![Portfolio](https://img.shields.io/badge/Portfolio-voir%20les%20projets-126b55?style=flat-square)](https://portfolio-d-mk.vercel.app/portfolio/#/projects)
[![Workflow Architect](https://img.shields.io/badge/Workflow%20Architect-d%C3%A9mo-127b76?style=flat-square)](https://workflow-architect-flax.vercel.app/)
[![OPS COMMAND](https://img.shields.io/badge/OPS%20COMMAND-d%C3%A9mo-254852?style=flat-square)](https://ops-command-studio-kdkongodervilons-projects.vercel.app/)
[![Vérification des preuves](https://github.com/KD-Kongo-Dervilon/portfolio-kd-frontend/actions/workflows/showcase-quality.yml/badge.svg)](https://github.com/KD-Kongo-Dervilon/portfolio-kd-frontend/actions/workflows/showcase-quality.yml)

**Dernière revue du dossier : 31 octobre 2026.** Ce dépôt présente le portfolio actuel, conserve son historique React et réunit des instantanés vérifiables des interfaces publiques. Il n'est **pas** le dépôt de déploiement du site D. Mk : les applications Vercel actuelles sont déployées séparément.

## En deux minutes : mes réalisations

| Réalisation | Besoin métier | Ce que je démontre | Démo / preuves |
| --- | --- | --- | --- |
| **Workflow Architect** | Transformer une demande métier en projet d'automatisation | Cadrage, découpage IA, génération JSON n8n, transparence sur les limites Make | [Démo](https://workflow-architect-flax.vercel.app/) · [Dossier](docs/projets/WORKFLOW-ARCHITECT.md) |
| **OPS COMMAND Studio** | Suivre des processus, responsabilités et exécutions d'entreprise | Modélisation de workflows, rôles, validations, traçabilité, interface produit | [Démo](https://ops-command-studio-kdkongodervilons-projects.vercel.app/) · [Dossier](docs/projets/OPS-COMMAND-STUDIO.md) |
| **D. Mk — Portfolio** | Donner à un recruteur des preuves navigables | Architecture de l'information, présentation de projets, responsive, recette | [Portfolio](https://portfolio-d-mk.vercel.app/portfolio/#/projects) · [Dossier](docs/projets/PORTFOLIO-DMK.md) |
| **Portfolio React historique** | Mon précédent travail frontend et IA | Évolution du parcours technique, React, composants, interface | [Code historique](src/) · [Documentation d'origine](docs/archives/README-REACT-2026.md) |

### Deux interfaces visibles

**Parcours de découverte :** seulement **HelpDesk Flow, BudgetFlow et PRISME** sont présentés en accueil. La page Projets regroupe ces trois projets et les quatre autres réalisations (OPS COMMAND Studio, Workflow Architect, HitDNA, D.k Academy), avec des cartes uniformisées. [Voir la recette du 31 octobre](docs/projets/PORTFOLIO-DMK.md).


| Workflow Architect | OPS COMMAND Studio |
| --- | --- |
| ![Capture de Workflow Architect](https://dmk-portfolio-ui-20261031-26c08dst2-kdkongodervilons-projects.vercel.app/workflow-current-20261031.jpg) | ![Capture d'OPS COMMAND Studio](https://portfolio-d-mk.vercel.app/portfolio/assets/screens/ops-command-capture-v4.jpg) |

*Captures réelles des applications publiques, dont Workflow Architect avec Cloudflare Workers AI. Contrôle des cartes le 31/10/2026 sur ordinateur, tablette et mobile.*

## Méthode de travail

1. **Comprendre le besoin** : déclencheur, données, acteurs, règles et résultat attendu.
2. **Modéliser** : étapes, dépendances, permissions et cas d'erreur.
3. **Construire** : interface utilisable, intégrations authentifiées et code organisé.
4. **Recetter** : cas nominaux, cas bloquants, contrôle d'accès, mobile et fichiers livrés.
5. **Rendre vérifiable** : expliquer ce qui marche, ce qui reste à configurer et fournir des preuves.

## Ce qui est réellement vérifié

- **Cloudflare Workers AI** : un appel réel a généré un plan structuré via le service du portfolio.
- **n8n** : génération dans le navigateur et téléchargement du fichier JSON et de son guide ; liens internes validés ; workflow exporté **inactif**.
- **Make** : blueprint de base disponible pour certains scénarios simples ; **refus explicite** de produire un export lorsque des contrôles métier, filtres ou approbations seraient perdus.
- **Portfolio** : cartes OPS COMMAND et Workflow Architect uniques, images chargées, aucun débordement horizontal sur les résolutions 1440 px et 390 px.
- **Limite importante** : aucun import réel dans un compte n8n ou Make tiers n'a été certifié ; il ne serait pas correct de le prétendre.

[Lire la recette détaillée](docs/QUALITE-ET-TESTS.md) · [Lire l'architecture](docs/ARCHITECTURE.md)

## Documentation au même niveau pour tous les projets

Le [centre documentaire du portfolio](https://portfolio-d-mk.vercel.app/portfolio/#/docs) présente désormais PRISME, OPS COMMAND Studio et Workflow Architect selon le **même modèle de fiche** que HelpDesk Flow et BudgetFlow. Chaque nouveau projet comprend 11 documents de cadrage et de vérification. Leurs [33 sources Markdown](docs/catalogue/projects) sont consultables dans GitHub ; elles distinguent soigneusement ce qui est testé de ce qui reste à certifier.

## Repères pour naviguer dans ce dépôt

```text
README.md                               ← présentation orientée recrutement
docs/
  DOSSIER-RECRUTEUR.md                 ← synthèse en 2 minutes
  ARCHITECTURE.md                      ← frontières frontend/backend
  QUALITE-ET-TESTS.md                  ← preuves et limites de validation
  SECURITE-ET-CONFIDENTIALITE.md       ← ce qui peut / ne peut pas être publié
  MAINTENANCE.md                       ← procédure de mise à jour
  projets/                             ← étude de chaque produit
  archives/                            ← présentation de l'ancien portfolio
showcase/
  workflow-architect/                  ← instantané du frontend public
  ops-command-studio/                  ← instantané du frontend public
  portfolio/                           ← code des cartes projets
  manifest.json                        ← URL source de chaque fichier
scripts/verify-showcase.mjs            ← tests reproductibles
.github/workflows/showcase-quality.yml ← tests et détection de dérive
src/, public/                           ← application React historique conservée
```

### Vérifier les preuves

Prérequis : **Node.js 22+**. Aucun token, base privée ou installation npm n'est nécessaire.

```bash
node scripts/verify-showcase.mjs
node scripts/verify-showcase.mjs --live
```

La première commande teste localement les sources et les exports. La seconde compare les fichiers clients publics aux versions actuellement servies par Vercel ; elle **signale** les écarts mais ne modifie ni GitHub ni Vercel. Une vérification GitHub Actions est programmée chaque jour.

### Démarrer l'ancien portfolio React

```bash
npm ci
npm start
```

Cette commande lance la version **historique** conservée dans ce dépôt, **pas** le portfolio D. Mk publié aujourd'hui. Éviter cette confusion fait partie de la traçabilité recherchée.

## Transparence et confidentialité

- Les sources dans `showcase/` sont des **copies du frontend public** au 30/10/2026, pas des dépôts backend complets ni une liaison automatique de déploiement.
- L'API Cloudflare et les services métiers authentifiés sont hébergés séparément. Leurs clés secrètes ne figurent pas ici.
- Une clé Supabase **publishable**, présente dans le JavaScript livré publiquement aux navigateurs, n'est pas une clé `service_role` : les protections doivent être assurées côté serveur, par les permissions et les règles de base de données.
- Les exports doivent être configurés et essayés sur les plateformes cibles avant activation.

[Consulter la politique de publication](docs/SECURITE-ET-CONFIDENTIALITE.md)

---

**Consulter les applications :** [D. Mk](https://portfolio-d-mk.vercel.app/portfolio/) · [Workflow Architect](https://workflow-architect-flax.vercel.app/) · [OPS COMMAND](https://ops-command-studio-kdkongodervilons-projects.vercel.app/)

*Dossier technique maintenu pour permettre la lecture rapide, la vérification et la discussion des choix produit avec un recruteur ou une équipe technique.*


## Catalogue unifié — 31 octobre 2026

L’accueil conserve trois projets sélectionnés ; la page Projets réunit les **sept réalisations dans une seule grille**, sans séparation « Autres réalisations ». La page Preuves propose sept entrées documentées avec limites vérifiables.
