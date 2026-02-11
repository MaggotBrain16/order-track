// src/infrastructure/mappers/OrderStepMapper.js
import { OrderStep } from '../../core/entities/OrderStep';

export class OrderStepMapper {
    static toDomain(doc) {
        if (!doc || !doc.exists()) return null;
        const data = doc.data();

        return new OrderStep({
            id: doc.id,
            orderId: data.order_id || null,
            label: data.label || "",
            status: data.status || "",
            updatedAt: data.update_at || null
        });
    }

    static toPersistence(step) {
        const s = step instanceof OrderStep ? step : new OrderStep(step);

        return {
            order_id: s.orderId || null,
            label: s.label || "",
            status: s.status || "",
            update_at: s.updatedAt || null
        };
    }

    static fromFirestoreSnapshot(snapshot) {
        return this.toDomain(snapshot);
    }

    static toFirestoreObject(entity) {
        return this.toPersistence(entity);
    }
}
