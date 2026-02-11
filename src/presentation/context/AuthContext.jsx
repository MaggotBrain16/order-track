// src/presentation/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../infrastructure/firebase/config";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
                console.error("Erreur lors de la récupération du profil:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        userProfile,
        loading,
        error,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Export nommé correct
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
