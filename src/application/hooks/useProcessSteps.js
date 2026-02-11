// src/application/hooks/useProcessSteps.js
import { useState, useEffect, useCallback } from 'react';
import { ProcessStepService } from '../services/ProcessStepService';

/**
 * Hook personnalisé pour la gestion des étapes de processus
 * @param {string} orderId - ID de la commande
 * @returns {Object} État et fonctions de gestion des étapes
 */
export function useProcessSteps(orderId) {
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Instance du service partagée
    const processStepService = new ProcessStepService();

    /**
     * Charge les étapes pour une commande
     */
    const loadSteps = useCallback(async () => {
        if (!orderId) return;

        setLoading(true);
        setError(null);
        try {
            const loadedSteps = await processStepService.getStepsByOrder(orderId);
            setSteps(loadedSteps.sort((a, b) => a.position - b.position));
        } catch (err) {
            setError(err);
            console.error("Erreur chargement étapes:", err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    // Chargement initial
    useEffect(() => {
        loadSteps();
    }, [loadSteps]);

    /**
     * Crée une nouvelle étape
     * @param {Object} stepData - Données de l'étape
     * @returns {Promise<Object>} Étape créée
     */
    const createStep = useCallback(async (stepData) => {
        try {
            const newStep = await processStepService.createStep(stepData);
            setSteps(prev => [...prev, newStep].sort((a, b) => a.position - b.position));
            return newStep;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processStepService]);

    /**
     * Met à jour une étape
     * @param {string} stepId - ID de l'étape
     * @param {Object} updateData - Données de mise à jour
     * @returns {Promise<Object>} Étape mise à jour
     */
    const updateStep = useCallback(async (stepId, updateData) => {
        try {
            const updatedStep = await processStepService.updateStep(stepId, updateData);
            setSteps(prev =>
                prev.map(step => step.id === stepId ? updatedStep : step)
            );
            return updatedStep;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processStepService]);

    /**
     * Ajoute une mini-étape
     * @param {string} stepId - ID de l'étape
     * @param {Object} miniStepData - Données de la mini-étape
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} Étape mise à jour
     */
    const addMiniStep = useCallback(async (stepId, miniStepData, userId = null) => {
        try {
            const updatedStep = await processStepService.addMiniStep(stepId, miniStepData, userId);
            setSteps(prev =>
                prev.map(step => step.id === stepId ? updatedStep : step)
            );
            return updatedStep;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processStepService]);

    /**
     * Met à jour une mini-étape
     * @param {string} stepId - ID de l'étape
     * @param {string} miniStepId - ID de la mini-étape
     * @param {Object} updateData - Données de mise à jour
     * @returns {Promise<Object>} Étape mise à jour
     */
    const updateMiniStep = useCallback(async (stepId, miniStepId, updateData) => {
        try {
            const updatedStep = await processStepService.updateMiniStep(stepId, miniStepId, updateData);
            setSteps(prev =>
                prev.map(step => step.id === stepId ? updatedStep : step)
            );
            return updatedStep;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processStepService]);

    /**
     * Supprime une mini-étape
     * @param {string} stepId - ID de l'étape
     * @param {string} miniStepId - ID de la mini-étape
     * @returns {Promise<Object>} Étape mise à jour
     */
    const deleteMiniStep = useCallback(async (stepId, miniStepId) => {
        try {
            const updatedStep = await processStepService.deleteMiniStep(stepId, miniStepId);
            setSteps(prev =>
                prev.map(step => step.id === stepId ? updatedStep : step)
            );
            return updatedStep;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processStepService]);

    /**
     * Supprime une étape
     * @param {string} stepId - ID de l'étape
     * @returns {Promise<void>}
     */
    const deleteStep = useCallback(async (stepId) => {
        try {
            await processStepService.deleteStep(stepId);
            setSteps(prev => prev.filter(step => step.id !== stepId));
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processStepService]);

    /**
     * Ajoute un employé à une étape
     * @param {string} stepId - ID de l'étape
     * @param {string} employeeId - ID de l'employé
     * @returns {Promise<Object>} Étape mise à jour
     */
    const addEmployeeToStep = useCallback(async (stepId, employeeId) => {
        try {
            const updatedStep = await processStepService.addEmployeeToStep(stepId, employeeId);
            setSteps(prev =>
                prev.map(step => step.id === stepId ? updatedStep : step)
            );
            return updatedStep;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processStepService]);

    /**
     * Retire un employé d'une étape
     * @param {string} stepId - ID de l'étape
     * @param {string} employeeId - ID de l'employé
     * @returns {Promise<Object>} Étape mise à jour
     */
    const removeEmployeeFromStep = useCallback(async (stepId, employeeId) => {
        try {
            const updatedStep = await processStepService.removeEmployeeFromStep(stepId, employeeId);
            setSteps(prev =>
                prev.map(step => step.id === stepId ? updatedStep : step)
            );
            return updatedStep;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [processStepService]);

    return {
        steps,
        loading,
        error,
        createStep,
        updateStep,
        addMiniStep,
        updateMiniStep,
        deleteMiniStep,
        deleteStep,
        addEmployeeToStep,
        removeEmployeeFromStep,
        refreshSteps: loadSteps
    };
}
