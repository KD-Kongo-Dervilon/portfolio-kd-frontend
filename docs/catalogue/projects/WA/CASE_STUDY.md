# Étude de cas — Workflow Architect

## Problème et finalité

Transformer une description métier en première structure d'automatisation accompagnée d'un guide d'installation.

## Fonctionnement observable

- Saisie de brief et choix n8n ou Make
- Plan d'étapes généré via une API serveur et Cloudflare Workers AI
- Compilation déterministe du JSON n8n avec workflow inactif
- Blueprint Make simple seulement si les étapes sont représentées fidèlement
- Guide de configuration et d'essai

## Choix produit

- Séparer génération IA et compilation déterministe
- Éviter de publier une automatisation active sans contrôle humain
- Bloquer explicitement un export Make qui ferait disparaître une étape

## Preuves, résultats et limites

- API Cloudflare : HTTP 200 et plan généré
- n8n : fichier JSON et guide Markdown téléchargés dans un navigateur réel
- n8n : noms de nœuds et connexions contrôlés, workflow inactif
- Make : scénarios contenant des validations, transformations ou filtres non pris en charge bloqués
- Import sur plateforme tierce : non certifié

La démonstration permet de discuter du travail réalisé, mais ne prouve pas l'activation de processus tiers ni la sécurité complète d'un service.

[Voir le produit](https://workflow-architect-flax.vercel.app/)

---

**État réel au 31 octobre 2026.** Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés. [Voir le produit](https://workflow-architect-flax.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
