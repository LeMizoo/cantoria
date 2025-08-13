// src/hooks/useMedia.js
import { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

export function useMedia() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const q  = query(
      collection(db, 'media'),
      orderBy('createdAt', 'desc')
    );

    // Abonnement en temps réel
    const unsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMedia(items);
    });

    // Cleanup à la désallocation du hook
    return unsubscribe;
  }, []);

  return media;
}