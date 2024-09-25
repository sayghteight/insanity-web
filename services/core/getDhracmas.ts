import { useEffect, useState } from 'react';
import { getInsanityCoins } from '@/services/api/api.service';

// Ejemplo de uso de useDhracmas
export const useDhracmas = (discordId: string | null) => {
  const [dhracmas, setDhracmas] = useState<string>('');
  const [loadingDhracmas, setLoadingDhracmas] = useState<boolean>(true);

  useEffect(() => {
    if (discordId) {
      // Lógica para obtener Dhracmas
      setLoadingDhracmas(true);
      // Supongamos que fetchDhracmas es una función que obtiene los Dhracmas
      getInsanityCoins(discordId).then(data => {
        setDhracmas(data);
        setLoadingDhracmas(false);
      });
    } else {
      setLoadingDhracmas(false);
    }
  }, [discordId]);

  return { dhracmas, loadingDhracmas }; // Asegúrate de retornar la propiedad correcta
};



