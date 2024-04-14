/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['resources/views/**/*.{edge|html|js|jsx|ts|tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        "primary": ["YellowTail", "serif"],
        "secondary": ["Space-Grotesk", "sans-serif"]
      },
      backgroundColor: {
        "dark": "#1E1D1E"
      }
    },
  },
  plugins: [require('@tailwindcss/container-queries'), require('tailwind-scrollbar'), require('@tailwindcss/forms')],
}
