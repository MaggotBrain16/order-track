import React, { useState } from "react";
import { UserPlus, Check } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useUser } from "../../../application/hooks/useUser"; // ← Nouveau hook
import { useToast } from "../../context/ToastContext"; // ← Pour le toast

export const CreateUserWizard = ({ defaultRole = "client", onCreated, onError }) => {
    const [formData, setFormData] = useState({
        email: "",
        displayName: "",
        companyId: "",
    });

    const [success, setSuccess] = useState(false);

    // Nouveau hook unifié
    const { createClient, createEmployee, validateEmail, validateDisplayName } = useUser();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);

        // Validation
        if (!validateEmail(formData.email)) {
            showToast("Email invalide", "error");
            if (onError) onError("Email invalide");
            return;
        }
        if (!validateDisplayName(formData.displayName)) {
            showToast("Le nom est requis", "error");
            if (onError) onError("Le nom est requis");
            return;
        }

        try {
            let newUser;

            // Création selon le rôle avec le hook unifié
            if (defaultRole === 'client') {
                newUser = await createClient(
                    formData.email.trim(),
                    formData.displayName.trim(),
                    { companyId: formData.companyId || null }
                );
            } else {
                // employee ou admin
                newUser = await createEmployee(
                    formData.email.trim(),
                    formData.displayName.trim(),
                    formData.companyId || null,
                    defaultRole
                );
            }

            // 🎉 Toast de succès
            const roleLabel = defaultRole === 'client' ? 'Client' : defaultRole === 'employee' ? 'Employé' : 'Utilisateur';
            showToast(`${roleLabel} ${newUser.displayName} créé avec succès !`, "success");

            setSuccess(true);

            // Callback parent
            if (onCreated) {
                onCreated(newUser);
            }

            // Reset form
            setFormData({
                email: "",
                displayName: "",
                companyId: "",
            });

        } catch (err) {
            showToast(err.message || "Erreur lors de la création", "error");
            if (onError) onError(err.message);
        }
    };

    const onChangeField = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Créer {defaultRole === 'client' ? 'un client' : 'un employé'}
                </h3>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={onChangeField("email")}
                        required
                        placeholder="email@entreprise.com"
                    />

                    <Input
                        label="Nom / Raison sociale *"
                        type="text"
                        value={formData.displayName}
                        onChange={onChangeField("displayName")}
                        required
                        placeholder="Nom complet"
                    />

                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Création réussie !
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        icon={success ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    >
                        {success ? "Créé !" : `Créer ${defaultRole === 'client' ? 'le client' : 'l\'employé'}`}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
