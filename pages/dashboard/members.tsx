import { DashboardComponent } from '@/components/DashboardComponent';
import { Home, Gavel, Eye, Users, Calendar, AlertTriangle, Coins, LogOut, Search, Edit, Trash2 } from 'lucide-react'
import { useDhracmas } from '@/services/core/getDhracmas';
import { useSession } from 'next-auth/react';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react'
import { useMembersCount } from '@/services/core/membersCount';
import { useUsers } from '@/services/core/getMembers';

export default function Member() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const { users: initialListUsers, loadingUsers } = useUsers();

    // Si la sesión está cargando, mostrar un mensaje
    if (status === "loading") {
        return <p>Cargando sesión...</p>;
    }

    // Si no hay sesión, redirigir al usuario o mostrar un mensaje de error
    if (!session) {
        return <p>Inicia sesión para ver esta página.</p>;
    }

    // Mostrar un mensaje de carga mientras se cargan los usuarios
    if (loadingUsers) {
        return <p>Cargando miembros...</p>;
    }

    // Filtrar los miembros según el término de búsqueda
    const filteredMembers = Array.isArray(initialListUsers) ? 
        initialListUsers.filter((member: { username: string; roles: string; }) =>
            member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.roles.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];
    
    return (
        <DashboardComponent>
        <div className="flex-1 p-8 overflow-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold">Miembros</h2>
            </header>
            <main>
                <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6 flex items-center">
                    <AlertTriangle className="mr-2" />
                    <span>Esta página está en versión beta. Algunas funciones pueden no estar disponibles.</span>
                </div>
                <div className="mb-6 flex justify-between items-center">
                    <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar miembros..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full bg-gray-800 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-700">
                        <th className="p-3 text-left">Nombre</th>
                        <th className="p-3 text-left">Rango</th>
                        <th className="p-3 text-left">Dhracmas</th>
                        <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member: { id: Key | null | undefined; username: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; roles: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; dhracmas: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                        <tr key={member.id} className="border-b border-gray-700">
                            <td className="p-3">{member.username}</td>
                            <td className="p-3">{member.roles}</td>
                            <td className="p-3">{member.dhracmas}</td>
                            <td className="p-3">
                            <button className="text-gray-400 hover:text-gray-300 mr-2">
                                <Eye size={18} />
                            </button>
                            <button className="text-blue-400 hover:text-blue-300 mr-2">
                                <Edit size={18} />
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                                <Trash2 size={18} />
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </main>
        </div>
        </DashboardComponent>
    );
}