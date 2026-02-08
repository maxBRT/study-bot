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
> Note : NEON à été retirer du project pour prioriser la contenerisation. Plus de detail dans le rapport technique.
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

<img width="1904" height="918" alt="image" src="https://github.com/user-attachments/assets/6b7cb192-866c-4775-a76b-fb02d1c536a4" />
<img width="1903" height="916" alt="image" src="https://github.com/user-attachments/assets/8eb6879e-a3b9-4824-8b7f-d32eec3fbacd" />
<img width="1899" height="914" alt="image" src="https://github.com/user-attachments/assets/8017cedd-4320-4aaa-8f76-da11ea48d2a0" />

3. Dashboard avec une conversation

<img width="1905" height="915" alt="image" src="https://github.com/user-attachments/assets/7154e1cb-9725-4de4-b5e7-b341a2e862ac" />

3. Page de profil avec les statistiques

<img width="1905" height="916" alt="image" src="https://github.com/user-attachments/assets/8535aa71-089a-4322-91af-479509c6e35d" />


## Auteur

Maxime Bourret

