# Évolutions prévues — Workflow Architect

## Étape 1 — fiabiliser

- API Cloudflare : HTTP 200 et plan généré
- n8n : fichier JSON et guide Markdown téléchargés dans un navigateur réel
- n8n : noms de nœuds et connexions contrôlés, workflow inactif

## Étape 2 — recetter les limites

- Tester les imports sur comptes réels n8n et Make
- Vérifier la configuration OAuth et les champs de chaque module
- Ajouter des tests de reprise et d'erreurs métier
- Certifier les scénarios complexes avant d'étendre le compilateur

## Étape 3 — décider

N'étendre le périmètre qu'après avoir documenté les résultats observés, les bugs bloquants et les conditions de mise en service.

*Calendrier non engagé : cette liste indique des priorités, pas des dates de livraison garanties.*

---

**État réel au 31 octobre 2026.** Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés. [Voir le produit](https://workflow-architect-flax.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
