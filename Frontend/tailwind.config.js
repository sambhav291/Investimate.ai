/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        michroma: ['Michroma', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


