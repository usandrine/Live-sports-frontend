/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Black foundation
        ink: {
          DEFAULT: '#0A0A0A', // page background
          900: '#0F0F0F',
          800: '#141414', // cards
          700: '#1A1A1A', // raised surfaces / hover
          600: '#202022',
        },
        line: {
          DEFAULT: '#27272A', // borders
          strong: '#3F3F46',
        },
        // Yellow energy
        brand: {
          DEFAULT: '#FFD21F',
          light: '#FFEA61',
          dark: '#E6B800',
        },
        muted: '#A1A1AA',
        win: '#22C55E',
        loss: '#EF4444',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.8)',
        'card-hover': '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 32px -16px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,210,31,0.35)',
      },
      keyframes: {
        'live-ping': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '80%, 100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'score-pop': {
          '0%': { transform: 'scale(1)', color: '#FFFFFF' },
          '30%': { transform: 'scale(1.35)', color: '#FFD21F' },
          '100%': { transform: 'scale(1)', color: '#FFFFFF' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'live-ping': 'live-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
        'score-pop': 'score-pop 0.7s ease-out',
        'fade-up': 'fade-up 0.35s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
