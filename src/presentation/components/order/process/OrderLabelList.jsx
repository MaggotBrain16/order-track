// src/presentation/components/order/process/OrderLabelList.jsx
import React from "react";
import { Layers } from "lucide-react";
import { DraggableLabel } from "./DraggableLabel";

export const OrderLabelList = ({ labels, onUpdate, onDelete }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
                <Layers className="h-5 w-5" />
                <h3 className="font-semibold">Étiquettes disponibles</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {labels.length}
                </span>
            </div>

            {labels.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    Aucune étiquette créée
                </div>
            ) : (
                <div className="space-y-2">
                    {labels.map((label) => (
                        <DraggableLabel
                            key={label.id}
                            label={label}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                <span className="inline-block w-4 h-4 border border-dashed border-gray-400 rounded"></span>
                Glissez une étiquette dans le workflow
            </p>
        </div>
    );
};
