import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { LoadingShimmer, MotionCard } from './components/motion/MotionPrimitives'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="cp-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <MotionCard className="cp-card" hover={false} style={{ width: 'min(100%, 520px)', padding: '28px' }}>
          <LoadingShimmer rows={5} />
        </MotionCard>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}
