import { DashboardComponent } from '@/components/DashboardComponent';
import { Home, Gavel, Users, Calendar, AlertTriangle, Coins, LogOut, ChevronLeft, Edit, Star, Trophy, Target, X, Activity, Award, Gift, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useDhracmas } from '@/services/core/getDhracmas';
import { useMembersCount } from '@/services/core/membersCount';
import { useUsers } from '@/services/core/getMembers';

// Define the types for contribution
type ContributionType = 'Donación' | 'Evento' | 'Misión' | 'Reclutamiento';

interface ContributionData {
    type: ContributionType;
    description: string;
    value: string;
}

export default function View() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const { users: initialListUsers, loadingUsers } = useUsers();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contributionData, setContributionData] = useState<ContributionData>({
        type: 'Donación', // Initial value is valid
        description: '',
        value: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

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

    const memberData = {
        name: 'Alice',
        rank: 'Élite',
        dhracmas: 5000,
        joinDate: '2023-01-15',
        avatar: '/placeholder.svg?height=200&width=200',
        level: 42,
        clan: 'Insanity Clan',
        contributionHistory: [
            { date: '2023-06-15', type: 'Evento', description: 'Organizó el torneo mensual', value: 500 },
            { date: '2023-05-20', type: 'Donación', description: 'Donó recursos al clan', value: 1000 },
            { date: '2023-04-10', type: 'Misión', description: 'Completó la misión "Rescate heroico"', value: 300 },
            { date: '2023-03-05', type: 'Reclutamiento', description: 'Reclutó 3 nuevos miembros', value: 450 },
            { date: '2023-02-18', type: 'Evento', description: 'Participó en el evento de la alianza', value: 200 },
            { date: '2023-01-25', type: 'Donación', description: 'Contribuyó con materiales raros', value: 750 },
            { date: '2022-12-30', type: 'Misión', description: 'Lideró una misión de alto riesgo', value: 600 },
            { date: '2022-11-15', type: 'Evento', description: 'Ganó el torneo de PvP', value: 1000 },
            { date: '2022-10-05', type: 'Reclutamiento', description: 'Trajo 5 nuevos miembros al clan', value: 500 },
            { date: '2022-09-20', type: 'Donación', description: 'Donó equipo legendario', value: 2000 },
            { date: '2022-08-10', type: 'Misión', description: 'Completó todas las misiones semanales', value: 400 },
            { date: '2022-07-01', type: 'Evento', description: 'Organizó la fiesta de aniversario del clan', value: 800 },
        ]
    };

    const handleContributionSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Aquí iría la lógica para procesar la nueva contribución
        console.log('Nueva contribución:', contributionData);
        setIsModalOpen(false);
        setContributionData({ type: 'Donación', description: '', value: '' });
    };

    const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setContributionData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const getContributionIcon = (type: string): JSX.Element => {
        switch (type) {
            case 'Evento':
                return <Calendar className="text-blue-400" />;
            case 'Donación':
                return <Gift className="text-green-400" />;
            case 'Misión':
                return <Target className="text-red-400" />;
            case 'Reclutamiento':
                return <Users className="text-yellow-400" />;
            default:
                return <Activity className="text-purple-400" />;
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEscapeKey = (e: { key: string; }) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = memberData.contributionHistory.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(memberData.contributionHistory.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <DashboardComponent>
            <div className="flex-1 p-8 overflow-auto bg-gradient-to-br from-gray-900 to-gray-800">
                <header className="mb-8">
                    <button className="flex items-center text-purple-400 hover:text-purple-300 mb-4 transition duration-300">
                        <ChevronLeft className="mr-1" size={20} />
                        Volver a la lista de miembros
                    </button>
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Perfil de Miembro</h2>
                        <div className="space-x-4">
                            <button
                                className="bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-300 hover:from-green-600 hover:to-green-800"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Coins className="mr-2" size={18} />
                                Nueva Contribución
                            </button>
                        </div>
                    </div>
                </header>
                <main>
                    <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6 flex items-center shadow-lg">
                        <AlertTriangle className="mr-2" />
                        <span>Esta página está en versión beta. Algunas funciones pueden no estar disponibles.</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-80">
                                <img src={memberData.avatar} alt={memberData.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-500" />
                                <h3 className="text-2xl font-bold text-center mb-2">{memberData.name}</h3>
                                <p className="text-purple-400 text-center mb-4">{memberData.rank}</p>
                                <div className="flex justify-center items-center mb-4">
                                    <Star className="text-yellow-500 mr-1" size={18} />
                                    <span className="font-semibold">Nivel {memberData.level}</span>
                                </div>
                                <div className="space-y-2 text-gray-300">
                                    <p><strong className="text-white">Clan:</strong> {memberData.clan}</p>
                                    <p><strong className="text-white">Fecha de Ingreso:</strong> {memberData.joinDate}</p>
                                    <p><strong className="text-white">Dhracmas:</strong> {memberData.dhracmas}</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-80">
                                <h3 className="text-2xl font-bold mb-4">Historial de Contribuciones</h3>
                                {currentItems.length === 0 ? (
                                    <p className="text-gray-400">No hay contribuciones registradas.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {currentItems.map((contribution, index) => (
                                            <li key={index} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-sm">
                                                <div className="flex items-center">
                                                    {getContributionIcon(contribution.type)}
                                                    <div className="ml-3">
                                                        <p className="font-semibold">{contribution.type}</p>
                                                        <p className="text-gray-400">{contribution.description}</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold">{contribution.value} Dhracmas</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="mt-4 flex justify-center">
                                    {pageNumbers.map(number => (
                                        <button
                                            key={number}
                                            onClick={() => setCurrentPage(number)}
                                            className={`mx-1 px-3 py-1 rounded-full ${currentPage === number ? 'bg-purple-600' : 'bg-purple-500 hover:bg-purple-400'} text-white`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-lg font-bold mb-4">Registrar Contribución</h2>
                            <form onSubmit={handleContributionSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2">Tipo de Contribución:</label>
                                    <select
                                        name="type"
                                        value={contributionData.type}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                    >
                                        <option value="Donación">Donación</option>
                                        <option value="Evento">Evento</option>
                                        <option value="Misión">Misión</option>
                                        <option value="Reclutamiento">Reclutamiento</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2">Descripción:</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={contributionData.description}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2">Valor:</label>
                                    <input
                                        type="number"
                                        name="value"
                                        value={contributionData.value}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
                                        onClick={closeModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                                    >
                                        Registrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardComponent>
    );
}
