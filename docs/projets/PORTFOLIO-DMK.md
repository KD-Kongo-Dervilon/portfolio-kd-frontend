# Portfolio D. Mk — Étude de projet

**URL de production :** https://portfolio-d-mk.vercel.app/portfolio/#/projects  
**Dernière recette des cartes :** 30 octobre 2026.

## Objectif produit

Permettre à un recruteur d'accéder rapidement aux **projets, décisions et preuves** : pas seulement une liste d'outils ou de compétences.

## Parcours observé

Le portfolio rassemble des projets comme **HelpDesk Flow, PRISME, BudgetFlow, OPS COMMAND Studio, Workflow Architect, HitDNA et D.k Academy**. Les deux derniers projets ajoutés à la grille principale ont été contrôlés pour éviter les doublons.

## Recette réelle sur deux tailles d'écran

| Vérification | Bureau 1440 px | Mobile 390 px |
| --- | --- | --- |
| OPS COMMAND visible une seule fois | OK | OK |
| Workflow Architect visible une seule fois | OK | OK |
| Deux projets dans la grille principale après BudgetFlow | OK | OK |
| Images 1194 × 760 chargées | OK | OK |
| Pas de débordement horizontal de la page | OK | OK |
| Navigation vers les démos publiques | URLs vérifiées | URLs vérifiées |

Sources publiques des cartes : [JavaScript](../../showcase/portfolio/project-ops.js) et [CSS](../../showcase/portfolio/project-ops.css).

## Architecture et traçabilité

Le site public D. Mk est déployé sur le projet Vercel **dmk-portfolio**. Il **n'est pas actuellement relié** au dépôt React historique que vous consultez. Ce dossier donne des preuves de la version en ligne, sans prétendre que les fichiers React de `src/` sont la source du site D. Mk.

Pour éviter une fausse piste à un recruteur, le lien vers le site actuel figure toujours en premier ; le React historique est explicitement identifié comme archive du parcours.

[Architecture](../ARCHITECTURE.md) · [Méthode de maintenance](../MAINTENANCE.md)
