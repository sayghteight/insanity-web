'use client'

import { useState } from 'react'
import { Home, Gavel, Users, Eye, Calendar, AlertTriangle, Coins, LogOut, Search, Edit, Trash2 } from 'lucide-react'

export function MembersPageComponent() {
  const [activePage, setActivePage] = useState('members')
  const [searchTerm, setSearchTerm] = useState('')

  const pages = {
    home: { title: 'Home', icon: Home },
    auction: { title: 'Auction', icon: Gavel },
    members: { title: 'Members', icon: Users },
    events: { title: 'Events', icon: Calendar },
  }

  const members = [
    { id: 1, name: 'Alice', rank: 'Élite', dhracmas: 5000, joinDate: '2023-01-15' },
    { id: 2, name: 'Bob', rank: 'Veterano', dhracmas: 3500, joinDate: '2023-02-20' },
    { id: 3, name: 'Charlie', rank: 'Novato', dhracmas: 1000, joinDate: '2023-05-10' },
    { id: 4, name: 'Diana', rank: 'Élite', dhracmas: 4800, joinDate: '2023-03-05' },
    { id: 5, name: 'Evan', rank: 'Veterano', dhracmas: 3200, joinDate: '2023-04-18' },
  ]

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.rank.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">IC</span>
          </div>
          <h1 className="ml-4 text-xl font-bold">Insanity Clan</h1>
        </div>
        <nav className="flex-grow">
          {Object.entries(pages).map(([key, { title, icon: Icon }]) => (
            <button
              key={key}
              className={`flex items-center w-full p-2 mb-2 rounded ${
                activePage === key ? 'bg-purple-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActivePage(key)}
            >
              <Icon className="mr-2" />
              {title}
            </button>
          ))}
        </nav>
        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">Usuario123</p>
              <p className="text-sm text-gray-400">Rango: Élite</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <Coins className="text-yellow-500" />
            <span className="text-yellow-500 font-semibold">1,234 Dhracmas</span>
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
            <LogOut className="mr-2" size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">{pages[activePage].title}</h2>
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
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Añadir Miembro
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Rango</th>
                  <th className="p-3 text-left">Dhracmas</th>
                  <th className="p-3 text-left">Fecha de Ingreso</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-700">
                    <td className="p-3">{member.name}</td>
                    <td className="p-3">{member.rank}</td>
                    <td className="p-3">{member.dhracmas}</td>
                    <td className="p-3">{member.joinDate}</td>
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
    </div>
  )
}