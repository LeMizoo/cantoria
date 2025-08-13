// src/pages/Gallery.jsx
import React from 'react';
import { useMedia }  from '../hooks/useMedia';
import PhotoGrid     from '../components/PhotoGrid.jsx';

export default function Gallery() {
  const mediaItems = useMedia();

  return (
    <div className="page-gallery">
      <h1>Galerie des Médias</h1>
      <PhotoGrid items={mediaItems} />
    </div>
  );
}