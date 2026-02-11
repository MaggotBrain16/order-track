import React from "react";
import { Users, Search } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { useUser } from "../../../application/hooks/useUser"; // ← Nouveau hook

export const CustomersList = () => {

    const { clients, loading, error, refresh: refreshClients } = useUser({ initialRole: 'client' });

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-semibold text-gray-900">Liste des clients</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshClients}
                        disabled={loading}
                        icon={<Search size={16} />}
                    >
                        Actualiser
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {loading && (
                    <div className="py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Chargement des clients…</p>
                    </div>
                )}

                {error && (
                    <div className="py-8 text-center text-red-600">
                        <p>Impossible de charger les clients</p>
                        <Button variant="secondary" size="sm" onClick={refreshClients} className="mt-2">
                            Réessayer
                        </Button>
                    </div>
                )}

                {!loading && clients.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun client</h3>
                        <p className="mt-1 text-sm text-gray-500">Commencez par ajouter des clients.</p>
                    </div>
                )}

                {clients.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map((client) => (
                                <tr key={client.uid} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-900">{client.displayName || "—"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{client.email || "—"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{client.companyName || client.companyId || "—"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {client.createdAt ? new Date(client.createdAt).toLocaleDateString("fr-FR") : "—"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
