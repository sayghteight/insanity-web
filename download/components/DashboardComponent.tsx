import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { DashboardMenu } from './DashboardMenu'; // Importa el menú

export function DashboardComponent({ children }) { // children será el contenido de cada página
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <DashboardMenu session={session} /> {/* Componente del menú separado */}

      {/* Main content */}
      <div className="flex-1 p-8">
      {children}
      </div>
    </div>
  );
}
