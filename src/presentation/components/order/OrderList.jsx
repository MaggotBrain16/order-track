// src/presentation/components/order/OrderList.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../../application/hooks/useOrder";
import { Card, CardHeader, CardContent } from "../ui/Card";

export const OrderList = () => {
    const {
        orders,
        loading,
        ordersError: error,
        formatDate,
        getStatusBadge,
        ordersCount
    } = useOrder();

    const navigate = useNavigate();

    // Memoization des lignes du tableau
    const tableRows = useMemo(() => {
        if (loading || error || !orders || orders.length === 0) return null;

        return orders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
                <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                >
                    <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">#{order.orderNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">{order.clientName || "—"}</div>
                        <div className="text-gray-500 text-xs">
                            {order.clientId ? "Client #" + order.clientId.substring(0, 8) : "—"}
                        </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                        <div>Début: {formatDate(order.startDate)}</div>
                        <div className="text-gray-500 text-xs">
                            Fin estimée: {formatDate(order.estimatedEndDate)}
                        </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                        <span className={badge.className}>
                            {badge.label}
                        </span>
                    </td>
                </tr>
            );
        });
    }, [orders, formatDate, getStatusBadge, navigate]);

    // Affichage des cards
    const emptyState = useMemo(() => {
        if (loading) return null;
        if (error) return (
            <div className="py-8 text-center text-red-600">
                <p>Impossible de charger les commandes</p>
            </div>
        );
        if (!loading && orders && orders.length === 0) return (
            <div className="py-8 text-center text-gray-500">
                <h3 className="text-sm font-medium text-gray-900">Aucune commande</h3>
                <p className="text-sm text-gray-500">Commencez par créer une nouvelle commande.</p>
            </div>
        );
        return null;
    }, [loading, error, orders]);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Commandes en cours</h2>
                    <span className="text-sm text-gray-500">
                        {ordersCount} commande{ordersCount > 1 ? 's' : ''}
                    </span>
                </div>
            </CardHeader>

            <CardContent>
                {/* Loading */}
                {loading && (
                    <div className="py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Chargement des commandes…</p>
                    </div>
                )}

                {/* Error & Empty */}
                {emptyState}

                {/* Table */}
                {orders && orders.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commande
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dates
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                            {tableRows}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
