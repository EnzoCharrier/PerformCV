// Page d'inscription d'un étudiant.
// Le serveur connecte l'étudiant d'office après l'inscription (il renvoie un jeton).

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appelerApi } from '../../lib/api.js';
import { enregistrerJeton } from '../../lib/session.js';

export default function PageInscription() {
  // Tous les champs sont regroupés dans un seul objet.
  // Les clés ont les mêmes noms que ceux attendus par le serveur.
  const [formulaire, setFormulaire] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    classe: '',
    anneeBTS: '1', // un champ de formulaire donne toujours du texte
  });

  const [messageErreur, setMessageErreur] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const naviguer = useNavigate();

  // Une seule fonction pour tous les champs.
  // Elle utilise l'attribut "name" du champ pour savoir lequel modifier.
  function modifierChamp(evenement) {
    const { name, value } = evenement.target;
    setFormulaire({ ...formulaire, [name]: value });
  }

  async function envoyerFormulaire(evenement) {
    evenement.preventDefault();

    setMessageErreur('');
    setEnvoiEnCours(true);

    try {
      const reponse = await appelerApi('/auth/register', {
        method: 'POST',
        corps: {
          ...formulaire,
          // Le serveur attend le nombre 1 ou 2, pas le texte "1" ou "2"
          anneeBTS: Number(formulaire.anneeBTS),
        },
      });

      enregistrerJeton(reponse.token);
      naviguer('/');
    } catch (erreur) {
      setMessageErreur(erreur.message);
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <main>
      <h1>Inscription</h1>

      <form onSubmit={envoyerFormulaire}>
        <div>
          <label htmlFor="nom">Nom</label>
          <input
            id="nom"
            name="nom"
            type="text"
            autoComplete="family-name"
            required
            maxLength={100}
            value={formulaire.nom}
            onChange={modifierChamp}
          />
        </div>

        <div>
          <label htmlFor="prenom">Prénom</label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            autoComplete="given-name"
            required
            maxLength={100}
            value={formulaire.prenom}
            onChange={modifierChamp}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formulaire.email}
            onChange={modifierChamp}
          />
        </div>

        <div>
          <label htmlFor="motDePasse">Mot de passe (8 caractères minimum)</label>
          <input
            id="motDePasse"
            name="motDePasse"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={formulaire.motDePasse}
            onChange={modifierChamp}
          />
        </div>

        <div>
          <label htmlFor="classe">Classe (ex : SIO1)</label>
          <input
            id="classe"
            name="classe"
            type="text"
            required
            maxLength={50}
            value={formulaire.classe}
            onChange={modifierChamp}
          />
        </div>

        <div>
          <label htmlFor="anneeBTS">Année de BTS</label>
          <select
            id="anneeBTS"
            name="anneeBTS"
            value={formulaire.anneeBTS}
            onChange={modifierChamp}
          >
            <option value="1">1ère année</option>
            <option value="2">2e année</option>
          </select>
        </div>

        {messageErreur && <p role="alert">{messageErreur}</p>}

        <button type="submit" disabled={envoiEnCours}>
          {envoiEnCours ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>

      <p>
        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </main>
  );
}