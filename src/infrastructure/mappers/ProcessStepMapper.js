// src/infrastructure/mappers/ProcessStepMapper.js
import { ProcessStep, MiniStep } from '../../core/entities/ProcessStep';

export class ProcessStepMapper {
    static toDomain(doc) {
        if (!doc || !doc.exists()) return null;
        const data = doc.data();

        // Convertir les mini-steps avec meilleure gestion des dates
        const miniSteps = Array.isArray(data.miniSteps)
            ? data.miniSteps.map(ms => {
                let createdAt = new Date();
                if (ms.createdAt) {
                    if (typeof ms.createdAt === 'string') {
                        createdAt = new Date(ms.createdAt);
                    } else if (ms.createdAt.toDate) {
                        createdAt = ms.createdAt.toDate();
                    } else {
                        createdAt = ms.createdAt;
                    }
                }

                return new MiniStep({
                    id: ms.id || "",
                    title: ms.title || "",
                    notes: ms.notes || "",
                    photos: Array.isArray(ms.photos) ? ms.photos : [],
                    completed: ms.completed || false,
                    createdBy: ms.createdBy || null,
                    createdAt: createdAt
                });
            })
            : [];

        // Gestion des dates principales
        let createdAt = new Date();
        let updatedAt = new Date();

        if (data.createdAt) {
            if (typeof data.createdAt === 'string') {
                createdAt = new Date(data.createdAt);
            } else if (data.createdAt.toDate) {
                createdAt = data.createdAt.toDate();
            } else {
                createdAt = data.createdAt;
            }
        }

        if (data.updatedAt) {
            if (typeof data.updatedAt === 'string') {
                updatedAt = new Date(data.updatedAt);
            } else if (data.updatedAt.toDate) {
                updatedAt = data.updatedAt.toDate();
            } else {
                updatedAt = data.updatedAt;
            }
        }

        return new ProcessStep({
            id: doc.id,
            orderId: data.orderId || "",
            labelId: data.labelId || "",
            labelName: data.labelName || "",
            status: data.status || "pending",
            position: data.position || 0,
            attributedTo: Array.isArray(data.attributedTo) ? data.attributedTo : [],
            miniSteps: miniSteps,
            createdAt: createdAt,
            updatedAt: updatedAt
        });
    }

    static toPersistence(step) {
        const s = step instanceof ProcessStep ? step : new ProcessStep(step);

        // ✅ Convertir les MiniStep en objets simples
        const cleanedMiniSteps = s.miniSteps.map(ms => ({
            id: ms.id || "",
            title: ms.title || "",
            notes: ms.notes || "",
            photos: Array.isArray(ms.photos) ? ms.photos : [],
            completed: ms.completed || false,
            createdBy: ms.createdBy || null,
            createdAt: ms.createdAt instanceof Date ? ms.createdAt : new Date(ms.createdAt || Date.now())
        }));

        return {
            orderId: s.orderId || "",
            labelId: s.labelId || "",
            labelName: s.labelName || "",
            status: s.status || "pending",
            position: s.position || 0,
            attributedTo: Array.isArray(s.attributedTo) ? s.attributedTo : [],
            miniSteps: cleanedMiniSteps, // ✅ Objets simples
            createdAt: s.createdAt instanceof Date ? s.createdAt : new Date(s.createdAt || Date.now()),
            updatedAt: s.updatedAt instanceof Date ? s.updatedAt : new Date(s.updatedAt || Date.now())
        };
    }

    static fromFirestoreSnapshot(snapshot) {
        return this.toDomain(snapshot);
    }

    static toFirestoreObject(entity) {
        return this.toPersistence(entity);
    }
}
