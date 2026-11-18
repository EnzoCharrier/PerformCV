// Ce fichier contient LA fonction qui parle au serveur.
// Les composants ne font jamais de "fetch" eux-mêmes : ils passent par ici.
// Avantage : le jeton et la gestion des erreurs sont écrits une seule fois.

import { lireJeton } from './session.js';

// Grâce au proxy de Vite, "/api" est redirigé vers le serveur Node
const ADRESSE_API = '/api';

// Exemple : appelerApi('/auth/login', { method: 'POST', corps: { email, motDePasse } })
export async function appelerApi(chemin, options = {}) {
  const jeton = lireJeton();

  let reponse;
  try {
    reponse = await fetch(ADRESSE_API + chemin, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Si on est connecté, on joint le jeton à la requête
        ...(jeton && { Authorization: `Bearer ${jeton}` }),
      },
      body: options.corps ? JSON.stringify(options.corps) : undefined,
    });
  } catch (erreur) {
    // fetch échoue seulement si le serveur est injoignable
    throw new Error('Le serveur est injoignable, réessayez plus tard');
  }

  // Le serveur répond en JSON. Si ce n'est pas le cas, on obtient null.
  const donnees = await reponse.json().catch(() => null);

  // Les codes 400, 401, 409... : on transforme la réponse en erreur.
  // Le serveur envoie toujours le message dans le champ "error".
  if (!reponse.ok) {
    throw new Error(donnees?.error || 'Une erreur est survenue');
  }

  return donnees;
}