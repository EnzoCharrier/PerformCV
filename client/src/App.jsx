// Liste des pages du site et de leur adresse.

import { Routes, Route } from 'react-router-dom';
import PageAccueil from './features/auth/PageAccueil.jsx';
import PageConnexion from './features/auth/PageConnexion.jsx';
import PageInscription from './features/auth/PageInscription.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PageAccueil />} />
      <Route path="/connexion" element={<PageConnexion />} />
      <Route path="/inscription" element={<PageInscription />} />
    </Routes>
  );
}