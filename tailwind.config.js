/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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
      },
      fontSize: {
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'h4': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.5rem' }],
        'small': ['0.875rem', { lineHeight: '1.25rem' }],
        'tiny': ['0.75rem', { lineHeight: '1rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'briefing': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'briefing-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}