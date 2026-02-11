// src/infrastructure/mappers/CompanyMapper.js
import { Company } from '../../core/entities/Company';

export class CompanyMapper {
    toDomain(doc) {
        if (!doc || !doc.exists()) return null;
        const data = doc.data();

        return new Company({
            id: doc.id,
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
            siret: data.siret || "",
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
        });
    }

    toPersistence(company) {
        const c = company instanceof Company ? company : new Company(company);

        return {
            name: c.name || "",
            address: c.address || "",
            phone: c.phone || "",
            email: c.email || "",
            siret: c.siret || "",
            createdAt: c.createdAt || new Date(),
            updatedAt: c.updatedAt || new Date()
        };
    }

    fromFirestoreSnapshot(snapshot) {
        return this.toDomain(snapshot);
    }

    toFirestoreObject(entity) {
        return this.toPersistence(entity);
    }
}
