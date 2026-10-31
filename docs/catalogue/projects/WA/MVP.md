# Périmètre MVP — Workflow Architect

## Fonctionnalités présentes ou représentées

- Saisie de brief et choix n8n ou Make
- Plan d'étapes généré via une API serveur et Cloudflare Workers AI
- Compilation déterministe du JSON n8n avec workflow inactif
- Blueprint Make simple seulement si les étapes sont représentées fidèlement
- Guide de configuration et d'essai

## Hors du périmètre validé

- Tester les imports sur comptes réels n8n et Make
- Vérifier la configuration OAuth et les champs de chaque module
- Ajouter des tests de reprise et d'erreurs métier
- Certifier les scénarios complexes avant d'étendre le compilateur

## Condition de passage à une version exploitable

Chaque intégration et règle métier sensible doit être exercée sur un environnement de test avec des données fictives, des droits contrôlés et un résultat reproductible.

---

**État réel au 31 octobre 2026.** Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés. [Voir le produit](https://workflow-architect-flax.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
