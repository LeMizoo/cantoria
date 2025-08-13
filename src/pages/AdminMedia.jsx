// src/pages/AdminMedia.jsx
import React from 'react';
import { useMedia } from '../hooks/useMedia';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { AdminRoute } from '../components/AdminRoute.jsx';

export default function AdminMedia() {
  const media    = useMedia();
  const db       = getFirestore();
  const storage  = getStorage();

  const handleDelete = async (m) => {
    // 1) Supprime le doc Firestore
    await deleteDoc(doc(db, 'media', m.id));

    // 2) Supprime le fichier dans Storage (si possible)
    try {
      const segments   = m.url.split('/');
      const fileName   = segments[segments.length - 1].split('?')[0];
      const mediaRef   = ref(storage, `media/${fileName}`);
      await deleteObject(mediaRef);
    } catch (err) {
      console.warn("Impossible de supprimer le fichier Storage :", err);
    }
  };

  return (
    <AdminRoute>
      <div className="admin-media">
        <h1>Modération des Médias</h1>
        {media.length === 0 ? (
          <p>Aucun média trouvé.</p>
        ) : (
          <table className="admin-media__table">
            <thead>
              <tr>
                <th>Aperçu</th>
                <th>Nom</th>
                <th>Utilisateur</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {media.map(m => {
                const date = m.createdAt?.toDate
                  ? m.createdAt.toDate()
                  : new Date(m.createdAt.seconds * 1000);
                return (
                  <tr key={m.id}>
                    <td>
                      {m.type.startsWith('image/') && (
                        <img src={m.url} alt={m.name} className="thumb" />
                      )}
                      {m.type.startsWith('audio/') && (
                        <audio controls src={m.url} className="thumb-audio" />
                      )}
                      {m.type.startsWith('video/') && (
                        <video controls src={m.url} className="thumb" />
                      )}
                    </td>
                    <td>{m.name}</td>
                    <td>{m.displayName}</td>
                    <td>{date.toLocaleString()}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(m)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminRoute>
  );
}