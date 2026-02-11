// src/application/hooks/useProcessLabels.js
import { useState, useEffect, useCallback } from 'react';
import { ProcessLabelService } from '../services/ProcessLabelService';

/**
 * Hook personnalisé pour la gestion des étiquettes de processus
 * @param {string} companyId - ID de l'entreprise
 * @returns {Object} État et fonctions de gestion des étiquettes
 */
export function useProcessLabels(companyId) {
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Instance du service partagée
    const processLabelService = new ProcessLabelService();

    /**
     * Charge les étiquettes pour une entreprise
     */
    const loadLabels = useCallback(async () => {
        if (!companyId) return;

        setLoading(true);
        setError(null);
        try {
            const loadedLabels = await processLabelService.getLabelsByCompany(companyId);
            setLabels(loadedLabels.sort((a, b) => a.order - b.order));
        } catch (err) {
            setError(err);
            console.error("Erreur chargement étiquettes:", err);
        } finally {
            setLoading(false);
        }
    }, [companyId]);

    // Chargement initial
    useEffect(() => {
        loadLabels();
    }, [loadLabels]);

    /**
     * Crée une nouvelle étiquette
     * @param {Object} labelData - Données de l'étiquette
     * @returns {Promise<Object>} Étiquette créée
     */
    const createLabel = useCallback(async (labelData) => {
        try {
            const newLabel = await processLabelService.createLabel(labelData, companyId);
            setLabels(prev => [...prev, newLabel].sort((a, b) => a.order - b.order));
            return newLabel;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [companyId, processLabelService]);

    /**
     * Met à jour une étiquette
     * @param {string} labelId - ID de l'étiquette
     * @param {Object} updateData - Données de mise à jour
     * @returns {Promise<Object>} Étiquette mise à jour
     */
    const updateLabel = useCallback(async (labelId, updateData) => {
        try {
            const updatedLabel = await processLabelService.updateLabel(labelId, updateData);
            setLabels(prev =>
                prev.map(label => label.id === labelId ? updatedLabel : label)
            );
            return updatedLabel;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processLabelService]);

    /**
     * Supprime une étiquette
     * @param {string} labelId - ID de l'étiquette
     * @returns {Promise<void>}
     */
    const deleteLabel = useCallback(async (labelId) => {
        try {
            await processLabelService.deleteLabel(labelId);
            setLabels(prev => prev.filter(label => label.id !== labelId));
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processLabelService]);

    /**
     * Réorganise les étiquettes
     * @param {Array} newOrderLabels - Étiquettes réorganisées
     * @returns {Promise<void>}
     */
    const reorderLabels = useCallback(async (newOrderLabels) => {
        try {
            await processLabelService.reorderLabels(
                newOrderLabels.map((label, index) => ({
                    id: label.id,
                    order: index
                }))
            );
            setLabels(newOrderLabels);
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processLabelService]);

    return {
        labels,
        loading,
        error,
        createLabel,
        updateLabel,
        deleteLabel,
        reorderLabels,
        refreshLabels: loadLabels
    };
}
