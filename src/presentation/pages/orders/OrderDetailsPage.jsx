// src/presentation/pages/orders/OrderDetailsPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Printer,
    Mail,
    Calendar,
    Hash,
    User,
    Building,
    Settings,
    FileText,
    Clock, Edit3
} from "lucide-react";
import { OrderWorkflow } from "../../components/order/process/OrderWorkflow";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useOrder } from "../../../application/hooks/useOrder.js";

export const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const {
        order,
        getClientById,
        formatDate,
        getStatusBadge,
        loading,
        ordersError: error
    } = useOrder(orderId);

    const client = order ? getClientById(order.clientId) : null;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center text-red-600">
                        Impossible de charger les détails de la commande
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!order) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center text-gray-500">
                        Commande non trouvée
                    </div>
                </CardContent>
            </Card>
        );
    }

    const badge = getStatusBadge(order.status);

    const handlePrint = () => {
        window.print();
    };

    const handleSendEmail = () => {
        // TODO: Implémenter l'envoi d'email
        console.log("Envoi d'email pour la commande", orderId);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 print:space-y-4"
        >
            {/* En-tête */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 print:shadow-none print:border-0"
            >
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                                icon={<ArrowLeft className="h-4 w-4" />}
                                className="print:hidden"
                            >
                                Retour
                            </Button>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Commande #{order.orderNumber}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className={badge.className}>{badge.label}</span>
                            <span className="text-sm text-gray-500">
                Créée le {formatDate(order.createdAt)}
              </span>
                        </div>
                    </div>

                    {/* QR Code */}
                    {order.qrToken && (
                        <div className="bg-gray-50 p-4 rounded-lg print:bg-white">
                            <div className="text-xs text-gray-500 mb-2 text-center">QR Code de suivi</div>
                            <div className="bg-white p-2 rounded print:p-0">
                                <QRCode
                                    value={JSON.stringify({
                                        type: "order",
                                        id: order.id,
                                        orderNumber: order.orderNumber,
                                        clientId: order.clientId,
                                        clientName: order.clientName,
                                        createdAt: order.createdAt,
                                        status: order.status,
                                        qrToken: order.qrToken,
                                    })}
                                    size={100}
                                    fgColor="#0f172a"
                                    bgColor="#ffffff"
                                    className="print:w-24 print:h-24"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations Client */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informations Client
                            </h2>
                        </CardHeader>
                        <CardContent>
                            {client ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Nom</div>
                                        <div className="font-medium text-gray-900">{client.displayName || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Email</div>
                                        <div className="font-medium text-gray-900">{client.email || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Entreprise</div>
                                        <div className="font-medium text-gray-900">{client.companyName || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">ID Client</div>
                                        <div className="font-medium text-sm text-gray-900">{client.id || client.uid || "—"}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500">Client non trouvé</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Détails de la commande */}
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Détails de la commande
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Dates
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-gray-500">Début: </span>
                                            <span className="font-medium text-gray-900">{formatDate(order.startDate)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Fin estimée: </span>
                                            <span className="font-medium text-gray-900">{formatDate(order.estimatedEndDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Création
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-gray-500">Créée par: </span>
                                            <span className="font-medium text-gray-900">{order.createdBy?.name || "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">ID utilisateur: </span>
                                            <span className="font-medium text-sm text-gray-900">{order.createdBy?.uid?.substring(0, 8) || "—"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attachments */}
                            {order.attachments && order.attachments.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                        <Paperclip className="h-4 w-4" />
                                        Pièces jointes ({order.attachments.length})
                                    </div>
                                    <div className="space-y-2">
                                        {order.attachments.map((attachment, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <div className="text-sm text-gray-900">
                                                    {attachment.notes || `Pièce jointe #${index + 1}`}
                                                </div>
                                                {attachment.photos && (
                                                    <div className="text-xs text-gray-500">
                                                        {attachment.photos.length} photo{attachment.photos.length > 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Informations supplémentaires */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Métadonnées */}
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Métadonnées
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm text-gray-500">ID Commande</div>
                                    <div className="font-mono text-sm break-all text-gray-900">{order.id}</div>
                                </div>

                                {order.qrToken && (
                                    <div>
                                        <div className="text-sm text-gray-500">Token QR</div>
                                        <div className="font-mono text-sm break-all text-gray-900">{order.qrToken}</div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-sm text-gray-500">Dernière mise à jour</div>
                                    <div className="text-gray-900">{formatDate(order.updatedAt)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Actions
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button
                                    className="w-full"
                                    onClick={() => navigate(`/orders/${orderId}/update`)}
                                    icon={<Edit3 className="h-4 w-4" />}
                                >
                                    Mettre à jour la commande
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={handlePrint}
                                    icon={<Printer className="h-4 w-4" />}
                                >
                                    Imprimer le bon de suivi
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={handleSendEmail}
                                    icon={<Mail className="h-4 w-4" />}
                                >
                                    Envoyer le QR Code
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};
