// src/components/UploadMedia.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function UploadMedia() {
  const storage       = getStorage();
  const db            = getFirestore();
  const { currentUser } = useAuth();
  const dropRef       = useRef();

  // files sélectionnés via input ou drop
  const [files, setFiles]     = useState([]);
  // uploads contient { file, preview, progress, url, error }
  const [uploads, setUploads] = useState([]);

  // 1) Setup drag & drop
  useEffect(() => {
    const el = dropRef.current;
    const prevent = e => { e.preventDefault(); e.stopPropagation(); };

    const onDrop = e => {
      prevent(e);
      const dropped = Array.from(e.dataTransfer.files);
      setFiles(f => [...f, ...dropped]);
    };

    ['dragenter','dragover','dragleave','drop'].forEach(evt => {
      el.addEventListener(evt, prevent);
    });
    el.addEventListener('drop', onDrop);

    return () => {
      ['dragenter','dragover','dragleave','drop'].forEach(evt => {
        el.removeEventListener(evt, prevent);
      });
      el.removeEventListener('drop', onDrop);
    };
  }, []);

  // 2) Génère un objet upload avec preview dès ajout dans files
  useEffect(() => {
    if (!files.length) return;
    const newUploads = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      url: null,
      error: null
    }));
    setUploads(u => [...u, ...newUploads]);
    setFiles([]); // on vire les files car géré via uploads
  }, [files]);

  // 3) Lance l’upload d’un media & enregistre en Firestore
  const startUpload = (item) => {
    const fileName   = `${Date.now()}_${item.file.name}`;
    const storageRef = ref(storage, `media/${fileName}`);
    const task       = uploadBytesResumable(storageRef, item.file);

    task.on('state_changed',
      snapshot => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploads(upl =>
          upl.map(u => u.file === item.file
            ? { ...u, progress: pct }
            : u
          )
        );
      },
      err => {
        setUploads(upl =>
          upl.map(u => u.file === item.file
            ? { ...u, error: err.message }
            : u
          )
        );
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        // update local state
        setUploads(upl =>
          upl.map(u => u.file === item.file
            ? { ...u, url, progress: 100 }
            : u
          )
        );
        // enregistrer en Firestore
        try {
          await addDoc(collection(db, 'media'), {
            uid:         currentUser.uid,
            displayName: currentUser.displayName,
            name:        item.file.name,
            type:        item.file.type,
            size:        item.file.size,
            url,
            createdAt:   serverTimestamp()
          });
        } catch (e) {
          console.error('Erreur enregistrement Firestore :', e);
        }
      }
    );
  };

  // 4) Retirer un upload de la liste
  const removeUpload = (file) => {
    setUploads(upl => upl.filter(u => u.file !== file));
  };

  return (
    <div className="upload-media-advanced">
      <h2>Ajouter des médias</h2>

      {/* Drag & drop + input */}
      <div ref={dropRef} className="drop-zone">
        Glisse-dépose tes fichiers ici ou{' '}
        <label className="btn-select">
          sélectionne
          <input
            type="file"
            multiple
            accept="image/*,audio/*,video/*"
            onChange={e => setFiles(f => [...f, ...Array.from(e.target.files)])}
          />
        </label>
      </div>

      {/* Galerie de previews */}
      {uploads.length > 0 && (
        <div className="preview-grid">
          {uploads.map((u, i) => (
            <div key={i} className="preview-item">
              {/* Aperçu */}
              {u.file.type.startsWith('image/') && <img src={u.preview} alt="" />}
              {u.file.type.startsWith('audio/') && <audio controls src={u.preview} />}
              {u.file.type.startsWith('video/') && <video controls src={u.preview} />}

              {/* Barre de progression */}
              <div className="progress-bar">
                <div
                  className="progress-filled"
                  style={{ width: `${u.progress}%` }}
                />
              </div>

              {/* Actions & statut */}
              <div className="preview-meta">
                <span>{u.file.name}</span>
                {u.url && <a href={u.url} target="_blank" rel="noreferrer">✔️</a>}
                {u.error && <span className="error">❌</span>}
                {!u.url && !u.error && u.progress === 0 && (
                  <button onClick={() => startUpload(u)}>⬆️</button>
                )}
                <button onClick={() => removeUpload(u.file)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}