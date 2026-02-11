// src/core/entities/Company.js
export class Company {
    constructor({
                    id = null,
                    name = "",
                    address = "",
                    phone = "",
                    email = "",
                    siret = "",
                    createdAt = new Date(),
                    updatedAt = new Date()
                } = {}) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.siret = siret;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
        this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
    }

    // Méthodes métier
    getFormattedInfo() {
        return {
            fullName: this.name,
            contact: this.email || this.phone,
            legalInfo: this.siret
        };
    }

    isValid() {
        return Boolean(this.name?.trim());
    }

    update(updateData) {
        return new Company({
            ...this,
            ...updateData,
            updatedAt: new Date()
        });
    }
}
