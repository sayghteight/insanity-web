import { useEffect, useState, useCallback } from 'react';
import { getBid } from '@/services/api/api.service';
import { Auction } from '@/services/types/Auction';

export function useAuctionHistory(bidId: string) {
  const [auctionHistory, setAuctionHistory] = useState<Auction | null>(null); // Cambiado a Auction | null
  const [auctionHistoryLoading, setAuctionHistoryLoading] = useState<boolean>(true);
  const [errorAuction, setErrorAuction] = useState<string | null>(null);

  const fetchAuction = useCallback(() => {
    if (!bidId) {
      setAuctionHistory(null); // Manejar caso en que bidId no es válido
      setAuctionHistoryLoading(false);
      return;
    }

    getBid(bidId) // Cambié auctionId por bidId
      .then(data => {
        setAuctionHistory(data); // `data` debería ser un objeto Auction
        setAuctionHistoryLoading(false);
      })
      .catch(error => {
        console.error('Error fetching auction:', error);
        setErrorAuction('Error fetching auction');
        setAuctionHistoryLoading(false);
      });
  }, [bidId]); // Dependencia del bidId

  useEffect(() => {
    fetchAuction(); // Llamar a la función de carga inicial
  }, [fetchAuction]);

  return { auctionHistory, auctionHistoryLoading, errorAuction };
}
