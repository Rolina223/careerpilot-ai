const ACTIVITY_KEY = 'careerpilot_recent_activity'

export function getRecentActivity() {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]') } catch { return [] }
}

export function logActivity(action, detail, to) {
  const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, action, detail, to, createdAt: new Date().toISOString() }
  const next = [item, ...getRecentActivity()].slice(0, 8)
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('careerpilot:activity'))
  return item
}
