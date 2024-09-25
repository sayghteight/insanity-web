import { useState } from 'react';
import { updateBid } from '@/services/api/api.service';
import { Auction } from '@/services/types/Auction';

export function useUpdateBid() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateBid = async (auctionId: string, bidAmount: number, userId: string) => {
    setIsLoading(true);
    try {
      await updateBid(auctionId, bidAmount, userId);
    } catch (error) {
      console.error('Error actualizando la puja:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleUpdateBid, isLoading, error };
}