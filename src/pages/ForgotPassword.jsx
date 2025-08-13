import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await resetPassword(email);
      setMessage('Un email de réinitialisation a été envoyé.');
    } catch (err) {
      setError('Impossible d’envoyer l’email. Vérifie ton adresse.');
    }
  };

  return (
    <div className="auth-page">
      <h1>Mot de passe oublié</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Envoyer le lien</button>
      </form>
      <p>
        <Link to="/login">Retour à la connexion</Link>
      </p>
    </div>
  );
}