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
          bg: '#09090b',         // Zinc 950 - Extremely dark, professional background
          surface: '#18181b',    // Zinc 900
          surface2: '#27272a',   // Zinc 800
          border: '#3f3f46',     // Zinc 700
          cyan: '#60a5fa',       // Soft clinical lab blue (Blue-400)
          cyandim: '#3b82f6',    // Blue-500
          green: '#10b981',      // Emerald-500 - Safety validation green
          red: '#ef4444',        // Red-500
          purple: '#8b5cf6',     // Violet-500
          white: '#ffffff',      // Pure White
          muted: '#a1a1aa',      // Zinc 400
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
