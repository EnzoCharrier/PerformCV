// Page d'accueil publique : présente le site et invite à s'inscrire.

import { Link } from 'react-router-dom';

export default function PageLanding() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <h1 id="hero-title">
            Créez votre CV pour votre stage en quelques minutes
          </h1>
          <p className="hero__text">
            Un CV propre, à jour et cohérent, prêt à être exporté en PDF.
          </p>
          <div className="hero__actions">
            <Link to="/inscription" className="btn btn--primary">Commencer mon CV</Link>
            <Link to="/connexion" className="btn btn--secondary">Se connecter</Link>
          </div>
        </div>

        <figure className="hero__visual">
          <img
            src="/apercu-cv.png"
            alt="Aperçu d'un CV généré avec PerformCV"
            width="480"
            height="620"
          />
        </figure>
      </section>
    </main>
  );
}