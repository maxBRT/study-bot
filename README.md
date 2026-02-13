# Study Bot

Study Bot est un compagnon d'étude propulsé par l'IA. L'application permet aux utilisateurs de poser des questions, obtenir des explications et maîtriser n'importe quel sujet à travers des conversations interactives avec différents modèles d'IA (GPT-3.5 Turbo, GPT-4, GPT-5).

## Technologies utilisées

| Technologie | Version |
|---|---|
| Bun | 1.3 |
| React | 19 |
| React Router | 7.13 |
| TypeScript | 5.9 |
| Tailwind CSS | 4.1 |
| shadcn/ui | latest |
| Better Auth (Stack Auth) | 1.4 |
| Express | 5.2 |
| Prisma | 7.1 |
| PostgreSQL | Latest |
| OpenAI SDK | 6.10 |
| Docker | Latest |

## Instructions d'installation

### Prérequis

Avant de commencer, configurez les variables d'environnement dans les fichiers `.env` des dossiers `frontend/` et `backend/`.

#### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `API_URL` | URL du backend (défaut : `http://localhost:3000`) |

#### Backend (`backend/.env`)

Copier les variables d'environnement fournies dans le fichier `.env` à la racine du dossier `backend`.

**Variables requises :**

| Variable | Description |
|---|---|
| `DB_TYPE` | Type de base de données (`PG` pour local, `NEON` pour Neon) |
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `TEST_DATABASE_URL` | URL de connexion pour les tests |
| `BETTER_AUTH_SECRET` | Clé secrète pour Better Auth |
| `BETTER_AUTH_URL` | URL de l'application (ex: `http://localhost:3000`) |
| `OPENAI_API_KEY` | Clé API OpenAI |
| `FRONTEND_URL` | URL du frontend (ex: `http://localhost:4321`) |
| `PORT` | Port du serveur backend (défaut : `3000`) |
| `GITHUB_CLIENT_ID` | ID client OAuth GitHub |
| `GITHUB_CLIENT_SECRET` | Secret client OAuth GitHub |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails |
| `RESEND_EMAIL` | Adresse email d'envoi |
| `VERIFY_EMAIL` | Activer la vérification des emails (`true`/`false`) |

> **Note :** [Resend](https://resend.com/docs/dashboard/emails/introduction) permet uniquement d'envoyer des emails à l'adresse liée au compte. La vérification des emails est désactivée par défaut.

---

### Installation avec Docker (Recommendé)

```bash
git clone https://github.com/maxBRT/study-bot.git
cd study-bot-project
docker compose up --build
```

### Installation locale

#### Prérequis supplémentaires

- [Bun](https://bun.sh/) installé
- [Node.js](https://nodejs.org/) installé (pour le backend)

#### Frontend

```bash
cd frontend
bun install
bun run dev
# Accessible à http://localhost:4321
```

#### Backend

```bash
cd backend

# 1. Installer les dépendances
npm install

# 2. Générer le client Prisma
npx prisma generate

# 3. Lancer le serveur
npm run dev
# Accessible à http://localhost:3000
# Documentation API : http://localhost:3000/docs
```

## Captures d'écran

1. Page d'accueil / Landing page

<img width="1904" height="918" alt="image" src="https://github.com/user-attachments/assets/6b7cb192-866c-4775-a76b-fb02d1c536a4" />
<img width="1903" height="916" alt="image" src="https://github.com/user-attachments/assets/8eb6879e-a3b9-4824-8b7f-d32eec3fbacd" />
<img width="1899" height="914" alt="image" src="https://github.com/user-attachments/assets/8017cedd-4320-4aaa-8f76-da11ea48d2a0" />

3. Dashboard avec une conversation

<img width="1905" height="915" alt="image" src="https://github.com/user-attachments/assets/7154e1cb-9725-4de4-b5e7-b341a2e862ac" />

3. Page de profil avec les statistiques

<img width="1905" height="916" alt="image" src="https://github.com/user-attachments/assets/8535aa71-089a-4322-91af-479509c6e35d" />

## L'intelligence artificielle a été utilisée dans ce projet pour :
- Déboguer le code.
- Conseils sur les meilleures pratiques.
- Proposer des suggestions de refactorisation.
- Assister à la résolution de problèmes techniques.
- Corriger les fautes d'orthographe dans la documentation.

> Le fichier CLAUDE.md est créer par défault lors de bun init. 

## Auteur

Maxime Bourret

