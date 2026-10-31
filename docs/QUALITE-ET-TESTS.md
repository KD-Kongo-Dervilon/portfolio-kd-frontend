# Assurance qualité — journal de recette

**Date : 30 octobre 2026**  
**Environnement : déploiements Vercel publics, navigateur Chromium headless, API réelle.**

## Matrice de vérification

| ID | Périmètre | Scénario de contrôle | Observation | Statut |
| --- | --- | --- | --- | --- |
| IA-01 | Cloudflare Workers AI | Demande de gestion des devis envoyée au service du portfolio | HTTP 200, modèle Cloudflare Workers AI, 5 étapes | **Réussi** |
| IA-02 | Workflow Architect | Génération depuis le navigateur, relais API interne | Plan renvoyé et visible | **Réussi** |
| N8N-01 | n8n | Export d'un scénario de test | Fichier `.json` et guide `.md` réellement téléchargés | **Réussi** |
| N8N-02 | n8n | Validation locale de l'export | 5 nœuds, 4 connexions dans un contrôle ; IDs uniques, `active:false` | **Réussi localement** |
| MAKE-01 | Make | Scénario avec validations / filtres / transformations | Export incomplet refusé, boutons de téléchargement/copie désactivés | **Protection active** |
| MAKE-02 | Make | Scénario HTTP simple | Blueprint de base, JSON parseable et IDs uniques | **Structure seulement** |
| UI-01 | Portfolio | Desktop 1440 px : cartes projets et captures | 1 occurrence de chaque carte, images chargées, aucun overflow | **Réussi** |
| UI-02 | Portfolio | Mobile 390 px : cartes projets et captures | 1 occurrence de chaque carte, images chargées, aucun overflow | **Réussi** |
| UI-03 | Workflow Architect | Desktop 1440 px et mobile 390 px | Interface visible et largeur de contenu maîtrisée | **Réussi** |
| ACCESS-01 | Démos Vercel | Ouverture des deux applications sans compte Vercel | HTTP 200, HTML de l'application accessible | **Réussi** |

## Contrôles non réalisés — ne pas les présenter comme réussis

- **Import du JSON dans n8n et Make** : non certifié sur des comptes réels.
- **Automatisation Make complexe** : interdite à l'export lorsque la structure ne représente pas toutes les opérations.
- **Connexions tiers** : OAuth Gmail/Sheets, CRM, SMTP et autres intégrations non validées sur compte test.
- **OPS COMMAND** : rôles, isolation des organisations et journaux métier non audités de bout en bout.
- **Tests de sécurité complets** : penetration test, RLS Supabase, montée en charge et gestion des incidents non effectués.
- **Tous les écrans** : la recette responsive couvre deux résolutions explicitement listées, pas tous les appareils.

## Reproduire les vérifications de code

```bash
node scripts/verify-showcase.mjs
```

La commande teste syntaxe, intégrité des exports n8n et comportement protecteur de Make avec des cas fictifs. Elle **n'appelle pas** Cloudflare et ne consomme pas de crédits IA.

Pour comparer les copies de fichiers clients à la production :

```bash
node scripts/verify-showcase.mjs --live
```

Cette commande effectue uniquement des requêtes GET publiques. Une divergence signale qu'il faut contrôler, tester puis resynchroniser le snapshot.

## Doctrine de recette

Un fichier généré n'est **pas** une automatisation validée. Avant de déclarer une intégration fonctionnelle : importer sur la plateforme, relier un compte test, inspecter chaque module, vérifier conditions, droits, doublons et reprises, puis activer seulement avec une procédure de retour arrière.

[Workflow Architect](projets/WORKFLOW-ARCHITECT.md) · [OPS COMMAND](projets/OPS-COMMAND-STUDIO.md)


## Recette complémentaire — 31 octobre 2026

Revue réalisée à partir du dernier déploiement **READY** du projet Vercel \`dmk-portfolio\`, sans remplacement du backend ou des autres applications.

- **Accueil** : trois cartes précisément, dans l'ordre HelpDesk Flow, BudgetFlow, PRISME.
- **Catalogue** : sept projets dans une grille unique, sans rubrique secondaire, avec le même niveau de présentation pour HitDNA, D.k Academy, Workflow Architect et OPS COMMAND Studio.
- **PRISME et autres cartes** : cadres de captures unifiés, informations métier et liens préservés.
- **Documentation du site** : huit dossiers récents ajoutés au centre documentaire ; ancien guide GitHub corrigé, anciens documents d'architecture explicitement datés.
- **Écrans contrôlés** : 1440 × 900, 820 × 1080, 390 × 844.
- **Résultat** : pas de débordement horizontal ni d'erreur JavaScript détectés dans les parcours de contrôle.
- **Capture Workflow Architect** : remplacée par une capture de l'interface publique qui nomme réellement **Cloudflare Workers AI**.
- **Méthode de publication** : correction ciblée via une route Vercel pour \`/portfolio/project-ops.js\`, permettant de conserver le déploiement applicatif principal.

Ces vérifications ne couvrent pas toutes les routes du portfolio, les comptes Supabase, l'import réel Make/n8n ni l'ensemble des interactions clavier/lecteur d'écran.


## Recette de l'organisation unifiée

Vérifier un seul groupe de sept cartes sur la page Projets, sans doublons, les trois projets de l'accueil, les sept liens vérifiables de la page Preuves et l'absence de débordement sur mobile. Ces contrôles ne certifient pas les intégrations tierces ni les fonctions backend.
