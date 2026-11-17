// Point d'entrée : c'est ce fichier qu'on lance avec "npm run dev".
// Il configure le serveur Express et branche les routes.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routesAuthentification from './routesAuthentification.js';

// Le serveur refuse de démarrer sans clé secrète pour signer les jetons
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET manquant dans le fichier .env');
  process.exit(1);
}

const application = express();

// Ajoute des en-têtes HTTP de sécurité
application.use(helmet());

// N'autorise que le site React (CLIENT_URL) à appeler cette API
application.use(cors({ origin: process.env.CLIENT_URL }));

// Permet de lire le JSON envoyé par le client, avec une taille maximale
application.use(express.json({ limit: '10kb' }));

// Route de test : sert à vérifier que le serveur fonctionne
application.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Toutes les routes de routesAuthentification.js commencent par /api/auth
application.use('/api/auth', routesAuthentification);

// Démarrage du serveur
const port = process.env.PORT || 3000;

application.listen(port, () => {
  console.log(`API disponible sur http://localhost:${port}`);
});