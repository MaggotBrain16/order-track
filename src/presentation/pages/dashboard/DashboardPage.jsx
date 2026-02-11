// src/presentation/pages/dashboard/DashboardPage.jsx
import React from "react";
import { motion } from "framer-motion";
// Ajoute CheckCircle à l'import en haut du fichier
import {
    User,
    ShoppingCart,
    Calendar,
    TrendingUp,
    Building,
    Users,
    Camera,
    CheckCircle
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export const DashboardPage = () => {
    const { user, userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        );
    }

    const stats = [
        {
            title: "Commandes actives",
            value: "12",
            change: "+2",
            icon: <ShoppingCart className="h-6 w-6" />,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Commandes terminées",
            value: "34",
            change: "+5",
            icon: <CheckCircle className="h-6 w-6" />,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Photos ajoutées",
            value: "87",
            change: "+12",
            icon: <Camera className="h-6 w-6" />,
            color: "bg-purple-100 text-purple-600"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Welcome Banner */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Bonjour, {userProfile?.displayName || user?.email} 👋</h1>
                        <p className="mt-1 text-blue-100">Voici un aperçu de vos activités récentes</p>
                    </div>
                    <div className="hidden md:block">
                        <Building className="h-12 w-12 text-blue-300" />
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                    >
                        <Card>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">{stat.title}</p>
                                        <div className="flex items-baseline mt-2">
                                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                            <span className="ml-2 text-sm text-green-600">{stat.change}</span>
                                        </div>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-full`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* User Info Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informations du profil
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nom</p>
                                <p className="text-base">{userProfile?.displayName || "—"}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-base">{user?.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Rôle</p>
                                <p className="text-base">{userProfile?.role || "client"}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Entreprise</p>
                                <p className="text-base">{userProfile?.companyName || userProfile?.companyId || "—"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="text-sm">Nouvelle commande</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                                <Users className="h-5 w-5" />
                                <span className="text-sm">Ajouter client</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span className="text-sm">Planning</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                <span className="text-sm">Statistiques</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Commande #ORD-2026-001 créée</p>
                                    <p className="text-sm text-gray-600">Il y a 2 heures</p>
                                </div>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Nouveau
                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Client John Doe ajouté</p>
                                    <p className="text-sm text-gray-600">Il y a 1 jour</p>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Client
                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Photo ajoutée à la commande #ORD-2026-001</p>
                                    <p className="text-sm text-gray-600">Il y a 3 jours</p>
                                </div>
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Photo
                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};
