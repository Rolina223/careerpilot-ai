import { motion } from 'framer-motion'
import { MotionButton, motionTokens } from './motion/MotionPrimitives'

function TemplateCard({ template, active, onSelect }) {
  return (
    <MotionButton
      type="button"
      onClick={() => onSelect(template.id)}
      aria-pressed={active}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '24px',
        borderRadius: '16px',
        border: active ? `2px solid ${template.accent}` : '1px solid rgba(148, 163, 184, 0.25)',
        backgroundColor: active ? 'rgba(56, 189, 248, 0.1)' : 'var(--color-surface)',
        color: active ? 'var(--color-text)' : 'var(--color-muted)',
        cursor: 'pointer',
        boxShadow: active ? '0 16px 40px rgba(56,189,248,0.12)' : 'var(--shadow)',
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={motionTokens.spring}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <motion.span style={{ fontSize: '28px' }} animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }} transition={{ duration: 0.36, ease: motionTokens.ease }}>{template.icon}</motion.span>
        <span style={{ color: template.accent, fontWeight: 700, fontSize: '14px' }}>{template.name}</span>
      </div>
      <p style={{ margin: 0, lineHeight: '1.6', color: active ? 'var(--color-text)' : 'var(--color-muted)', fontSize: '14px' }}>{template.description}</p>
    </MotionButton>
  )
}

export default TemplateCard
