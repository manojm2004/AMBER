/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          border: '#E0E6ED',
          primary: '#1F2A44',
          muted: '#64748B',
          cyan: '#3A7DFF',
          green: '#28C76F',
          red: '#EA5455',
        }
      },
      fontFamily: {
        mono: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
