import { useEffect, useState } from 'react';
import { getClanData } from '@/services/api/api.service';

export function useMembersCount() {
  const [countMembers, setMembers] = useState<number | null>(null);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);

  useEffect(() => {
    getClanData()
      .then(data => {
        setMembers(data.membersCount); // Acceder a membersCount
        setLoadingMembers(false);
      })
      .catch(error => {
        console.error('Error fetching members count:', error);
        setLoadingMembers(false);
      });
  }, []);

  return { countMembers, loadingMembers };
}