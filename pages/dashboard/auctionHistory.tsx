import { DashboardComponent } from '@/components/DashboardComponent';
import { AlertTriangle, Coins, Clock, ChevronLeft, ArrowUpCircle } from 'lucide-react';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { useRouter } from 'next/router';
import { useDhracmas } from '@/services/core/getDhracmas';
import { useSession } from 'next-auth/react';
import { useMembersCount } from '@/services/core/membersCount';
import { useAuctionHistory } from '@/services/core/useFetchBid';
import { useUpdateBid } from '@/services/core/auctionHistory';

export default function AuctionHistory() {
    const router = useRouter();
    const { title, id } = router.query;

    if (!id) {
        return <p>Error: ID de subasta no proporcionado.</p>;
    }

    const { data: session, status } = useSession();
    const discordId = session?.discordId || null;

    const auctionIdString = Array.isArray(id) ? id[0] : id;

    const { dhracmas, loadingDhracmas: dhracmasLoading } = useDhracmas(discordId);
    const { auctionHistory: initialAuctionHistory, auctionHistoryLoading, errorAuction } = useAuctionHistory(auctionIdString);
    const { handleUpdateBid, isLoading: bidLoading, error: bidError } = useUpdateBid();
    
    const [bidAmount, setBidAmount] = useState(0);

    if (status === "loading") {
        return <p>Cargando sesión...</p>;
    }

    if (!session?.discordId) {
        return <p>Inicia sesión para ver esta página.</p>;
    }

    if (dhracmasLoading) {
        return <p>Cargando Dhracmas...</p>;
    }

    if (auctionHistoryLoading) {
        return <p>Cargando historial de pujas...</p>;
    }

    if (errorAuction) {
        return <p>Error: {errorAuction}</p>;
    }

    const { auctionItem } = initialAuctionHistory || {
        auctionItem: {
            title: "Título no disponible",
            currentBid: 0,
            startBid: 0,
            dateEnd: "N/A",
        },
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const minBid = auctionItem.currentBid === 0 ? auctionItem.startBid + 50 : auctionItem.currentBid + 50;

        // Verifica si la puja está dentro del plazo
        const currentDate = new Date();
        const auctionEndDate = new Date(auctionItem.dateEnd);
        if (currentDate > auctionEndDate) {
            alert("La subasta ha terminado.");
            return;
        }

        if (bidAmount < minBid) {
            alert(`La puja mínima es ${minBid} Dhracmas.`);
            return;
        }

        const dhracmasNumber =  Number(dhracmas);

        if (bidAmount > dhracmasNumber) {
            alert("No tienes suficientes Dhracmas para realizar esta puja.");
            return;
        }

        if (!session.discordId) {
            console.error("User ID is not defined in session.");
            return; // Maneja el error según sea necesario
        }
        
        await handleUpdateBid(auctionIdString, bidAmount, session.discordId); // Asumiendo que `userId` está en `session`
        setBidAmount(0); // Reiniciar el valor del input después de la puja

        // Refrescar la página después de pujar
        router.reload();
    };

    const isAuctionEnded = new Date(auctionItem.dateEnd) < new Date();

    return (
        <DashboardComponent>
            <div className="flex-1 p-8 overflow-auto">
                <header className="mb-8">
                    <button 
                        onClick={() => router.push('/dashboard/auction')} // Redirigir a la página de subastas
                        className="flex items-center text-purple-400 hover:text-purple-300 mb-4"
                    >
                        <ChevronLeft className="mr-1" size={20} />
                        Volver a las subastas
                    </button>
                    <h2 className="text-3xl font-bold">{auctionItem.title}</h2>
                </header>
                <main>
                    <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6 flex items-center">
                        <AlertTriangle className="mr-2" />
                        <span>Esta página está en versión beta. Algunas funciones pueden no estar disponibles.</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <Coins className="text-yellow-500 mr-2" size={24} />
                                        <span className="text-2xl font-bold">{auctionItem.currentBid} Dhracmas</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <Clock className="mr-2" size={20} />
                                        <span>{new Date(auctionItem.dateEnd).toLocaleString()}</span>
                                    </div>
                                </div>
                                {!isAuctionEnded ? (
                                    <form onSubmit={handleSubmit} className="mb-4">
                                        <div className="flex mb-2">
                                            <input
                                                type="number"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(Number(e.target.value))}
                                                placeholder="Cantidad de la puja"
                                                className="flex-grow px-4 py-2 rounded-l bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                            <button
                                                type="submit"
                                                className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r flex items-center justify-center ${bidLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={bidLoading}
                                            >
                                                <ArrowUpCircle className="mr-2" size={18} />
                                                Pujar
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Puja mínima: {auctionItem.currentBid === 0 ? auctionItem.startBid + 50 : auctionItem.currentBid + 50} Dhracmas
                                        </p>
                                        {bidError && <p className="text-red-500">{bidError}</p>}
                                    </form>
                                ) : (
                                    initialAuctionHistory && initialAuctionHistory.bids.length > 0 && (
                                    <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6 flex items-center">
                                        <AlertTriangle className="mr-2" />
                                        La subasta ha terminado. El mayor pujante fue {initialAuctionHistory.bids[initialAuctionHistory.bids.length - 1]?.auctionUser?.username || "N/A"}. 
                                        Por favor, contacta a un oficial para obtener el objeto.
                                    </div>
                                    )
                                )}
                                <div className="space-y-2">
                                    <p><strong>Mayor pujante:</strong></p>
                                    <p><strong>Puja inicial:</strong> {auctionItem.startBid} Dhracmas</p>
                                    <p><strong>Incremento mínimo:</strong> 50 Dhracmas</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">Historial de pujas</h3>
                                <ul className="space-y-2">
                                    {
                                    initialAuctionHistory && initialAuctionHistory.bids.length > 0 && (
                                            initialAuctionHistory.bids.map((bid: { auctionUser: { username: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }; bidAmount: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, index: Key | null | undefined) => (
                                                <li key={index} className="flex justify-between">
                                                    <span>{bid.auctionUser.username}</span>
                                                    <span>{bid.bidAmount} Dhracmas</span>
                                                </li>
                                            )
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardComponent>
    );
}
