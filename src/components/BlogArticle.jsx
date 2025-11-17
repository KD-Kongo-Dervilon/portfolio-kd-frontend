// src/components/BlogArticle.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Paper,
  Divider,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  TextField,
  Link as MuiLink,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import {
  ArrowBack,
  AccessTime,
  CalendarToday,
  Person,
  Visibility,
  Favorite,
  FavoriteBorder,
  Share,
  Edit,
  Delete,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAnalytics } from '../utils/analytics';

// 🧠 Base articles
const articles = {
  'chatbot-ia-reduction-60-support': {
    title: "Comment j'ai réduit de 60% le temps support avec un chatbot IA",
    date: '2024-12-15',
    readTime: '8 min',
    category: 'IA & Automatisation',
    excerpt:
      "Retour d'expérience sur la mise en place d'un chatbot LLM avec RAG pour automatiser le support client et réduire les tickets manuels.",
    content: `
## Introduction

Dans un contexte où notre équipe support traitait **500+ tickets par mois** avec des questions répétitives, j'ai piloté la mise en place d'un **chatbot IA** basé sur GPT-4 et RAG.

🎯 Objectif : **réduire la charge du support** tout en **améliorant l'expérience utilisateur**.

> Résultat : **-60% de tickets manuels en 8 semaines**.

---

## Le contexte initial

Notre équipe de 5 personnes passait près de **70% de son temps** sur des questions récurrentes :

- "Comment réinitialiser mon mot de passe ?"
- "Où trouver mes factures ?"
- "Comment ajouter un utilisateur ?"

Conséquences :

- Temps de réponse qui s'allonge,
- Frustration côté clients,
- Peu de temps pour les demandes à forte valeur ajoutée.

---

## Notre approche méthodologique

### Phase 1 — Analyse & cadrage (Semaine 1)

1. Analyse des **1000 derniers tickets**.
2. Identification de **20 questions** couvrant ~80% des demandes.
3. Définition de la cible :

- Cas d'usage couverts
- Ton & style de réponse
- Limites du chatbot (escalade vers humain)

### Phase 2 — POC & validation (Semaines 2–3)

Mise en place d'un POC avec :

- GPT-4 pour la génération,
- RAG sur ~100 articles de la base de connaissances,
- Interface simple intégrée dans le centre d'aide.

**Résultat du POC :**

- Taux de résolution autonome : **73%**
- Très bon feedback des agents support.

### Phase 3 — MVP & déploiement (Semaines 4–6)

- Intégration dans Zendesk,
- Déploiement progressif : 10% → 50% → 100% du trafic,
- Mise en place d'un loop de feedback avec l'équipe support.

### Phase 4 — Optimisation (Semaines 7–8)

- Ajout de ~50 nouvelles réponses,
- Amélioration des prompts & des règles métier,
- Mise en place d'un monitoring simple (Dashboards + alertes).

---

## Résultats mesurables

| Métrique                | Avant      | Après     | Amélioration |
|-------------------------|-----------:|----------:|-------------:|
| Tickets support / mois  | 500        | 200       | **-60%**     |
| Temps de réponse moyen  | 4h         | 36 min    | **-85%**     |
| Satisfaction client     | 3.2 / 5    | 4.2 / 5   | **+32%**     |
| ROI                     | –          | 8 mois    | ✅           |

Ces résultats ont permis :

- De libérer du temps pour le support de niveau 2,
- D'améliorer la perception globale du support,
- De justifier de nouveaux investissements sur l'IA.

---

## Leçons apprises

### ✅ Ce qui a bien fonctionné

1. **Démarrer petit** : se concentrer sur 20 questions à fort volume plutôt que tout couvrir.
2. **Mesurer dès le premier jour** : taux de résolution, temps de réponse, NPS.
3. **Impliquer l'équipe support** : validation des réponses, retours terrain, idées d'amélioration.

### ⚠️ Pièges à éviter

1. Ne pas tester le chatbot sur de **vrais tickets** (situations réelles).
2. Vouloir **tout automatiser d'un coup**.
3. Négliger la **formation des équipes** sur ce nouvel outil.

---

## Technologies utilisées

- **LLM** : GPT-4 (API OpenAI)
- **RAG** : index vectoriel sur les articles de FAQ
- **Backend** : Python + FastAPI
- **Intégration** : Zendesk API
- **Monitoring** : Dashboard custom (PostgreSQL + Metabase)

---

## Conclusion

Un chatbot IA bien conçu peut transformer votre support client :

- meilleure expérience,
- moins de tickets,
- plus de temps pour les sujets à forte valeur.

La clé : **commencer petit**, mesurer, et itérer rapidement.

---

## Et ensuite ?

Vous voulez discuter de votre projet d'automatisation du support ?

👉 Contactez-moi, je peux vous aider à cadrer un POC ou un MVP en quelques semaines.
    `,
  },
  'roi-projet-rag-3-metriques': {
    title: "ROI d'un projet RAG : 3 métriques à suivre absolument",
    date: '2024-12-10',
    readTime: '6 min',
    category: 'Product Management',
    excerpt:
      'Quelles métriques suivre pour démontrer le ROI réel d’un projet RAG côté métier ?',
    content: `
## Pourquoi le ROI d’un RAG est souvent mal mesuré

Un projet RAG est souvent présenté comme "innovant" ou "stratégique", mais peu d'équipes savent le **relier clairement à des KPIs business**.

Résultat : les sponsors ont une bonne intuition que "ça apporte quelque chose", sans pouvoir expliquer **combien**, pour **qui**, et **à quel coût**. C’est exactement le genre de situation qui fragilise un projet IA au moment de chercher du budget ou d’industrialiser.

Dans cet article, je me concentre sur **3 métriques simples** à suivre pour avoir une histoire ROI solide, compréhensible pour un COMEX :

1. Taux de résolution autonome
2. Temps gagné par les équipes
3. Impact sur la satisfaction / NPS

L’idée n’est pas de tout mesurer, mais de **raconter une histoire claire** : "Voilà ce qu’on a automatisé, voilà ce que ça a changé pour les équipes et les utilisateurs, voilà comment ça se voit dans les chiffres."

---

## 1. Taux de résolution autonome : est-ce que le RAG fait vraiment le job ?

C’est la question la plus simple pour un sponsor métier :  
> "Sur 100 demandes, combien sont gérées par le RAG sans intervention humaine ?"

### Définition

Le **taux de résolution autonome** mesure la proportion de requêtes où :

- la réponse du système RAG est jugée **suffisante** pour l’utilisateur,
- **aucun agent humain** n’a besoin de reprendre.

Formellement :

> Taux de résolution autonome = (Nombre de requêtes résolues par le RAG seul) / (Nombre total de requêtes éligibles)

> 💡 *Éligibles* = les situations où le RAG **a le droit** de répondre (ex : support niveau 1, aide à la décision, FAQ, etc.).

### Comment le mesurer concrètement

Quelques approches possibles :

- **Tag "escalade"** : si l’utilisateur demande à parler à un humain → la requête **n’est pas** résolue de façon autonome.
- **Feedback utilisateur** : simple vote 👍 / 👎 ou question "Cette réponse vous a-t-elle été utile ?".
- **Requêtes répétées** : si l’utilisateur repose la même question dans les minutes qui suivent, c’est un signal d’échec.

Tu peux alors définir par exemple :

- ✅ RAG "résout" la demande si l’utilisateur ne fait *pas* d’escalade **et** ne repose pas la même question dans un délai T.

### Exemple de lecture

- 10 000 requêtes sur 1 mois, dont 7 000 éligibles au RAG.
- 4 900 gérées sans intervention humaine.

> Taux de résolution autonome = 4 900 / 7 000 = **70 %**

À ce stade, tu peux traduire ça en narratif métier :

> "7 demandes sur 10 sont gérées automatiquement, sans solliciter les équipes opérationnelles."

---

## 2. Temps gagné par les équipes : la traduction en capacité

Le taux de résolution autonome est intéressant, mais il reste abstrait pour un décideur.  
La question suivante est toujours :

> "Ok, mais **qu’est-ce que ça libère comme temps** pour les équipes ?"

### La logique de calcul

Pour estimer le **temps gagné**, tu as besoin de trois ingrédients :

1. **Volume** : nombre de requêtes traitées par le RAG (par période).
2. **Temps moyen par requête** : avant l’IA, combien de temps prenait le traitement manuel d’une demande.
3. **Taux de résolution autonome** : pour ne compter que les cas réellement pris en charge par le RAG.

Exemple simplifié :

- 4 900 demandes résolues automatiquement (cf. exemple précédent).
- 4 minutes en moyenne par demande lorsqu’elle était traitée à la main.

> Temps gagné ≈ 4 900 × 4 min = 19 600 minutes  
> Soit **326 heures** sur la période.

Sur un mois, ça commence à ressembler à :

- ~2 ETP *jours* libérés,
- du temps que tu peux réallouer : accompagnement de niveau 2, amélioration continue, projets.

### Comment le présenter simplement

Plutôt que d’arriver avec uniquement des heures et des minutes, reformule en termes opérationnels :

- "Le RAG nous fait gagner l’équivalent de **X jours/homme par mois**."
- "On a récupéré **Y % de capacité** sur l’équipe support / métier."

L’objectif n’est pas de licencier les équipes, mais de dire :

> "On a converti du traitement répétitif en capacité pour des tâches à plus forte valeur."

---

## 3. Impact sur la satisfaction / NPS : est-ce que les utilisateurs aiment vraiment ça ?

Automatiser, c’est bien. Améliorer l’expérience, c’est mieux.

Un RAG performant permet souvent :

- des réponses **plus rapides**,
- une **disponibilité 24/7**,
- des réponses plus **cohérentes** qu’un support très fragmenté.

### Ce que tu peux suivre

Selon ton contexte, tu peux regarder :

- **NPS global** sur le produit / service, avant / après déploiement.
- **CSAT** (note de satisfaction) juste après l’interaction avec le RAG.
- Un indicateur simple type : "Cette réponse vous a-t-elle aidé ?" (Oui / Non).

L’important, c’est de lier :

- ton **taux de résolution autonome**,
- ton **temps de réponse**,
- et l’évolution de la **satisfaction**.

Exemple de récit :

- Temps de réponse moyen passé de 4h à 40 min.
- Taux de résolution autonome à 70 %.
- CSAT post-interaction passé de 3,3/5 à 4,1/5.

> "On a réduit le temps d’attente et augmenté la satisfaction, tout en déchargeant les équipes."

---

## Mettre les 3 métriques ensemble : construire une histoire ROI

L’idée n’est pas de sortir un business case ultra compliqué, mais une **histoire simple** :

1. **Efficacité** : "X % des demandes sont traitées automatiquement."
2. **Capacité** : "Ça représente Y heures ou jours/homme libérés par mois."
3. **Expérience** : "La satisfaction progresse de Z points."

Tu peux par exemple résumer dans un slide unique :

- **Objectif** : absorber la croissance du volume de demandes sans recruter.
- **Moyen** : déploiement d’un assistant RAG sur les questions récurrentes.
- **Résultat** :
  - 70 % de résolution autonome,
  - 326 heures gagnées / mois,
  - +0,8 point de CSAT.

Et conclure par :

> "Sans ce projet, nous aurions dû ajouter X ETP pour maintenir le même niveau de service."

---

## Checklist rapide avant de lancer / continuer un projet RAG

Avant (ou pendant) ton projet, tu peux te poser ces questions :

- [ ] Ai-je listé clairement les **cas d’usage éligibles** au RAG ?
- [ ] Ai-je une estimation du **volume** de demandes concernées ?
- [ ] Ai-je une mesure (même approximative) du **temps moyen** par demande aujourd’hui ?
- [ ] Ai-je prévu une façon de suivre le **taux de résolution autonome** (feedback, escalade, répétition) ?
- [ ] Ai-je un indicateur simple de **satisfaction** (CSAT, NPS, pouce 👍 / 👎) ?

Si tu coches ces cases, tu peux déjà raconter une histoire beaucoup plus solide que "on teste de l’IA, on verra bien".

---

## Et ensuite ?

Si tu veux aller plus loin, les étapes suivantes peuvent être :

- ajouter des métriques plus fines (coût par requête, qualité de réponse, taux d’escalade vers le niveau 2) ;
- connecter le RAG à d’autres sources (CRM, historique tickets, base documentaire interne) ;
- industrialiser le suivi dans un **dashboard simple** partagé avec les équipes métiers.

Et si tu veux en discuter, je peux t’aider à :

- cadrer un POC RAG autour de quelques cas d’usage bien choisis,
- définir les bons indicateurs à suivre dès le jour 1,
- préparer une **histoire ROI** claire pour ton sponsor ou ton COMEX.
    `,
  },
  'poc-mvp-21-jours-methode': {
    title: 'De POC à MVP en 21 jours : ma méthode step-by-step',
    date: '2024-12-05',
    readTime: '10 min',
    category: 'Méthodologie',
    excerpt:
      'Comment passer d’une idée IA à un MVP utilisable par de vrais utilisateurs en 3 semaines.',
    content: `
## Pourquoi viser 21 jours ?

Au-delà de 3 semaines, un POC IA a tendance à dériver en **projet sans fin** :

- backlog qui gonfle,
- effets "on ajoutera ça plus tard",
- difficulté à dire objectivement si on continue, on pivote ou on arrête.

Ma conviction : pour un premier cas d’usage IA / RAG, il faut un **cadre court et très clair**.  
21 jours, c’est suffisant pour :

- tester un cas d’usage réel avec de vrais utilisateurs,
- stabiliser un socle technique minimal,
- apporter assez de matière pour une **décision Go / No Go**.

Dans cet article, je détaille ma méthode **step-by-step** :

- Semaine 1 (J1–7) : POC fonctionnel sur un cas d’usage ciblé  
- Semaine 2 (J8–14) : MVP utilisable par un petit groupe pilote  
- Semaine 3 (J15–21) : Tests utilisateurs, mesure, décision et plan de suite

---

## Vue d’ensemble : la ligne du temps en 21 jours

| Période        | Objectif principal                                  | Livrables clés                               |
|----------------|------------------------------------------------------|----------------------------------------------|
| J1–2           | Cadrage express, sélection du cas d’usage           | Problème métier clarifié, succès critères    |
| J3–7           | POC fonctionnel sur un parcours ciblé               | Démo bout-en-bout                            |
| J8–11          | Passage en MVP : UX, données, sécurité minimale     | Version testable par de vrais utilisateurs   |
| J12–14         | Mise en pilote restreint                            | 1er feedback qualitatif                      |
| J15–18         | Boucle d’itération rapide                           | Corrections, ajustements prompts & règles    |
| J19–21         | Synthèse & décision Go / No Go / Next               | REX, métriques, plan 30–90 jours             |

L’idée : **chaque bloc de quelques jours a un livrable tangible**, pas seulement des tickets "en cours".

---

## Semaine 1 (J1–7) — POC fonctionnel sur un cas d’usage très ciblé

Objectif : passer d’une **idée floue** à un **parcours concret qui fonctionne** de bout en bout, même si l’UX est encore brute.

### J1–2 — Cadrage express

Ateliers courts avec 3 profils minimum :

- 1 personne métier (porteuse du problème),
- 1 profil "ops" / support / terrain,
- 1 profil technique (dev / data / IA).

Questions clés :

- Quel problème concret veut-on adresser ? (1 phrase max)
- Pour qui (personas, équipe, type d’utilisateur) ?
- À quelle étape du parcours client / interne ?
- Comment fait-on **aujourd’hui** sans IA (process actuel) ?
- Quel **succès minimal** dans 21 jours ? (ex : réduire de 20 % le temps de traitement d’un type de demande, obtenir un certain niveau de satisfaction, etc.)

🎯 Livrables recommandés :

- une **fiche de cas d’usage** (1 page) :
  - Problème
  - Population cible
  - Données disponibles
  - Règles métier à respecter
- une **checklist de contraintes** :
  - confidentialité / RGPD,
  - sécurité (données sensibles ?),
  - validation juridique si nécessaire.

### J3–5 — POC technique : le "happy path"

On construit un POC qui traite **un parcours simple et bien défini**.  
Par exemple :

- l’utilisateur pose une question dans un domaine donné,
- le système RAG va chercher dans une base documentaire ciblée,
- on renvoie une réponse structurée (et non pas juste un blob de texte).

Le but n’est pas d’être parfait, mais de vérifier :

- qu’on sait **connecter les sources** (FAQ, base de connaissances, docs internes),
- que les réponses sont **globalement pertinentes** sur les cas fréquents,
- qu’on respecte les grandes contraintes (pas de fuite de données, pas d’hallucinations flagrantes).

🧱 Livrable en fin de J5 :

- une **démo clique-à-cliquer** (interface simple ou même un outil interne) montrant :
  - 3 à 5 scénarios typiques,
  - le flux complet : input → RAG → réponse.

### J6–7 — Sanity check + décision de passage en MVP

On fait un point rapide avec le sponsor :

- Est-ce que le POC répond **au bon problème** ?
- Le niveau de qualité est-il **suffisant pour un pilote restreint** ?
- Y a-t-il des risques bloquants (juridique, sécurité, data) ?

👉 Si la réponse est "oui, ça tient la route" → on passe en mode MVP sur la même base, sans repartir de zéro.

---

## Semaine 2 (J8–14) — MVP testable par de vrais utilisateurs

Objectif : transformer le POC en **MVP utilisable** par un petit groupe (équipe support, commerciaux, consultants…).

### J8–10 — Solidifier le produit

3 axes principaux :

1. **Expérience utilisateur (UX/UI)**  
   - Formulaire un peu plus propre, messages d’erreur clairs.  
   - Indication de "ce que l’IA sait faire" et "ce qu’elle ne fera pas".

2. **Données & contexte**  
   - Nettoyage des sources : enlever les contenus obsolètes.  
   - Ajouter des méta-infos : date de mise à jour, source visible dans la réponse ("Réponse basée sur : guide X, page Y.").

3. **Suivi & logs**  
   - Stocker :
     - la question posée,
     - le ou les documents utilisés,
     - la réponse retournée,
     - un signal de feedback (si dispo).

🎯 Livrable en fin de J10 :

- un **MVP cliquable** :
  - accessible à quelques utilisateurs identifiés,
  - avec un minimum de design mais une expérience claire.

### J11–14 — Mise en pilote restreint

On ouvre le MVP à un **petit groupe pilote** (5–20 personnes max).  
L’objectif n’est pas le volume, mais la qualité des retours.

On prépare :

- un canal de feedback (formulaire, Slack, Teams…),
- quelques questions simples pour les pilotes :
  - "Dans quel contexte as-tu utilisé l’outil ?"
  - "Qu’est-ce qui t’a fait gagner du temps ?"
  - "Qu’est-ce qui t’a fait perdre confiance ?"

On commence à suivre quelques métriques :

- nombre de requêtes/jour,
- cas réussis vs cas ratés,
- motifs de demandes d’escalade vers un humain.

---

## Semaine 3 (J15–21) — Itérations rapides, décision et plan de suite

Objectif : **ne pas rester en POC éternel**, mais aboutir à une vision claire :

- Go → on continue, on scale.
- No Go → on arrête proprement et on capitalise.
- Pivot → on ajuste le cas d’usage.

### J15–18 — Boucle d’amélioration rapide

À partir des retours du pilote :

- on corrige les prompts qui posent problème,
- on ajoute quelques règles métier (ex : "ne jamais répondre sur X", "rediriger vers Y si…"),
- on améliore le routing : quels cas sont éligibles ou non au RAG.

On peut aussi :

- ajouter 1 ou 2 **micro-fonctionnalités** vraiment utiles (ex : copier la réponse, exporter en email, etc.),
- simplifier le parcours si les utilisateurs se perdent.

L’idée est de montrer que l’équipe **sait itérer** sur la base des retours, pas seulement livrer un one-shot.

### J19–21 — Synthèse & décision Go / No Go

On produit un **retour d’expérience structuré**, par exemple sous forme de doc ou de slide :

1. **Rappel du contexte**
   - problème,
   - cas d’usage cible,
   - population concernée.
2. **Ce qui a été fait en 21 jours**
   - POC,
   - MVP,
   - pilote.
3. **Résultats**
   - quelques métriques clés (même si approximatives),
   - verbatims utilisateurs,
   - points forts / limites identifiées.
4. **Recommandation**
   - Go / No Go / Pivot,
   - prochain jalon (ex : déploiement plus large, intégration à d’autres systèmes).

🧾 Livrable final :

- un **artefact partageable** (doc, slide) que le sponsor peut utiliser pour :
  - défendre le budget,
  - aligner les équipes,
  - décider des priorités.

---

## Rôles et responsabilités dans le sprint 21 jours

Pour que ça tienne en 3 semaines, il faut être clair sur **qui fait quoi** :

- **Product / Chef de projet IA**
  - cadre le problème,
  - arbitre les priorités,
  - anime les démos & la décision finale.
- **Tech / Data / IA**
  - construit le POC + MVP,
  - met en place les connexions (RAG, API, données),
  - gère la sécurité technique.
- **Métier / Support / Ops**
  - apporte les cas concrets et la connaissance terrain,
  - teste le MVP,
  - remonte les feedbacks prioritaires.

Une personne peut cumuler plusieurs rôles dans une petite équipe, mais ces **angles de vue** doivent exister.

---

## Checklist "21 jours" avant de te lancer

Avant de démarrer, vérifie :

- [ ] Tu as un **cas d’usage précis** (pas "l’IA pour tout faire").
- [ ] Tu as identifié 1 sponsor métier et 2–3 utilisateurs pilotes.
- [ ] Tu sais quelles **données** tu vas brancher (et celles que tu ne peux pas utiliser).
- [ ] Tu as une idée, même approximative, de **ce que tu veux mesurer** (temps gagné, satisfaction, etc.).
- [ ] Tu as un créneau pour **2–3 démos intermédiaires** (J7, J14, J21).

Si tu coches ces points, tu es déjà beaucoup mieux armé que la plupart des projets IA "exploratoires".

---

## Et ensuite ?

Une fois ce sprint 21 jours terminé, les suites possibles :

- **Go** : on consolide (monitoring, sécurité, intégrations supplémentaires), on élargit le pilote à plus d’utilisateurs.
- **Pivot** : on garde le socle technique, mais on change le cas d’usage ou la cible.
- **Pause / No Go** : on documente ce qui a été appris, pour ne pas refaire les mêmes erreurs plus tard.

L’important n’est pas que tout soit parfait en 21 jours, mais d’avoir :

- un **prototype qui tourne**,
- des **retours réels d’utilisateurs**,
- une **histoire claire** à raconter à ton sponsor ou ton COMEX.

Et si tu veux être accompagné sur ce type de sprint (cadrage, pilotage produit, choix des métriques), je peux t’aider à le structurer en fonction de ton contexte et de ton niveau de maturité IA.
    `,
  },
};

