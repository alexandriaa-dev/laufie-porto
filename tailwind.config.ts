import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    'z-[100]',
    'z-[50]',
    'z-[45]',
    'z-[46]',
    'pointer-events-none',
    'pointer-events-auto',
    'data-ready',
  ],
  theme: {
    extend: {
      // Tambahkan breakpoint di atas lg tapi di bawah xl
      screens: {
        lgx: '1200px',
      },
      colors: {
        bg: { DEFAULT: 'hsl(220 15% 7%)', soft: 'hsl(220 15% 9%)', raised: 'hsl(220 14% 12%)' },
        card: { DEFAULT: 'hsl(220 14% 12%)' },
        border: 'hsl(220 14% 18%)',
        primary: {
          50: '#EEF4FF',
          100: '#DCEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',     // c2
          500: '#0062FF',     // c3 (updated)
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#0013BE',     // c4 (updated)
        },
      },
      boxShadow: {
        glass: '0 2px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
        rim: '0 0 0 1px rgba(255,255,255,0.06)',
        glow: '0 0 40px rgba(0,98,255,0.35)',
      },
      backdropBlur: { xs: '2px' },
      maxWidth: { container: '1200px' },
      borderRadius: { xl: '16px', '2xl': '24px' },
    },
  },
  darkMode: ['class', '[data-theme="dark"]'],
} satisfies Config