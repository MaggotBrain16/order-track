import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus } from "lucide-react";
import { CustomersList } from "../../components/customer/CustomersList";
import { CreateUserWizard } from "../../components/user/CreateUserWizard";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useUser } from "../../../application/hooks/useUser"; // ← Nouveau hook
import { useToast } from "../../context/ToastContext";

export const CustomersPage = () => {
    const [showModal, setShowModal] = useState(false);

    // Hook unifié pour charger les clients
    const { clients, loading, refresh } = useUser({ initialRole: 'client' });
    const { showToast } = useToast();

    const handleCreated = (newClient) => {
        // Fermer la modal
        setShowModal(false);

        // Rafraîchir la liste pour afficher le nouveau client
        refresh();

        // Toast de confirmation (redondant avec celui du wizard, mais assure le feedback)
        showToast(`Client ${newClient.displayName} ajouté à la liste !`, "success");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Clients ({clients.length})
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Gérez votre liste de clients
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setShowModal(true)}
                        icon={<Plus className="h-4 w-4" />}
                        disabled={loading}
                    >
                        Ajouter un client
                    </Button>
                </div>
            </motion.header>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <CustomersList />
            </motion.div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Créer un client"
                size="md"
            >
                <CreateUserWizard
                    defaultRole="client"
                    onCreated={handleCreated}
                    onError={(err) => showToast(err, "error")}
                />
            </Modal>
        </motion.div>
    );
};
