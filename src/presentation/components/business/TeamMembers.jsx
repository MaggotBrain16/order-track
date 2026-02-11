// src/presentation/components/business/TeamMembers.jsx
import React, { useState } from "react";
import { Users, Plus, UserPlus } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { MemberItem } from "./MemberItem";
import { CreateEmployeeForm } from "./CreateEmployeeForm";

export const TeamMembers = ({ members = [], onCreateEmployee, onRemove, loading, error }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-100 rounded"></div>
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
                        Erreur lors du chargement des membres: {error.message}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-medium text-gray-900">Équipe</h2>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        icon={<UserPlus size={16} />}
                    >
                        Ajouter un employé
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {showCreateForm && (
                    <div className="mb-6">
                        <CreateEmployeeForm
                            onCreate={onCreateEmployee}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </div>
                )}

                {members.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun membre</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Commencez par ajouter des employés à votre équipe.
                        </p>
                        <div className="mt-4">
                            <Button
                                onClick={() => setShowCreateForm(true)}
                                icon={<Plus size={16} />}
                            >
                                Ajouter un employé
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {members.map((member) => (
                            <MemberItem
                                key={member.uid}
                                member={member}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
