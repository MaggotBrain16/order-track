import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, UserPlus, X, Users, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderMiniStepItem } from "./OrderMiniStepItem";
import { Button } from "../../ui/Button";
import { Input, Select } from "../../ui/Input";
import { useUser } from "../../../../application/hooks/useUser"; // ← Nouveau hook unifié

export const OrderProcessStepCard = ({
                                         step,
                                         labels,
                                         onUpdateStep,
                                         onAddMiniStep,
                                         onUpdateMiniStep,
                                         onDeleteMiniStep,
                                         onDeleteStep,
                                         companyId,
                                         currentUser
                                     }) => {
    const [newMiniStepTitle, setNewMiniStepTitle] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);

    // Nouveau hook : récupère uniquement les employés
    const { employees } = useUser({ initialRole: 'employee' });

    const label = labels.find(l => l.id === step.labelId) || { name: "Étape", color: "#3b82f6" };

    // Toutes les fonctions helpers définies AVANT le return
    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed': return 'Terminé';
            case 'in_progress': return 'En cours';
            default: return 'En attente';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getEmployeeInitials = (employeeId) => {
        const employee = employees.find(emp => emp.uid === employeeId);
        if (!employee) return "?";
        const name = employee.displayName || employee.email || "";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(emp => emp.uid === employeeId);
        return employee ? (employee.displayName || employee.email) : `Employé ${employeeId.substring(0, 8)}`;
    };

    // Handlers
    const handleAddMiniStep = () => {
        if (newMiniStepTitle.trim()) {
            onAddMiniStep(step.id, { title: newMiniStepTitle }, currentUser?.uid);
            setNewMiniStepTitle("");
        }
    };

    const handleAssignEmployee = async () => {
        if (!selectedEmployee) return;
        await onUpdateStep(step.id, {
            ...step,
            attributedTo: [...(step.attributedTo || []), selectedEmployee],
            updatedAt: new Date()
        });
        setSelectedEmployee("");
    };

    const handleRemoveEmployee = async (employeeId) => {
        const newAttributedTo = (step.attributedTo || []).filter(id => id !== employeeId);
        await onUpdateStep(step.id, {
            ...step,
            attributedTo: newAttributedTo,
            updatedAt: new Date()
        });
    };

    // Calcul du pourcentage
    const completionPercentage = step.miniSteps && step.miniSteps.length > 0
        ? Math.round((step.miniSteps.filter(ms => ms.completed).length / step.miniSteps.length) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
        >
            <div
                className="px-5 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
                style={{ backgroundColor: `${label.color}10` }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4 flex-1">
                    <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: label.color }}
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{label.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                                {getStatusLabel(step.status)}
                            </span>

                            {completionPercentage > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                                            style={{ width: `${completionPercentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">
                                        {completionPercentage}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Select
                        value={step.status}
                        onChange={(e) => {
                            onUpdateStep(step.id, {
                                ...step,
                                status: e.target.value,
                                updatedAt: new Date()
                            });
                        }}
                        className="text-sm bg-white border-gray-300"
                    >
                        <option value="pending">En attente</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminé</option>
                    </Select>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteStep(step.id);
                        }}
                        icon={<X size={18} />}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Supprimer cette étape"
                    />

                    {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 space-y-6">
                            {/* Attribution */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="h-5 w-5 text-gray-600" />
                                    <h4 className="text-sm font-semibold text-gray-900">Attribution</h4>
                                </div>

                                <div className="flex gap-3 mb-3">
                                    <Select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="flex-1 text-sm h-10"
                                    >
                                        <option value="">Sélectionner un employé</option>
                                        {employees
                                            .filter(emp => !(step.attributedTo || []).includes(emp.uid))
                                            .map((employee) => (
                                                <option key={employee.uid} value={employee.uid}>
                                                    {employee.displayName || employee.email}
                                                </option>
                                            ))}
                                    </Select>
                                    <Button
                                        onClick={handleAssignEmployee}
                                        size="sm"
                                        icon={<UserPlus size={16}/>}
                                        className="bg-green-600 hover:bg-green-700 h-10"
                                    />
                                </div>

                                {step.attributedTo && step.attributedTo.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {step.attributedTo.map((employeeId) => (
                                            <div
                                                key={employeeId}
                                                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                                            >
                                                <span className="flex items-center gap-1">
                                                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-medium">
                                                        {getEmployeeInitials(employeeId)}
                                                    </div>
                                                    {getEmployeeName(employeeId)}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveEmployee(employeeId)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mini-étapes */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                    <h4 className="text-sm font-semibold text-gray-900">Mini-étapes</h4>
                                    {step.miniSteps && step.miniSteps.length > 0 && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                            {step.miniSteps.filter(ms => ms.completed).length}/{step.miniSteps.length}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {step.miniSteps && step.miniSteps.map((miniStep) => (
                                        <OrderMiniStepItem
                                            key={miniStep.id}
                                            miniStep={miniStep}
                                            onUpdate={(id, data) => onUpdateMiniStep(step.id, id, data)}
                                            onDelete={(id) => onDeleteMiniStep(step.id, id)}
                                            onPhotoUpload={() => {}}
                                            employees={employees}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Ajouter une mini-étape */}
                            <div className="flex gap-3 pt-2 border-t border-gray-100">
                                <Input
                                    type="text"
                                    value={newMiniStepTitle}
                                    onChange={(e) => setNewMiniStepTitle(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddMiniStep()}
                                    placeholder="Ajouter une mini-étape..."
                                    className="flex-1 text-base h-11 px-4"
                                />
                                <Button
                                    onClick={handleAddMiniStep}
                                    size="sm"
                                    icon={<Plus size={18}/>}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
