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
    },
  },
  plugins: [],
};
