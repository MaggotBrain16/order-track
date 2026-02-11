// src/infrastructure/mappers/UserMapper.js
import { User } from '../../core/entities/User';

export class UserMapper {
    toDomain(doc) {
        if (!doc || !doc.exists()) return null;
        const data = doc.data();

        return new User({
            uid: doc.id,
            email: data.email || null,
            displayName: data.displayName || null,
            role: data.role || 'client',
            companyId: data.companyId || null,
            companyName: data.companyName || null,
            createdAt: data.createdAt || null
        });
    }

    toPersistence(user) {
        const u = user instanceof User ? user : new User(user || {});
        return {
            email: u.email || null,
            displayName: u.displayName || null,
            role: u.role || 'client',
            companyId: u.companyId || null,
            companyName: u.companyName || null,
            createdAt: u.createdAt || null
        };
    }

    fromFirestoreSnapshot(snapshot) {
        return this.toDomain(snapshot);
    }

    toFirestoreObject(entity) {
        return this.toPersistence(entity);
    }

    fromFirebaseAuth(firebaseUser) {
        if (!firebaseUser) return null;

        return new User({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: 'client', // Default role, will be updated from Firestore
            createdAt: firebaseUser.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date()
        });
    }
}
