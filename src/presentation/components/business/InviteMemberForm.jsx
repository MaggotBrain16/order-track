// src/presentation/components/business/InviteMemberForm.jsx
import React, { useState } from "react";
import { Send, UserPlus } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { useToast } from "../../context/ToastContext";

export const InviteMemberForm = ({ onInvite, onCancel }) => {
    const [formData, setFormData] = useState({
        email: "",
        role: "employee"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
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

        if (!formData.email.trim()) {
            setError("Veuillez entrer un email valide");
            return;
        }

        // Validation email simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Veuillez entrer un email valide");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await onInvite(formData);
            setFormData({ email: "", role: "employee" });
            showToast("Invitation envoyée avec succès !", "success");
        } catch (error) {
            console.error("Erreur lors de l'invitation:", error);
            setError(error.message || "Erreur lors de l'invitation");
            showToast(error.message || "Erreur lors de l'invitation", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Inviter un nouveau membre</h3>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        placeholder="email@entreprise.com"
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
                            icon={<Send size={16} />}
                        >
                            {isSubmitting ? "Envoi en cours..." : "Envoyer l'invitation"}
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
