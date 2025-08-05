import React, { createContext, useState, useEffect, useRef } from 'react';
import { auth } from '../FireBase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (isMounted.current) {
        console.log('AuthProvider: Auth state changed, user:', currentUser ? currentUser.uid : 'none');
        // فحص إضافي لمنع التحديثات المتكررة
        if (JSON.stringify(currentUser) !== JSON.stringify(user) || loading) {
          setUser(currentUser);
          setLoading(false);
        }
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      isMounted.current = false;
      unsubscribe();
    };
  }, [user, loading]);

  const login = async (user) => {
    try {
      console.log('AuthProvider: Login called with user:', user ? user.uid : 'none');
      setLoading(true);
      setUser(user);
    } catch (error) {
      console.error('AuthProvider: Error during login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthProvider: Starting logout');
      setLoading(true);
      await signOut(auth);
      setUser(null);
      console.log('AuthProvider: User signed out successfully');
    } catch (error) {
      console.error('AuthProvider: Error during sign out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};