// 🎨 Mapping Markdown -> composants MUI
const markdownComponents = {
  h1: ({ node, ...props }) => (
    <Typography
      variant="h3"
      component="h2"
      sx={{ mt: 4, mb: 2, fontWeight: 800, letterSpacing: '-0.03em' }}
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <Typography
      variant="h4"
      component="h2"
      sx={{ mt: 4, mb: 2, fontWeight: 800, letterSpacing: '-0.02em' }}
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <Typography
      variant="h6"
      component="h3"
      sx={{ mt: 3, mb: 1.5, fontWeight: 700 }}
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <Typography
      variant="body1"
      paragraph
      sx={{ lineHeight: 1.8, mb: 2 }}
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <Box
      component="ul"
      sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <Box
      component="ol"
      sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}
      {...props}
    />
  ),
  li: ({ node, ...props }) => (
    <Box component="li" sx={{ mb: 0.5 }}>
      <Typography variant="body1" component="span" sx={{ lineHeight: 1.7 }}>
        {props.children}
      </Typography>
    </Box>
  ),
  strong: ({ node, ...props }) => (
    <Box component="strong" sx={{ fontWeight: 700 }} {...props} />
  ),
  em: ({ node, ...props }) => (
    <Box component="em" sx={{ fontStyle: 'italic' }} {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <Paper
      elevation={0}
      sx={{
        borderLeft: (t) => `4px solid ${t.palette.primary.main}`,
        pl: 2.5,
        py: 1.5,
        my: 3,
        bgcolor: (t) => alpha(t.palette.primary.light, 0.04),
      }}
    >
      <Typography
        component="div"
        variant="body1"
        sx={{
          fontStyle: 'italic',
          color: 'text.secondary',
          '& p': { m: 0 },
        }}
      >
        {props.children}
      </Typography>
    </Paper>
  ),

  // 🧮 Tableaux → vrais composants MUI Table
  table: ({ node, ...props }) => (
    <TableContainer
      component={Paper}
      sx={{
        my: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflowX: 'auto',
        overflowY: 'hidden',
        maxWidth: '100%',
        boxShadow: (t) => `0 10px 30px ${alpha(t.palette.primary.main, 0.04)}`,
        transition:
          'box-shadow 400ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms ease',
        '&:hover': {
          boxShadow: '0 22px 70px rgba(15, 23, 42, 0.16)',
          borderColor: '#4f46e5',
        },
      }}
    >
      <Table
        size="small"
        aria-label="Tableau de données"
        sx={{
          minWidth: { xs: 520, sm: 650 },
          '& th': {
            fontWeight: 700,
            whiteSpace: 'nowrap',
          },
        }}
      >
        {props.children}
      </Table>
    </TableContainer>
  ),
  thead: ({ node, ...props }) => (
    <TableHead
      sx={{
        bgcolor: (t) =>
          `linear-gradient(135deg, ${alpha(
            t.palette.primary.main,
            0.12
          )}, ${alpha(t.palette.secondary.main, 0.1)})`,
      }}
      {...props}
    />
  ),
  tbody: ({ node, ...props }) => <TableBody {...props} />,
  tr: ({ node, ...props }) => <TableRow {...props} />,
  th: ({ node, ...props }) => (
    <TableCell
      component="th"
      scope="col"
      sx={{ px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <TableCell
      sx={{
        px: 2,
        py: 1.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:nth-of-type(n+2)': { textAlign: 'right' },
      }}
      {...props}
    />
  ),

  code: ({ inline, node, ...props }) => (
    <Box
      component="code"
      sx={{
        fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
        fontSize: '0.85em',
        px: inline ? 0.5 : 1.5,
        py: inline ? 0.2 : 1,
        borderRadius: 1,
        bgcolor: inline ? 'action.hover' : 'background.paper',
        border: inline ? 'none' : '1px solid',
        borderColor: inline ? 'transparent' : 'divider',
        display: inline ? 'inline' : 'block',
        my: inline ? 0 : 2,
        overflowX: inline ? 'visible' : 'auto',
      }}
      {...props}
    />
  ),
};

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const article = slug ? articles[slug] : null;

  const [readCount, setReadCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ pseudo: '', text: '' });
  const [commentError, setCommentError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Identifiant local pour savoir quels commentaires appartiennent à ce navigateur
  const [viewerId] = useState(() => {
    if (typeof window === 'undefined') return 'server-viewer';
    try {
      const existing = window.localStorage.getItem('kd-blog-viewer-id');
      if (existing) return existing;
      const id =
        'viewer_' +
        Math.random().toString(36).slice(2) +
        Date.now().toString(36);
      window.localStorage.setItem('kd-blog-viewer-id', id);
      return id;
    } catch {
      return 'viewer-anon';
    }
  });

  // Statut admin (basé sur la session admin déjà utilisée dans /admin)
  const [isAdmin, setIsAdmin] = useState(false);
  // charger les commentaires depuis le localStorage
  useEffect(() => {
    if (!slug || typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(`kd-blog-comments-${slug}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setComments(parsed);
        } else {
          setComments([]);
        }
      } else {
        setComments([]);
      }
    } catch {
      setComments([]);
    }
  }, [slug]);
  // persister les commentaires
  useEffect(() => {
    if (!slug || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        `kd-blog-comments-${slug}`,
        JSON.stringify(comments)
      );
    } catch {
      // ignore
    }
  }, [comments, slug]);
  const handleCommentFieldChange = (field) => (event) => {
    const value = event.target.value;
    setCommentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (commentError) {
      setCommentError('');
    }
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();
    const pseudo = commentForm.pseudo.trim();
    const text = commentForm.text.trim();

    if (!pseudo || !text) {
      setCommentError('Merci de renseigner un pseudo et un commentaire.');
      return;
    }

    const newComment = {
      id: Date.now(),
      pseudo,
      text,
      createdAt: new Date().toISOString(),
      ownerId: viewerId,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentForm({ pseudo: '', text: '' });
    setCommentError('');
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => {
      const toDelete = prev.find((c) => c.id === commentId);
      if (!toDelete) return prev;

      const canManage =
        isAdmin ||
        (toDelete.ownerId && toDelete.ownerId === viewerId);

      if (!canManage) {
        // optionnel : on pourrait afficher un message, mais on reste discret côté UI
        return prev;
      }

      return prev.filter((c) => c.id !== commentId);
    });

    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  };

  const handleStartEditComment = (commentId) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;

    const canManage =
      isAdmin || (target.ownerId && target.ownerId === viewerId);
    if (!canManage) return;

    setEditingCommentId(commentId);
    setEditingCommentText(target.text || '');
    if (commentError) {
      setCommentError('');
    }
  };

  const handleSaveEditComment = () => {
    if (!editingCommentId) return;
    const trimmed = editingCommentText.trim();
    if (!trimmed) {
      setCommentError('Le commentaire ne peut pas être vide.');
      return;
    }

    setComments((prev) =>
      prev.map((c) =>
        c.id === editingCommentId
          ? {
              ...c,
              text: trimmed,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setEditingCommentId(null);
    setEditingCommentText('');
    setCommentError('');
  };

  // scroll en haut à chaque changement d'article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // détecter si l'admin est connecté (token stocké par le /admin)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const token = window.sessionStorage.getItem('adminToken');
      setIsAdmin(Boolean(token));
    } catch {
      setIsAdmin(false);
    }
  }, []);

  // charger le nombre de vues depuis les analytics (section_view sur blog/slug)
  useEffect(() => {
    if (!slug) return;
    try {
      const data = getAnalytics() || [];
      const sectionKey = `blog/${slug}`;

      const views = data.filter(
        (e) =>
          e?.metadata?.type === 'section_view' &&
          (e.metadata.section === sectionKey ||
            e.label === sectionKey ||
            e.metadata.path === `/blog/${slug}`)
      );
      setReadCount(views.length);
    } catch {
      setReadCount(0);
    }
  }, [slug]);

  // init état "like" à partir du localStorage
  useEffect(() => {
    if (!slug || typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(`kd-blog-like-${slug}`);
      if (raw === '1') setLiked(true);
    } catch {
      // ignore
    }
  }, [slug]);

  // persister le like
  useEffect(() => {
    if (!slug || typeof window === 'undefined') return;
    try {
      if (liked) {
        window.localStorage.setItem(`kd-blog-like-${slug}`, '1');
      } else {
        window.localStorage.removeItem(`kd-blog-like-${slug}`);
      }
    } catch {
      // ignore
    }
  }, [liked, slug]);

  const handleToggleLike = () => {
    setLiked((prev) => !prev);
  };

  const handleShare = async () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/blog/${slug}`
        : `https://kddervilon.com/blog/${slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url,
        });
        setShareFeedback('');
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setShareFeedback('Lien copié dans le presse-papier');
        setTimeout(() => setShareFeedback(''), 1800);
      }
    } catch {
      // utilisateur a annulé
    }
  };

  if (!article) {
    return (
      <Box component="main" sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Article introuvable
          </Typography>
          <Typography paragraph color="text.secondary" sx={{ mb: 3 }}>
            Cet article n&apos;existe pas ou a été déplacé.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/blog')}
          >
            Retour au blog
          </Button>
        </Container>
      </Box>
    );
  }

  const formattedDate = new Date(article.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const canonicalHref =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blog/${slug}`
      : `https://kddervilon.com/blog/${slug}`;

  return (
    <>
      <Helmet>
        <title>{`${article.title} - Blog KD Dervilon`}</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={canonicalHref} />
      </Helmet>

      {/* Skip link pour aller directement au contenu principal */}
      <Box component="nav" sx={{ position: 'absolute', left: 0, top: 0 }}>
        <MuiLink
          href="#main-content"
          sx={{
            position: 'absolute',
            left: '-10000px',
            top: 'auto',
            width: 1,
            height: 1,
            overflow: 'hidden',
            '&:focus': {
              position: 'static',
              width: 'auto',
              height: 'auto',
              m: 1,
              p: 1,
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: 1,
              zIndex: 1300,
            },
          }}
        >
          Aller directement au contenu principal
        </MuiLink>
      </Box>

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: { xs: 6, md: 8 },
          mt: { xs: 'calc(env(safe-area-inset-top) + 72px)', md: 0 },
        }}
      >
        <Container maxWidth="md">
          {/* Bouton retour */}
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/blog')}
            sx={{ mb: 3 }}
          >
            Retour au blog
          </Button>

          {/* Header article */}
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (t) =>
                `linear-gradient(135deg, ${alpha(
                  t.palette.primary.main,
                  0.04
                )}, ${alpha(t.palette.secondary.main, 0.02)})`,
            }}
          >
            <Chip
              label={article.category}
              sx={{
                mb: 2,
                fontWeight: 700,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                color: 'primary.main',
              }}
            />

            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2,
                letterSpacing: '-0.04em',
              }}
            >
              {article.title}
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{
                color: 'text.secondary',
                fontSize: 14,
                flexWrap: 'wrap',
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <CalendarToday fontSize="small" />
                <Typography
                  component="time"
                  dateTime={article.date}
                  variant="body2"
                >
                  {formattedDate}
                </Typography>
              </Stack>

              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                  display: { xs: 'none', sm: 'inline-block' },
                }}
              />

              <Stack direction="row" spacing={1.2} alignItems="center">
                <AccessTime fontSize="small" />
                <Typography variant="body2">
                  {article.readTime}
                </Typography>
              </Stack>

              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                  display: { xs: 'none', sm: 'inline-block' },
                }}
              />

              <Stack direction="row" spacing={1.2} alignItems="center">
                <Person fontSize="small" />
                <Typography variant="body2">
                  Par KD Dervilon
                </Typography>
              </Stack>
            </Stack>

            {/* Ligne vues + like + partage */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Visibility fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {readCount > 0
                    ? `${readCount} lecture${readCount > 1 ? 's' : ''}`
                    : 'Premières lectures en cours'}
                </Typography>
              </Stack>

              <Box sx={{ flexGrow: 1 }} />

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ color: 'text.secondary' }}
              >
                <IconButton
                  size="small"
                  onClick={handleToggleLike}
                  aria-label={
                    liked ? 'Retirer le like' : "J’aime cet article"
                  }
                  aria-pressed={liked}
                  sx={{
                    color: liked ? 'error.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: (t) =>
                        alpha(t.palette.error.main, 0.08),
                      color: 'error.main',
                    },
                  }}
                >
                  {liked ? (
                    <Favorite fontSize="small" />
                  ) : (
                    <FavoriteBorder fontSize="small" />
                  )}
                </IconButton>

                <IconButton
                  size="small"
                  onClick={handleShare}
                  aria-label="Partager l'article"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: (t) =>
                        alpha(t.palette.primary.main, 0.08),
                      color: 'primary.main',
                    },
                  }}
                >
                  <Share fontSize="small" />
                </IconButton>

                {shareFeedback && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {shareFeedback}
                  </Typography>
                )}
              </Stack>
            </Stack>

            {article.excerpt && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {article.excerpt}
                </Typography>
              </>
            )}
          </Paper>

          {/* Contenu de l'article */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <ReactMarkdown
              components={markdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {article.content}
            </ReactMarkdown>

            {/* Section commentaires */}
            <Box
              component="section"
              aria-labelledby="comments-title"
              sx={{ mt: 6 }}
            >
              <Typography
                id="comments-title"
                variant="h5"
                component="h2"
                sx={{ fontWeight: 800, mb: 2 }}
              >
                Commentaires
              </Typography>

              {/* Formulaire de commentaire */}
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmitComment}
                sx={{
                  mb: 4,
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: (t) => t.palette.primary.main,
                      fontWeight: 700,
                    }}
                    aria-hidden="true"
                  >
                    {commentForm.pseudo
                      ? commentForm.pseudo.trim().charAt(0).toUpperCase()
                      : 'K'}
                  </Avatar>

                  <Box sx={{ flexGrow: 1 }}>
                    <Stack spacing={2}>
                      <TextField
                        label="Pseudo"
                        variant="outlined"
                        fullWidth
                        value={commentForm.pseudo}
                        onChange={handleCommentFieldChange('pseudo')}
                        inputProps={{
                          'aria-label': 'Votre pseudo pour le commentaire',
                        }}
                      />
                      <TextField
                        label="Votre commentaire"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={3}
                        value={commentForm.text}
                        onChange={handleCommentFieldChange('text')}
                        inputProps={{
                          'aria-label': 'Contenu de votre commentaire',
                        }}
                      />
                      {commentError && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: -0.5 }}
                        >
                          {commentError}
                        </Typography>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          alignSelf: { xs: 'stretch', sm: 'flex-start' },
                          fontWeight: 700,
                          textTransform: 'none',
                        }}
                      >
                        Publier le commentaire
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Liste des commentaires */}
              {comments.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  Aucun commentaire pour le moment. Soyez le premier à réagir à
                  cet article.
                </Typography>
              ) : (
                <Stack spacing={2.5}>
                  {comments.map((comment) => {
                    const date =
                      comment.createdAt &&
                      !Number.isNaN(Date.parse(comment.createdAt))
                        ? new Date(comment.createdAt).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : null;

                    const updatedDate =
                      comment.updatedAt &&
                      !Number.isNaN(Date.parse(comment.updatedAt))
                        ? new Date(comment.updatedAt).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : null;

                    const canManage =
                      isAdmin ||
                      (comment.ownerId && comment.ownerId === viewerId);

                    return (
                      <Box
                        key={comment.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                          p: 2,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.default',
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: (t) => t.palette.primary.main,
                            fontWeight: 700,
                          }}
                          aria-hidden="true"
                        >
                          {comment.pseudo
                            ? comment.pseudo.trim().charAt(0).toUpperCase()
                            : 'A'}
                        </Avatar>
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.5 }}
                          >
                            <Typography
                              variant="subtitle2"
                              component="p"
                              sx={{ fontWeight: 700 }}
                            >
                              {comment.pseudo || 'Anonyme'}
                            </Typography>
                            {date && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {date}
                              </Typography>
                            )}
                            {updatedDate && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontStyle: 'italic' }}
                              >
                                · modifié le {updatedDate}
                              </Typography>
                            )}
                            {canManage && (
                              <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ ml: 1 }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleStartEditComment(comment.id)
                                  }
                                  aria-label={
                                    isAdmin
                                      ? "Modifier ce commentaire (administrateur)"
                                      : 'Modifier votre commentaire'
                                  }
                                >
                                  <Edit fontSize="inherit" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  aria-label={
                                    isAdmin
                                      ? "Supprimer ce commentaire (administrateur)"
                                      : 'Supprimer votre commentaire'
                                  }
                                >
                                  <Delete fontSize="inherit" />
                                </IconButton>
                              </Stack>
                            )}
                          </Stack>

                          {editingCommentId === comment.id ? (
                            <Box sx={{ mt: 1 }}>
                              <TextField
                                label={
                                  isAdmin
                                    ? 'Modifier ce commentaire'
                                    : 'Modifier votre commentaire'
                                }
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={2}
                                size="small"
                                value={editingCommentText}
                                onChange={(e) =>
                                  setEditingCommentText(e.target.value)
                                }
                                inputProps={{
                                  'aria-label': isAdmin
                                    ? 'Contenu du commentaire à modifier'
                                    : 'Contenu de votre commentaire à modifier',
                                }}
                                sx={{ mb: 1 }}
                              />
                              <Stack direction="row" spacing={1}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={handleSaveEditComment}
                                  sx={{ textTransform: 'none', fontWeight: 700 }}
                                >
                                  Enregistrer
                                </Button>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditingCommentText('');
                                    setCommentError('');
                                  }}
                                >
                                  Annuler
                                </Button>
                              </Stack>
                            </Box>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                            >
                              {comment.text}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                border: (t) =>
                  `1px dashed ${alpha(t.palette.primary.main, 0.4)}`,
              }}
            >
              <Typography
                variant="subtitle1"
                component="p"
                fontWeight={700}
                gutterBottom
              >
                Discuter d’un projet similaire ?
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Vous avez un projet de chatbot IA, d’automatisation
                support ou un cas d’usage RAG à tester ? Je peux vous
                aider à cadrer un POC ou un MVP.
              </Typography>
              <Button
                variant="contained"
                href="/#contact"
                sx={{ fontWeight: 700, textTransform: 'none' }}
              >
                Me contacter
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default BlogArticle;