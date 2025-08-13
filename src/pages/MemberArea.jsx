// src/pages/MemberArea.jsx
import React from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import ProfileForm     from '../components/ProfileForm.jsx';
import UploadMedia     from '../components/UploadMedia.jsx';
import MessageBoard    from '../components/MessageBoard.jsx';

export default function MemberArea() {
  return (
    <ProtectedRoute>
      <div className="member-area">
        <h1>Espace Membre</h1>

        <section>
          <ProfileForm />
        </section>

        <section>
          <UploadMedia />
        </section>

        <section>
          <MessageBoard />
        </section>
      </div>
    </ProtectedRoute>
  );
}