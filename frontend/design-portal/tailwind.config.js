/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#030303',
        'black-2': '#070707',
        'black-3': '#0b0b0b',
        panel: '#0d0d0d',
        'panel-2': '#111111',
      },
      borderRadius: {
        DEFAULT: '18px',
      },
    },
  },
  plugins: [],
}
