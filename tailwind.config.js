/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Gowun Dodum"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        cursive: ['"Great Vibes"', 'cursive'],
      },
      colors: {
        background: '#f8f9fa',
        primary: '#333333',
        secondary: '#666666',
        accent: '#c0a080',
      }
    },
  },
  plugins: [],
}
