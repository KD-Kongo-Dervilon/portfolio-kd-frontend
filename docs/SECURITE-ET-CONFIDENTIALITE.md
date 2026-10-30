# Sécurité et confidentialité des preuves GitHub

## Périmètre

Ce dépôt expose uniquement des **fichiers déjà diffusés publiquement aux navigateurs**, l'ancien code React existant et des documents de preuve. Aucune extraction de secret serveur n'a été entreprise.

Les snapshots ont été examinés pour identifier les signatures usuelles de clés privées avant publication. Cette inspection **ne remplace pas** un audit de sécurité.

## Règles de publication

1. **Jamais** de token Cloudflare, secret d'Edge Function, secret JWT, clé `SUPABASE_SERVICE_ROLE_KEY` ou mot de passe dans GitHub.
2. Aucune donnée personnelle de visiteurs, candidature, compte ou CRM dans les tests : uniquement des entrées fictives.
3. Les clés Supabase `publishable` présentes dans du code frontend public ne donnent pas de droits administratifs. Les autorisations restent indispensables côté serveur.
4. Les fichiers `.env` réels et journaux contenant des cookies, tokens ou sessions restent privés.
5. Les démonstrations publiques et les tests de structure ne valent pas certification de sécurité.

## Exports automatiques

- **n8n** : fichier inactif par défaut ; OAuth et autres secrets doivent être configurés dans n8n, jamais dans la description libre.
- **Make** : les flux ne représentant pas fidèlement les contrôles métier sont refusés à l'export.
- **Validations humaines** : une reprise de workflow ne suffit pas à attester une approbation authentifiée ; une vraie politique de permission doit être mise en place.

## Avant une nouvelle publication

- Inspecter les modifications, notamment la configuration client, les endpoints et toute donnée d'exemple.
- Vérifier qu'aucune clé serveur privée n'a été ajoutée au frontend.
- Exécuter les tests locaux puis comparer au site publié.
- Documenter explicitement les fonctionnalités non validées.

Voir [architecture](ARCHITECTURE.md) et [recette](QUALITE-ET-TESTS.md).
