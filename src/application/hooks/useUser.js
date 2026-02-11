// src/application/hooks/useUser.js
import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../services/UserService';
import { User } from '../../core/entities/User';

/**
 * Hook unifié pour la gestion des utilisateurs (clients, employés, admins)
 * @param {Object} options - Options initiales
 * @param {string|null} options.initialRole - Rôle à charger au montage ('client', 'employee', ou null pour tous)
 * @param {string|null} options.companyId - Filtrer par entreprise (optionnel)
 * @returns {Object} État et fonctions de gestion des utilisateurs
 */
export function useUser(options = {}) {
    const { initialRole = null, companyId = null } = options;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentFilter, setCurrentFilter] = useState({ role: initialRole, companyId });

    const userService = new UserService();

    // Chargement initial
    useEffect(() => {
        loadUsers(initialRole, companyId);
    }, []);

    /**
     * Charge les utilisateurs (tous ou filtrés par rôle/entreprise)
     */
    const loadUsers = useCallback(async (role = null, compId = null) => {
        setLoading(true);
        setError(null);
        setCurrentFilter({ role, companyId: compId });

        try {
            let userList;

            if (compId) {
                // Si companyId fourni, on prend tous les users de l'entreprise
                userList = await userService.getUsersByCompany(compId);
                // Et on filtre par rôle si demandé
                if (role) {
                    userList = userList.filter(u => u.role === role);
                }
            } else if (role) {
                // Sinon filtre par rôle uniquement
                userList = await userService.getUsersByRole(role);
            } else {
                // Sinon on récupère tous les users (clients + employees)
                const [clients, employees] = await Promise.all([
                    userService.getUsersByRole('client'),
                    userService.getUsersByRole('employee')
                ]);
                userList = [...clients, ...employees];
            }

            setUsers(userList);
            return userList;
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors du chargement des utilisateurs:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userService]);

    /**
     * Rafraîchit la liste avec les filtres actuels
     */
    const refresh = useCallback(async () => {
        return loadUsers(currentFilter.role, currentFilter.companyId);
    }, [loadUsers, currentFilter]);

    /**
     * Crée un nouveau client
     */
    const createClient = useCallback(async (email, displayName, companyData = null) => {
        setLoading(true);
        setError(null);

        try {
            // Génération auto du companyId si non fourni
            const finalCompanyId = companyData?.companyId ||
                "COMP-" + displayName.toUpperCase().replace(/\s+/g, '-');
            const finalCompanyName = companyData?.companyName || displayName.toLowerCase();

            // Créer l'entité via la méthode statique
            const clientEntity = User.createClient(
                email,
                displayName,
                finalCompanyId,
                finalCompanyName
            );

            // Persister via le service
            const createdClient = await userService.createUser(clientEntity);

            // Mise à jour optimiste de la liste si on affiche des clients
            if (!currentFilter.role || currentFilter.role === 'client') {
                setUsers(prev => [...prev, createdClient]);
            }

            return createdClient;
        } catch (err) {
            setError(err.message);
            console.error('Erreur création client:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userService, currentFilter]);

    /**
     * Crée un nouvel employé
     */
    const createEmployee = useCallback(async (email, displayName, companyId, role = 'employee') => {
        setLoading(true);
        setError(null);

        try {
            const employeeEntity = User.createEmployee(email, displayName, companyId, role);
            const createdEmployee = await userService.createUser(employeeEntity);

            // Mise à jour optimiste si on affiche des employés
            if (!currentFilter.role || currentFilter.role === 'employee') {
                setUsers(prev => [...prev, createdEmployee]);
            }

            return createdEmployee;
        } catch (err) {
            setError(err.message);
            console.error('Erreur création employé:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userService, currentFilter]);

    /**
     * Récupère un utilisateur par ID (depuis la liste locale ou l'API)
     */
    const getById = useCallback((id) => {
        // Recherche locale d'abord
        const localUser = users.find(u => String(u.uid) === String(id));
        if (localUser) return localUser;

        // Sinon retourne null (ou tu peux appeler getUserById du service si besoin)
        return null;
    }, [users]);

    /**
     * Récupère un utilisateur par ID depuis l'API (force refresh)
     */
    const fetchById = useCallback(async (id) => {
        setLoading(true);
        try {
            const user = await userService.getUserById(id);
            return user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userService]);

    /**
     * Met à jour un utilisateur
     */
    const update = useCallback(async (userId, updateData) => {
        setLoading(true);
        setError(null);

        try {
            const updatedUser = await userService.updateUser(userId, updateData);

            // Mise à jour locale
            setUsers(prev =>
                prev.map(u => u.uid === userId ? updatedUser : u)
            );

            return updatedUser;
        } catch (err) {
            setError(err.message);
            console.error('Erreur mise à jour user:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userService]);

    /**
     * Supprime un utilisateur
     */
    const remove = useCallback(async (userId) => {
        setLoading(true);
        setError(null);

        try {
            await userService.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.uid !== userId));
        } catch (err) {
            setError(err.message);
            console.error('Erreur suppression user:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userService]);

    // Helpers filtrés (computed)
    const clients = users.filter(u => u.role === 'client');
    const employees = users.filter(u => u.role === 'employee');
    const admins = users.filter(u => u.role === 'admin');

    // Validation helpers
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateDisplayName = (name) => name && name.trim().length > 0;

    return {
        // State
        users,
        clients,
        employees,
        admins,
        loading,
        error,
        currentFilter,

        // CRUD Operations
        loadUsers,           // Charger avec filtres (role, companyId)
        refresh,             // Rafraîchir avec filtres actuels
        createClient,        // Créer un client
        createEmployee,      // Créer un employé
        getById,             // Récupérer par ID (local)
        fetchById,           // Récupérer par ID (API)
        update,              // Mettre à jour
        remove,              // Supprimer

        // Helpers
        validateEmail,
        validateDisplayName
    };
}
