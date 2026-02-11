// src/application/services/EmailService.js
import emailjs from '@emailjs/browser';

export class EmailService {
    constructor() {
        //TODO DEBUG L'APPEL AUX VARIABLE D'ENV
        this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        this.templateIdInvitation = import.meta.env.VITE_EMAILJS_TEMPLATE_INVITATION;
        this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        this.init();
    }

    init() {
        if (this.publicKey && this.publicKey !== 'VOTRE_PUBLIC_KEY') {
            emailjs.init(this.publicKey);
        } else {
            console.warn('EmailJS non initialisé - clé publique manquante');
        }
    }

    generateTempPassword(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = 'TEMP-';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    async sendTrackingEmail({ orderNumber, clientEmail, qrCodeUrl, companyName = "SIMON GROUPE", replyTo = "boutet1406@gmail.com" }) {
        try {
            // Validation des paramètres requis
            if (!this.serviceId || this.serviceId === 'VOTRE_SERVICE_ID') {
                throw new Error('Service ID EmailJS non configuré');
            }
            if (!this.templateId || this.templateId === 'VOTRE_TEMPLATE_ID') {
                throw new Error('Template ID EmailJS non configuré');
            }
            if (!this.publicKey || this.publicKey === 'VOTRE_PUBLIC_KEY') {
                throw new Error('Public Key EmailJS non configurée');
            }
            if (!orderNumber) throw new Error('Numéro de commande requis');
            if (!clientEmail) throw new Error('Email du client requis');
            if (!qrCodeUrl) throw new Error('URL du QR Code requise');

            const tempPassword = this.generateTempPassword();

            const templateParams = {
                to_email: clientEmail,
                order_number: orderNumber,
                temporary_password: tempPassword,
                company_name: companyName,
                qr_code_url: qrCodeUrl,
                reply_to: replyTo
            };

            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams,
                this.publicKey
            );

            return {
                success: true,
                data: response,
                tempPassword: tempPassword
            };

        } catch (error) {
            let errorMessage = 'Erreur inconnue lors de l\'envoi de l\'email';
            if (error.text) {
                errorMessage = error.text;
            } else if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            throw new Error(`Erreur lors de l'envoi de l'email: ${errorMessage}`);
        }
    }

    async sendEmployeeInvitation({ employeeEmail, employeeName, companyName, temporaryPassword }) {
        try {
            if (!employeeEmail) {
                throw new Error('Email de l\'employé requis');
            }

            const templateParams = {
                to_email: employeeEmail,
                employee_name: employeeName || "Collaborateur",
                company_name: companyName || "votre entreprise",
                temporary_password: temporaryPassword,
                login_url: `${window.location.origin}/register`,
                support_email: "support@votreentreprise.com"
            };

            const response = await emailjs.send(
                this.serviceId,
                this.templateIdInvitation,
                templateParams,
                this.publicKey
            );

            return {
                success: true,
                data: response
            };

        } catch (error) {
            let errorMessage = 'Erreur inconnue lors de l\'envoi de l\'email';
            if (error.text) {
                errorMessage = error.text;
            } else if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            throw new Error(`Erreur lors de l'envoi de l'email d'invitation: ${errorMessage}`);
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
