// src/infrastructure/repositories/ProcessLabelRepository.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ProcessLabelMapper } from '../mappers/ProcessLabelMapper';

export class ProcessLabelRepository {
    constructor() {
        this.collectionName = 'processLabel';
        // ✅ Pas besoin d'instancier le mapper si les méthodes sont statiques
    }

    async create(labelData) {
        try {
            // ✅ Utiliser ProcessLabelMapper.toPersistence (statique)
            const docRef = await addDoc(collection(db, this.collectionName), {
                ...ProcessLabelMapper.toPersistence(labelData),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(docRef);
            // ✅ Utiliser ProcessLabelMapper.toDomain (statique)
            return ProcessLabelMapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error creating process label:', error);
            throw new Error('Failed to create process label');
        }
    }

    async getById(id) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return ProcessLabelMapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error getting process label by ID:', error);
            throw new Error('Failed to get process label');
        }
    }

    async update(id, updateData) {
        try {
            const labelRef = doc(db, this.collectionName, id);

            // ✅ Pour les updates partiels, ne pas passer par toPersistence
            await updateDoc(labelRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(labelRef);
            return ProcessLabelMapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error updating process label:', error);
            throw new Error('Failed to update process label');
        }
    }

    async delete(id) {
        try {
            const labelRef = doc(db, this.collectionName, id);
            await deleteDoc(labelRef);
        } catch (error) {
            console.error('Error deleting process label:', error);
            throw new Error('Failed to delete process label');
        }
    }

    async getByCompany(companyId) {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('companyId', '==', companyId),
                orderBy('order', 'asc')
            );

            const querySnapshot = await getDocs(q);
            // ✅ Utiliser ProcessLabelMapper.toDomain (statique)
            return querySnapshot.docs.map(doc => ProcessLabelMapper.toDomain(doc));
        } catch (error) {
            console.error('Error getting process labels by company:', error);
            throw new Error('Failed to get process labels by company');
        }
    }

    async getAll() {
        try {
            const q = query(
                collection(db, this.collectionName),
                orderBy('order', 'asc')
            );

            const querySnapshot = await getDocs(q);
            // ✅ Utiliser ProcessLabelMapper.toDomain (statique)
            return querySnapshot.docs.map(doc => ProcessLabelMapper.toDomain(doc));
        } catch (error) {
            console.error('Error getting all process labels:', error);
            throw new Error('Failed to get all process labels');
        }
    }
}