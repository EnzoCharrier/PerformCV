// Ce fichier crée la connexion à la base de données MariaDB.
// Il est importé par les autres fichiers qui ont besoin de lire ou d'écrire des données.

// Charge les variables du fichier .env (DATABASE_URL, etc.)
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

// DATABASE_URL ressemble à : mysql://utilisateur:motdepasse@adresse:3306/PerformCV
// On la découpe pour récupérer chaque information séparément
const adresseBaseDeDonnees = new URL(process.env.DATABASE_URL);

// L'adaptateur fait le lien entre Prisma et MariaDB
const adaptateurMariaDb = new PrismaMariaDb({
  host: adresseBaseDeDonnees.hostname,
  port: Number(adresseBaseDeDonnees.port) || 3306,
  user: decodeURIComponent(adresseBaseDeDonnees.username),
  password: decodeURIComponent(adresseBaseDeDonnees.password),
  database: adresseBaseDeDonnees.pathname.slice(1), // enlève le "/" au début
});

// Un seul client partagé dans toute l'application.
// Exemple d'utilisation : baseDeDonnees.utilisateur.findMany()
export const baseDeDonnees = new PrismaClient({ adapter: adaptateurMariaDb });