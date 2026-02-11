// src/presentation/components/order/process/OrderLabelCreator.jsx
import React, { useState } from "react";
import { Tag, Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { ColorPicker } from "./ColorPicker";

/**
 * Composant de création d'étiquettes
 * @param {Object} props - Propriétés du composant
 * @param {Function} props.onCreate - Fonction de création
 * @returns {JSX.Element} Composant OrderLabelCreator
 */
export const OrderLabelCreator = ({ onCreate }) => {
    const [newLabelName, setNewLabelName] = useState("");
    const [newLabelColor, setNewLabelColor] = useState("#3b82f6");

    /**
     * Ajoute une nouvelle étiquette
     */
    const handleAddLabel = () => {
        if (newLabelName.trim()) {
            onCreate({
                name: newLabelName,
                color: newLabelColor
            });
            setNewLabelName("");
            setNewLabelColor("#3b82f6");
        }
    };

    /**
     * Gestion de la touche Entrée
     * @param {KeyboardEvent} e - Événement clavier
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddLabel();
        }
    };

    return (
        <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Tag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Étiquettes d'étape</h2>
                        <p className="text-sm text-gray-500">Créez vos catégories de tâches</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <Input
                        type="text"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nom de l'étiquette"
                        className="h-12 px-4 text-base"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Couleur de l'étiquette
                        </label>
                        <ColorPicker
                            currentColor={newLabelColor}
                            onColorChange={setNewLabelColor}
                            label="Sélectionner une couleur"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleAddLabel}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    icon={<Plus size={18} />}
                >
                    Ajouter une étiquette
                </Button>
            </CardContent>
        </Card>
    );
};
