import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Give Supabase a moment to process the URL and restore session
        await new Promise(resolve => setTimeout(resolve, 500))

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Session error:', error)
          navigate('/login', { replace: true })
          return
        }

        if (data?.session) {
          navigate('/dashboard', { replace: true })
          return
        }

        // Try exchanging the code if session not yet available
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          const { data: exchangeData, error: exchangeError } = 
            await supabase.auth.exchangeCodeForSession(window.location.href)
          
          if (exchangeData?.session) {
            navigate('/dashboard', { replace: true })
            return
          }
          console.error('Exchange error:', exchangeError)
        }

        navigate('/login', { replace: true })
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