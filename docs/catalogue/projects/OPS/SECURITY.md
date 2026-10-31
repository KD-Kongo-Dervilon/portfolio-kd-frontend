# Sécurité et limites — OPS COMMAND Studio

## Contraintes

- Une clé publishable Supabase n'est pas un secret de serveur
- L'autorisation ne peut pas reposer sur le seul frontend
- Ne pas annoncer comme actives des intégrations non configurées

## Vérification avant utilisation réelle

- Vérifier les permissions effectives, les secrets serveur et les données personnelles.
- Tester les scénarios d'erreur et l'isolation des utilisateurs lorsqu'elle existe.
- Documenter explicitement les intégrations non exécutées.

## État actuel

Frontend de pilotage de processus métier et d'authentification accessible publiquement ; les rôles, l'isolation des entreprises et les connecteurs tiers ne sont pas certifiés sur des comptes de test.

---

**État réel au 31 octobre 2026.** Frontend de pilotage de processus métier et d'authentification accessible publiquement ; les rôles, l'isolation des entreprises et les connecteurs tiers ne sont pas certifiés sur des comptes de test. [Voir le produit](https://ops-command-studio-kdkongodervilons-projects.vercel.app/). Le document est une pièce de cadrage du portfolio, non une attestation d'utilisation en production.
