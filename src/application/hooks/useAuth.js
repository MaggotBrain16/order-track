// src/application/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const authService = new AuthService();

export function useAuth() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
            try {
                setLoading(true);
                setError(null);

                if (firebaseUser) {
                    setUser(firebaseUser);

                    // Récupérer le profil utilisateur depuis Firestore
                    try {
                        const userRepository = new UserRepository();
                        const profile = await userRepository.getById(firebaseUser.uid);
                        setUserProfile(profile);
                    } catch (profileError) {
                        console.warn("Impossible de charger le profil utilisateur:", profileError);
                        setUserProfile(null);
                    }
                } else {
                    setUser(null);
                    setUserProfile(null);
                }
            } catch (err) {
                console.error('Erreur lors de la récupération du profil:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const firebaseUser = await authService.login(email, password);
            setUser(firebaseUser);
            return firebaseUser;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, displayName = null) => {
        try {
            setLoading(true);
            setError(null);
            const firebaseUser = await authService.register(email, password, displayName);
            setUser(firebaseUser);
            return firebaseUser;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);
            await authService.logout();
            setUser(null);
            setUserProfile(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        userProfile,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };
}
