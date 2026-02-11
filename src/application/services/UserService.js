// src/application/services/UserService.js
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { User } from '../../core/entities/User';

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(userData) {
        try {
            // Générer un UID si non fourni
            const uid = userData.uid || this.generateUid();

            // Créer l'instance User
            const user = new User({
                ...userData,
                uid,
                createdAt: new Date()
            });

            // Persister dans la base de données
            const createdUser = await this.userRepository.createUser(user);
            return createdUser;
        } catch (error) {
            throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            return await this.userRepository.getById(id);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
        }
    }

    async getUsersByRole(role) {
        try {
            return await this.userRepository.getByRole(role);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
        }
    }

    async getUsersByCompany(companyId) {
        try {
            return await this.userRepository.getByCompany(companyId);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
        }
    }

    async updateUser(userId, updateData) {
        try {
            return await this.userRepository.updateUser(userId, updateData);
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
        }
    }

    generateUid() {
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return `uid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Méthodes utilitaires
    static createClient(email, displayName, companyId = null) {
        return User.createClient(email, displayName, companyId);
    }

    static createEmployee(email, displayName, companyId, role = "employee") {
        return User.createEmployee(email, displayName, companyId, role);
    }
}
