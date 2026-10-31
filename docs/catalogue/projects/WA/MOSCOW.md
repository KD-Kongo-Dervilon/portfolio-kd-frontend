# Priorités expliquées — Workflow Architect

## Must — à préserver

- Saisie de brief et choix n8n ou Make
- Plan d'étapes généré via une API serveur et Cloudflare Workers AI
- Compilation déterministe du JSON n8n avec workflow inactif

## Should — à valider ensuite

- Tester les imports sur comptes réels n8n et Make
- Vérifier la configuration OAuth et les champs de chaque module

## Could — après recette

- Ajouter des tests de reprise et d'erreurs métier
- Certifier les scénarios complexes avant d'étendre le compilateur

## Won't for now

Aucune promesse d'intégration tierce ou de sécurité certifiée en l'absence de tests sur les systèmes concernés.

*Ces priorités sont des décisions de cadrage, pas la preuve d'une roadmap contractualisée.*

---

**État réel au 31 octobre 2026.** Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés. [Voir le produit](https://workflow-architect-flax.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
