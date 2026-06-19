import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data?.session ?? null)
      setLoading(false)
    }

    initialize()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setLoading(false)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
