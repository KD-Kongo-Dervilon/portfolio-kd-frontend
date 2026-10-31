# Portfolio D. Mk — étude de projet

**Site publié :** https://portfolio-d-mk.vercel.app/portfolio/  
**Dernière recette de l’interface :** 31 octobre 2026 (desktop, tablette et mobile).  
**Démonstrations :** https://portfolio-d-mk.vercel.app/portfolio/#/projects

## Le problème résolu

Un recruteur doit pouvoir comprendre en quelques minutes la nature des projets, les décisions produit et les preuves, sans parcourir un catalogue désordonné.

La vitrine distingue uniquement trois aperçus à l’accueil et un catalogue complet de sept projets dans une grille unique :

| Emplacement | Projets | Rôle |
| --- | --- | --- |
| **Accueil — 3 projets sélectionnés** | HelpDesk Flow, BudgetFlow, PRISME | Offrir trois points d'entrée immédiats |
| **Page Projets — tous les projets** | HelpDesk Flow, PRISME, BudgetFlow, OPS COMMAND Studio, Workflow Architect, HitDNA, D.k Academy | Sept réalisations présentées dans une seule grille |

Le titre « Trois projets à découvrir » de l'accueil correspond désormais aux **trois cartes réellement affichées**. Les deux réalisations récentes ne sont plus injectées dans cette section.

## Cohérence visuelle

- Cadres de captures à **235 px de hauteur** dans les cartes et même traitement des légendes.
- Présentation harmonisée : **problème**, **contribution produit**, **choix de conception**, **état et limites**, **liens de preuve** et **compétences**.
- Suppression du bandeau PRISME redondant qui rompait l'équilibre de la page Projets ; PRISME conserve sa propre carte et sa documentation.
- Sur ordinateur : une grille unique de sept réalisations à trois colonnes, puis deux colonnes sur tablette et une seule sur mobile.
- Les nouvelles cartes renvoient vers une **étude de projet sur le portfolio**, la démonstration réelle et la documentation GitHub.

**Captures actuelles :** [Workflow Architect — Cloudflare Workers AI](https://dmk-portfolio-ui-20261031-26c08dst2-kdkongodervilons-projects.vercel.app/workflow-current-20261031.jpg) · [OPS COMMAND Studio](https://portfolio-d-mk.vercel.app/portfolio/assets/screens/ops-command-capture-v4.jpg)

## Technique : préserver la production existante

Le déploiement principal Vercel reste le projet **dmk-portfolio**. Sa route \`/portfolio/project-ops.js\` charge maintenant une couche frontend testée depuis le projet Vercel indépendant **dmk-portfolio-ui-20261031**.

Cela évite de republier ou d'écraser les fonctions API, la configuration IA et les autres applications. Le code actuellement chargé sur le site public est versionné dans [showcase/portfolio/project-ops.js](../../showcase/portfolio/project-ops.js).

**Cette architecture est une correction ciblée, pas encore un monorepo source de vérité intégral.** Le prochain chantier d'industrialisation sera de rattacher proprement la source principale Vercel à Git, avec tests de déploiement et procédure de restauration.

## Contrôles effectués le 31 octobre 2026

| Contrôle navigateur | 1440 px | 820 px | 390 px |
| --- | --- | --- | --- |
| Accueil : exactement 3 projets | Réussi | Réussi | Réussi |
| Projets : 7 cartes dans une même grille | Réussi | Réussi | Réussi |
| Les 7 captures affichées dans des cadres équivalents | Réussi | Réussi | Réussi |
| Documentation : 8 dossiers récents visibles | Réussi | Réussi | Réussi |
| Aucun débordement horizontal | Réussi | Réussi | Réussi |
| Aucune erreur JavaScript détectée pendant les parcours de contrôle | Réussi | Réussi | Réussi |

Les contrôles ne constituent pas un audit d'accessibilité exhaustif ni une certification des intégrations tierces.

[Qualité et tests](../QUALITE-ET-TESTS.md) · [Architecture](../ARCHITECTURE.md) · [GitHub et maintenance](../MAINTENANCE.md)


## Organisation corrigée — 31 octobre 2026

L'accueil conserve trois projets. Sur la page Projets, les sept réalisations sont désormais **dans une seule grille**, sans sous-section « Autres réalisations ». Les sept cartes utilisent les mêmes structures d'informations, cadres d'image et blocs de compétences. La page **Preuves** comporte un accès documenté pour chaque projet.
