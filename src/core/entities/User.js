// src/core/entities/User.js
export class User {
    constructor({
                    uid = null,
                    email = null,
                    displayName = null,
                    role = "client",
                    companyId = null,
                    companyName = null,
                    createdAt = null
                } = {}) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
        this.companyId = companyId;
        this.companyName = companyName;
        this.createdAt = createdAt instanceof Date ? createdAt : (createdAt ? new Date(createdAt) : null);
    }

    // Méthodes métier
    isAdmin() {
        return this.role === "admin";
    }

    isEmployee() {
        return this.role === "employee";
    }

    isClient() {
        return this.role === "client";
    }

    getInitials() {
        if (!this.displayName) return this.email ? this.email.charAt(0).toUpperCase() : "?";
        return this.displayName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    getFullName() {
        return this.displayName || this.email || "Utilisateur";
    }

    belongsToCompany(companyId) {
        return this.companyId === companyId;
    }

    update(updateData) {
        return new User({
            ...this,
            ...updateData
        });
    }

    static createEmployee(email, displayName, companyId, role = "employee") {
        return new User({
            email,
            displayName,
            companyId,
            role,
            createdAt: new Date()
        });
    }

    // src/core/entities/User.js
    static createClient(email, displayName, companyId = null, companyName = null) {
        return new User({
            email,
            displayName,
            companyId,
            companyName: companyName || displayName?.toLowerCase() || null,
            role: "client",
            createdAt: new Date()
        });
    }
}
