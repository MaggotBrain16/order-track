// src/presentation/components/order/process/OrderQuickActions.jsx
import React from "react";
import { Zap, Plus, Sparkles } from "lucide-react";
import { Card, CardHeader, CardContent } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { motion } from "framer-motion";

/**
 * Actions rapides pour ajouter des étapes
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.labels - Liste des étiquettes
 * @param {Function} props.onAddStep - Fonction d'ajout d'étape
 * @returns {JSX.Element} Composant OrderQuickActions
 */
export const OrderQuickActions = ({ labels, onAddStep }) => {
    return (
        <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Sparkles className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
                        <p className="text-sm text-gray-500">Ajoutez rapidement des étapes</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    {labels.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg"
                        >
                            <p className="text-sm">Aucune étiquette disponible</p>
                        </motion.div>
                    ) : (
                        labels.map((label, index) => (
                            <motion.div
                                key={label.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Button
                                    variant="outline"
                                    onClick={() => onAddStep(label)}
                                    className="w-full text-left justify-between gap-3 py-3 hover:shadow-sm transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full shadow-sm"
                                            style={{ backgroundColor: label.color }}
                                        />
                                        <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                            {label.name}
                                        </span>
                                    </div>
                                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </Button>
                            </motion.div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
