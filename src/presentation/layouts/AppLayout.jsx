// src/presentation/layouts/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { SideBar } from "../components/SideBar";
import { useAuth } from "../context/AuthContext";

export const AppLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Accès non autorisé</h2>
                    <p className="mt-2 text-gray-600">Veuillez vous connecter pour accéder à cette page.</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex bg-gray-50"
        >
            <SideBar />

            <main className="flex-1 p-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </motion.div>
    );
};
