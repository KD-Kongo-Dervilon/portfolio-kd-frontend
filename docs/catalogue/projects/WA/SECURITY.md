# Sécurité et limites — Workflow Architect

## Contraintes

- La bonne structure JSON ne prouve pas un import opérationnel
- Ne jamais intégrer d'identifiants API dans les fichiers d'exemple
- Rendre explicites les limites de couverture des modules Make

## Vérification avant utilisation réelle

- Vérifier les permissions effectives, les secrets serveur et les données personnelles.
- Tester les scénarios d'erreur et l'isolation des utilisateurs lorsqu'elle existe.
- Documenter explicitement les intégrations non exécutées.

## État actuel

Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés.

---

**État réel au 31 octobre 2026.** Appels réels à Cloudflare Workers AI et génération JSON n8n validés depuis le navigateur. Les imports réels Make/n8n et les connexions externes restent non certifiés ; les exports Make incomplets sont refusés. [Voir le produit](https://workflow-architect-flax.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
