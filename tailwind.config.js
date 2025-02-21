/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['Dancing Script', 'cursive'], // Add Dancing Script as a custom cursive font
      },
    },
  },
  plugins: [],
}