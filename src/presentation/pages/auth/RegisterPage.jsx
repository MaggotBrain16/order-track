// src/presentation/pages/auth/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        displayName: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState("register"); // register ou success

    // Récupérer les paramètres de l'URL (si invitation)
    const searchParams = new URLSearchParams(location.search);
    const invitedEmail = searchParams.get("email");

    // Si email d'invitation présent, pré-remplir
    React.useEffect(() => {
        if (invitedEmail) {
            setFormData(prev => ({
                ...prev,
                email: invitedEmail
            }));
        }
    }, [invitedEmail]);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        if (error) setError("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await register(formData.email, formData.password, formData.displayName);
            setStep("success");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (step === "success") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-xl p-8 text-center"
                >
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>

                    <div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            Compte créé avec succès !
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Bienvenue dans l'application de suivi de commandes.
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate("/")}
                        className="w-full"
                    >
                        Accéder au tableau de bord
                    </Button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-xl p-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Création de compte
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Créez votre compte personnel
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange("email")}
                            required
                            icon={<Mail className="h-4 w-4" />}
                            placeholder="email@entreprise.com"
                            readOnly={!!invitedEmail}
                        />

                        <Input
                            label="Nom complet"
                            type="text"
                            value={formData.displayName}
                            onChange={handleChange("displayName")}
                            required
                            icon={<User className="h-4 w-4" />}
                            placeholder="Votre nom complet"
                        />

                        <div className="relative">
                            <Input
                                label="Mot de passe"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange("password")}
                                required
                                icon={<Lock className="h-4 w-4" />}
                                placeholder="Au moins 6 caractères"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirmer le mot de passe"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange("confirmPassword")}
                                required
                                icon={<Lock className="h-4 w-4" />}
                                placeholder="Confirmez votre mot de passe"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        {error}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                            icon={loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : null}
                        >
                            {loading ? "Création en cours..." : "Créer mon compte"}
                        </Button>
                    </div>
                </form>

                {invitedEmail && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Invitation détectée :</strong> Vous avez été invité avec l'email {invitedEmail}
                        </p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
