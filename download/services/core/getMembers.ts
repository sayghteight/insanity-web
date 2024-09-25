import { useEffect, useState } from 'react';
import { getUsers } from '@/services/api/api.service';

export function useUsers() {
  const [users, setUsers] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loadingUsers };
}
