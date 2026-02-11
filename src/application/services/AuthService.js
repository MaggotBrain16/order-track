// src/application/services/AuthService.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/config';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(email, password, displayName = null) {
        try {
            // Créer l'utilisateur dans Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Mettre à jour le displayName
            if (displayName) {
                await updateProfile(userCredential.user, { displayName });
            }

            // Créer le document utilisateur dans Firestore
            await this.userRepository.createUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: displayName || userCredential.user.email,
                role: 'client',
                createdAt: new Date()
            });

            return userCredential.user;
        } catch (error) {
            throw new Error(this.mapAuthError(error.code));
        }
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw new Error(this.mapAuthError(error.code));
        }
    }

    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            throw new Error('Erreur lors de la déconnexion');
        }
    }

    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, callback);
    }

    getCurrentUser() {
        return auth.currentUser;
    }

    mapAuthError(errorCode) {
        const errorMap = {
            'auth/user-not-found': 'Aucun compte trouvé avec cet email',
            'auth/wrong-password': 'Mot de passe incorrect',
            'auth/email-already-in-use': 'Cet email est déjà utilisé',
            'auth/invalid-email': 'Email invalide',
            'auth/weak-password': 'Mot de passe trop faible (minimum 6 caractères)',
            'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
            'auth/network-request-failed': 'Problème de connexion réseau'
        };

        return errorMap[errorCode] || 'Erreur d\'authentification inconnue';
    }
}
