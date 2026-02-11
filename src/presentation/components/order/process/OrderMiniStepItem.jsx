// src/presentation/components/order/process/OrderMiniStepItem.jsx
import React, { useState } from "react";
import {
    CheckSquare,
    Square,
    Edit3,
    Save,
    X,
    User,
    Image as ImageIcon,
    Upload,
    Camera
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../ui/Button";
import { Input, TextArea } from "../../ui/Input";

/**
 * Item de mini-étape
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.miniStep - Mini-étape
 * @param {Function} props.onUpdate - Fonction de mise à jour
 * @param {Function} props.onDelete - Fonction de suppression
 * @param {Function} props.onPhotoUpload - Fonction d'upload de photos
 * @param {Array} props.employees - Liste des employés
 * @returns {JSX.Element} Composant OrderMiniStepItem
 */
export const OrderMiniStepItem = ({
                                      miniStep,
                                      onUpdate,
                                      onDelete,
                                      onPhotoUpload,
                                      employees = []
                                  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: miniStep.title,
        notes: miniStep.notes
    });
    const [newPhotos, setNewPhotos] = useState([]);

    /**
     * Sauvegarde les modifications
     */
    const handleSave = () => {
        const updateData = { ...editData };
        if (newPhotos.length > 0) {
            updateData.photos = [...(miniStep.photos || []), ...newPhotos];
        }
        onUpdate(miniStep.id, updateData);
        setIsEditing(false);
        setNewPhotos([]);
    };

    /**
     * Obtenir les initiales d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {string} Initiales
     */
    const getUserInitials = (userId) => {
        if (!userId) return "?";
        const user = employees.find(emp => emp.id === userId);
        if (!user) return "?";
        const name = user.displayName || user.email || "";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    /**
     * Obtenir le nom complet d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {string} Nom complet
     */
    const getUserFullName = (userId) => {
        if (!userId) return "Utilisateur inconnu";
        const user = employees.find(emp => emp.uid === userId); // ✅ uid
        return user ? (user.displayName || user.email) : "Utilisateur inconnu";
    };

    /**
     * Gestion de l'upload de photos
     * @param {Event} e - Événement input
     */
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        // Simuler l'upload - à remplacer par le vrai service
        const urls = files.map((_, index) => `https://picsum.photos/200/200?random=${Date.now()}-${index}`);
        setNewPhotos(prev => [...prev, ...urls]);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-xl p-4 mb-3 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
        >
            {isEditing ? (
                <div className="space-y-4">
                    <Input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                        placeholder="Titre de la mini-étape"
                        className="text-base font-medium text-gray-900 h-12 px-3"
                    />

                    <TextArea
                        value={editData.notes}
                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                        placeholder="Notes..."
                        rows="3"
                        className="text-gray-900 px-3 py-2"
                    />

                    {/* Upload de photos */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Photos</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                                id={`photo-upload-${miniStep.id}`}
                            />
                            <label
                                htmlFor={`photo-upload-${miniStep.id}`}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors text-sm"
                            >
                                <Upload className="h-4 w-4" />
                                Ajouter des photos
                            </label>
                        </div>

                        {newPhotos.length > 0 && (
                            <div className="flex gap-2 flex-wrap pt-2">
                                {newPhotos.map((photo, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={photo}
                                            alt={`Nouvelle photo ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setNewPhotos(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={handleSave}
                            size="sm"
                            icon={<Save size={16} />}
                            className="bg-green-600 hover:bg-green-700 transition-colors"
                        >
                            Sauver
                        </Button>
                        <Button
                            onClick={() => setIsEditing(false)}
                            variant="secondary"
                            size="sm"
                            icon={<X size={16} />}
                        >
                            Annuler
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onUpdate(miniStep.id, { completed: !miniStep.completed })}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {miniStep.completed ? (
                                    <CheckSquare className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Square className="h-5 w-5" />
                                )}
                            </button>
                            <span className={`text-base font-medium ${miniStep.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {miniStep.title || 'Mini-étape sans titre'}
                            </span>
                        </div>

                        {miniStep.notes && (
                            <p className="text-sm text-gray-600 mt-2 ml-8">
                                {miniStep.notes}
                            </p>
                        )}

                        {/* Affichage des photos */}
                        {miniStep.photos && miniStep.photos.length > 0 && (
                            <div className="flex gap-2 mt-3 ml-8 flex-wrap">
                                {miniStep.photos.map((photo, index) => (
                                    <div key={index} className="group relative">
                                        <img
                                            src={photo}
                                            alt={`Photo ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                                            onClick={() => window.open(photo, '_blank')}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <ImageIcon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Affichage de l'utilisateur qui a créé la mini-step */}
                        {miniStep.createdBy && (
                            <div className="flex items-center gap-2 mt-3 ml-8">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm">
                                    {getUserInitials(miniStep.createdBy)}
                                </div>
                                <span className="text-sm text-gray-600">
                                    Créé par {getUserFullName(miniStep.createdBy)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            icon={<Edit3 size={16} />}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(miniStep.id)}
                            icon={<X size={16} />}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
};
