/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        briefing: {
          primary: '#1a365d',
          secondary: '#2d3748',
          accent: '#3182ce',
          muted: '#718096',
          surface: '#f7fafc',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        briefing: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}