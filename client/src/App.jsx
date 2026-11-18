// Liste des pages du site et de leur adresse.
// Structure commune à toutes les pages (barre de navigation) + liste des routes.

import { Routes, Route, Link } from 'react-router-dom';
import ThemeToggle from './assets/ThemeToggle.jsx';
import PageLanding from './features/accueil/PageLanding.jsx';
import PageConnexion from './features/auth/PageConnexion.jsx';
import PageInscription from './features/auth/PageInscription.jsx';
import PageAccueil from './features/auth/PageAccueil.jsx';

export default function App() {
  return (
    <div>
      {/* Link remplace <a> : la navigation se fait sans recharger la page */}
      <nav>
  <a href="/" className="logo">
    <img src="/favicon.svg" alt="" width="28" height="28" />
    <span>PerformCV</span>
  </a>
 
  <span className="nav__divider" aria-hidden="true"></span>
 
  <a href="/">Accueil</a>
  <a href="/fonctionnalites">Fonctionnalités</a>
  <a href="/aide">Aide</a>
  <ThemeToggle />
</nav>
      <Routes>
        <Route path="/" element={<PageLanding />} />
        <Route path="/connexion" element={<PageConnexion />} />
        <Route path="/inscription" element={<PageInscription />} />
        <Route path="/mon-compte" element={<PageAccueil />} />
      </Routes>
    </div>
  );
}