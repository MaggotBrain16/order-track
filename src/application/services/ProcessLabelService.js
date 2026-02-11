// src/application/services/ProcessLabelService.js
import { ProcessLabelRepository } from '../../infrastructure/repositories/ProcessLabelRepository';

/**
 * Service de gestion des étiquettes de processus
 * @class ProcessLabelService
 */
export class ProcessLabelService {
    constructor() {
        this.processLabelRepository = new ProcessLabelRepository();
    }

    /**
     * Crée une nouvelle étiquette
     * @param {Object} labelData - Données de l'étiquette
     * @param {string} companyId - ID de l'entreprise
     * @returns {Promise<Object>} Étiquette créée
     */
    async createLabel(labelData, companyId) {
        const labelWithCompany = {
            ...labelData,
            companyId: companyId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return await this.processLabelRepository.create(labelWithCompany);
    }

    /**
     * Récupère les étiquettes par entreprise
     * @param {string} companyId - ID de l'entreprise
     * @returns {Promise<Array>} Liste des étiquettes
     */
    async getLabelsByCompany(companyId) {
        return await this.processLabelRepository.getByCompany(companyId);
    }

    /**
     * Met à jour une étiquette
     * @param {string} labelId - ID de l'étiquette
     * @param {Object} updateData - Données de mise à jour
     * @returns {Promise<Object>} Étiquette mise à jour
     */
    async updateLabel(labelId, updateData) {
        return await this.processLabelRepository.update(labelId, {
            ...updateData,
            updatedAt: new Date()
        });
    }

    /**
     * Supprime une étiquette
     * @param {string} labelId - ID de l'étiquette
     * @returns {Promise<void>}
     */
    async deleteLabel(labelId) {
        return await this.processLabelRepository.delete(labelId);
    }

    /**
     * Réordonne les étiquettes
     * @param {Array} labelsWithNewOrder - Étiquettes avec nouveaux ordres
     * @returns {Promise<Array>} Étiquettes mises à jour
     */
    async reorderLabels(labelsWithNewOrder) {
        const updates = labelsWithNewOrder.map(({ id, order }) => ({
            id,
            updateData: { order, updatedAt: new Date() }
        }));

        const promises = updates.map(({ id, updateData }) =>
            this.processLabelRepository.update(id, updateData)
        );

        return await Promise.all(promises);
    }

    /**
     * Récupère une étiquette par ID
     * @param {string} labelId - ID de l'étiquette
     * @returns {Promise<Object>} Étiquette trouvée
     */
    async getLabelById(labelId) {
        return await this.processLabelRepository.getById(labelId);
    }
}
