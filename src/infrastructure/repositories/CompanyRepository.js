// src/infrastructure/repositories/CompanyRepository.js
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { CompanyMapper } from '../mappers/CompanyMapper';

export class CompanyRepository {
    constructor() {
        this.collectionName = 'companies';
        this.mapper = new CompanyMapper(); // ← AJOUTER CETTE LIGNE
    }

    async getById(id) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return this.mapper.toDomain(docSnap); // ← Utiliser this.mapper
        } catch (error) {
            console.error('Error getting company by ID:', error);
            throw new Error('Failed to get company');
        }
    }

    async create(companyData) {
        try {
            let companyRef;
            if (companyData.id) {
                companyRef = doc(db, this.collectionName, companyData.id);
            } else {
                companyRef = doc(collection(db, this.collectionName));
            }

            const companyToPersist = this.mapper.toPersistence(companyData); // ← this.mapper

            await setDoc(companyRef, {
                ...companyToPersist,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(companyRef);
            return this.mapper.toDomain(docSnap); // ← this.mapper
        } catch (error) {
            console.error('Error creating company:', error);
            throw new Error('Failed to create company');
        }
    }

    async update(id, updateData) {
        try {
            const companyRef = doc(db, this.collectionName, id);
            const updateToPersist = this.mapper.toPersistence(updateData); // ← this.mapper

            await updateDoc(companyRef, {
                ...updateToPersist,
                updatedAt: serverTimestamp()
            });

            const docSnap = await getDoc(companyRef);
            return this.mapper.toDomain(docSnap); // ← this.mapper
        } catch (error) {
            console.error('Error updating company:', error);
            throw new Error('Failed to update company');
        }
    }

    async delete(id) {
        try {
            const companyRef = doc(db, this.collectionName, id);
            await deleteDoc(companyRef);
        } catch (error) {
            console.error('Error deleting company:', error);
            throw new Error('Failed to delete company');
        }
    }
}
