// Page de connexion : email + mot de passe.
// En cas de succès, on garde le jeton et on va sur la page d'accueil.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appelerApi } from '../../lib/api.js';
import { enregistrerJeton } from '../../lib/session.js';

export default function PageConnexion() {
  // Ce que l'utilisateur est en train de taper
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  // Message d'erreur à afficher (vide = aucune erreur)
  const [messageErreur, setMessageErreur] = useState('');

  // Vrai pendant l'envoi : évite de cliquer deux fois sur le bouton
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const naviguer = useNavigate();

  async function envoyerFormulaire(evenement) {
    // Empêche le navigateur de recharger la page à l'envoi du formulaire
    evenement.preventDefault();

    setMessageErreur('');
    setEnvoiEnCours(true);

    try {
      const reponse = await appelerApi('/auth/login', {
        method: 'POST',
        corps: { email, motDePasse },
      });

      enregistrerJeton(reponse.token);
      naviguer('/');
    } catch (erreur) {
      setMessageErreur(erreur.message);
    } finally {
      // Exécuté dans tous les cas, succès ou erreur
      setEnvoiEnCours(false);
    }
  }

  return (
    <main>
      <h1>Connexion</h1>

      <form onSubmit={envoyerFormulaire}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(evenement) => setEmail(evenement.target.value)}
          />
        </div>

        <div>
          <label htmlFor="motDePasse">Mot de passe</label>
          <input
            id="motDePasse"
            type="password"
            autoComplete="current-password"
            required
            value={motDePasse}
            onChange={(evenement) => setMotDePasse(evenement.target.value)}
          />
        </div>

        {/* role="alert" : les lecteurs d'écran annoncent l'erreur */}
        {messageErreur && <p role="alert">{messageErreur}</p>}

        <button type="submit" disabled={envoiEnCours}>
          {envoiEnCours ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p>
        Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
      </p>
    </main>
  );
}