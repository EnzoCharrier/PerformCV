// fichier qui garde le jeton de connexion dans le navigateur.
// Le jeton est la "preuve" que l'utilisateur est connecté : le serveur le renvoie
// à la connexion, et on le renvoie à chaque requête ensuite.

const CLE_DU_JETON = 'jeton';

export function lireJeton() {
  return localStorage.getItem(CLE_DU_JETON);
}

export function enregistrerJeton(jeton) {
  localStorage.setItem(CLE_DU_JETON, jeton);
}

// Se déconnecter = oublier le jeton
export function supprimerJeton() {
  localStorage.removeItem(CLE_DU_JETON);
}