import { Button } from '@/components/ui/button';
import { signIn } from '@/components/firebaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthProvider';

export function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get the return URL from the location state, default to '/'
  const returnTo = location.state?.from?.pathname || '/';

  // If user is already authenticated, redirect them
  useEffect(() => {
    if (user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  return (
    <div className="max-w-sm py-8 mx-auto">
      <Button onClick={signIn} className="w-full">
        Sign in with Google
      </Button>
    </div>
  );
}
