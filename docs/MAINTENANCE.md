# Guide de maintenance — garder GitHub cohérent avec Vercel

**Référence initiale : 30 octobre 2026.**

## Différence essentielle

Ce dépôt GitHub est le **dossier de preuves**, avec des copies de fichiers clients publics. Ce n'est pas la source connectée des déploiements Vercel D. Mk, Workflow Architect ou OPS COMMAND. Une livraison Vercel peut donc précéder sa documentation GitHub.

## Après chaque correction Vercel

1. Ouvrir la version **publique de production** ; ne pas confondre avec une prévisualisation Vercel.
2. Vérifier les parcours pertinents dans un navigateur et noter l'environnement, la date et les résultats.
3. Réexaminer les secrets avant de recopier le moindre fichier.
4. Mettre à jour les fichiers concernés de `showcase/` à partir des URL listées dans [manifest.json](../showcase/manifest.json).
5. Exécuter `node scripts/verify-showcase.mjs`.
6. Exécuter `node scripts/verify-showcase.mjs --live` pour détecter les écarts dans les scripts/CSS surveillés.
7. Mettre à jour la fiche projet, le journal des tests et la date de revue **après validation**.
8. Commiter les changements avec un message explicite, par exemple `docs: recetter Workflow Architect et synchroniser les preuves de production`.

## Vérification automatique

- À chaque push ou pull request : contrôle statique des snapshots et des exports.
- Chaque jour : comparaison des scripts/CSS publics aux fichiers versionnés.
- Une divergence fait échouer le contrôle, **mais ne modifie jamais automatiquement** la production ou GitHub.

Le flux quotidien signale une différence, pas sa cause : examiner le diff avant de synchroniser.

## Pour améliorer l'architecture ultérieurement

Créer un dépôt Git de référence par produit ou connecter les projets Vercel à un dépôt autorisé, avec revue des secrets, politique de branches, tests de préproduction et mécanisme de rollback. Cette liaison **n'est pas réalisée** par la présente documentation.

## Définition de terminé

Une mise à jour de preuve est terminée lorsque le frontend public correspond aux sources suivies, la documentation dit ce qui a été testé, la CI est verte, les données privées sont protégées et les liens sont opérationnels.

[Qualité](QUALITE-ET-TESTS.md) · [Sécurité](SECURITE-ET-CONFIDENTIALITE.md)
