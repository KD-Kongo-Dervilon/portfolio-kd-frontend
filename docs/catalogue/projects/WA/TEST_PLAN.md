# Stratégie de test — Workflow Architect

## Contrôles et cas de recette

- API Cloudflare : HTTP 200 et plan généré
- n8n : fichier JSON et guide Markdown téléchargés dans un navigateur réel
- n8n : noms de nœuds et connexions contrôlés, workflow inactif
- Make : scénarios contenant des validations, transformations ou filtres non pris en charge bloqués
- Import sur plateforme tierce : non certifié

## Principes

- Utiliser des données d'essai.
- Distinguer une vérification de rendu, un test fonctionnel et un test d'intégration.
- Conserver les erreurs observées et les résultats avec date et environnement.
- Ne jamais déclarer PASS un scénario non exécuté.

## Limite de cette documentation

Les éléments notés comme « non certifiés » demandent une recette supplémentaire et ne constituent pas des tests réussis.

---

**État réel au 31 octobre 2026.** Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés. [Voir le produit](https://workflow-architect-flax.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
