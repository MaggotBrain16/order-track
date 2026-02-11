// src/infrastructure/mappers/ProcessLabelMapper.js
import { ProcessLabel } from '../../core/entities/ProcessLabel';

export class ProcessLabelMapper {
    static toDomain(doc) {
        if (!doc || !doc.exists()) return null;
        const data = doc.data();

        return new ProcessLabel({
            id: doc.id,
            name: data.name || "",
            color: data.color || "#3b82f6",
            order: data.order || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            companyId: data.companyId || null
        });
    }

    static toPersistence(label) {
        const l = label instanceof ProcessLabel ? label : new ProcessLabel(label);

        return {
            name: l.name,
            color: l.color,
            order: l.order,
            companyId: l.companyId,
            createdAt: l.createdAt,
            updatedAt: l.updatedAt
        };
    }

    static fromFirestoreSnapshot(snapshot) {
        return this.toDomain(snapshot);
    }

    static toFirestoreObject(entity) {
        return this.toPersistence(entity);
    }
}
