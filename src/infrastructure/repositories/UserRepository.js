// src/infrastructure/repositories/UserRepository.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { UserMapper } from '../mappers/UserMapper';

export class UserRepository {
    constructor() {
        this.collectionName = 'users';
        this.mapper = new UserMapper();
    }

    async getById(id) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            return this.mapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw new Error('Failed to get user');
        }
    }

    async getByEmail(email) {
        try {
            const q = query(collection(db, this.collectionName), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const docSnap = querySnapshot.docs[0];
            return this.mapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw new Error('Failed to get user by email');
        }
    }

    async getByRole(role) {
        try {
            const q = query(collection(db, this.collectionName), where('role', '==', role));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => this.mapper.toDomain(doc));
        } catch (error) {
            console.error('Error getting users by role:', error);
            throw new Error('Failed to get users by role');
        }
    }

    async getByCompany(companyId) {
        try {
            const q = query(collection(db, this.collectionName), where('companyId', '==', companyId));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => this.mapper.toDomain(doc));
        } catch (error) {
            console.error('Error getting users by company:', error);
            throw new Error('Failed to get users by company');
        }
    }

    async createUser(userData) {
        try {
            const userRef = doc(db, this.collectionName, userData.uid);
            const userToPersist = this.mapper.toPersistence(userData);

            await setDoc(userRef, {
                ...userToPersist,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(userRef);
            return this.mapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

    async updateUser(userId, updateData) {
        try {
            const userRef = doc(db, this.collectionName, userId);
            const updateToPersist = this.mapper.toPersistence(updateData);

            await updateDoc(userRef, {
                ...updateToPersist,
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(userRef);
            return this.mapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }

    async deleteUser(userId) {
        try {
            const userRef = doc(db, this.collectionName, userId);
            await deleteDoc(userRef);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
}
