/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#D4B982',
          DEFAULT: '#9E7B3B',
          dark: '#7A5B24'
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          paper: '#F4EFE6'
        }
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'sans-serif']
      }
    }
  },
  plugins: []
};
