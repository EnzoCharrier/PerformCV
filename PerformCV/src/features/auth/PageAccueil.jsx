// Page d'accueil provisoire : affiche le profil de l'utilisateur connecté.
// Si personne n'est connecté, on renvoie vers la page de connexion.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appelerApi } from '../../lib/api.js';
import { supprimerJeton } from '../../lib/session.js';

export default function PageAccueil() {
  const [utilisateur, setUtilisateur] = useState(null);
  const naviguer = useNavigate();

  // Au chargement de la page, on demande au serveur "qui suis-je ?"
  useEffect(() => {
    appelerApi('/auth/me')
      .then(setUtilisateur)
      .catch(() => {
        // Pas de jeton, jeton expiré ou refusé : retour à la connexion
        supprimerJeton();
        naviguer('/connexion');
      });
  }, [naviguer]);

  function seDeconnecter() {
    supprimerJeton();
    naviguer('/connexion');
  }

  // Tant que le serveur n'a pas répondu
  if (!utilisateur) {
    return <p>Chargement...</p>;
  }

  return (
    <main>
      <h1>Bonjour {utilisateur.prenom} {utilisateur.nom}</h1>
      <p>Rôle : {utilisateur.role}</p>
      <button onClick={seDeconnecter}>Se déconnecter</button>
    </main>
  );
}