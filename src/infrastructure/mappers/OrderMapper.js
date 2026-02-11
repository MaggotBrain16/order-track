// src/infrastructure/mappers/OrderMapper.js
import { Order } from '../../core/entities/Order';

export class OrderMapper {
    static toDomain(doc) {
        if (!doc || !doc.exists()) return null;
        const data = doc.data();

        return new Order({
            id: doc.id,
            orderNumber: data.orderNumber || "",
            clientId: data.clientId ?? null,
            clientName: data.clientName ?? null,
            createdBy: data.createdBy ?? { uid: null, name: null },
            createdAt: data.createdAt ?? null,
            updatedAt: data.updatedAt ?? null,
            startDate: data.startDate ?? null,
            estimatedEndDate: data.estimatedEndDate ?? null,
            status: data.status ?? "draft",
            qrToken: data.qrToken ?? null,
            attachments: Array.isArray(data.attachments) ? data.attachments : [],
            meta: data.meta ?? {}
        });
    }

    static toPersistence(order) {
        const o = order instanceof Order ? order : new Order(order);

        return {
            orderNumber: o.orderNumber || null,
            clientId: o.clientId ?? null,
            clientName: o.clientName ?? null,
            createdBy: o.createdBy ?? { uid: null, name: null },
            createdAt: o.createdAt ?? null,
            updatedAt: o.updatedAt ?? null,
            startDate: o.startDate ?? null,
            estimatedEndDate: o.estimatedEndDate ?? null,
            status: o.status ?? "draft",
            qrToken: o.qrToken ?? null,
            attachments: Array.isArray(o.attachments) ? o.attachments : [],
            meta: o.meta ?? {}
        };
    }

    static fromFirestoreSnapshot(snapshot) {
        return this.toDomain(snapshot);
    }

    static toFirestoreObject(entity) {
        return this.toPersistence(entity);
    }
}
