# PerformCV

Plateforme de création de CV pour les BTS SIO du lycée Fulbert.

## Technologies
React (Vite) · Node.js / Express · Prisma · MariaDB

## Prérequis
- Node.js 20 ou plus
- Accès à la base MariaDB

## Installation

### Serveur
```
cd server
npm install
```
Ouvrez `.env` et renseignez la connexion à la base. Puis :
```
npx prisma7 generate
npm run dev
```
L'API tourne sur http://localhost:3000/api/health

### Client
```
cd client
npm install
npm run dev
```
Le site tourne sur http://localhost:5173

## Organisation du travail
- `main` : version stable
- `dev` : développement en cours
