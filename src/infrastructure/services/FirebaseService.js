// src/infrastructure/services/FirebaseService.js
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

export class FirebaseService {
    static async createDocument(collectionName, data) {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    }

    static async getDocument(collectionName, id) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    }

    static async updateDocument(collectionName, id, data) {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    }

    static async deleteDocument(collectionName, id) {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    }

    static async queryDocuments(collectionName, conditions = [], orderByField = null) {
        let q = collection(db, collectionName);

        // Apply conditions
        conditions.forEach(condition => {
            q = query(q, where(condition.field, condition.operator, condition.value));
        });

        // Apply ordering
        if (orderByField) {
            q = query(q, orderBy(orderByField.field, orderByField.direction || 'asc'));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static subscribeToCollection(collectionName, callback, orderByField = 'createdAt') {
        const q = query(collection(db, collectionName), orderBy(orderByField, 'desc'));
        return onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(docs);
        });
    }

    static subscribeToQuery(collectionName, conditions, callback) {
        let q = collection(db, collectionName);
        conditions.forEach(condition => {
            q = query(q, where(condition.field, condition.operator, condition.value));
        });
        q = query(q, orderBy('createdAt', 'desc'));

        return onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(docs);
        });
    }
}
