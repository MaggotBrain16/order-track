// src/application/hooks/useOrderCreation.js
import { useState, useCallback } from 'react';
import { OrderService } from '../services/OrderService';

const orderService = new OrderService();

export function useOrderCreation() {
    const [loading, setLoading] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [qrSvgSaved, setQrSvgSaved] = useState(false);
    const [step, setStep] = useState(1);

    const createOrder = useCallback(async ({
                                               formData,
                                               currentUser,
                                               selectedClient,
                                               creatorName
                                           }) => {
        setLoading(true);
        setCreatedOrder(null);
        setQrSvgSaved(false);

        try {
            // Création de la commande avec tracking
            const { order, qrToken } = await orderService.createOrder(
                formData,
                currentUser,
                selectedClient,
                creatorName
            );

            // Stocker l'ordre avec le token local
            const orderWithQrToken = { ...order, _qrTokenLocal: qrToken };
            setCreatedOrder(orderWithQrToken);

            // Passer directement à l'étape de fin (affichage QR)
            setStep(3);

            return orderWithQrToken;

        } catch (err) {
            console.error("Erreur lors de la création:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const saveQrSvg = useCallback(async (qrRef) => {
        if (!createdOrder || !qrRef.current || qrSvgSaved) return false;

        try {
            const svgEl = qrRef.current.querySelector("svg");
            if (!svgEl) {
                console.warn("SVG QR non trouvé pour sérialisation.");
                return false;
            }

            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgEl);

            const success = await orderService.saveQrSvg(createdOrder.id, svgString);
            if (success) {
                setQrSvgSaved(true);
            }
            return success;

        } catch (err) {
            console.error("Erreur lors de la sauvegarde du SVG QR:", err);
            return false;
        }
    }, [createdOrder, qrSvgSaved]);

    const getQrPayload = useCallback(() => {
        if (!createdOrder) return null;
        return orderService.generateQrPayload(createdOrder, {}, [], createdOrder.id);
    }, [createdOrder]);

    const validateFields = useCallback(({ formData, clientId, clients }) => {
        const getSelectedClient = (id) =>
            clients.find((c) => String(c.id) === String(id) || String(c.uid) === String(id)) || null;

        const selectedClient = getSelectedClient(clientId);
        return orderService.validateOrderFields(formData, selectedClient, {});
    }, []);

    const reset = useCallback(() => {
        setCreatedOrder(null);
        setQrSvgSaved(false);
        setStep(1);
    }, []);

    return {
        loading,
        createdOrder,
        qrSvgSaved,
        step,
        setStep,
        createOrder,
        saveQrSvg,
        getQrPayload,
        validateFields,
        reset,
        qrToken: createdOrder?._qrTokenLocal || null // Ajout pour accéder au token
    };
}
