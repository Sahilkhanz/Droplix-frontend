/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // This is important - use 'class' instead of 'media'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}