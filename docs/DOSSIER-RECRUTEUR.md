# Dossier recruteur — D. Mk

**Lecture : environ 2 minutes · Revue du 31 octobre 2026**

## Profil et proposition de valeur

Je m'intéresse aux rôles de **chef de projet digital, Product Owner et chef de projet IA**, à la croisée de l'analyse du besoin, de l'organisation métier et de la mise en œuvre technique.

Ma démarche consiste à transformer une situation métier ambiguë en parcours structuré : comprendre qui fait quoi, avec quelles données, identifier les validations indispensables et rendre le résultat testable.

## Une vitrine unique

L’accueil présente **trois projets sélectionnés** : HelpDesk Flow, BudgetFlow et PRISME. La page **Projets** rassemble les sept réalisations dans **une grille unique**, sans sous-section « Autres réalisations ». La page **Preuves** fournit pour chacun des sept projets un document ou un résultat de vérification, en distinguant ce qui a réellement été testé.

## Trois démonstrations complémentaires

| Produit | Ce qu'il résout | Ce qu'il faut regarder |
|---|---|---|
| [Workflow Architect](https://workflow-architect-flax.vercel.app/) | Une demande d'automatisation formulée en langage naturel | Flux n8n, modules, guide d'installation, gestion honnête des limites Make |
| [OPS COMMAND Studio](https://ops-command-studio-kdkongodervilons-projects.vercel.app/) | La coordination d'opérations et de processus d'entreprise | Interface de connexion, structure des espaces, workflows et rôles ; démonstration approfondie soumise à authentification |
| [Portfolio D. Mk](https://portfolio-d-mk.vercel.app/portfolio/#/projects) | L'accès rapide aux réalisations et aux preuves | Cartes projets, captures, navigation et lisibilité responsive |

## Ce que je peux justifier techniquement

- **Analyse fonctionnelle** : déclencheurs, étapes, contraintes, garde-fous et guides pour des utilisateurs non développeurs.
- **IA intégrée sans exposer les secrets côté navigateur** : requête via une API serveur, fournisseur actuel Cloudflare Workers AI.
- **Automatisation pragmatique** : générateur n8n structuré ; distinction entre JSON généré et workflow réellement importé/activé.
- **Qualité** : tests de navigateur, validation d'exports, vérification mobile/ordinateur, gestion d'erreurs.
- **Traçabilité** : copies identifiées de sources publiques, documentation datée et surveillance automatisée d'un écart avec les versions en ligne.

## Preuves de test, pas promesses

Le 30 octobre 2026, un scénario n8n a été généré dans un navigateur réel avec un JSON téléchargé et un guide Markdown. Sur Make, l'application refuse de livrer un blueprint lorsqu'une étape essentielle serait manquante. Les deux nouvelles cartes du portfolio étaient uniques, illustrées et sans débordement sur écrans de 1440 et 390 px.

Ces contrôles **ne prouvent pas** l'importation sur de vrais comptes n8n/Make, la sécurité complète d'un environnement métier ou la fiabilité d'intégrations externes. La documentation distingue précisément ces frontières.

## Pour poursuivre

- [Architecture et flux](ARCHITECTURE.md)
- [Recette et statut de vérification](QUALITE-ET-TESTS.md)
- [Sécurité et limites de publication](SECURITE-ET-CONFIDENTIALITE.md)
- [Code client Workflow Architect](../showcase/workflow-architect/workflow-architect-ai.js)
- [Code client OPS COMMAND](../showcase/ops-command-studio/app.js)
- [Guide de synchronisation des preuves](MAINTENANCE.md)

**Une réalisation crédible doit pouvoir être expliquée, testée et remise en question.**


**Actualisation du 31 octobre 2026 :** les sept projets sont regroupés dans une seule grille et la page Preuves contient sept accès directs aux documents ou tests pertinents.
