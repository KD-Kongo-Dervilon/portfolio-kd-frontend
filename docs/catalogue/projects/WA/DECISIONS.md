# Décisions et arbitrages — Workflow Architect

## Choix de conception

- Séparer génération IA et compilation déterministe
- Éviter de publier une automatisation active sans contrôle humain
- Bloquer explicitement un export Make qui ferait disparaître une étape

## Arbitrage sécurité et confiance

Un prototype accessible n'est pas une preuve de mise en production métier. Les démonstrations restent décrites avec leurs contraintes, et les fonctions encore à intégrer sont annoncées comme telles.

---

**État réel au 31 octobre 2026.** Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés. [Voir le produit](https://workflow-architect-flax.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
