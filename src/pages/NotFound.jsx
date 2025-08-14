import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound-page" style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>404 – Page introuvable</h1>
      <p>Le contenu que vous cherchez n’existe pas ou a été déplacé.</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
        Retour à l’accueil
      </Link>
    </div>
  );
};

export default NotFound;