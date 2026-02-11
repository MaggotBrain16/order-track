// src/presentation/components/order/process/DraggableLabel.jsx
import React from "react";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2 } from "lucide-react";

export const DraggableLabel = ({ label, onUpdate, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `label-${label.id}`,
        data: {
            type: 'label',
            label: label
        }
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
        zIndex: 50
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group bg-white border-2 rounded-lg p-3 transition-all ${
                isDragging
                    ? 'opacity-50 shadow-xl ring-2 ring-indigo-400 rotate-2'
                    : 'hover:shadow-md border-gray-200'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    {...listeners}
                    {...attributes}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                </div>

                <div
                    className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                    style={{ backgroundColor: label.color }}
                />

                <span className="font-medium text-gray-900 flex-1">{label.name}</span>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onUpdate(label)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(label.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
