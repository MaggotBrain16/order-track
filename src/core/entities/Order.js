// src/core/entities/Order.js
export class Order {
    constructor({
                    id = null,
                    orderNumber = "",
                    clientId = null,
                    clientName = null,
                    createdBy = { uid: null, name: null },
                    createdAt = null,
                    updatedAt = null,
                    startDate = null,
                    estimatedEndDate = null,
                    status = "draft",
                    qrToken = null,
                    attachments = [],
                    meta = {}
                } = {}) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.clientId = clientId;
        this.clientName = clientName;
        this.createdBy = createdBy;
        this.createdAt = createdAt instanceof Date ? createdAt : (createdAt ? new Date(createdAt) : null);
        this.updatedAt = updatedAt instanceof Date ? updatedAt : (updatedAt ? new Date(updatedAt) : null);
        this.startDate = startDate;
        this.estimatedEndDate = estimatedEndDate;
        this.status = status;
        this.qrToken = qrToken;
        this.attachments = Array.isArray(attachments) ? attachments : [];
        this.meta = meta;
    }

    // Méthodes métier
    isEditable() {
        return ['draft', 'in_progress'].includes(this.status);
    }

    isCompleted() {
        return this.status === 'completed';
    }

    getDurationInDays() {
        if (!this.startDate || !this.estimatedEndDate) return 0;
        const start = new Date(this.startDate);
        const end = new Date(this.estimatedEndDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getProgressPercentage() {
        if (this.status === 'completed') return 100;
        if (this.status === 'draft') return 0;

        // Calcul simplifié basé sur les dates
        const now = new Date();
        const start = new Date(this.startDate);
        const end = new Date(this.estimatedEndDate);

        if (!start || !end) return 0;
        if (now < start) return 0;
        if (now > end) return 100;

        const total = end - start;
        const elapsed = now - start;
        return Math.round((elapsed / total) * 100);
    }

    getStatusInfo() {
        const statusMap = {
            draft: { label: "Brouillon", class: "bg-gray-100 text-gray-800" },
            in_progress: { label: "En cours", class: "bg-blue-100 text-blue-800" },
            completed: { label: "Terminé", class: "bg-green-100 text-green-800" },
            cancelled: { label: "Annulé", class: "bg-red-100 text-red-800" }
        };

        return statusMap[this.status] || { label: this.status, class: "bg-gray-100 text-gray-800" };
    }

    update(updateData) {
        return new Order({
            ...this,
            ...updateData,
            updatedAt: new Date()
        });
    }

    static createNew(orderData, creator) {
        return new Order({
            ...orderData,
            createdBy: {
                uid: creator.uid,
                name: creator.displayName || creator.email
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "draft"
        });
    }
}
