import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

export const motionTokens = {
  ease: [0.16, 1, 0.3, 1],
  spring: { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 },
  softSpring: { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 },
  duration: 0.22,
}

export const pageMotion = {
  initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -6, filter: 'blur(4px)' },
  transition: { duration: 0.28, ease: motionTokens.ease },
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.03,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: motionTokens.ease } },
}

export function MotionCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: motionTokens.ease }}
      whileHover={hover ? { y: -3, scale: 1.008 } : undefined}
      whileTap={hover ? { scale: 0.996 } : undefined}
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionButton({ children, className = '', disabled, onClick, ...props }) {
  const [ripples, setRipples] = useState([])

  const handleClick = (event) => {
    if (!disabled) {
      const rect = event.currentTarget.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const ripple = {
        id: `${Date.now()}-${Math.random()}`,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        size,
      }
      setRipples((items) => [...items.slice(-2), ripple])
      window.setTimeout(() => setRipples((items) => items.filter((item) => item.id !== ripple.id)), 520)
    }
    onClick?.(event)
  }

  return (
    <motion.button
      className={`motion-button ${className}`.trim()}
      disabled={disabled}
      onClick={handleClick}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.975 }}
      transition={motionTokens.spring}
      {...props}
    >
      {children}
      <span className="ripple-layer" aria-hidden="true">
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="ripple"
            initial={{ opacity: 0.35, scale: 0 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{ duration: 0.52, ease: motionTokens.ease }}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </span>
    </motion.button>
  )
}

export function AnimatedCounter({ value, suffix = '', duration = 0.75 }) {
  const numericValue = Number.parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(motionValue, numericValue, { duration, ease: motionTokens.ease })
    return controls.stop
  }, [duration, motionValue, numericValue])

  return <motion.span>{rounded}{suffix}</motion.span>
}

export function AnimatedProgress({ value, className = 'progress-fill', duration = 0.75, ...props }) {
  return (
    <motion.div
      className={className}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: Math.max(0, Math.min(value, 100)) / 100 }}
      transition={{ duration, ease: motionTokens.ease }}
      style={{ originX: 0, willChange: 'transform' }}
      {...props}
    />
  )
}

export function Skeleton({ className = '', style }) {
  return <div className={`motion-skeleton ${className}`.trim()} style={style} aria-hidden="true" />
}

export function LoadingShimmer({ rows = 3 }) {
  return (
    <div className="motion-shimmer-stack" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} style={{ width: `${94 - index * 12}%` }} />
      ))}
    </div>
  )
}

export function ToastMotion({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: motionTokens.ease }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
