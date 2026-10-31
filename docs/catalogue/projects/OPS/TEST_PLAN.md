# Stratégie de test — OPS COMMAND Studio

## Contrôles et cas de recette

- Accès de la page de production sans connexion Vercel : contrôlé
- Écran d'authentification et navigation publique : observés
- Création de comptes et gestion effective des rôles : non certifiées
- Isolation inter-organisations et webhooks métier : non certifiés

## Principes

- Utiliser des données d'essai.
- Distinguer une vérification de rendu, un test fonctionnel et un test d'intégration.
- Conserver les erreurs observées et les résultats avec date et environnement.
- Ne jamais déclarer PASS un scénario non exécuté.

## Limite de cette documentation

Les éléments notés comme « non certifiés » demandent une recette supplémentaire et ne constituent pas des tests réussis.

---

**État réel au 31 octobre 2026.** Frontend de pilotage de processus métier et d'authentification accessible publiquement ; les rôles, l'isolation des entreprises et les connecteurs tiers ne sont pas certifiés sur des comptes de test. [Voir le produit](https://ops-command-studio-kdkongodervilons-projects.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
