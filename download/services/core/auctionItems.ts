import { useEffect, useState, useCallback } from 'react';
import { getAuctions } from '@/services/api/api.service';
import { Auction } from '@/services/types/Auction';

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [auctionLoading, setAuctionLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuctions = useCallback(() => {
    setAuctionLoading(true);
    getAuctions()
      .then(data => {
        setAuctions(data); // `data` es un array de `Auction`
        setAuctionLoading(false);
      })
      .catch(error => {
        console.error('Error fetching auctions:', error);
        setError('Error fetching auctions');
        setAuctionLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAuctions(); // Llamar a la función de carga inicial
  }, [fetchAuctions]);

  return { auctions, auctionLoading, error, refetch: fetchAuctions }; // Retornar refetch
}
