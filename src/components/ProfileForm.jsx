// src/components/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileForm() {
  const { currentUser, userMeta, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL]       = useState('');
  const [error, setError]             = useState('');
  const [message, setMessage]         = useState('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(userMeta?.photoURL || '');
    }
  }, [currentUser, userMeta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await updateUserProfile({ displayName, photoURL });
      setMessage('Profil mis à jour !');
    } catch (err) {
      setError('Erreur lors de la mise à jour.');
    }
  };

  return (
    <div className="profile-form">
      <h2>Mon profil</h2>
      {error   && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nom affiché
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
          />
        </label>
        <label>
          URL de ma photo
          <input
            type="url"
            value={photoURL}
            onChange={e => setPhotoURL(e.target.value)}
          />
        </label>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}