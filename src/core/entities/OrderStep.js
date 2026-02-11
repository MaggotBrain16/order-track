// src/core/entities/OrderStep.js
export class OrderStep {
    constructor({
                    id = null,
                    orderId = null,
                    label = "",
                    status = "pending",
                    updatedAt = null
                } = {}) {
        this.id = id;
        this.orderId = orderId;
        this.label = label;
        this.status = status;
        this.updatedAt = updatedAt instanceof Date ? updatedAt : (updatedAt ? new Date(updatedAt) : null);
    }

    // Méthodes métier
    isPending() {
        return this.status === "pending";
    }

    isInProgress() {
        return this.status === "in_progress";
    }

    isCompleted() {
        return this.status === "completed";
    }

    updateStatus(newStatus) {
        return new OrderStep({
            ...this,
            status: newStatus,
            updatedAt: new Date()
        });
    }

    static createForOrder(orderId, label) {
        return new OrderStep({
            orderId,
            label,
            status: "pending",
            updatedAt: new Date()
        });
    }
}
