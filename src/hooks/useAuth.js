import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getAuthToken } from '@/lib/cookieUtils';

export function useAuth(required = true) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get token from cookies
    const authToken = getAuthToken();
    setToken(authToken);

    const checkAuth = async () => {
      if (!authToken) {
        if (required) {
          toast.error('Please log in to continue');
          router.push('/login');
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            if (required) {
              toast.error('Your session has expired. Please log in again.');
              router.push('/login');
            }
            setSession(null);
          } else {
            throw new Error('Failed to fetch user session');
          }
        } else {
          const userData = await response.json();
          setSession({ ...userData, token: authToken });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (required) {
          toast.error('Authentication error. Please log in again.');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [required, router]);

  return { session, loading, token };
}
