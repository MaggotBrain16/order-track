// src/presentation/pages/orders/UpdateOrderPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    Settings,
    FileText,
    Calendar,
    Hash
} from "lucide-react";
import { OrderLabelCreator } from "../../components/order/process/OrderLabelCreator";
import { OrderLabelList } from "../../components/order/process/OrderLabelList";
import { OrderQuickActions } from "../../components/order/process/OrderQuickActions";
import { OrderWorkflow } from "../../components/order/process/OrderWorkflow";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { useProcessLabels } from "../../../application/hooks/useProcessLabels";
import { useProcessSteps } from "../../../application/hooks/useProcessSteps";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../../application/hooks/useOrder.js";

// Composant pour l'aperçu pendant le drag
const DragPreview = ({ label }) => (
    <div className="bg-white border-2 border-indigo-500 rounded-lg p-3 shadow-2xl opacity-90 rotate-3 scale-105 w-64">
        <div className="flex items-center gap-3">
            <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: label.color }}
            />
            <span className="font-bold text-gray-900">{label.name}</span>
        </div>
        <div className="mt-2 text-xs text-indigo-600 font-medium">
            Ajouter au workflow →
        </div>
    </div>
);

export const UpdateOrderPage = () => {
    const { orderId } = useParams();
    const { userProfile } = useAuth();
    const companyId = userProfile?.companyId;
    const currentUser = userProfile;

    const [activeDragItem, setActiveDragItem] = useState(null);

    const {
        order,
        formatDate,
        loading: orderLoading,
        ordersError: orderError
    } = useOrder(orderId);

    const {
        labels,
        loading: labelsLoading,
        error: labelsError,
        createLabel,
        updateLabel,
        deleteLabel,
        reorderLabels,
        refreshLabels
    } = useProcessLabels(companyId);

    const {
        steps,
        loading: stepsLoading,
        error: stepsError,
        createStep,
        updateStep,
        addMiniStep,
        updateMiniStep,
        deleteMiniStep,
        deleteStep,
        refreshSteps
    } = useProcessSteps(orderId);

    // Configuration des capteurs pour le drag
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 } // 8px de déplacement avant activation
        })
    );

    // Rafraîchir les étapes quand l'orderId change
    useEffect(() => {
        if (orderId) {
            refreshSteps();
        }
    }, [orderId, refreshSteps]);

    // Début du drag - on stocke l'item actif
    const handleDragStart = (event) => {
        const { active } = event;
        console.log("[DEBUG] DragStart:", active.id, active.data.current);
        setActiveDragItem(active.data.current);
    };

    // Fin du drag - gestion du drop
    const handleDragEnd = (event) => {
        const { active, over } = event;

        console.log("[DEBUG] DragEnd:", {
            activeId: active.id,
            overId: over?.id,
            activeData: active.data.current,
            overData: over?.data?.current
        });

        setActiveDragItem(null);

        // Si on ne drop pas sur une zone valide, on annule
        if (!over) {
            console.log("[DEBUG] Drop annulé - pas de zone cible");
            return;
        }

        // Cas 1 : On drop un LABEL dans la zone workflow
        if (active.data.current?.type === 'label' && over.id === 'workflow-drop-zone') {
            const label = active.data.current.label;
            console.log("[DEBUG] Ajout de l'étape depuis le label:", label);

            handleAddStepToWorkflow(label);
            return;
        }

        // Cas 2 : Réordonnement des étapes existantes (optionnel pour plus tard)
        // if (active.data.current?.type === 'step' && over.data.current?.type === 'step') {
        //     // Logique de réordonnement ici
        // }
    };

    const handleCreateLabel = (labelData) => {
        createLabel({
            ...labelData,
            order: labels.length
        });
    };

    const handleAddStepToWorkflow = (label) => {
        createStep({
            orderId: orderId,
            labelId: label.id,
            labelName: label.name,
            position: steps.length,
            status: "pending",
            miniSteps: [],
            attributedTo: [],
            color: label.color // On garde la couleur du label
        });
    };

    const handleDeleteStep = (stepId) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette étape ?");
        if (confirmation) {
            deleteStep(stepId);
        }
    };

    // États de chargement
    if (orderLoading || labelsLoading || stepsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (orderError || labelsError || stepsError) {
        return (
            <div className="text-center py-12 text-red-500">
                Erreur de chargement des données
            </div>
        );
    }

    if (!order) {
        return <div className="text-center py-12">Commande non trouvée</div>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <FileText className="h-7 w-7 text-indigo-600" />
                                Commande #{order.orderNumber}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate ? formatDate(order.createdAt) : new Date(order.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Hash className="h-4 w-4" />
                                    {order.client?.name || 'Client non spécifié'}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status === 'completed' ? 'Terminée' :
                                        order.status === 'in_progress' ? 'En cours' : 'En attente'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Settings className="h-4 w-4" />
                                Paramètres
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Layout principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colonne gauche - Labels */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-bold text-gray-900">Configuration</h2>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <OrderLabelCreator onCreate={handleCreateLabel} />
                                <OrderLabelList
                                    labels={labels}
                                    onUpdate={updateLabel}
                                    onDelete={deleteLabel}
                                />
                                <OrderQuickActions
                                    labels={labels}
                                    onAddStep={handleAddStepToWorkflow}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Colonne droite - Workflow */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <OrderWorkflow
                            steps={steps}
                            labels={labels}
                            onUpdateStep={updateStep}
                            onAddMiniStep={addMiniStep}
                            onUpdateMiniStep={updateMiniStep}
                            onDeleteMiniStep={deleteMiniStep}
                            onDeleteStep={handleDeleteStep}
                            companyId={companyId}
                            currentUser={currentUser}
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Overlay pendant le drag */}
            <DragOverlay dropAnimation={{ duration: 0.2 }}>
                {activeDragItem?.type === 'label' ? (
                    <DragPreview label={activeDragItem.label} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};
