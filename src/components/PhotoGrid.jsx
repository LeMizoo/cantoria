// src/components/PhotoGrid.jsx
import React from 'react';

export default function PhotoGrid({ items }) {
  if (!items.length) {
    return <p>Aucun média pour l’instant.</p>;
  }

  return (
    <div className="photo-grid">
      {items.map(m => {
        // Firestore Timestamp -> JavaScript Date
        const date = m.createdAt?.toDate
          ? m.createdAt.toDate()
          : new Date(m.createdAt.seconds * 1000);

        return (
          <div key={m.id} className="photo-grid__item">
            {m.type.startsWith('image/')   && <img   src={m.url} alt={m.name} />}
            {m.type.startsWith('audio/')   && <audio controls src={m.url} />}
            {m.type.startsWith('video/')   && <video controls src={m.url} />}

            <div className="photo-grid__meta">
              <strong>{m.displayName}</strong>
              <time dateTime={date.toISOString()}>
                {date.toLocaleString()}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}