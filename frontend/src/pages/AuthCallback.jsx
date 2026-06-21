import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      // Hash se token lo
      const hash = window.location.hash
      console.log('Hash:', hash)

      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        console.log('Access token found:', accessToken)

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        console.log('Set session result:', data, error)

        if (data?.session) {
          navigate('/dashboard', { replace: true })
          return
        }
      }

      // Direct session check
      const { data } = await supabase.auth.getSession()
      console.log('Direct session:', data)

      if (data?.session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }

    checkSession()
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
        Login ho raha hai...
      </p>
    </div>
  )
}

export default AuthCallback