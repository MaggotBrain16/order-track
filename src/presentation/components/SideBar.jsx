// src/presentation/components/SideBar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { TbLogout2, TbShoppingCartCog } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";


import { motion } from "framer-motion";
import { useAuth } from "../../application/hooks/useAuth";
import {FaBuildingUser} from "react-icons/fa6";

export const SideBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    const menuItems = [
        {
            to: "/",
            icon: <RxDashboard className="text-xl" />,
            label: "Dashboard",
            exact: true
        },
        {
            to: "/orders",
            icon: <TbShoppingCartCog className="text-xl" />,
            label: "Commandes"
        },
        {
            to: "/customers",
            icon: <FaUserPlus className="text-xl" />,
            label: "Clients"
        },
        {
            to: "/company",
            icon: <FaBuildingUser className="text-xl" />,
            label: "Entreprise"
        }
    ];

    return (
        <motion.nav
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex flex-col w-64 bg-gray-900 text-white min-h-screen"
        >
            {/* Logo */}
            <div className="px-6 py-6">
                <div className="flex items-center justify-center">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-30 w-auto"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <div
                        className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ display: 'none' }}
                    >
                        SG
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-gray-800">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
                >
                    <TbLogout2 className="text-xl" />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </motion.nav>
    );
};
