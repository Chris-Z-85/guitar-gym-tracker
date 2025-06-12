import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/components/supabaseClient'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthProvider'

export function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Get the return URL from the location state, default to '/'
  const returnTo = location.state?.from?.pathname || '/'

  // If user is already authenticated, redirect them
  useEffect(() => {
    if (user) {
      navigate(returnTo, { replace: true })
    }
  }, [user, navigate, returnTo])

  return (
    <div className="max-w-sm py-8 mx-auto">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'var(--primary)',
                brandAccent: 'var(--primary-foreground)',
              },
            },
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
} 