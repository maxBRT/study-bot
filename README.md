# Study Bot

**Lien GitHub :** https://github.com/maxBRT/study-bot

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

### Installation avec Docker (Recommendé)

```bash
git clone https://github.com/maxBRT/study-bot.git
cd study-bot-project
docker compose up --build
```

### Installation locale

#### Prérequis

- [Bun](https://bun.sh/) installé
- [Node.js](https://nodejs.org/) installé (pour le backend)
- PostgreSQL en cours d'exécution
- Clés API OpenAI

### Installation locale

```bash
# Cloner le projet
git clone https://github.com/maxBRT/study-bot.git
cd study-bot-project

# --- Frontend ---
cd frontend
bun install
bun run dev
# Accessible à http://localhost:4321

# --- Backend (dans un autre terminal) ---
cd backend
npm install
npx prisma generate
npm run dev
# Accessible à http://localhost:3000
```

## Variables d'environnement

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `API_URL` | URL du backend (défaut : `http://localhost:3000`) |

### Backend (`backend/.env`)

Voir les instructions dans le fichier (README)[https://github.com/maxBRT/study-bot/tree/main/backend] du dossier `backend`.

## Captures d'écran

1. Page d'accueil / Landing page
2. Dashboard avec une conversation
3. Page de profil avec les statistiques

## Auteur

Maxime Bourret

