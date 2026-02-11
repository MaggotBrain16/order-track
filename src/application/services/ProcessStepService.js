// src/application/services/ProcessStepService.js
import { ProcessStepRepository } from '../../infrastructure/repositories/ProcessStepRepository';
import { ProcessStep } from '../../core/entities/ProcessStep';
import { ProcessStepMapper } from '../../infrastructure/mappers/ProcessStepMapper';

/**
 * Service de gestion des étapes de processus
 * @class ProcessStepService
 */
export class ProcessStepService {
    constructor() {
        this.processStepRepository = new ProcessStepRepository();
    }

    /**
     * Crée une nouvelle étape
     * @param {Object} stepData - Données de l'étape
     * @returns {Promise<Object>} Étape créée
     */
    async createStep(stepData) {
        const stepEntity = new ProcessStep(stepData);
        const persistenceData = ProcessStepMapper.toPersistence(stepEntity);
        return await this.processStepRepository.create(persistenceData);
    }

    /**
     * Récupère les étapes par commande
     * @param {string} orderId - ID de la commande
     * @returns {Promise<Array>} Liste des étapes
     */
    async getStepsByOrder(orderId) {
        return await this.processStepRepository.getByOrder(orderId);
    }

    /**
     * Met à jour une étape
     * @param {string} stepId - ID de l'étape
     * @param {Object} updateData - Données de mise à jour
     * @returns {Promise<Object>} Étape mise à jour
     */
    async updateStep(stepId, updateData) {
        const step = await this.processStepRepository.getById(stepId);
        if (!step) {
            throw new Error("Étape non trouvée");
        }

        const updatedStepEntity = new ProcessStep({
            ...step,
            ...updateData,
            updatedAt: new Date()
        });

        const persistenceData = ProcessStepMapper.toPersistence(updatedStepEntity);
        return await this.processStepRepository.update(stepId, persistenceData);
    }

    /**
     * Supprime une étape
     * @param {string} stepId - ID de l'étape
     * @returns {Promise<void>}
     */
    async deleteStep(stepId) {
        return await this.processStepRepository.delete(stepId);
    }

    /**
     * Ajoute une mini-étape
     * @param {string} stepId - ID de l'étape
     * @param {Object} miniStepData - Données de la mini-étape
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} Étape mise à jour
     */
    async addMiniStep(stepId, miniStepData, userId = null) {
        const step = await this.processStepRepository.getById(stepId);
        if (!step) {
            throw new Error("Étape non trouvée");
        }

        const stepEntity = new ProcessStep(step);
        const updatedStepEntity = stepEntity.addMiniStep(miniStepData, userId);

        const persistenceData = ProcessStepMapper.toPersistence(updatedStepEntity);
        return await this.processStepRepository.update(stepId, persistenceData);
    }

    /**
     * Met à jour une mini-étape
     * @param {string} stepId - ID de l'étape
     * @param {string} miniStepId - ID de la mini-étape
     * @param {Object} updateData - Données de mise à jour
     * @returns {Promise<Object>} Étape mise à jour
     */
    async updateMiniStep(stepId, miniStepId, updateData) {
        const step = await this.processStepRepository.getById(stepId);
        if (!step) {
            throw new Error("Étape non trouvée");
        }

        const stepEntity = new ProcessStep(step);
        const updatedStepEntity = stepEntity.updateMiniStep(miniStepId, updateData);

        const persistenceData = ProcessStepMapper.toPersistence(updatedStepEntity);
        return await this.processStepRepository.update(stepId, persistenceData);
    }

    /**
     * Supprime une mini-étape
     * @param {string} stepId - ID de l'étape
     * @param {string} miniStepId - ID de la mini-étape
     * @returns {Promise<Object>} Étape mise à jour
     */
    async deleteMiniStep(stepId, miniStepId) {
        const step = await this.processStepRepository.getById(stepId);
        if (!step) {
            throw new Error("Étape non trouvée");
        }

        const stepEntity = new ProcessStep(step);
        const updatedStepEntity = stepEntity.removeMiniStep(miniStepId);

        const persistenceData = ProcessStepMapper.toPersistence(updatedStepEntity);
        return await this.processStepRepository.update(stepId, persistenceData);
    }

    /**
     * Attribue une étape à des employés
     * @param {string} stepId - ID de l'étape
     * @param {Array|string} employeeIds - IDs des employés
     * @returns {Promise<Object>} Étape mise à jour
     */
    async assignStepToEmployees(stepId, employeeIds) {
        const step = await this.processStepRepository.getById(stepId);
        if (!step) {
            throw new Error("Étape non trouvée");
        }

        const updatedStepEntity = new ProcessStep({
            ...step,
            attributedTo: Array.isArray(employeeIds) ? employeeIds : [employeeIds],
            updatedAt: new Date()
        });

        const persistenceData = ProcessStepMapper.toPersistence(updatedStepEntity);
        return await this.processStepRepository.update(stepId, persistenceData);
    }

    /**
     * Ajoute un employé à une étape
     * @param {string} stepId - ID de l'étape
     * @param {string} employeeId - ID de l'employé
     * @returns {Promise<Object>} Étape mise à jour
     */
    async addEmployeeToStep(stepId, employeeId) {
        const step = await this.processStepRepository.getById(stepId);
        if (!step) {
            throw new Error("Étape non trouvée");
        }

        const currentAttributed = Array.isArray(step.attributedTo) ? step.attributedTo : [];
        if (!currentAttributed.includes(employeeId)) {
            const updatedStepEntity = new ProcessStep({
                ...step,
                attributedTo: [...currentAttributed, employeeId],
                updatedAt: new Date()
            });

            const persistenceData = ProcessStepMapper.toPersistence(updatedStepEntity);
            return await this.processStepRepository.update(stepId, persistenceData);
        }

        return step;
    }

    /**
     * Retire un employé d'une étape
     * @param {string} stepId - ID de l'étape
     * @param {string} employeeId - ID de l'employé
     * @returns {Promise<Object>} Étape mise à jour
     */
    async removeEmployeeFromStep(stepId, employeeId) {
        const step = await this.processStepRepository.getById(stepId);
        if (!step) {
            throw new Error("Étape non trouvée");
        }

        const currentAttributed = Array.isArray(step.attributedTo) ? step.attributedTo : [];
        const newAttributed = currentAttributed.filter(id => id !== employeeId);

        const updatedStepEntity = new ProcessStep({
            ...step,
            attributedTo: newAttributed,
            updatedAt: new Date()
        });

        const persistenceData = ProcessStepMapper.toPersistence(updatedStepEntity);
        return await this.processStepRepository.update(stepId, persistenceData);
    }
}
