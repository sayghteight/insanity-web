import { DashboardComponent } from '@/components/DashboardComponent';
import { AlertTriangle, Coins, Clock, ArrowUpCircle } from 'lucide-react';
import { useDhracmas } from '@/services/core/getDhracmas';
import { useSession } from 'next-auth/react';
import { useAuctions } from '@/services/core/auctionItems';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

export default function Auction() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const discordId = session?.discordId || null;
    const { dhracmas, loadingDhracmas } = useDhracmas(discordId);
    const { auctions: initialAuctions, auctionLoading, error, refetch } = useAuctions();

    const [auctions, setAuctions] = useState(initialAuctions);
    const [timeLeft, setTimeLeft] = useState(10);

    // Contador regresivo
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTimeLeft => {
                if (prevTimeLeft > 0) {
                    return prevTimeLeft - 1;
                } else {
                    refetch();
                    return 10;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [refetch]);

    useEffect(() => {
        const countdown = () => {
            const now = DateTime.now().setZone('UTC');
            const updatedAuctions = auctions.map(auction => {
                const endDateString = auction.dateEnd; // Asegúrate de que esto sea una cadena
                if (typeof endDateString === 'string') {
                    const endDate = DateTime.fromISO(endDateString).setZone('UTC');
                    const timeRemaining = endDate.diff(now);

                    if (timeRemaining.as('milliseconds') > 0) {
                        const days = Math.floor(timeRemaining.as('days'));
                        const hours = Math.floor(timeRemaining.as('hours')) % 24;
                        const minutes = Math.floor(timeRemaining.as('minutes')) % 60;
                        auction.timeLeft = `${days}d ${hours}h ${minutes}m`;
                    } else {
                        auction.timeLeft = "Cerrada";
                    }
                } else {
                    auction.timeLeft = "Cerrada"; // O maneja el caso donde dateEnd no es un string
                }

                return auction;
            });

            setAuctions(updatedAuctions);
        };
    
        countdown();
        const interval = setInterval(countdown, 1000);
        return () => clearInterval(interval);
    }, [auctions]);

    useEffect(() => {
        setAuctions(initialAuctions);
    }, [initialAuctions]);

    if (status === "loading") {
        return <p>Cargando sesión...</p>;
    }

    if (!session) {
        return <p>Inicia sesión para ver esta página.</p>;
    }

    if (loadingDhracmas) {
        return <p>Cargando Dhracmas...</p>;
    }

    return (
        <DashboardComponent>
            <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6 flex items-center">
                <AlertTriangle className="mr-2" />
                <span>Esta página está en versión beta. Algunas funciones pueden no estar disponibles.</span>
            </div>
            <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">Subastas Activas</h3>
                <p>Tiempo para la siguiente actualización: {timeLeft} segundos</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="p-3 text-left">Ítem</th>
                            <th className="p-3 text-left">Puja Actual</th>
                            <th className="p-3 text-left">Tiempo Restante</th>
                            <th className="p-3 text-left">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700">
                                <td className="p-3">{item.title}</td>
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <Coins className="text-yellow-500 mr-1" size={18} />
                                        <span>{item.currentBid ? item.currentBid : item.startBid}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <Clock className="mr-1" size={18} />
                                        <span>{item.timeLeft}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => router.push(`/dashboard/auctionHistory?title=${encodeURIComponent(item.title)}&id=${item.id}`)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                                    >
                                        <ArrowUpCircle className="mr-2" size={18} />
                                        Ver historial de pujas
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardComponent>
    );
}
