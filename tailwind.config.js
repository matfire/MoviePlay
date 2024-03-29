/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['resources/views/**/*.{edge|html|js|jsx|ts|tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/container-queries'), require('tailwind-scrollbar'), require('@tailwindcss/forms')],
}
