// src/application/hooks/useOrder.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { OrderService } from '../services/OrderService';
import { useClients } from './useClients';

const orderService = new OrderService();

export function useOrder(orderId = null) {
    const [orders, setOrders] = useState([]);
    const [specificOrder, setSpecificOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { clients, loading: clientsLoading } = useClients();

    // Memoization des clients pour éviter les re-renders
    const clientsById = useMemo(() => {
        const map = new Map();
        clients.forEach(client => {
            map.set(client.uid, client);
        });
        return map;
    }, [clients]);

    // Charger les commandes
    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            setError(null);

            try {
                if (orderId) {
                    const order = await orderService.getOrderById(orderId);
                    setSpecificOrder(order);
                } else {
                    const activeOrders = await orderService.getOrdersByStatus(['draft', 'in_progress']);
                    console.log("Commandes chargées:", activeOrders.length);
                    setOrders(activeOrders || []);
                }
            } catch (err) {
                console.error("Erreur lors du chargement:", err);
                setError(err.message);
                if (!orderId) {
                    setOrders([]);
                }
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [orderId]); // ✅ Un seul chargement par orderId

    const getClientById = useCallback((id) => {
        return clientsById.get(id) || null;
    }, [clientsById]);

    const formatDate = useCallback((date) => {
        if (!date) return "—";

        try {
            if (date?.seconds) {
                const dateObj = new Date(date.seconds * 1000);
                return dateObj.toLocaleDateString("fr-FR");
            }

            if (date?.toDate && typeof date.toDate === 'function') {
                return date.toDate().toLocaleDateString("fr-FR");
            }

            const dateObj = date instanceof Date ? date : new Date(date);
            return isNaN(dateObj.getTime()) ? "—" : dateObj.toLocaleDateString("fr-FR");
        } catch (err) {
            console.error("Erreur formatage date:", err);
            return "—";
        }
    }, []);

    const getStatusBadge = useCallback((status) => {
        const statusConfig = {
            draft: { label: "Brouillon", class: "bg-gray-100 text-gray-800" },
            in_progress: { label: "En cours", class: "bg-blue-100 text-blue-800" },
            completed: { label: "Terminé", class: "bg-green-100 text-green-800" },
            cancelled: { label: "Annulé", class: "bg-red-100 text-red-800" }
        };

        const config = statusConfig[status] || { label: status, class: "bg-gray-100 text-gray-800" };
        return {
            label: config.label,
            className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.class}`
        };
    }, []);

    return {
        orders: orderId ? [] : orders,
        allOrders: orders,
        clients,
        specificOrder,
        order: specificOrder,
        ordersLoading: loading,
        clientsLoading,
        specificOrderLoading: loading && orderId,
        loading,
        ordersError: error,
        clientsError: null,
        getClientById,
        formatDate,
        getStatusBadge,
        refreshOrders: orderId ? null : async () => {
            setLoading(true);
            try {
                const activeOrders = await orderService.getOrdersByStatus(['draft', 'in_progress']);
                setOrders(activeOrders || []);
            } catch (err) {
                console.error("Erreur lors du rafraîchissement:", err);
            } finally {
                setLoading(false);
            }
        },
        ordersCount: orderId ? 0 : orders.length
    };
}
