// src/presentation/components/business/CompanyInfo.jsx
import React, { useState } from "react";
import { Building, Mail, Phone, MapPin, Edit3, Save, X } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, TextArea } from "../ui/Input";
import { useToast } from "../../context/ToastContext";

export const CompanyInfo = ({ company, onUpdate, loading, error }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: company?.name || "",
        address: company?.address || "",
        phone: company?.phone || "",
        email: company?.email || "",
        siret: company?.siret || ""
    });
    const { showToast } = useToast();

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate(formData);
            setIsEditing(false);
            showToast("Informations mises à jour avec succès", "success");
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            showToast("Erreur lors de la mise à jour: " + error.message, "error");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: company?.name || "",
            address: company?.address || "",
            phone: company?.phone || "",
            email: company?.email || "",
            siret: company?.siret || ""
        });
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-10 bg-gray-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center text-red-600">
                        Erreur lors du chargement des informations: {error.message}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Informations de l'entreprise</h2>
                    {!isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            icon={<Edit3 size={16} />}
                        >
                            Modifier
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nom de l'entreprise"
                                value={formData.name}
                                onChange={handleChange("name")}
                                required
                            />

                            <Input
                                label="SIRET"
                                value={formData.siret}
                                onChange={handleChange("siret")}
                            />
                        </div>

                        <TextArea
                            label="Adresse"
                            value={formData.address}
                            onChange={handleChange("address")}
                            rows={3}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Téléphone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange("phone")}
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange("email")}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" icon={<Save size={16} />}>
                                Enregistrer
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                icon={<X size={16} />}
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {company?.name || "Entreprise non définie"}
                                </h3>
                                {company?.siret && (
                                    <p className="text-sm text-gray-500 mt-1">SIRET: {company.siret}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                                <div className="space-y-3">
                                    {company?.email && (
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                            {company.email}
                                        </div>
                                    )}
                                    {company?.phone && (
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Phone className="mr-2 h-4 w-4 text-gray-400" />
                                            {company.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-500">Adresse</h4>
                                <div className="flex items-start text-sm text-gray-900">
                                    <MapPin className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
                                    <div className="whitespace-pre-line">
                                        {company?.address || "Adresse non définie"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
