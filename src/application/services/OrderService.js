// src/application/services/OrderService.js
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';
import { EmailService } from './EmailService';
import {CloudinaryService} from "../../infrastructure/cloudinary/CloudinaryService.js";

export class OrderService {
    constructor() {
        this.orderRepository = new OrderRepository();
        this.emailService = new EmailService();
        this.cloudinaryService = new CloudinaryService();
    }

    async createOrder(orderData, currentUser, selectedClient, creatorName) {
        // Validation
        const validationErrors = this.validateOrderFields(orderData, selectedClient, currentUser);
        if (validationErrors.length > 0) {
            throw new Error("Erreurs de validation: " + validationErrors.join("; "));
        }

        // Mapping défensif
        const clientIdSafe = selectedClient.uid ?? selectedClient.id ?? null;
        const clientNameSafe = selectedClient.displayName ?? selectedClient.name ?? null;

        // Génération du QR Token
        const qrToken = this.generateQrToken();

        // Préparation du document Order
        const orderDoc = {
            orderNumber: orderData.orderNumber ?? "",
            clientId: clientIdSafe,
            clientName: clientNameSafe,
            createdBy: { uid: currentUser?.uid ?? null, name: creatorName ?? null },
            createdAt: new Date(),
            updatedAt: new Date(),
            startDate: orderData.startDate ?? null,
            estimatedEndDate: orderData.estimatedEndDate ?? null,
            status: "draft",
            qrToken: qrToken,
            attachments: [],
            meta: {}
        };

        try {
            const createdOrder = await this.orderRepository.create(orderDoc);

            // Envoyer l'email de suivi si client existe
            if (selectedClient?.email) {
                try {
                    await this.sendTrackingEmail(createdOrder, selectedClient);
                } catch (emailError) {
                    console.warn("Email de suivi non envoyé:", emailError);
                }
            }

            return {
                order: createdOrder,
                qrToken: qrToken
            };
        } catch (error) {
            throw new Error(`Erreur lors de la création de la commande: ${error.message}`);
        }
    }

    async updateOrder(orderId, updateData) {
        return await this.orderRepository.update(orderId, updateData);
    }

    async getOrderById(orderId) {
        return await this.orderRepository.getById(orderId);
    }

    async getOrdersByStatus(statuses) {
        return await this.orderRepository.getByStatus(statuses);
    }

    async getOrdersByClient(clientId) {
        return await this.orderRepository.getByClient(clientId);
    }

    async deleteOrder(orderId) {
        return await this.orderRepository.delete(orderId);
    }

    async uploadAttachment(file, orderId) {
        try {
            const uploadResult = await this.cloudinaryService.uploadFile(file, `orders/${orderId}`);
            return uploadResult;
        } catch (error) {
            throw new Error(`Échec de l'upload: ${error.message}`);
        }
    }

    async saveQrSvg(orderId, svgString) {
        try {
            await this.orderRepository.update(orderId, {
                "meta.qrSvg": svgString
            });
            return true;
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du SVG QR:", error);
            return false;
        }
    }

    async sendTrackingEmail(order, client) {
        try {
            // Générer l'URL du QR Code pour l'email
            const trackingUrl = `${window.location.origin}/suivi/${order.id}`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(trackingUrl)}&size=200x200`;

            // Validation de l'email client
            if (!client.email) {
                throw new Error('Email du client requis');
            }

            // Envoyer l'email avec EmailJS
            const emailResult = await this.emailService.sendTrackingEmail({
                orderNumber: order.orderNumber,
                clientEmail: client.email,
                qrCodeUrl: qrCodeUrl,
                companyName: "SIMON GROUPE",
                replyTo: "boutet1406@gmail.com"
            });

            return emailResult;
        } catch (error) {
            throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
        }
    }

    generateQrToken() {
        return typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    validateOrderFields(formData, selectedClient, currentUser) {
        const errors = [];

        if (!selectedClient) errors.push("Client invalide ou non sélectionné.");
        if (!formData.orderNumber || !String(formData.orderNumber).trim()) errors.push("Numéro de commande manquant.");
        if (!formData.startDate) errors.push("Date de début manquante.");
        if (!formData.estimatedEndDate) errors.push("Date de fin estimée manquante.");
        if (
            formData.startDate &&
            formData.estimatedEndDate &&
            formData.startDate > formData.estimatedEndDate
        )
            errors.push("La date de début doit être antérieure ou égale à la date de fin estimée.");
        if (!currentUser) errors.push("Utilisateur non authentifié.");

        return errors;
    }

// Dans generateQrPayload, gérer le cas où order est undefined
    generateQrPayload(order, formData, clients, orderId) {
        if (order) {
            return {
                type: "order",
                id: order.id,
                orderNumber: order.orderNumber,
                clientId: order.clientId,
                clientName: order.clientName,
                createdAt: order.createdAt,
                status: order.status,
                qrToken: order.qrToken
            };
        }

        const client = clients?.find((c) =>
            String(c.id) === String(formData?.clientId) || String(c.uid) === String(formData?.clientId)
        ) || null;

        return {
            type: "order_preview",
            orderId: orderId ?? null,
            orderNumber: formData?.orderNumber ?? "",
            clientId: client?.uid ?? client?.id ?? null,
            clientName: client?.displayName ?? "",
            qrToken: null
        };
    }


}
