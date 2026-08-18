/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#082B72',
        secondary: '#0D3E99',
        accent: '#FF7A00',
        background: '#F6F8FC',
        surface: '#FFFFFF'
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
