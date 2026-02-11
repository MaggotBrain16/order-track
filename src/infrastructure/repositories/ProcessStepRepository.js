// src/infrastructure/repositories/ProcessStepRepository.js
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
import { ProcessStepMapper } from '../mappers/ProcessStepMapper'; // CORRECT

export class ProcessStepRepository {
    constructor() {
        this.collectionName = 'processStep';
    }

    async create(stepData) {
        try {
            const docRef = await addDoc(collection(db, this.collectionName), {
                ...ProcessStepMapper.toPersistence(stepData), // CORRECT MAPPER
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(docRef);
            return ProcessStepMapper.toDomain(docSnap); // CORRECT MAPPER
        } catch (error) {
            console.error('Error creating process step:', error);
            throw new Error('Failed to create process step');
        }
    }

    async getById(id) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return ProcessStepMapper.toDomain(docSnap); // CORRECT MAPPER
        } catch (error) {
            console.error('Error getting process step by ID:', error);
            throw new Error('Failed to get process step');
        }
    }

    async update(id, updateData) {
        try {
            const stepRef = doc(db, this.collectionName, id);

            await updateDoc(stepRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(stepRef);
            return ProcessStepMapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error updating process step:', error);
            throw new Error('Failed to update process step');
        }
    }


    async delete(id) {
        try {
            const stepRef = doc(db, this.collectionName, id);
            await deleteDoc(stepRef);
        } catch (error) {
            console.error('Error deleting process step:', error);
            throw new Error('Failed to delete process step');
        }
    }

    async getByOrder(orderId) {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('orderId', '==', orderId),
                orderBy('position', 'asc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ProcessStepMapper.toDomain(doc)); // CORRECT MAPPER
        } catch (error) {
            console.error('Error getting process steps by order:', error);
            throw new Error('Failed to get process steps by order');
        }
    }

    async getAll() {
        try {
            const q = query(
                collection(db, this.collectionName),
                orderBy('position', 'asc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ProcessStepMapper.toDomain(doc)); // CORRECT MAPPER
        } catch (error) {
            console.error('Error getting all process steps:', error);
            throw new Error('Failed to get all process steps');
        }
    }
}
