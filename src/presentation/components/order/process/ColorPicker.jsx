// src/presentation/components/order/process/ColorPicker.jsx
import React, { useState } from "react";
import { Palette, X } from "lucide-react";
import { Button } from "../../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Sélecteur de couleur dans une modal
 * @param {Object} props - Propriétés du composant
 * @param {string} props.currentColor - Couleur actuelle
 * @param {Function} props.onColorChange - Fonction de rappel
 * @param {string} props.label - Texte du bouton
 * @returns {JSX.Element} Composant ColorPickerModal
 */
export const ColorPicker = ({ currentColor, onColorChange, label = "Choisir une couleur" }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Palette de couleurs prédéfinies
    const colors = [
        { name: "Bleu", value: "#3b82f6", class: "bg-blue-500" },
        { name: "Vert", value: "#10b981", class: "bg-green-500" },
        { name: "Rouge", value: "#ef4444", class: "bg-red-500" },
        { name: "Jaune", value: "#f59e0b", class: "bg-yellow-500" },
        { name: "Orange", value: "#f97316", class: "bg-orange-500" },
        { name: "Noir", value: "#1f2937", class: "bg-gray-800" }
    ];

    /**
     * Ferme la modal
     */
    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2"
            >
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentColor }}
                />
                {label}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Choisir une couleur</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => {
                                            onColorChange(color.value);
                                            closeModal();
                                        }}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                                            currentColor === color.value
                                                ? "border-indigo-500 bg-indigo-50 scale-105"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full ${color.class}`} />
                                        <span className="text-xs font-medium text-gray-700">
                                            {color.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
