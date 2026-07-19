import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const finishLogin = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!isMounted) return

      if (error) {
        navigate('/login', { replace: true })
        return
      }

      if (data?.session) {
        navigate('/dashboard', { replace: true })
        return
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return
        if (event === 'SIGNED_IN' && session) {
          navigate('/dashboard', { replace: true })
        } else if ((event === 'SIGNED_OUT' || !session) && !data?.session) {
          navigate('/login', { replace: true })
        }
      })

      setTimeout(() => {
        if (!isMounted) return
        supabase.auth.getSession().then(({ data: latestData }) => {
          if (latestData?.session) {
            navigate('/dashboard', { replace: true })
          } else {
            navigate('/login', { replace: true })
          }
        })
      }, 3000)

      return subscription
    }

    const cleanup = finishLogin()

    return () => {
      isMounted = false
      cleanup?.then((subscription) => subscription?.unsubscribe?.())
    }
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-body)',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(56,189,248,0.2)',
        borderTop: '3px solid #38bdf8',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Logging you in...</p>
    </div>
  )
}

export default AuthCallback