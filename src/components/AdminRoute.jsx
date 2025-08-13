// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // On suppose que `user.isAdmin` est un booléen fourni par ton AuthContext
  if (!user || !user.isAdmin) {
    // Si on n’est pas admin, on renvoie vers l’accueil
    return <Navigate to="/" replace />;
  }

  return children;
}