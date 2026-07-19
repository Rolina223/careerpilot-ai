import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Login() {
  const [step, setStep] = useState('choose') // choose | email | otp
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session) {
        navigate('/dashboard')
      }
    }

    loadSession()
  }, [navigate])

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Valid email daalo')
      return
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Sahi email format daalo (example@domain.com)')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
        },
      })

      setLoading(false)

      if (otpError) {
        // Proper error message display
        if (otpError.message?.includes('rate limit') || otpError.status === 429) {
          setError('Bahut zyada requests! Thodi der baad try karo.')
        } else if (otpError.message?.includes('invalid')) {
          setError('Yeh email valid nahi hai.')
        } else {
          setError(otpError.message || 'Kuch gadbad hui. Dobara try karo.')
        }
        return
      }

      setStep('otp')
      setMessage('✅ OTP bhej diya! Email check karo — Spam folder bhi dekho.')

    } catch (err) {
      setLoading(false)
      setError('Network error. Internet check karo aur dobara try karo.')
    }
  }

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setError('6 digit OTP daalo')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    setLoading(false)

    if (verifyError) {
      setError(verifyError.message)
      return
    }

    if (data?.session) {
      navigate('/dashboard')
      return
    }

    setMessage('Login successful! Redirecting...')
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    const redirectTo = `${window.location.origin}/auth/callback`

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (googleError) {
        setLoading(false)
        setError(googleError.message || 'Google login failed. Please try again.')
        return
      }

      setMessage('Redirecting to Google…')
    } catch (err) {
      setLoading(false)
      setError('Unable to start Google login right now. Please try again.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#0f172a',
    }}>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: '20px',
        padding: '40px 36px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}>
              ✦ CareerPilot AI
            </div>
          </Link>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Login karke apna career accelerate karo
          </p>
        </div>

        {/* STEP 1 — Choose method */}
        {step === 'choose' && (
          <div>
            <h2 style={{
              fontSize: '20px', fontWeight: '700',
              color: '#f1f5f9', textAlign: 'center', marginBottom: '28px',
            }}>
              Welcome back 👋
            </h2>

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#f1f5f9',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '13px', color: '#475569' }}>ya</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Email Button */}
            <button
              onClick={() => setStep('email')}
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 20px rgba(56,189,248,0.25)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(56,189,248,0.45)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(56,189,248,0.25)'}
            >
              📧 Continue with Email OTP
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#475569', marginTop: '24px' }}>
              Login karke aap hamare{' '}
              <span style={{ color: '#38bdf8', cursor: 'pointer' }}>Terms of Service</span>
              {' '}se agree karte ho
            </p>
          </div>
        )}

        {/* STEP 2 — Email input */}
        {step === 'email' && (
          <div>
            <button
              onClick={() => { setStep('choose'); setError('') }}
              style={{
                background: 'none', border: 'none', color: '#64748b',
                fontSize: '13px', cursor: 'pointer', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '4px', padding: '0',
              }}
            >
              ← Wapas jao
            </button>

            <h2 style={{
              fontSize: '20px', fontWeight: '700',
              color: '#f1f5f9', marginBottom: '8px',
            }}>
              Email daalo 📧
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              Hum aapke email pe OTP bhejenge
            </p>

            <input
              type="email"
              placeholder="aapka@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
              style={{
                width: '100%',
                padding: '13px 16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${error ? '#fb7185' : 'rgba(56,189,248,0.2)'}`,
                borderRadius: '12px',
                color: '#f1f5f9',
                fontSize: '15px',
                outline: 'none',
                marginBottom: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => e.target.style.borderColor = '#38bdf8'}
              onBlur={e => e.target.style.borderColor = error ? '#fb7185' : 'rgba(56,189,248,0.2)'}
            />

            {error && (
              <p style={{ fontSize: '13px', color: '#fb7185', marginBottom: '12px' }}>{error}</p>
            )}

            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading ? 'rgba(56,189,248,0.3)' : 'linear-gradient(135deg, #38bdf8, #818cf8)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'Bhej rahe hain...' : 'OTP Bhejo →'}
            </button>
          </div>
        )}

        {/* STEP 3 — OTP input */}
        {step === 'otp' && (
          <div>
            <button
              onClick={() => { setStep('email'); setError(''); setOtp('') }}
              style={{
                background: 'none', border: 'none', color: '#64748b',
                fontSize: '13px', cursor: 'pointer', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '4px', padding: '0',
              }}
            >
              ← Wapas jao
            </button>

            <h2 style={{
              fontSize: '20px', fontWeight: '700',
              color: '#f1f5f9', marginBottom: '8px',
            }}>
              OTP check karo 🔐
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
              6 digit code bheja hai:
            </p>
            <p style={{ fontSize: '14px', color: '#38bdf8', fontWeight: '600', marginBottom: '24px' }}>
              {email}
            </p>

            <input
              type="number"
              placeholder="000000"
              value={otp}
              onChange={e => {
                if (e.target.value.length <= 6) {
                  setOtp(e.target.value)
                  setError('')
                }
              }}
              onKeyDown={e => e.key === 'Enter' && handleOtpSubmit()}
              style={{
                width: '100%',
                padding: '13px 16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${error ? '#fb7185' : 'rgba(56,189,248,0.2)'}`,
                borderRadius: '12px',
                color: '#f1f5f9',
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '8px',
                textAlign: 'center',
                outline: 'none',
                marginBottom: '8px',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#38bdf8'}
              onBlur={e => e.target.style.borderColor = error ? '#fb7185' : 'rgba(56,189,248,0.2)'}
            />

            {error && (
              <p style={{ fontSize: '13px', color: '#fb7185', marginBottom: '12px' }}>{error}</p>
            )}

            <button
              onClick={handleOtpSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading ? 'rgba(56,189,248,0.3)' : 'linear-gradient(135deg, #38bdf8, #818cf8)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'Verify ho raha hai...' : 'Login Karo ✓'}
            </button>

            <button
              onClick={handleEmailSubmit}
              style={{
                width: '100%', background: 'none', border: 'none',
                color: '#38bdf8', fontSize: '13px', cursor: 'pointer',
                marginTop: '16px', textDecoration: 'underline',
              }}
            >
              OTP nahi aaya? Dobara bhejo
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Login