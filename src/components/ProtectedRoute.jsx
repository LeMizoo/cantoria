// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Si l’utilisateur n’est pas connecté, redirige vers /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, affiche le contenu protégé
  return children;
}