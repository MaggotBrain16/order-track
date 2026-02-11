// src/application/services/CompanyService.js
import { CompanyRepository } from '../../infrastructure/repositories/CompanyRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { EmailService } from './EmailService';
import {UserService} from "./UserService.js";
import { User } from '../../core/entities/User';

export class CompanyService {
    constructor() {
        this.companyRepository = new CompanyRepository();
        this.userRepository = new UserRepository();
        this.userService = new UserService(); // Ajouter cette ligne
        this.emailService = new EmailService();
    }

    async getCompanyInfo(companyId) {
        if (!companyId) return null;
        return await this.companyRepository.getById(companyId);
    }

    async updateCompanyInfo(companyId, updateData) {
        return await this.companyRepository.update(companyId, updateData);
    }

    async getTeamMembers(companyId) {
        if (!companyId) return [];
        return await this.userRepository.getByCompany(companyId);
    }


    async createEmployee(companyId, employeeData, companyName = "") {
        try {
            // Générer un mot de passe temporaire
            const temporaryPassword = this.generateTemporaryPassword();

            // ✅ CORRECTION : Utiliser UserService qui gère la génération d'UID
            // ou créer l'entité User complète
            const employeeEntity = User.createEmployee(
                employeeData.email,
                employeeData.displayName,
                companyId,
                employeeData.role || "employee"
            );

            // Ajouter les champs supplémentaires
            employeeEntity.companyName = companyName;

            // Persister via UserService (qui gère l'UID et la persistence)
            const newUser = await this.userService.createUser(employeeEntity);

            // Envoyer l'email d'invitation
            try {
                await this.emailService.sendEmployeeInvitation({
                    employeeEmail: employeeData.email,
                    employeeName: employeeData.displayName,
                    companyName: companyName || "votre entreprise",
                    temporaryPassword: temporaryPassword
                });
            } catch (emailError) {
                console.warn("Email d'invitation non envoyé:", emailError);
            }

            return {
                uid: newUser.uid,
                email: employeeData.email,
                displayName: employeeData.displayName,
                temporaryPassword: temporaryPassword,
                role: employeeData.role || "employee",
                emailSent: true
            };

        } catch (error) {
            console.error("Error in createEmployee:", error);
            throw new Error(`Erreur lors de la création de l'employé: ${error.message}`);
        }
    }
    async removeTeamMember(memberId) {
        // TODO: Implémenter la suppression du membre
        throw new Error("Fonctionnalité à implémenter");
    }

    generateTemporaryPassword(length = 12) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    async inviteMember(email, role, companyId, companyName) {
        try {
            const temporaryPassword = this.generateTemporaryPassword();

            // Envoyer l'email d'invitation
            await this.emailService.sendEmployeeInvitation({
                employeeEmail: email,
                employeeName: email.split('@')[0],
                companyName: companyName,
                temporaryPassword: temporaryPassword
            });

            return {
                success: true,
                temporaryPassword,
                message: "Invitation envoyée avec succès"
            };
        } catch (error) {
            throw new Error(`Erreur lors de l'invitation: ${error.message}`);
        }
    }
}
