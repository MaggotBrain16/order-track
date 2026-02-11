// src/infrastructure/repositories/OrderRepository.js
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
import { OrderMapper } from '../mappers/OrderMapper';

export class OrderRepository {
    constructor() {
        this.collectionName = 'order';
    }

    async create(orderData) {
        try {
            // ✅ Utiliser OrderMapper.toPersistence (méthode statique)
            const persistenceData = OrderMapper.toPersistence(orderData);

            const docRef = await addDoc(collection(db, this.collectionName), {
                ...persistenceData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(docRef);
            // ✅ Utiliser OrderMapper.toDomain (méthode statique)
            return OrderMapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Failed to create order');
        }
    }

    async getById(id) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return OrderMapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error getting order by ID:', error);
            throw new Error('Failed to get order');
        }
    }

    async update(id, updateData) {
        try {
            const orderRef = doc(db, this.collectionName, id);

            // ✅ Pour les updates partiels, ne pas passer par toPersistence si ce n'est pas un objet Order complet
            const dataToUpdate = {
                ...updateData,
                updatedAt: serverTimestamp()
            };

            await updateDoc(orderRef, dataToUpdate);

            const docSnap = await getDoc(orderRef);
            return OrderMapper.toDomain(docSnap);
        } catch (error) {
            console.error('Error updating order:', error);
            throw new Error('Failed to update order');
        }
    }

    async delete(id) {
        try {
            const orderRef = doc(db, this.collectionName, id);
            await deleteDoc(orderRef);
        } catch (error) {
            console.error('Error deleting order:', error);
            throw new Error('Failed to delete order');
        }
    }

    async getByStatus(statuses) {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('status', 'in', statuses),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => OrderMapper.toDomain(doc));
        } catch (error) {
            console.error('Error getting orders by status:', error);
            throw new Error('Failed to get orders by status');
        }
    }

    async getByClient(clientId) {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('clientId', '==', clientId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => OrderMapper.toDomain(doc));
        } catch (error) {
            console.error('Error getting orders by client:', error);
            throw new Error('Failed to get orders by client');
        }
    }

    async getAll() {
        try {
            const q = query(
                collection(db, this.collectionName),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => OrderMapper.toDomain(doc));
        } catch (error) {
            console.error('Error getting all orders:', error);
            throw new Error('Failed to get all orders');
        }
    }
}