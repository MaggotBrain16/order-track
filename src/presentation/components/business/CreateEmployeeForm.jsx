// src/presentation/components/business/CreateEmployeeForm.jsx
import React, { useState } from "react";
import { UserPlus, Copy, Check } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { useToast } from "../../context/ToastContext";

export const CreateEmployeeForm = ({ onCreate, onCancel }) => {
    const [formData, setFormData] = useState({
        email: "",
        displayName: "",
        role: "employee"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [createdEmployee, setCreatedEmployee] = useState(null);
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.email.trim()) {
            setError("Veuillez entrer un email valide");
            return;
        }

        if (!formData.displayName.trim()) {
            setError("Veuillez entrer un nom");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const result = await onCreate(formData);
            setCreatedEmployee(result);
            showToast("Employé créé avec succès !", "success");
        } catch (err) {
            setError(err.message || "Erreur lors de la création de l'employé");
            showToast(err.message || "Erreur lors de la création de l'employé", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({ email: "", displayName: "", role: "employee" });
        setCreatedEmployee(null);
        setCopied(false);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            showToast("Copié dans le presse-papier", "success");
        } catch (err) {
            showToast("Erreur lors de la copie", "error");
        }
    };

    // Afficher les instructions de connexion si l'employé est créé
    if (createdEmployee) {
        return (
            <Card>
                <CardContent>
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Employé créé avec succès !</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Les instructions ont été envoyées par email
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-3">📋 Instructions pour l'employé :</h4>
                            <div className="space-y-3 text-sm text-blue-700">
                                <div className="flex justify-between items-center">
                                    <span><strong>Email :</strong> {createdEmployee.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span><strong>Mot de passe temporaire :</strong></span>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                                            {createdEmployee.temporaryPassword}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(createdEmployee.temporaryPassword)}
                                            icon={copied ? <Check size={14} /> : <Copy size={14} />}
                                        >
                                            {copied ? "Copié" : "Copier"}
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                    <p className="font-medium text-yellow-800">⚠️ Action requise :</p>
                                    <ol className="list-decimal list-inside text-yellow-700 mt-1 space-y-1">
                                        <li>Aller sur la page d'inscription (<code className="bg-white px-1 rounded">/register</code>)</li>
                                        <li>Utiliser cet email et mot de passe</li>
                                        <li>Changer immédiatement son mot de passe</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleReset}
                                className="flex-1"
                                icon={<UserPlus size={16} />}
                            >
                                Créer un autre employé
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={onCancel}
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Ajouter un nouvel employé</h3>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        placeholder="email@entreprise.com"
                        required
                    />

                    <Input
                        label="Nom complet *"
                        type="text"
                        value={formData.displayName}
                        onChange={handleChange("displayName")}
                        placeholder="Prénom NOM"
                        required
                    />

                    <Select
                        label="Rôle"
                        value={formData.role}
                        onChange={handleChange("role")}
                    >
                        <option value="employee">Employé</option>
                        <option value="admin">Administrateur</option>
                    </Select>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                            icon={isSubmitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : null}
                        >
                            {isSubmitting ? "Création en cours..." : "Créer l'employé"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Annuler
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
