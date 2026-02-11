// src/presentation/pages/orders/OrdersPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus } from "lucide-react";
import { OrderList } from "../../components/order/OrderList";
import { CreateFollowupWizard } from "../../components/order/CreateFollowupWizard";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useOrder } from "../../../application/hooks/useOrder";

export const OrdersPage = () => {
    const [isCreating, setIsCreating] = useState(false);
    const { refreshOrders } = useOrder();

    const handleOpenCreate = () => setIsCreating(true);
    const handleCloseCreate = () => setIsCreating(false);
    const handleFollowupCreated = (followup) => {
        // Rafraîchir les commandes après création
        refreshOrders();
        // Ne pas fermer ici : laisser l'utilisateur voir le QR et fermer manuellement
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
                        <ShoppingCart className="h-6 w-6" />
                        Commandes
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Gérez vos commandes en cours
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleOpenCreate}
                        icon={<Plus className="h-4 w-4" />}
                    >
                        Nouvelle commande
                    </Button>
                </div>
            </motion.header>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <OrderList />
            </motion.div>

            {/* Modal de création */}
            <Modal
                isOpen={isCreating}
                onClose={handleCloseCreate}
                title="Créer une nouvelle commande"
                size="xl"
            >
                <CreateFollowupWizard
                    onClose={handleCloseCreate}
                    onCreated={handleFollowupCreated}
                />
            </Modal>
        </motion.div>
    );
};
