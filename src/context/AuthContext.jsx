import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userMeta, setUserMeta]       = useState(null);
  const [loading, setLoading]         = useState(true);

  // Surveille l’authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);
      if (user) {
        // Récupère les métadonnées (rôle, displayName, etc.)
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserMeta(snap.data());
        }
      } else {
        setUserMeta(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Inscription + création du profil en Firestore
  async function signup(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Met à jour le profile Firebase
    await updateProfile(cred.user, { displayName });
    // Crée le document Firestore avec role "member" par défaut
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid:         cred.user.uid,
      email,
      displayName,
      role:        'member',
      createdAt:   Date.now(),
    });
    return cred.user;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Mise à jour du profil (nom, photo)
  async function updateUserProfile(updates) {
    if (!auth.currentUser) throw new Error('Pas d’utilisateur connecté');
    await updateProfile(auth.currentUser, updates);
    // Répercute aussi dans Firestore
    const ref = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(ref, updates);
  }

  const value = {
    currentUser,
    userMeta,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}