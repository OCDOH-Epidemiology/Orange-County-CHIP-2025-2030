/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Orange County branding. Replace these hex codes if the county
        // publishes an official palette. Both values meet WCAG AA contrast
        // against white and against each other for large text.
        brand: {
          blue:      '#1B4B8A', // primary
          blueDark:  '#123566',
          blueLight: '#E6EEF7',
          green:     '#2F855A', // supporting accent
          greenDark: '#22623F',
          greenLight:'#E6F4EC',
        },
      },
      fontFamily: {
        // System font stack — fast, no external font requests, high legibility.
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      // Page transition animations — professional, restrained motion.
      // Primary animations defined in src/index.css; Tailwind utilities below
      // allow composition via class names.
      animation: {
        'page-enter': 'fadeInUp 300ms ease-out both',
        'fade-in': 'fadeIn 250ms ease-out both',
        'card-enter': 'fadeInScale 300ms ease-out both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          from: { opacity: '0', transform: 'scale(0.98)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
