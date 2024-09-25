'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useInsanityCoins } from '@/services/core/insanityCoins';
import { useMembersCount } from '@/services/core/membersCount';
import { useAuctions } from '@/services/core/auctionItems';
import { useUpdateBid } from '@/services/core/auctionHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Calendar, Users, Coins, LogOut, Menu, Moon, Sun, User } from "lucide-react"
import { checkUserRole } from '@/services/utils/roleChecker';

export function DashboardComponent() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState('inicio');
  const [userId, setUserId] = useState<string | null>(null);

  const [isAuctionModalOpen, setisAuctionModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedItemTitle, setSelectedItemTitle] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [auctionHistory, setAuctionHistory] = useState([]); // Nuevo estado para el historial de subastas
  
  const [isDarkMode, setIsDarkMode] = useState(false)

  const { auctions, auctionLoading, error } = useAuctions();
  const { handleUpdateBid, isLoading, error: bidError } = useUpdateBid();

  const { countMembers, loadingMembers } = useMembersCount();

  const handleBidNowClick = (id: string, title: string) => {
    setSelectedItemId(id);
    setSelectedItemTitle(title);
    setisAuctionModalOpen(true);
  };


  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Redirect to the homepage after logging out
  };

  const closeModal = () => {
    setBidAmount(0);
    setisAuctionModalOpen(false);
  };

  const closeTableModal = () => {
    setIsTableModalOpen(false);
  };

  const submitBid = async () => {
    if (selectedItemId !== null) {
      try {
        await handleUpdateBid(selectedItemId, bidAmount, userId);
        closeModal();
      } catch {
        // TODO:
      }
    }
  };
  
  const fetchAuctionHistory = async (itemId: string) => {
    setAuctionHistory([
      { id: '1', amount: 100, date: '2024-09-15T12:00:00Z' },
      { id: '2', amount: 150, date: '2024-09-16T15:00:00Z' }
    ]);
  };

  const openAuctionHistory = async (itemTitle: string) => {
    setSelectedItemTitle(itemTitle);
    await fetchAuctionHistory(itemTitle); // Carga el historial de subastas
    setIsTableModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50">
      <div className="container mx-auto p-6">
        <header className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white mr-6">Insanity HUB</h1>
            <nav className="hidden md:flex space-x-4">
              {['Inicio', 'Subasta', 'Miembros', 'Eventos'].map((item, index) => (
                <Button
                  key={item}
                  variant="ghost"
                  className={`text-white hover:bg-white/20 ${activeSection === item.toLowerCase() ? 'bg-white/10' : ''}`}
                  onClick={() => setActiveSection(item.toLowerCase())}
                >
                  {item}
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="user" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image} />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{roleCheck.roleName}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Coins className="mr-2 h-4 w-4 text-yellow-500" />
                  <span> Dhracmas</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {activeSection === 'inicio' && (
            <>
              <Card className="col-span-full pt-5">
                <CardHeader>
                  <CardTitle>Bienvenido a Insanity HUB</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Esto es el área principal de nuestros miembros...</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tus Insanity Coins</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Miembros activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{countMembers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eventos Activos (En la semana)</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'subasta' && (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Casa de Subastas</CardTitle>
                <CardDescription>Aquí encontrarás los diferentes objetos...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auctionLoading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div>{error}</div>
                  ) : auctions.length > 0 ? (
                    auctions.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.title}</span>
                        <div>
                          <Button onClick={() => handleBidNowClick(item.id, item.title)} className="mr-2">Pujar</Button>
                          <Button onClick={() => openAuctionHistory(item.title)}>Historial</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No auctions available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modal de puja */}
          {isAuctionModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Pujar en {selectedItemTitle}</h2>
                <input
                  type="number"
                  className="border text-black border-gray-300 p-2 rounded-md w-full mb-4"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                />
                <div className="flex justify-end space-x-4">
                  <Button onClick={submitBid} disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar puja'}
                  </Button>
                  <Button onClick={closeModal} variant="secondary">
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de historial de subastas */}
          {isTableModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Historial de subastas para {selectedItemTitle}</h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Cantidad</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auctionHistory.map((history) => (
                      <tr key={history.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{history.id}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{history.amount}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{new Date(history.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4">
                  <Button onClick={closeTableModal} variant="secondary">Cerrar</Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
