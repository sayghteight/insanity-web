import { DashboardComponent } from '@/components/DashboardComponent';
import { LucideProps, AlertTriangle, Coins, Users, Calendar } from 'lucide-react';
import { useDhracmas } from '@/services/core/getDhracmas';
import { useSession } from 'next-auth/react';
import { useMembersCount } from '@/services/core/membersCount';

export default function HomePage() {
    const { data: session, status } = useSession();
    const discordId = session?.discordId || null;  // Siempre definir discordId

    const { dhracmas, loadingDhracmas: dhracmasLoading } = useDhracmas(discordId);  // Verificar el estado de carga
    const { countMembers } = useMembersCount();

    // Si la sesión está cargando, mostrar un mensaje
    if (status === "loading") {
        return <p>Cargando sesión...</p>;
    }

    // Si no hay sesión, redirigir al usuario o mostrar un mensaje de error
    if (!session) {
        return <p>Inicia sesión para ver esta página.</p>;
    }
    
    // Mostrar un mensaje de carga mientras se cargan los dhracmas
    if (dhracmasLoading) {
        return <p>Cargando Dhracmas...</p>;
    }

    return (
        <DashboardComponent>
            <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6 flex items-center">
                <AlertTriangle className="mr-2" />
                <span>
                    Este sitio web se encuentra en fase beta. Estamos trabajando activamente 
                    para mejorar la experiencia de usuario. Algunas funciones aún están en 
                    desarrollo y podrían no estar disponibles o no funcionar como se espera
                    en este momento.
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Validamos que dhracmas exista antes de mostrarlo */}
                <Card title="Tus Dhracmas" icon={Coins} value={dhracmas ? dhracmas : 'N/A'} />
                <Card title="Miembros totales" icon={Users} value={countMembers ?? 0} />
                <Card title="Eventos" icon={Calendar} value="0" />
            </div>
        </DashboardComponent>
    );
}


function Card({ title, icon: Icon, value }: { title: string; icon: React.ComponentType<LucideProps>; value: string | number; }) {
    return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Icon className="text-purple-500" size={24} />
      </div>
      <p className="text-3xl font-bold text-purple-400">{value}</p>
    </div>
  );
}
