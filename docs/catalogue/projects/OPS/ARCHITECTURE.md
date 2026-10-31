# Architecture — OPS COMMAND Studio

## Organisation technique

Interface navigateur publiée sur Vercel et services d'authentification/API métier utilisant Supabase. Les secrets serveur et les politiques de données ne sont pas compris dans les sources publiques.

## Responsabilités

Le navigateur sert à présenter et manipuler les scénarios de démonstration. Les permissions, secrets et appels privilégiés doivent être gérés côté serveur ou service autorisé, selon l'architecture réellement déployée.

## Points d'attention

- Une clé publishable Supabase n'est pas un secret de serveur
- L'autorisation ne peut pas reposer sur le seul frontend
- Ne pas annoncer comme actives des intégrations non configurées

---

**État réel au 31 octobre 2026.** Frontend de pilotage de processus métier et d'authentification accessible publiquement ; les rôles, l'isolation des entreprises et les connecteurs tiers ne sont pas certifiés sur des comptes de test. [Voir le produit](https://ops-command-studio-kdkongodervilons-projects.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
