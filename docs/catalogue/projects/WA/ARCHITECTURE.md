# Architecture — Workflow Architect

## Organisation technique

Frontend Vercel vers route serveur /api/generate, puis service IA du portfolio et Cloudflare Workers AI. La compilation de JSON n8n et Make intervient côté interface ; les secrets du fournisseur restent côté serveur.

## Responsabilités

Le navigateur sert à présenter et manipuler les scénarios de démonstration. Les permissions, secrets et appels privilégiés doivent être gérés côté serveur ou service autorisé, selon l'architecture réellement déployée.

## Points d'attention

- La bonne structure JSON ne prouve pas un import opérationnel
- Ne jamais intégrer d'identifiants API dans les fichiers d'exemple
- Rendre explicites les limites de couverture des modules Make

---

**État réel au 31 octobre 2026.** Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés. [Voir le produit](https://workflow-architect-flax.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
