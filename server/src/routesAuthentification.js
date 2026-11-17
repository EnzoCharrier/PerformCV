// Ce fichier contient les routes liées aux comptes :
//   POST /api/auth/register  -> créer un compte étudiant
//   POST /api/auth/login     -> se connecter
//   GET  /api/auth/me        -> récupérer son propre profil

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { baseDeDonnees } from './baseDeDonnees.js';
import { verifierConnexion } from './controleAcces.js';

const routeur = Router();

// Anti force brute : 10 tentatives de connexion maximum
// par adresse IP toutes les 15 minutes
const limiteTentativesConnexion = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Trop de tentatives, réessayez plus tard' },
});

// Crée le jeton qui prouve que l'utilisateur est connecté.
// Il contient son id et son rôle, et expire au bout de 2 heures.
function creerJetonConnexion(utilisateur) {
  const informationsDuJeton = { id: utilisateur.id, role: utilisateur.role };

  return jwt.sign(informationsDuJeton, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
}

// Retire le mot de passe (même haché) avant d'envoyer l'utilisateur au client
function retirerMotDePasse(utilisateur) {
  const { motDePasse, ...utilisateurSansMotDePasse } = utilisateur;
  return utilisateurSansMotDePasse;
}

// Vérifie qu'une valeur est un texte qui n'est pas vide.
// Le test "typeof" évite qu'un client envoie un objet ou un nombre à la place.
function estTexteNonVide(valeur) {
  return typeof valeur === 'string' && valeur.trim() !== '';
}

// ---------- INSCRIPTION ----------
routeur.post('/register', async (req, res) => {
  // Données envoyées par le formulaire d'inscription
  const { nom, prenom, email, motDePasse, classe, anneeBTS } = req.body;

  // 1. Vérification des données reçues
  const lesDonneesSontValides =
    estTexteNonVide(nom) &&
    estTexteNonVide(prenom) &&
    estTexteNonVide(email) &&
    estTexteNonVide(classe) &&
    typeof motDePasse === 'string' &&
    motDePasse.length >= 8 &&
    motDePasse.length <= 72 && // 72 = longueur maximale acceptée par bcrypt
    [1, 2].includes(anneeBTS); // BTS 1ère ou 2e année

  if (!lesDonneesSontValides) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  try {
    // 2. Création de l'utilisateur dans la base
    const nouvelUtilisateur = await baseDeDonnees.utilisateur.create({
      data: {
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim().toLowerCase(), // "Lea@test.fr" = "lea@test.fr"
        classe: classe.trim(),
        anneeBTS,
        motDePasse: await bcrypt.hash(motDePasse, 12), // jamais stocké en clair
        role: 'ETUDIANT', // toujours étudiant, le client ne choisit jamais son rôle
      },
    });

    // 3. On renvoie le jeton (utilisateur connecté d'office) et son profil
    res.status(201).json({
      token: creerJetonConnexion(nouvelUtilisateur),
      user: retirerMotDePasse(nouvelUtilisateur),
    });
  } catch (erreur) {
    // P2002 est le code Prisma pour "cette valeur existe déjà" (ici : l'email)
    if (erreur.code === 'P2002') {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    // Toute autre erreur est inattendue : Express renverra une erreur 500
    throw erreur;
  }
});

// ---------- CONNEXION ----------
routeur.post('/login', limiteTentativesConnexion, async (req, res) => {
  const { email, motDePasse } = req.body;

  // 1. Vérification des données reçues
  if (!estTexteNonVide(email) || !estTexteNonVide(motDePasse)) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  // 2. Recherche de l'utilisateur par son email
  const utilisateur = await baseDeDonnees.utilisateur.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  // 3. Comparaison du mot de passe saisi avec le mot de passe haché en base
  const motDePasseCorrect =
    utilisateur && (await bcrypt.compare(motDePasse, utilisateur.motDePasse));

  // Même message si l'email n'existe pas OU si le mot de passe est faux :
  // on ne révèle pas quels emails sont inscrits
  if (!motDePasseCorrect) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // 4. Connexion réussie : on renvoie le jeton et le profil
  res.json({
    token: creerJetonConnexion(utilisateur),
    user: retirerMotDePasse(utilisateur),
  });
});

// ---------- PROFIL DE L'UTILISATEUR CONNECTÉ ----------
// verifierConnexion s'exécute avant : si le jeton est invalide, on n'arrive jamais ici
routeur.get('/me', verifierConnexion, async (req, res) => {
  const utilisateur = await baseDeDonnees.utilisateur.findUnique({
    where: { id: req.utilisateurConnecte.id },
  });

  // Cas rare : le compte a été supprimé alors que le jeton est encore valide
  if (!utilisateur) {
    return res.status(401).json({ error: 'Utilisateur introuvable' });
  }

  res.json(retirerMotDePasse(utilisateur));
});

export default routeur;