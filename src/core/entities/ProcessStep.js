// src/core/entities/ProcessStep.js
export class ProcessStep {
    constructor({
                    id = null,
                    orderId = "",
                    labelId = "",
                    labelName = "",
                    status = "pending",
                    position = 0,
                    attributedTo = [],
                    miniSteps = [],
                    createdAt = new Date(),
                    updatedAt = new Date()
                } = {}) {
        this.id = id;
        this.orderId = orderId;
        this.labelId = labelId;
        this.labelName = labelName;
        this.status = status;
        this.position = position;
        this.attributedTo = Array.isArray(attributedTo) ? attributedTo : [];
        this.miniSteps = Array.isArray(miniSteps) ? miniSteps : [];
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
        this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
    }

    // Méthodes métier
    getCompletionPercentage() {
        if (this.miniSteps.length === 0) return 0;
        const completed = this.miniSteps.filter(ms => ms.completed).length;
        return Math.round((completed / this.miniSteps.length) * 100);
    }

    isInProgress() {
        return this.status === "in_progress";
    }

    isCompleted() {
        return this.status === "completed";
    }

    isPending() {
        return this.status === "pending";
    }

    addMiniStep(miniStepData, createdBy = null) {
        const newMiniStep = new MiniStep({
            ...miniStepData,
            createdBy,
            createdAt: new Date()
        });

        return new ProcessStep({
            ...this,
            miniSteps: [...this.miniSteps, newMiniStep],
            updatedAt: new Date()
        });
    }

    updateMiniStep(miniStepId, updateData) {
        const updatedMiniSteps = this.miniSteps.map(ms =>
            ms.id === miniStepId
                ? new MiniStep({ ...ms, ...updateData, updatedAt: new Date() })
                : ms
        );

        return new ProcessStep({
            ...this,
            miniSteps: updatedMiniSteps,
            updatedAt: new Date()
        });
    }

    removeMiniStep(miniStepId) {
        return new ProcessStep({
            ...this,
            miniSteps: this.miniSteps.filter(ms => ms.id !== miniStepId),
            updatedAt: new Date()
        });
    }

    update(updateData) {
        return new ProcessStep({
            ...this,
            ...updateData,
            updatedAt: new Date()
        });
    }

    static createForOrder(orderId, label, position = 0) {
        return new ProcessStep({
            orderId,
            labelId: label.id,
            labelName: label.name,
            position,
            status: "pending",
            attributedTo: [],
            miniSteps: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
}

// Sous-structure pour les mini-étapes
export class MiniStep {
    constructor({
                    id = null,
                    title = "",
                    notes = "",
                    photos = [],
                    completed = false,
                    createdBy = null,
                    createdAt = new Date()
                } = {}) {
        this.id = id || `mini_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.title = title;
        this.notes = notes;
        this.photos = Array.isArray(photos) ? photos : [];
        this.completed = completed;
        this.createdBy = createdBy;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    }

    toggleCompletion() {
        return new MiniStep({
            ...this,
            completed: !this.completed,
            updatedAt: new Date()
        });
    }

    update(updateData) {
        return new MiniStep({
            ...this,
            ...updateData,
            updatedAt: new Date()
        });
    }
}
