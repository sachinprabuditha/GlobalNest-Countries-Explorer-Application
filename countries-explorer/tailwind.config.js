// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable dark mode using class strategy
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#4da6ff',
            DEFAULT: '#0078ff',
            dark: '#0055cc',
          },
          secondary: {
            light: '#f8f9fa',
            DEFAULT: '#e9ecef',
            dark: '#dee2e6',
          },
        },
      },
    },
    plugins: [],
  }