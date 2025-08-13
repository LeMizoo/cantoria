// src/App.jsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout';
import MainRouter from './MainRouter';

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <MainRouter />
    </AuthProvider>
  );
}