export const validators = {
  fullName: (value) => {
    if (!value.trim()) return 'Name is required'
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) return 'Name should only contain letters'
    if (value.trim().length < 2) return 'Name is too short'
    return ''
  },

  email: (value) => {
    if (!value.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Enter a valid email (e.g. john@example.com)'
    return ''
  },

  phone: (value) => {
    if (!value.trim()) return 'Phone number is required'
    const digitsOnly = value.replace(/[\s+()-]/g, '')
    if (!/^\d+$/.test(digitsOnly)) return 'Phone number should contain only digits'
    if (digitsOnly.length < 10 || digitsOnly.length > 13) return 'Enter a valid phone number (10 digits)'
    return ''
  },

  location: (value) => {
    if (!value.trim()) return 'Location is required'
    if (!/^[a-zA-Z\s,.'-]+$/.test(value)) return 'Location should only contain letters'
    return ''
  },

  linkedin: (value) => {
    if (!value.trim()) return ''
    if (!value.includes('linkedin.com')) return 'Enter a valid LinkedIn URL'
    try {
      new URL(value)
      return ''
    } catch {
      return 'Enter a valid URL (starting with https://)'
    }
  },

  github: (value) => {
    if (!value.trim()) return ''
    if (!value.includes('github.com')) return 'Enter a valid GitHub URL'
    try {
      new URL(value)
      return ''
    } catch {
      return 'Enter a valid URL (starting with https://)'
    }
  },

  portfolio: (value) => {
    if (!value.trim()) return ''
    try {
      new URL(value)
      return ''
    } catch {
      return 'Enter a valid URL (starting with https://)'
    }
  },

  year: (value) => {
    if (!value.trim()) return 'Year is required'
    if (!/^\d{4}$/.test(value)) return 'Enter a valid 4-digit year (e.g. 2024)'
    const num = parseInt(value)
    if (num < 1980 || num > 2035) return 'Enter a realistic year'
    return ''
  },

  duration: (value) => {
    if (!value.trim()) return 'Duration is required'
    return ''
  },

  required: (value, label = 'This field') => {
    if (!value.trim()) return `${label} is required`
    return ''
  },
}