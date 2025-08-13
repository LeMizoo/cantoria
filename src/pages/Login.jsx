import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/members');
    } catch (err) {
      setError('Email ou mot de passe invalide');
    }
  };

  return (
    <div className="auth-page">
      <h1>Connexion</h1>
      {error && <p className="error">{error}</p>}
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
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Se connecter</button>
      </form>
      <p>
        Mot de passe oublié ? <Link to="/forgot-password">Réinitialiser</Link>
      </p>
      <p>
        Pas de compte ? <Link to="/signup">Inscription</Link>
      </p>
    </div>
  );
}