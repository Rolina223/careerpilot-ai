/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--cp-canvas) / <alpha-value>)',
        surface: 'rgb(var(--cp-surface) / <alpha-value>)',
        elevated: 'rgb(var(--cp-elevated) / <alpha-value>)',
        'surface-hover': 'rgb(var(--cp-surface-hover) / <alpha-value>)',
        ink: 'rgb(var(--cp-ink) / <alpha-value>)',
        muted: 'rgb(var(--cp-muted) / <alpha-value>)',
        subtle: 'rgb(var(--cp-subtle) / <alpha-value>)',
        line: 'rgb(var(--cp-line) / <alpha-value>)',
        brand: 'rgb(var(--cp-brand) / <alpha-value>)',
        violet: 'rgb(var(--cp-violet) / <alpha-value>)',
        success: 'rgb(var(--cp-success) / <alpha-value>)',
        warning: 'rgb(var(--cp-warning) / <alpha-value>)',
        danger: 'rgb(var(--cp-danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.055em', fontWeight: '700' }],
        'display-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.05em', fontWeight: '700' }],
        'display-lg': ['2.625rem', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '650' }],
        'heading-md': ['1.25rem', { lineHeight: '1.35', letterSpacing: '-0.018em', fontWeight: '650' }],
      },
      spacing: { 18: '4.5rem', 22: '5.5rem', 26: '6.5rem', 30: '7.5rem' },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        'soft-sm': '0 1px 2px rgb(15 23 42 / 0.04)',
        soft: '0 12px 32px rgb(15 23 42 / 0.08)',
        float: '0 24px 56px rgb(15 23 42 / 0.14)',
        glow: '0 0 0 1px rgb(112 84 255 / 0.12), 0 16px 40px rgb(112 84 255 / 0.18)',
      },
      transitionTimingFunction: { 'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)' },
      transitionDuration: { 400: '400ms', 600: '600ms' },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: { 'fade-up': 'fade-up 600ms cubic-bezier(0.16,1,0.3,1) both', shimmer: 'shimmer 1.5s infinite' },
    },
  },
  plugins: [],
}
