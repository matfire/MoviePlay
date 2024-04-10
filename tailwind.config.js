/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['resources/views/**/*.{edge|html|js|jsx|ts|tsx,vue}'],
  theme: {
    extend: {
      backgroundColor: {
        "light": "#E0E0E0",
        "dark": "#1E1D1E"
      }
    },
  },
  plugins: [require('@tailwindcss/container-queries'), require('tailwind-scrollbar'), require('@tailwindcss/forms')],
}
