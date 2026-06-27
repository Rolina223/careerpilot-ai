import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // PKCE flow: exchange the code in the URL for a real session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        )

        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login', { replace: true })
          return
        }

        if (data?.session) {
          navigate('/dashboard', { replace: true })
          return
        }

        // Fallback: check if session already exists
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData?.session) {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/login', { replace: true })
        }
      } catch (err) {
        console.error('Unexpected auth error:', err)
        navigate('/login', { replace: true })
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
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
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: '#64748b', fontSize: '14px' }}>
        Logging you in...
      </p>
    </div>
  )
}

export default AuthCallback