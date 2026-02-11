import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Calendar,
    Hash,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { useAuth } from "../../../application/hooks/useAuth";
import { useUser } from "../../../application/hooks/useUser"; // ← Nouveau hook unifié
import { useOrderCreation } from "../../../application/hooks/useOrderCreation";

export const CreateFollowupWizard = ({ orderId, onClose, onCreated }) => {
    const navigate = useNavigate();
    const { user: firebaseUser, userProfile } = useAuth();

    // Nouveau hook : charge uniquement les clients
    const { clients, loading: loadingClients } = useUser({ initialRole: 'client' });

    const { createOrder, loading, createdOrder, step, setStep, qrToken } = useOrderCreation();
    const [localLoading, setLocalLoading] = useState(false);
    const setLoading = setLocalLoading;
    const qrRef = useRef(null);

    const [formData, setFormData] = useState({
        clientId: "",
        startDate: "",
        estimatedEndDate: "",
        orderNumber: "",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
            ...prev,
            startDate: today,
            estimatedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));
    }, []);

    const onChangeField = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (error) setError("");
    };

    const getClientById = (id) => {
        return clients.find((c) => String(c.uid) === String(id)) || null;
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            onClose?.();
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            // Validation
            if (!formData.clientId) {
                setError("Veuillez sélectionner un client");
                return;
            }
            if (!formData.orderNumber.trim()) {
                setError("Veuillez entrer un numéro de commande");
                return;
            }
            if (!formData.startDate) {
                setError("Veuillez entrer une date de début");
                return;
            }
            if (!formData.estimatedEndDate) {
                setError("Veuillez entrer une date de fin estimée");
                return;
            }
            if (new Date(formData.startDate) > new Date(formData.estimatedEndDate)) {
                setError("La date de début doit être antérieure à la date de fin");
                return;
            }

            setStep(2);
        } else if (step === 2) {
            // Création de la commande
            setLoading(true);
            setError("");
            const selectedClient = getClientById(formData.clientId);

            try {
                const order = await createOrder({
                    formData,
                    currentUser: firebaseUser,
                    selectedClient: selectedClient,
                    creatorName: userProfile?.displayName || firebaseUser?.displayName || firebaseUser?.email,
                });

                setStep(3);
                onCreated?.(order);
            } catch (err) {
                console.error("Création échouée", err);
                setError(err.message || "Erreur lors de la création de la commande");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFinish = () => {
        onClose?.();
        if (createdOrder) {
            navigate(`/orders/${createdOrder.id}`);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Créer un nouveau bon de suivi
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            icon={<X size={16} />}
                        />
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        s <= step
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-600"
                                    }`}>
                                        {s < step ? (
                                            <CheckCircle size={16} />
                                        ) : (
                                            s
                                        )}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-16 h-1 mx-2 ${
                                            s < step ? "bg-blue-600" : "bg-gray-200"
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-2 text-sm text-gray-500">
                            {step === 1 && "Informations de base"}
                            {step === 2 && "Confirmation"}
                            {step === 3 && "Terminé"}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* STEP 1 : saisie */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <Select
                                        label="Client *"
                                        value={formData.clientId}
                                        onChange={onChangeField("clientId")}
                                        disabled={loadingClients || loading}
                                    >
                                        <option value="">Sélectionner un client…</option>
                                        {clients.map((c) => (
                                            <option key={String(c.uid)} value={String(c.uid)}>
                                                {c.displayName} — {c.email}
                                            </option>
                                        ))}
                                    </Select>

                                    {loadingClients && (
                                        <div className="text-sm text-gray-500 mt-1">Chargement des clients…</div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => navigate("/customers")}
                                        className="mt-2 text-blue-600 text-sm underline hover:text-blue-800"
                                    >
                                        + Ajouter un client
                                    </button>

                                    {formData.clientId && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                            <div className="text-xs text-gray-600">Client sélectionné:</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {getClientById(formData.clientId)?.displayName || "—"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {getClientById(formData.clientId)?.email || "—"}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Date de début *"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={onChangeField("startDate")}
                                        icon={<Calendar size={16} />}
                                    />

                                    <Input
                                        label="Date fin estimée *"
                                        type="date"
                                        value={formData.estimatedEndDate}
                                        onChange={onChangeField("estimatedEndDate")}
                                        icon={<Calendar size={16} />}
                                    />
                                </div>

                                <Input
                                    label="Numéro de commande *"
                                    value={formData.orderNumber}
                                    onChange={onChangeField("orderNumber")}
                                    placeholder="Ex: ORD-2026-001"
                                    icon={<Hash size={16} />}
                                />

                                <div className="p-3 bg-gray-50 rounded-md">
                                    <div className="text-xs text-gray-600">Créé par</div>
                                    <div className="text-sm text-gray-900">
                                        {userProfile?.displayName ?? firebaseUser?.email ?? "Anonyme"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 : confirmation */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                                        <CheckCircle className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                                        Confirmez les informations
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Vérifiez les détails avant de créer la commande
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Client:</span>
                                        <span className="font-medium text-gray-900">
                                            {getClientById(formData.clientId)?.displayName}
                                        </span>
                                    </div>

                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Commande:</span>
                                        <span className="font-medium text-gray-900">
                                            {formData.orderNumber}
                                        </span>
                                    </div>

                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Dates:</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(formData.startDate).toLocaleDateString('fr-FR')} → {new Date(formData.estimatedEndDate).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 : terminé */}
                        {step === 3 && createdOrder && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        Commande créée avec succès !
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        ID: <strong>{createdOrder.id}</strong>
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="inline-block bg-white p-4 rounded-md shadow-sm">
                                        <div ref={qrRef} style={{ display: "inline-block" }}>
                                            <QRCode
                                                value={JSON.stringify({
                                                    type: "order",
                                                    id: createdOrder.id,
                                                    orderNumber: createdOrder.orderNumber,
                                                    clientId: createdOrder.clientId,
                                                    clientName: createdOrder.clientName,
                                                    createdAt: createdOrder.createdAt,
                                                    status: createdOrder.status,
                                                    qrToken: createdOrder.qrToken || createdOrder._qrTokenLocal,
                                                })}
                                                size={200}
                                                fgColor="#0f172a"
                                                bgColor="#ffffff"
                                                style={{ display: "block" }}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">
                                        QR Code de suivi généré
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Footer Buttons */}
                        <div className="flex justify-between pt-6">
                            <Button
                                variant="secondary"
                                onClick={handleBack}
                                disabled={loading}
                                icon={<ArrowLeft size={16} />}
                            >
                                {step === 1 ? "Annuler" : "Retour"}
                            </Button>

                            <Button
                                onClick={step === 3 ? handleFinish : handleNext}
                                disabled={loading}
                                icon={step === 3 ? null : <ArrowRight size={16} />}
                                className={step === 3 ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Création...
                                    </div>
                                ) : step === 1 ? (
                                    "Continuer"
                                ) : step === 2 ? (
                                    "Créer la commande"
                                ) : (
                                    "Terminer"
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
