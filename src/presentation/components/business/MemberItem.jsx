// src/presentation/components/business/MemberItem.jsx
import React from "react";
import { User, Shield, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export const MemberItem = ({ member, onRemove }) => {
    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Administrateur';
            case 'employee': return 'Employé';
            case 'client': return 'Client';
            default: return role;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'employee': return 'bg-blue-100 text-blue-800';
            case 'client': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-medium">
                    {member.displayName ? getInitials(member.displayName) : <User size={20} />}
                </div>
                <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                        {member.displayName || 'Nom non défini'}
                        {member.role === 'admin' && (
                            <Shield className="h-4 w-4 text-purple-500" />
                        )}
                    </div>
                    <div className="text-sm text-gray-500">
                        {member.email}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
          {getRoleLabel(member.role)}
        </span>

                {member.role !== 'admin' && onRemove && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(member.id)}
                        icon={<X size={16} />}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Retirer de l'équipe"
                    />
                )}
            </div>
        </motion.div>
    );
};
