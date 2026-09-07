import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f9',
          100: '#d6e0ef',
          200: '#adc1df',
          300: '#84a2cf',
          400: '#4d76ae',
          500: '#2a548c',
          600: '#1c3c6b',
          700: '#152e52',
          800: '#0f2140',
          900: '#0a1730',
          950: '#060f20',
        },
        gold: {
          50: '#fbf6e7',
          100: '#f5e8bf',
          200: '#ecd489',
          300: '#e0bd53',
          400: '#d3a92e',
          500: '#c19620',
          600: '#a67c1a',
          700: '#815f16',
          800: '#5c4410',
          900: '#3d2e0b',
        },
        ink: '#0a0e14',
        ivory: '#faf9f6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        premium: '0 20px 60px -15px rgba(10, 23, 48, 0.35)',
        card: '0 2px 20px -4px rgba(10, 23, 48, 0.12)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0a1730 0%, #152e52 60%, #1c3c6b 100%)',
        'gold-gradient': 'linear-gradient(135deg, #e0bd53 0%, #c19620 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
