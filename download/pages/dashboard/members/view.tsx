import { DashboardComponent } from '@/components/DashboardComponent';
import { Home, Gavel, Users, Calendar, AlertTriangle, Coins, LogOut, ChevronLeft, Edit, Star, Trophy, Target, X, Activity, Award, Gift, ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react'
import { useDhracmas } from '@/services/core/getDhracmas';
import { useMembersCount } from '@/services/core/membersCount';
import { useUsers } from '@/services/core/getMembers';

export default function View() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const { users: initialListUsers, loadingUsers } = useUsers();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [contributionData, setContributionData] = useState({
      type: 'Donación',
      description: '',
      value: ''
    })
    
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3
  
    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isModalOpen])
  
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
    }

    const handleContributionSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para procesar la nueva contribución
    console.log('Nueva contribución:', contributionData)
    setIsModalOpen(false)
    setContributionData({ type: 'Donación', description: '', value: '' })
    }

    const handleInputChange = (e) => {
    const { name, value } = e.target
    setContributionData(prevData => ({
        ...prevData,
        [name]: value
    }))
    }

    const getContributionIcon = (type) => {
    switch (type) {
        case 'Evento': return <Calendar className="text-blue-400" />
        case 'Donación': return <Gift className="text-green-400" />
        case 'Misión': return <Target className="text-red-400" />
        case 'Reclutamiento': return <Users className="text-yellow-400" />
        default: return <Activity className="text-purple-400" />
    }
    }

    const closeModal = () => {
    setIsModalOpen(false)
    }

    const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
        closeModal()
    }
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = memberData.contributionHistory.slice(indexOfFirstItem, indexOfLastItem)

    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(memberData.contributionHistory.length / itemsPerPage); i++) {
    pageNumbers.push(i)
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
                        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Histórico de Contribución</h3>
                        <div className="space-y-4">
                        {currentItems.map((contribution, index) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg shadow transition duration-300 hover:shadow-lg hover:bg-gray-600">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-300">{contribution.date}</span>
                                <div className="flex items-center">
                                {getContributionIcon(contribution.type)}
                                <span className="ml-2 text-purple-400">{contribution.type}</span>
                                </div>
                            </div>
                            <p className="mb-2 text-gray-300">{contribution.description}</p>
                            <div className="flex items-center">
                                <Coins className="text-yellow-500 mr-2" size={18} />
                                <span className="font-bold text-yellow-400">{contribution.value} Dhracmas</span>
                            </div>
                            </div>
                        ))}
                        </div>
                        {/* Pagination */}
                        <div className="flex justify-center mt-6">
                        <nav className="inline-flex rounded-md shadow">
                            <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                            >
                            <ChevronLeft size={20} />
                            </button>
                            {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`px-3 py-2 border border-gray-700 bg-gray-800 text-sm font-medium ${
                                currentPage === number
                                    ? 'text-white bg-purple-600'
                                    : 'text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                {number}
                            </button>
                            ))}
                            <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageNumbers.length))}
                            disabled={currentPage === pageNumbers.length}
                            className="px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                            >
                            <ChevronRight size={20} />
                            </button>
                        </nav>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
        </div>
        
      {/* Modal for new contribution */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Nueva Contribución</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition duration-300"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleContributionSubmit}>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">Tipo de Contribución</label>
                <select
                  id="type"
                  name="type"
                  value={contributionData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
                >
                  <option value="Donación">Donación</option>
                  <option value="Evento">Evento</option>
                  <option value="Misión">Misión</option>
                  <option value="Reclutamiento">Reclutamiento</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={contributionData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-6">
                <label htmlFor="value" className="block text-sm font-medium text-gray-400 mb-1">Valor (Dhracmas)</label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={contributionData.value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 hover:from-purple-600 hover:to-purple-800">
                Registrar Contribución
              </button>
            </form>
          </div>
        </div>
        )}
        </DashboardComponent>
    );
}