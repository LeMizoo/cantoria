// src/router.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages publiques
import Home           from './pages/Home.jsx';
import Vision         from './pages/Vision.jsx';
import Team           from './pages/Team.jsx';
import InMemoriam     from './pages/InMemoriam.jsx';
import Locations      from './pages/Locations.jsx';
import Repertoire     from './pages/Repertoire.jsx';
import Collaborations from './pages/Collaborations.jsx';
import Distribution   from './pages/Distribution.jsx';
import Gallery        from './pages/Gallery.jsx';
import Spirituality   from './pages/Spirituality.jsx';
import Contact        from './pages/Contact.jsx';

// Authentification
import Signup         from './pages/Signup.jsx';
import Login          from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

// Espace utilisateur
import MemberArea     from './pages/MemberArea.jsx';

// Admin
import AdminMembers   from './pages/AdminMembers.jsx';
import AdminMedia     from './pages/AdminMedia.jsx';

import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminRoute }     from './components/AdminRoute.jsx';

export default function Router() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"               element={<Home />} />
      <Route path="/vision"         element={<Vision />} />
      <Route path="/team"           element={<Team />} />
      <Route path="/in-memoriam"    element={<InMemoriam />} />
      <Route path="/locations"      element={<Locations />} />
      <Route path="/repertoire"     element={<Repertoire />} />
      <Route path="/collaborations" element={<Collaborations />} />
      <Route path="/distribution"   element={<Distribution />} />
      <Route path="/gallery"        element={<Gallery />} />
      <Route path="/spirituality"   element={<Spirituality />} />
      <Route path="/contact"        element={<Contact />} />

      {/* Auth public */}
      <Route path="/signup"          element={<Signup />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Espace Membre */}
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <MemberArea />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/members"
        element={
          <AdminRoute>
            <AdminMembers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/media"
        element={
          <AdminRoute>
            <AdminMedia />
          </AdminRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}