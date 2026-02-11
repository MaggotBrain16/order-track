// src/infrastructure/repositories/BaseRepository.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

export class BaseRepository {
    constructor(collectionName, mapper) {
        this.collectionName = collectionName;
        this.mapper = mapper;
        this.db = db;
    }

    async getById(id) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return this.mapper.toDomain(docSnap);
        } catch (error) {
            console.error(`Error getting ${this.collectionName} by ID:`, error);
            throw new Error(`Failed to get ${this.collectionName}`);
        }
    }

    async getByField(field, value) {
        try {
            const q = query(
                collection(this.db, this.collectionName),
                where(field, '==', value)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return [];
            }

            return querySnapshot.docs.map(doc => this.mapper.toDomain(doc));
        } catch (error) {
            console.error(`Error getting ${this.collectionName} by ${field}:`, error);
            throw new Error(`Failed to get ${this.collectionName}`);
        }
    }

    async create(entity) {
        try {
            // Si pas d'ID, Firestore en génère un auto
            const docRef = entity.id
                ? doc(this.db, this.collectionName, entity.id)
                : doc(collection(this.db, this.collectionName));

            const dataToPersist = this.mapper.toPersistence(entity);

            await setDoc(docRef, {
                ...dataToPersist,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(docRef);
            return this.mapper.toDomain(docSnap);
        } catch (error) {
            console.error(`Error creating ${this.collectionName}:`, error);
            throw new Error(`Failed to create ${this.collectionName}`);
        }
    }

    async update(id, updateData) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            const dataToPersist = this.mapper.toPersistence(updateData);

            await updateDoc(docRef, {
                ...dataToPersist,
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(docRef);
            return this.mapper.toDomain(docSnap);
        } catch (error) {
            console.error(`Error updating ${this.collectionName}:`, error);
            throw new Error(`Failed to update ${this.collectionName}`);
        }
    }

    async delete(id) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error(`Error deleting ${this.collectionName}:`, error);
            throw new Error(`Failed to delete ${this.collectionName}`);
        }
    }
}
