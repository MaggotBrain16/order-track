// src/core/entities/ProcessLabel.js
export class ProcessLabel {
    constructor({
                    id = null,
                    name = "",
                    color = "#3b82f6",
                    order = 0,
                    createdAt = new Date(),
                    updatedAt = new Date(),
                    companyId = null
                } = {}) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.order = order;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
        this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
        this.companyId = companyId;
    }

    // Méthodes métier
    getContrastTextColor() {
        // Convert hex to RGB
        const hex = this.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Calculate brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    update(updateData) {
        return new ProcessLabel({
            ...this,
            ...updateData,
            updatedAt: new Date()
        });
    }

    static createDefault(name, companyId) {
        return new ProcessLabel({
            name,
            companyId,
            color: "#3b82f6",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
}
