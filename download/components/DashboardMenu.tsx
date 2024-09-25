'use client'

import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { checkUserRole } from '@/services/utils/roleChecker';
import { useDhracmas } from '@/services/core/getDhracmas';
import { Home, Gavel, Users, Calendar, AlertTriangle, Coins, LogOut } from 'lucide-react'

export function DashboardMenu({ session }) {
  const router = useRouter();

  const roleCheck = checkUserRole(session.roles);

  const pages = {
    home: { title: 'Home', icon: Home, route: '/dashboard/home' },
    auction: { title: 'Auction', icon: Gavel, route: '/dashboard/auction' },
    members: { title: 'Members', icon: Users, route: '/dashboard/members' },
    events: { title: 'Events', icon: Calendar, route: '/dashboard/events' },
  };

  const discordId = session.discordId;

  if (!discordId) {
    return <p>No se pudo obtener el Discord ID.</p>;
  }

  const dhracmas = useDhracmas(discordId);

  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col">
      {/* Logo y nombre */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
          <img src="/insanity.webp" className="w-12 h-12 rounded-full" />
        </div>
        <h1 className="ml-4 text-xl font-bold">Insanity Clan</h1>
      </div>

      {/* Navegación */}
      <nav className="flex-grow">
        {Object.entries(pages).map(([key, { title, icon: Icon, route }]) => (
          <button
            key={key}
            className="flex items-center w-full p-2 mb-2 rounded hover:bg-gray-700"
            onClick={() => router.push(route)}
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
              src={`${session.user?.image}?height=40&width=40`}
              alt={`${session.user?.name} avatar`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">{session.user?.name}</p>
              <p className="text-sm text-gray-400">{roleCheck.roleName}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <Coins className="text-yellow-500" />
            <span className="text-yellow-500 font-semibold">{dhracmas.dhracmas} Dhracmas</span>
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center" onClick={() => signOut()}>
            <LogOut className="mr-2" size={18} />
            Cerrar Sesión
          </button>
        </div>
    </div>
  );
}
