// src/presentation/components/order/process/OrderWorkflow.jsx
import React from "react";
import { Workflow, AlertCircle, Layers, Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "../../ui/Card";
import { OrderProcessStepCard } from "./OrderProcessStepCard";
import { motion } from "framer-motion";
import { useDroppable } from '@dnd-kit/core';

const WorkflowDropZone = () => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'workflow-drop-zone',
        data: { type: 'workflow-zone' }
    });

    return (
        <div
            ref={setNodeRef}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 mb-6 ${
                isOver
                    ? 'border-indigo-500 bg-indigo-50 scale-[1.02] shadow-lg'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
        >
            <div className={`mx-auto h-12 w-12 mb-3 rounded-full flex items-center justify-center transition-colors ${
                isOver ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
            }`}>
                <Plus className="h-6 w-6" />
            </div>
            <p className={`font-medium transition-colors ${
                isOver ? 'text-indigo-700' : 'text-gray-600'
            }`}>
                {isOver ? 'Relâchez pour ajouter l\'étape' : 'Glissez une étiquette ici'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
                Les étapes s'ajoutent à la fin du workflow
            </p>
        </div>
    );
};

export const OrderWorkflow = ({
                                  steps,
                                  labels,
                                  onUpdateStep,
                                  onAddMiniStep,
                                  onUpdateMiniStep,
                                  onDeleteMiniStep,
                                  onDeleteStep,
                                  companyId,
                                  currentUser
                              }) => {
    return (
        <Card className="h-full">
            <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Workflow className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Workflow de production</h2>
                            <p className="text-sm text-gray-500">{steps.length} étape(s) configurée(s)</p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* Zone de Drop */}
                <WorkflowDropZone />

                {/* Liste des étapes */}
                {steps.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">Aucune étape dans le workflow</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Commencez par glisser une étiquette ci-dessus
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <OrderProcessStepCard
                                    step={step}
                                    labels={labels}
                                    onUpdateStep={onUpdateStep}
                                    onAddMiniStep={onAddMiniStep}
                                    onUpdateMiniStep={onUpdateMiniStep}
                                    onDeleteMiniStep={onDeleteMiniStep}
                                    onDeleteStep={onDeleteStep}
                                    companyId={companyId}
                                    currentUser={currentUser}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
