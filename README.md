# Study Bot

Backend d'une application web de chat avec intelligence artificielle permettant aux utilisateurs de créer des conversations avec un assistant IA. Le système inclut un mécanisme de gestion de tokens pour contrôler l'utilisation de l'API OpenAI.

## Architecture du Projet

### Composants Principaux

#### 1. Authentification (Better Auth)

L'application utilise [Better Auth](https://www.better-auth.com/) pour gérer l'authentification des utilisateurs :

- Inscription/connexion par email et mot de passe
- Gestion des sessions
- Middleware d'authentification pour protéger les routes

> Le restes des fonctionnalités d'autentification comme:
> - la vérification des email
> - les mots de passe oubliés
> - les connexions avec 0Auth seront implémentées sur le front-end.
> - le changement de courriel.
> - la suppression du compte.
> Seront tous implémenter sur le frontend avec BetterAuth -> [Voir doc](https://www.better-auth.com/docs/concepts/users-accounts)

**Routes d'authentification :**

- `POST /api/auth/sign-up/email` - Créer un compte
- `POST /api/auth/sign-in/email` - Se connecter
- `POST /api/auth/sign-out` - Se déconnecter
- `GET /api/auth/get-session` - Obtenir la session courante
- `GET /api/auth/list-sessions` - Lister toutes les sessions

#### 3. Routes API

**Routes publiques :**

- `/api/auth/*` - Authentification
- `/webhooks/stripe` - Endpoints pour "Acheter des tokens" (Simule un webhook stripe)

**Routes protégées** (nécessitent authentification) :

- `GET /chats` - Lister les conversations de l'utilisateur
- `GET /chats/:id` - Obtenir une conversation spécifique avec ses messages
- `POST /chats` - Créer une nouvelle conversation
- `DELETE /chats/:id` - Supprimer une conversation
- `POST /messages` - Envoyer un message à l'IA (streaming)
- `GET /me` - Obtenir les informations de l'utilisateur connecté
- `GET /token-usages` - Lister les transaction de tokens
- `GET /token-usages/:id` - Obtenir une utilisation spécifique

#### 4. Gestion des Tokens

Le système implémente un mécanisme de "pay-per-use" :

1. Chaque utilisateur commence avec 1000 tokens gratuits
2. Les tokens se rechargent automatiquement (1000 tokens aux 2 minutes pour faciliter les tests)
3. Avant chaque message, le middleware `tokenUsageMiddleware` vérifie qu'il reste au moins 100 tokens
4. Après chaque réponse de l'IA, les tokens consommés sont déduits du solde
5. Les utilisateurs peuvent acheter des tokens supplémentaires via `/webhooks/stripe`

#### 5. Intégration OpenAI

L'application utilise l'API Chat Completion d'OpenAI avec :

- Streaming des réponses (Server-Sent Events)
- Support de plusieurs modèles (les tests utilisent gpt-4.1-nano pour réduire les couts)
- Comptage des tokens avec la bibliothèque `tiktoken`
- Contexte conversationnel (historique des messages)
- Instructions système pour guider le comportement de l'IA ([prompts/system.md](prompts/system.md))

### Flux de Données

1. **Authentification**

   ```
   Client → POST /api/auth/sign-in/email
         → Better Auth vérifie les credentials
         → Session créée et cookie envoyé
   ```

2. **Envoi d'un message**
   ```
   Client → POST /messages {input, chatId, modelName}
         → authMiddleware vérifie la session
         → tokenUsageMiddleware vérifie le solde de tokens
         → Récupération de l'historique du chat
         → Appel à l'API OpenAI avec streaming
         → Calcul et déduction des tokens consommés
         → Sauvegarde du message et des TokenUsage
         → Réponse streamée au client (SSE)
   ```

## Installation et Configuration

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/maxBRT/study-bot.git
   cd study-bot
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

Copier les variables d'environnement fournies dans le fichier de remise dans `.env` à la racine du projet.

4. **Générer le client Prisma et migrer la base de données**

   ```bash
   npx prisma generate
   ```

5. **Lancer l'application**

   ```bash
   npm run dev
   ```

## Tests

L'application utilise **Vitest** comme framework de tests.
Les tests sont exécutés en mode séquentiel pour éviter les conflits de base de données.
Malheureusement, ça les rends beaucoup plus lents...

### Structure des Tests

- **Tests unitaires** ([tests/unit/](tests/unit/)) : Testent chaque contrôleur et middleware individuellement
- **Tests d'intégration** ([tests/integration/](tests/integration/)) : Testent des scénarios utilisateur complets end-to-end

### Configuration des Tests

Le fichier [vitest.config.ts](vitest.config.ts) configure :

- Utilisation d'une base de données de test séparée (`TEST_DATABASE_URL`)
- Exécution séquentielle pour éviter les conflits de base de données
- Timeout de 30 secondes pour les tests asynchrones

### Exécuter les Tests

**Lancer tous les tests :**

```bash
npm test -- --ui
```

### Types de Tests

#### Tests Unitaires

Les tests unitaires vérifient chaque composant isolément :

- **Controllers** : Testent la logique métier de chaque endpoint

  - [tests/unit/controllers/chats.test.ts](tests/unit/contollers/chats.test.ts)
  - [tests/unit/controllers/messages.test.ts](tests/unit/contollers/messages.test.ts)
  - [tests/unit/controllers/tokenUsages.test.ts](tests/unit/contollers/tokenUsages.test.ts)
  - [tests/unit/controllers/me.test.ts](tests/unit/contollers/me.test.ts)

- **Middlewares** : Testent l'authentification et la vérification des tokens
  - [tests/unit/middlewares/auth.test.ts](tests/unit/middlewares/auth.test.ts)
  - [tests/unit/middlewares/token.test.ts](tests/unit/middlewares/token.test.ts)

#### Tests d'Intégration

Le fichier [tests/integration/userJourney.test.ts](tests/integration/userJourney.test.ts) contient des scénarios complets :

1. **Test de parcours utilisateur complet**

   - Crée un utilisateur
   - Crée un chat
   - Envoie un message
   - Vérifie la consommation de tokens
   - Vérifie la mise à jour du solde

2. **Test de conversation multi-tours**

   - Simule plusieurs échanges consécutifs
   - Vérifie l'accumulation correcte des tokens
   - Valide la persistance de l'historique

3. **Test d'épuisement des tokens**
   - Simule un utilisateur avec peu de tokens
   - Vérifie que le solde ne devient jamais négatif
   - Teste les limites du système

#### Tests Manuels

**REST Client :**

Le fichier [rest_client.http](rest_client.http) permet de tester tous les endpoints directement dans VSCode avec l'extension "REST Client".

**Script de Streaming :**

Le script [tests/stream.sh](tests/stream.sh) permet de tester le streaming en temps réel dans le terminal :

dépendance -> [curl](https://curl.se/windows/)

```bash
chmod +x tests/stream.sh
./tests/stream.sh
```

### Helpers de Tests

- [tests/helpers/authHelpers.ts](tests/helpers/authHelpers.ts) : Utilitaires pour créer des utilisateurs de test
- [tests/helpers/mockRequest.ts](tests/helpers/mockRequest.ts) : Création de requêtes/réponses Express mockées

## Technologies Utilisées

- **Backend** : Node.js, Express.js, TypeScript
- **Base de données** : PostgreSQL (Neon), Prisma ORM
- **Authentification** : Better Auth
- **IA** : OpenAI API
- **Tests** : Vitest
- **Utilitaires** : tiktoken (comptage de tokens), dotenv

## Diagramme de la Base de Données

Le diagramme SQL complet est disponible dans [Diagramme SQL.pdf](Diagramme%20SQL.pdf).
