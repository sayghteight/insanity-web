import { useEffect, useState } from 'react';
import { getInsanityCoins } from '@/services/api/api.service';

export function useDhracmas(userId: string) {
  const [dhracmas, setDhracmas] = useState<string>('');
  const [loadingDhracmas, setLoadingDhracmas] = useState<boolean>(true);

  useEffect(() => {
    const fetchDhracmas = async () => {
      setLoadingDhracmas(true);
      try {
        const data = await getInsanityCoins(userId);
        setDhracmas(data);
      } catch (error) {
        console.error('Error fetching dhracmas:', error);
      } finally {
        setLoadingDhracmas(false);
      }
    };

    fetchDhracmas();
  }, [userId]);

  return { dhracmas, loadingDhracmas };
}
