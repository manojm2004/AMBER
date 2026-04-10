/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          bg: '#F5F7FA',         // Clean Light Gray Background
          surface: '#FFFFFF',    // Pure White Surface (Cards)
          border: '#E0E6ED',     // Light border gray
          primary: '#1F2A44',    // Dark Blue / Charcoal (Main Text)
          muted: '#64748B',      // Muted Slate Text
          cyan: '#3A7DFF',       // Soft Blue Accents (Actionable)
          green: '#28C76F',      // Fresh Safe Green (Purity)
          red: '#EA5455',        // Soft Alert Red (Adulteration)
        }
      },
      fontFamily: {
        // OVERRIDE: We forcefully replace 'mono' spacing with clean, premium sans-serif typography to eliminate the "Hacker" vibe.
        mono: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
