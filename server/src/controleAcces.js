// Ce fichier contient les "gardiens" qui décident si une requête a le droit
// d'accéder à une route. On les place devant les routes à protéger.

import jwt from 'jsonwebtoken';

// Gardien n°1 : vérifie que l'utilisateur est connecté.
// Le client doit envoyer l'en-tête : Authorization: Bearer <jeton>
export function verifierConnexion(req, res, next) {
  // On récupère le jeton en retirant le mot "Bearer " au début
  const enteteAuthorization = req.headers.authorization || '';
  const jeton = enteteAuthorization.replace('Bearer ', '');

  try {
    // Vérifie que le jeton est authentique et n'a pas expiré.
    // Si oui, on range son contenu (id et rôle) dans la requête
    // pour que la route suivante puisse l'utiliser.
    req.utilisateurConnecte = jwt.verify(jeton, process.env.JWT_SECRET);

    // Tout va bien : on passe à l'étape suivante
    next();
  } catch (erreur) {
    // Jeton absent, falsifié ou expiré : on arrête ici
    res.status(401).json({ error: 'Non connecté' });
  }
}

// Gardien n°2 : vérifie que l'utilisateur a le bon rôle.
// À placer APRÈS verifierConnexion.
// Exemple : router.get('/admin', verifierConnexion, verifierRole('ADMIN'), ...)
export function verifierRole(roleAutorise) {
  return (req, res, next) => {
    const roleDeLUtilisateur = req.utilisateurConnecte.role;

    if (roleDeLUtilisateur !== roleAutorise) {
      // Connecté, mais pas le droit d'accéder à cette route
      return res.status(403).json({ error: 'Accès interdit' });
    }

    next();
  };
}