// src/infrastructure/repositories/interfaces/IOrderRepository.js
export class IOrderRepository {
    async create(order) {
        throw new Error("Method not implemented");
    }

    async getById(id) {
        throw new Error("Method not implemented");
    }

    async update(id, updateData) {
        throw new Error("Method not implemented");
    }

    async delete(id) {
        throw new Error("Method not implemented");
    }

    async getByStatus(statuses) {
        throw new Error("Method not implemented");
    }

    async getByClient(clientId) {
        throw new Error("Method not implemented");
    }

    async subscribeToChanges(callback) {
        throw new Error("Method not implemented");
    }
}
