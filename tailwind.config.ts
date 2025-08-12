import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',  // Vite + TS
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#072e57',
          800: '#0b3d73',
        }
      },
      boxShadow: {
        soft: '0 2px 20px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
} satisfies Config
