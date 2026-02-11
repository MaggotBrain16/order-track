// src/presentation/pages/business/BusinessManagementPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building, Users, RefreshCw } from "lucide-react";
import { CompanyInfo } from "../../components/business/CompanyInfo";
import { TeamMembers } from "../../components/business/TeamMembers";
import { useAuth } from "../../context/AuthContext";
import { CompanyService } from "../../../application/services/CompanyService";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export const BusinessManagementPage = () => {
    const { userProfile } = useAuth();
    const companyId = userProfile?.companyId;

    const [company, setCompany] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState({
        company: true,
        members: true
    });
    const [errors, setErrors] = useState({});

    const companyService = new CompanyService();

    // Charger les données de l'entreprise
    useEffect(() => {
        const loadCompanyData = async () => {
            if (!companyId) return;

            try {
                setLoading(prev => ({ ...prev, company: true }));
                const companyData = await companyService.getCompanyInfo(companyId);
                setCompany(companyData);
            } catch (error) {
                console.error("Erreur chargement entreprise:", error);
                setErrors(prev => ({ ...prev, company: error }));
            } finally {
                setLoading(prev => ({ ...prev, company: false }));
            }
        };

        loadCompanyData();
    }, [companyId]);

    // Charger les membres de l'équipe
    useEffect(() => {
        const loadTeamMembers = async () => {
            if (!companyId) return;

            try {
                setLoading(prev => ({ ...prev, members: true }));
                const teamMembers = await companyService.getTeamMembers(companyId);
                setMembers(teamMembers);
            } catch (error) {
                console.error("Erreur chargement membres:", error);
                setErrors(prev => ({ ...prev, members: error }));
            } finally {
                setLoading(prev => ({ ...prev, members: false }));
            }
        };

        loadTeamMembers();
    }, [companyId]);

    // Mettre à jour les informations de l'entreprise
    const handleUpdateCompany = async (updateData) => {
        try {
            const updatedCompany = await companyService.updateCompanyInfo(companyId, updateData);
            setCompany(updatedCompany);
        } catch (error) {
            throw error;
        }
    };

    // Créer un nouvel employé
    const handleCreateEmployee = async (employeeData) => {
        try {
            const companyName = company?.name || "Votre entreprise";
            const result = await companyService.createEmployee(companyId, employeeData, companyName);

            // Recharger les membres
            const teamMembers = await companyService.getTeamMembers(companyId);
            setMembers(teamMembers);

            return result;
        } catch (error) {
            throw error;
        }
    };

    // Retirer un membre (TODO: implémenter)
    const handleRemoveMember = async (memberId) => {
        if (window.confirm("Êtes-vous sûr de vouloir retirer ce membre ?")) {
            try {
                await companyService.removeTeamMember(memberId);
                // Recharger les membres
                const teamMembers = await companyService.getTeamMembers(companyId);
                setMembers(teamMembers);
            } catch (error) {
                console.error("Erreur lors du retrait du membre:", error);
            }
        }
    };

    const handleRefresh = async () => {
        if (!companyId) return;

        try {
            setLoading({ company: true, members: true });

            const [companyData, teamMembers] = await Promise.all([
                companyService.getCompanyInfo(companyId),
                companyService.getTeamMembers(companyId)
            ]);

            setCompany(companyData);
            setMembers(teamMembers);
        } catch (error) {
            console.error("Erreur lors de l'actualisation:", error);
        } finally {
            setLoading({ company: false, members: false });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* En-tête */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-6"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Building className="h-6 w-6" />
                            Gestion de l'entreprise
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Gérez les informations de votre entreprise et votre équipe
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleRefresh}
                        icon={<RefreshCw className="h-4 w-4" />}
                        title="Actualiser"
                    />
                </div>
            </motion.div>

            {/* Informations de l'entreprise */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <CompanyInfo
                    company={company}
                    onUpdate={handleUpdateCompany}
                    loading={loading.company}
                    error={errors.company}
                />
            </motion.div>

            {/* Équipe */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <TeamMembers
                    members={members}
                    onCreateEmployee={handleCreateEmployee}
                    onRemove={handleRemoveMember}
                    loading={loading.members}
                    error={errors.members}
                />
            </motion.div>
        </motion.div>
    );
};
