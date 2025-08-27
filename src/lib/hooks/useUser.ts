import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { observeAuth } from '@/components/firebaseClient';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = observeAuth(u => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}
