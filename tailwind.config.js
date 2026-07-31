/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 6 Vibrant SaaS Palette base & border definitions
        canary: {
          bg: '#FEF9C3',
          border: '#FDE047',
          accent: '#CA8A04',
          header: '#FACC15',
          text: '#713F12',
        },
        mint: {
          bg: '#DCFCE7',
          border: '#86EFAC',
          accent: '#16A34A',
          header: '#4ADE80',
          text: '#14532D',
        },
        magenta: {
          bg: '#FCE7F3',
          border: '#F472B6',
          accent: '#DB2777',
          header: '#F43F5E',
          text: '#831843',
        },
        sky: {
          bg: '#E0F2FE',
          border: '#7DD3FC',
          accent: '#0284C7',
          header: '#38BDF8',
          text: '#0C4A6E',
        },
        tangerine: {
          bg: '#FFEDD5',
          border: '#FDBA74',
          accent: '#EA580C',
          header: '#FB923C',
          text: '#7C2D12',
        },
        pink: {
          bg: '#FFE4E6',
          border: '#FDA4AF',
          accent: '#E11D48',
          header: '#FB7185',
          text: '#881337',
        },
      },
      boxShadow: {
        'postit': '5px 5px 15px rgba(0,0,0,0.15), -1px 3px 5px rgba(0,0,0,0.1)',
        'postit-hover': '8px 12px 20px rgba(0,0,0,0.22), -2px 5px 8px rgba(0,0,0,0.12)',
        'postit-active': '12px 18px 30px rgba(0,0,0,0.28), -3px 8px 12px rgba(0,0,0,0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
