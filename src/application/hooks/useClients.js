// src/application/hooks/useClients.js
import { useState, useEffect, useCallback } from 'react';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const userRepository = new UserRepository();

export function useClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadClients = async () => {
            setLoading(true);
            setError(null);

            try {
                const clientList = await userRepository.getByRole('client');
                setClients(clientList);
                console.log("Clients chargés:", clientList.length);
            } catch (err) {
                setError(err.message);
                console.error('Erreur lors du chargement des clients:', err);
            } finally {
                setLoading(false);
            }
        };

        loadClients();
    }, []);

    // AJOUTER CETTE FONCTION :
    const createClient = useCallback(async (clientData) => {
        try {
            setLoading(true);
            setError(null);

            console.log("[DEBUG] Creating client in repository:", clientData);

            // clientData doit contenir un uid (généré par UserService ou User.createClient)
            const newClient = await userRepository.createUser(clientData);

            // Mise à jour optimiste de la liste locale
            setClients(prev => [...prev, newClient]);

            return newClient;
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la création du client:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getClientById = useCallback((id) => {
        return clients.find((c) => String(c.uid) === String(id)) || null;
    }, [clients]);

    const refreshClients = useCallback(async () => {
        setLoading(true);
        try {
            const clientList = await userRepository.getByRole('client');
            setClients(clientList);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // N'oublie pas de l'ajouter dans le return !
    return {
        clients,
        loading,
        error,
        getClientById,
        refreshClients,
        createClient // ← AJOUTÉ ICI
    };
}
